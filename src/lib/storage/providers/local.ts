import { promises as fs } from "fs";
import path from "path";
import type { StorageProvider, StoredObject } from "../types";

const ROOT = path.join(process.cwd(), ".storage");

/**
 * Resolves a storage key to an absolute path inside the storage root.
 * Rejects any key that would escape the root (path traversal).
 */
function resolveSafe(key: string): string {
  const target = path.resolve(ROOT, key);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    throw new Error("Invalid storage key");
  }
  return target;
}

export function createLocalProvider(): StorageProvider {
  return {
    name: "local",

    async put(key, body): Promise<string> {
      const target = resolveSafe(key);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, body);
      return key;
    },

    async get(key): Promise<StoredObject | null> {
      try {
        const buffer = await fs.readFile(resolveSafe(key));
        return { body: new Uint8Array(buffer), contentLength: buffer.byteLength };
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw err;
      }
    },

    async delete(key) {
      try {
        await fs.unlink(resolveSafe(key));
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
      }
    },
  };
}
