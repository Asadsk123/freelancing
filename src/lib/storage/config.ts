/**
 * Storage mode:
 *   - "r2"    → Cloudflare R2 via the S3 API (needs R2_* env vars)
 *   - "local" → filesystem under `.storage/` (dev/preview; gitignored)
 *
 * Safety: local mode is the default — R2 is only used when explicitly
 * requested via STORAGE_MODE=r2 or when all R2 credentials are present.
 */
export type StorageMode = "r2" | "local";

export function getStorageMode(): StorageMode {
  const explicit = (process.env.STORAGE_MODE ?? "").toLowerCase();
  if (explicit === "local") return "local";
  if (explicit === "r2") return "r2";

  const hasR2 =
    !!process.env.R2_ACCOUNT_ID &&
    !!process.env.R2_ACCESS_KEY_ID &&
    !!process.env.R2_SECRET_ACCESS_KEY &&
    !!process.env.R2_BUCKET_NAME;
  return hasR2 ? "r2" : "local";
}

/** Maximum accepted upload size (bytes). */
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
