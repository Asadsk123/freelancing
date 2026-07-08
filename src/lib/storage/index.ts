import { getProvider } from "./providers";
import type { StoredObject } from "./types";

export { getStorageMode, MAX_UPLOAD_BYTES } from "./config";
export type { StorageProvider, StoredObject } from "./types";

/** Builds a collision-free storage key scoped to a project. */
export function buildStorageKey(projectId: string, fileName: string): string {
  const safeName = fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(-120);
  return `projects/${projectId}/${crypto.randomUUID()}-${safeName}`;
}

export const storage = {
  put(key: string, body: Uint8Array, contentType: string): Promise<void> {
    return getProvider().put(key, body, contentType);
  },

  get(key: string): Promise<StoredObject | null> {
    return getProvider().get(key);
  },

  delete(key: string): Promise<void> {
    return getProvider().delete(key);
  },
};
