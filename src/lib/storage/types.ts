/**
 * Storage provider abstraction (mirrors the email provider pattern):
 * dev-safe local filesystem provider by default, Cloudflare R2 (S3 API via
 * fetch + SigV4, no SDK) when credentials are configured, Vercel Blob when
 * BLOB_READ_WRITE_TOKEN is set.
 */
export type StoredObject = {
  body: Uint8Array;
  contentLength: number;
};

export interface StorageProvider {
  /** Provider name for logging (never logs secrets). */
  name: string;
  /**
   * Store an object. Returns the effective retrieval key — for local/R2 this
   * is the same `key` passed in; for Blob it is the full object URL (which
   * is what must be stored in the DB as `originalKey`).
   */
  put(key: string, body: Uint8Array, contentType: string): Promise<string>;
  /** Returns null when the object does not exist. */
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
}
