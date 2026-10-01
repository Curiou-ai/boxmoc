// POST /webhook - validates, enqueues, 200s fast

import type { Env, InboundMessage, QueueMessage } from "../env";
import { verifyMetaSignature, handleVerificationChallenge } from "./verify";
import type { WhatsAppWebhookPayload, WhatsAppMessage } from "./types";

/** GET /webhook — Meta's one-time verification handshake. */
export function handleWebhookVerification(request: Request, env: Env): Response {
  const url = new URL(request.url);
  return handleVerificationChallenge(url, env);
}

/**
 * POST /webhook — the hot path Meta calls on every inbound message/status update.
 * Job here is strictly: verify signature, extract messages, push to queue, return 200 fast.
 * All real processing (LLM calls, tool execution) happens in the queue consumer —
 * see queue/consumer.ts — so this handler never blocks on anything slow.
 */
export async function handleWebhookPost(request: Request, env: Env): Promise<Response> {
  const rawBody = await request.text();
  const signature = request.headers.get("X-Hub-Signature-256");

  const valid = await verifyMetaSignature(rawBody, signature, env);
  if (!valid) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const queued: Promise<unknown>[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const { messages, contacts } = change.value;
      if (!messages?.length) continue; // status updates (delivered/read) — nothing to process

      const nameByWaId = new Map((contacts ?? []).map((c) => [c.wa_id, c.profile.name]));

      for (const msg of messages) {
        const queueMessage: QueueMessage = {
          wa_id: msg.from,
          customer_name: nameByWaId.get(msg.from),
          received_at: Date.now(),
          message: toInboundMessage(msg),
        };
        queued.push(env.MESSAGE_QUEUE.send(queueMessage));
      }
    }
  }

  await Promise.all(queued);

  // Meta requires a fast 200 — it retries (and can eventually disable the webhook)
  // if this takes too long or returns non-2xx.
  return new Response("OK", { status: 200 });
}

function toInboundMessage(msg: WhatsAppMessage): InboundMessage {
  if (msg.type === "text" && msg.text) {
    return { type: "text", text: msg.text.body };
  }
  if (msg.type === "image" && msg.image) {
    return { type: "image", media_id: msg.image.id, caption: msg.image.caption };
  }
  return { type: "unsupported", raw: msg };
}