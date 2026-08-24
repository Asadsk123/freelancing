import type { StorageProvider } from "../types";
import { getStorageMode } from "../config";
import { createLocalProvider } from "./local";
import { createR2Provider } from "./r2";
import { createBlobProvider } from "./blob";

export function getProvider(): StorageProvider {
  const mode = getStorageMode();

  if (mode === "blob") {
    return createBlobProvider();
  }

  if (mode === "r2") {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucket = process.env.R2_BUCKET_NAME;
    if (accountId && accessKeyId && secretAccessKey && bucket) {
      return createR2Provider({ accountId, accessKeyId, secretAccessKey, bucket });
    }
  }

  return createLocalProvider();
}
