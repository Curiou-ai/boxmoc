// Outbound send-message API wrapper
import type { Env } from "../env";

function apiUrl(env: Env, path: string): string {
  return `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/${path}`;
}

async function callWhatsAppApi(env: Env, body: Record<string, unknown>): Promise<Response> {
  const res = await fetch(apiUrl(env, "messages"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
  });
  if (!res.ok) {
    throw new Error(`WhatsApp send failed: ${res.status} ${await res.text()}`);
  }
  return res;
}

export async function sendTextMessage(env: Env, wa_id: string, text: string): Promise<void> {
  await callWhatsAppApi(env, {
    to: wa_id,
    type: "text",
    text: { body: text, preview_url: false },
  });
}

/** Marks a customer's message as read (shows the double blue tick) — call when staff opens a conversation. */
export async function markMessageAsRead(env: Env, messageId: string): Promise<void> {
  await callWhatsAppApi(env, {
    status: "read",
    message_id: messageId,
  });
}

/**
 * Sends a pre-approved template message — required for any outbound message
 * sent more than 24h after the customer's last message (Meta's session-window rule).
 */
export async function sendTemplateMessage(
  env: Env,
  wa_id: string,
  templateName: string,
  languageCode: string,
  parameters: string[] = []
): Promise<void> {
  await callWhatsAppApi(env, {
    to: wa_id,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: parameters.length
        ? [{ type: "body", parameters: parameters.map((text) => ({ type: "text", text })) }]
        : [],
    },
  });
}