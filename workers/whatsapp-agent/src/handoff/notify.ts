// Pushes to webapp dashboard (webjhook or DO)

import type { Env } from "../env";
import type { Session } from "../session/types";

/**
 * Called when the agent's `handoff_to_human` tool fires. Two things happen:
 *  1. The conversation is written/updated in this Worker's D1 (source of truth
 *     the admin dashboard's API calls read from — see api/conversations.ts).
 *  2. A best-effort push notification goes to the webapp so it can alert staff
 *     in real time (e.g. relay to a WebSocket/SSE layer). If this call fails,
 *     the dashboard still picks up the handoff on its next poll of /api/conversations,
 *     so a webhook outage never loses a handoff — it only delays the live alert.
 */
export async function handoffToHuman(
  env: Env,
  session: Session,
  reason: string,
  latestQuoteId: string | null
): Promise<void> {
  const now = Date.now();

  await env.DB.prepare(
    `INSERT INTO whatsapp_conversations (wa_id, customer_name, status, assigned_to, last_message_at, handed_off_at, created_at)
     VALUES (?1, ?2, 'human_owned', NULL, ?3, ?3, ?3)
     ON CONFLICT(wa_id) DO UPDATE SET
       status = 'human_owned',
       assigned_to = NULL,
       last_message_at = ?3,
       handed_off_at = ?3`
  )
    .bind(session.wa_id, session.customer_name ?? null, now)
    .run();

  await pushHandoffWebhook(env, {
    wa_id: session.wa_id,
    customer_name: session.customer_name,
    reason,
    latest_quote_id: latestQuoteId,
    handed_off_at: now,
  });
}

interface HandoffPayload {
  wa_id: string;
  customer_name?: string;
  reason: string;
  latest_quote_id: string | null;
  handed_off_at: number;
}

async function pushHandoffWebhook(env: Env, payload: HandoffPayload): Promise<void> {
  try {
    const body = JSON.stringify(payload);
    const signature = await signBody(env.WEBAPP_HANDOFF_WEBHOOK_SECRET, body);

    const res = await fetch(env.WEBAPP_HANDOFF_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Signature-256": `sha256=${signature}`,
      },
      body,
    });
    if (!res.ok) {
      console.error(`Handoff webhook returned ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    // Non-fatal — the dashboard's own polling of /api/conversations is the fallback.
    console.error("Handoff webhook push failed", err);
  }
}

/** HMAC-signs the outbound handoff payload so the webapp can verify it really came from this Worker. */
async function signBody(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Flips a conversation back to bot-owned — called by the admin API's "close" action. */
export async function returnToBot(env: Env, wa_id: string): Promise<void> {
  await env.DB.prepare(
    `UPDATE whatsapp_conversations SET status = 'agent_owned', assigned_to = NULL WHERE wa_id = ?1`
  )
    .bind(wa_id)
    .run();

  const raw = await env.SESSIONS.get(`session:${wa_id}`);
  if (raw) {
    const session = JSON.parse(raw) as Session;
    session.status = "agent_owned";
    await env.SESSIONS.put(`session:${wa_id}`, JSON.stringify(session));
  }
}