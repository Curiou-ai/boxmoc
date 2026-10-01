// Queue consumer - the actual message processing.
import type { Env, QueueMessage } from "../env";
import { getSession, saveSession, appendMessage } from "../session/store";
import { runAgentTurn } from "../agent/orchestrator";
import { fetchMediaFromMeta } from "../media/fetch-from-meta";
import { storeMediaInR2 } from "../media/store-r2";
import { sendTextMessage } from "../whatsapp/send";

export async function handleQueueBatch(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
  for (const message of batch.messages) {
    try {
      await processOne(env, message.body);
      message.ack();
    } catch (err) {
      console.error("Failed to process inbound message", err);
      message.retry(); // Cloudflare Queues retries per `max_retries`, then routes to the DLQ
    }
  }
}

async function processOne(env: Env, payload: QueueMessage): Promise<void> {
  const session = await getSession(env, payload.wa_id, payload.customer_name);

  // Log every inbound message to D1 for the admin dashboard's transcript view,
  // regardless of who currently owns the conversation.
  await logMessage(env, payload.wa_id, "customer", summarizeForLog(payload.message));

  if (session.status === "human_owned") {
    // A staff member owns this thread — the bot stays silent. Staff replies go
    // out through the admin API's reply endpoint (see api/conversations.ts),
    // not through this pipeline.
    await touchConversationTimestamp(env, payload.wa_id);
    return;
  }

  if (payload.message.type === "unsupported") {
    await sendTextMessage(env, payload.wa_id, "Sorry, I can only read text and images right now — could you resend that?");
    return;
  }

  let turnInput: { text?: string; image?: { base64: string; mediaType: string } } = {};

  if (payload.message.type === "text") {
    turnInput.text = payload.message.text;
  } else if (payload.message.type === "image") {
    const { bytes, mimeType } = await fetchMediaFromMeta(env, payload.message.media_id);
    const objectKey = await storeMediaInR2(env, payload.wa_id, bytes, mimeType);

    session.current_draft_quote = session.current_draft_quote ?? {
      box_type_id: "",
      quantity: 0,
      modifiers: [],
      image_keys: [],
    };
    session.current_draft_quote.image_keys.push(objectKey);

    turnInput.image = { base64: arrayBufferToBase64(bytes), mediaType: mimeType };
    turnInput.text = payload.message.caption ?? "[customer sent an image for their box design]";
  }

  const replyText = await runAgentTurn(env, session, turnInput);
  await saveSession(env, session);

  await sendTextMessage(env, payload.wa_id, replyText);
  await logMessage(env, payload.wa_id, "agent_bot", replyText);
}

function summarizeForLog(message: QueueMessage["message"]): string {
  if (message.type === "text") return message.text;
  if (message.type === "image") return message.caption ? `[image] ${message.caption}` : "[image]";
  return "[unsupported message type]";
}

async function logMessage(env: Env, wa_id: string, sender: string, content: string): Promise<void> {
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO whatsapp_conversations (wa_id, status, last_message_at, created_at)
       VALUES (?1, 'agent_owned', ?2, ?2)
       ON CONFLICT(wa_id) DO UPDATE SET last_message_at = ?2`
    ).bind(wa_id, now),
    env.DB.prepare(
      `INSERT INTO whatsapp_messages (id, wa_id, sender, content, created_at) VALUES (?1, ?2, ?3, ?4, ?5)`
    ).bind(crypto.randomUUID(), wa_id, sender, content, now),
  ]);
}

async function touchConversationTimestamp(env: Env, wa_id: string): Promise<void> {
  await env.DB.prepare(`UPDATE whatsapp_conversations SET last_message_at = ?1 WHERE wa_id = ?2`)
    .bind(Date.now(), wa_id)
    .run();
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}