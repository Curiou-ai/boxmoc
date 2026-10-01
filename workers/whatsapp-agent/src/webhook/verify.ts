// Meta signature verification

import type { Env } from "../env";

/**
 * Verifies the `X-Hub-Signature-256` header Meta sends on every webhook POST.
 * The header is `sha256=<hex hmac>` computed over the raw request body using
 * your app secret. Must run against the RAW body string — never the parsed JSON,
 * since re-serializing can change byte-for-byte content and break the signature.
 */
export async function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null,
  env: Env
): Promise<boolean> {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;
  const expectedHex = signatureHeader.slice("sha256=".length);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.WHATSAPP_APP_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const computedHex = [...new Uint8Array(signatureBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return timingSafeEqual(computedHex, expectedHex);
}

/** Constant-time string comparison to avoid timing side-channels on the signature check. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Handles Meta's GET verification handshake, performed once when you register
 * the webhook URL in the Meta App dashboard.
 */
export function handleVerificationChallenge(url: URL, env: Env): Response {
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}