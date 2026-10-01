// Downloads media via Meta's media API
import type { Env } from "../env";

interface MetaMediaMeta {
  url: string;
  mime_type: string;
  sha256: string;
  file_size: number;
  id: string;
}

/**
 * WhatsApp media flow is two calls: first resolve the media ID to a short-lived
 * CDN URL, then fetch the bytes from that URL — both require the access token.
 */
export async function fetchMediaFromMeta(
  env: Env,
  mediaId: string
): Promise<{ bytes: ArrayBuffer; mimeType: string }> {
  const metaRes = await fetch(`https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${mediaId}`, {
    headers: { Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` },
  });
  if (!metaRes.ok) {
    throw new Error(`Failed to resolve media ${mediaId}: ${metaRes.status} ${await metaRes.text()}`);
  }
  const meta = (await metaRes.json()) as MetaMediaMeta;

  const fileRes = await fetch(meta.url, {
    headers: { Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` },
  });
  if (!fileRes.ok) {
    throw new Error(`Failed to download media ${mediaId}: ${fileRes.status}`);
  }

  return { bytes: await fileRes.arrayBuffer(), mimeType: meta.mime_type };
}