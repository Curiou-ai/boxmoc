// KV read/write for rolling conversation history
import type { Env } from "../env";
import { MAX_HISTORY_MESSAGES, type Session, type SessionMessage } from "./types";

const sessionKey = (wa_id: string) => `session:${wa_id}`;

export async function getSession(env: Env, wa_id: string, customerName?: string): Promise<Session> {
  const raw = await env.SESSIONS.get(sessionKey(wa_id));
  if (raw) return JSON.parse(raw) as Session;

  return {
    wa_id,
    customer_name: customerName,
    history: [],
    status: "agent_owned",
    last_active: Date.now(),
  };
}

export async function saveSession(env: Env, session: Session): Promise<void> {
  session.last_active = Date.now();
  // Keep KV bounded — trim the oldest turns once we exceed the cap. A production
  // system would summarize trimmed turns into a rolling `summary` field instead
  // of dropping them outright; omitted here for brevity.
  if (session.history.length > MAX_HISTORY_MESSAGES) {
    session.history = session.history.slice(session.history.length - MAX_HISTORY_MESSAGES);
  }
  await env.SESSIONS.put(sessionKey(session.wa_id), JSON.stringify(session), {
    expirationTtl: 60 * 60 * 24 * 30, // 30 days of inactivity
  });
}

export function appendMessage(session: Session, message: SessionMessage): void {
  session.history.push(message);
}