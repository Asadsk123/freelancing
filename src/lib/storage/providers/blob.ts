import { put, del } from "@vercel/blob";
import type { StorageProvider, StoredObject } from "../types";

export function createBlobProvider(): StorageProvider {
  return {
    name: "blob",

    async put(key, body, contentType): Promise<string> {
      const result = await put(key, Buffer.from(body), { access: "public", contentType });
      return result.url;
    },

    async get(url): Promise<StoredObject | null> {
      try {
        const res = await fetch(url);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Blob fetch failed with status ${res.status}`);
        const buffer = new Uint8Array(await res.arrayBuffer());
        return { body: buffer, contentLength: buffer.byteLength };
      } catch {
        return null;
      }
    },

    async delete(url) {
      await del(url);
    },
  };
}
