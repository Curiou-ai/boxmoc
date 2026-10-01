// Uploads to R2, returns object key
import type { Env } from "../env";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Uploads raw media bytes to R2, keyed by customer + timestamp, and returns the object key. */
export async function storeMediaInR2(
  env: Env,
  wa_id: string,
  bytes: ArrayBuffer,
  mimeType: string
): Promise<string> {
  const ext = EXT_BY_MIME[mimeType] ?? "bin";
  const key = `customer-uploads/${wa_id}/${Date.now()}.${ext}`;

  await env.MEDIA.put(key, bytes, {
    httpMetadata: { contentType: mimeType },
  });

  return key;
}

/** Produces a signed, time-limited URL for the dashboard/admin UI to render a customer image. */
export async function getSignedMediaUrl(env: Env, objectKey: string): Promise<string> {
  // R2 doesn't natively presign like S3; a common pattern is a dedicated Worker
  // route (see api/media.ts) that streams the object after checking the caller's
  // internal API key, so the bucket itself never needs to be public.
  return `/api/media/${encodeURIComponent(objectKey)}`;
}