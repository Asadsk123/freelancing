/**
 * Storage provider abstraction (mirrors the email provider pattern):
 * dev-safe local filesystem provider by default, Cloudflare R2 (S3 API via
 * fetch + SigV4, no SDK) when credentials are configured.
 */
export type StoredObject = {
  body: Uint8Array;
  contentLength: number;
};

export interface StorageProvider {
  /** Provider name for logging (never logs secrets). */
  name: string;
  put(key: string, body: Uint8Array, contentType: string): Promise<void>;
  /** Returns null when the object does not exist. */
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
}
