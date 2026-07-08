import type { StorageProvider } from "../types";
import { getStorageMode } from "../config";
import { createLocalProvider } from "./local";
import { createR2Provider } from "./r2";

/**
 * Selects the active storage provider. R2 is only used when configured;
 * otherwise files live on the local filesystem so development never needs
 * cloud credentials. To add S3/GCS: implement `StorageProvider` and branch
 * here — no business-logic changes needed.
 */
export function getProvider(): StorageProvider {
  if (getStorageMode() === "r2") {
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
