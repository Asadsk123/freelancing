import { createHash, createHmac } from "crypto";
import type { StorageProvider, StoredObject } from "../types";

/**
 * Cloudflare R2 provider using the S3 REST API directly (AWS Signature V4
 * over fetch — no SDK dependency, mirroring the Resend email provider).
 */
type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

const REGION = "auto";
const SERVICE = "s3";

function sha256Hex(data: Uint8Array | string): string {
  return createHash("sha256").update(data).digest("hex");
}

function hmac(key: Uint8Array | string, data: string): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

/** RFC 3986 encode a single path segment (S3 canonical URI rules). */
function encodeSegment(segment: string): string {
  return encodeURIComponent(segment).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function signedHeaders(
  config: R2Config,
  method: "GET" | "PUT" | "DELETE",
  key: string,
  body: Uint8Array | null,
  contentType?: string,
): { url: string; headers: Record<string, string> } {
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${config.bucket}/${key.split("/").map(encodeSegment).join("/")}`;
  const url = `https://${host}${canonicalUri}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(body ?? "");

  const headerEntries: [string, string][] = [
    ["host", host],
    ["x-amz-content-sha256", payloadHash],
    ["x-amz-date", amzDate],
  ];
  if (contentType) headerEntries.push(["content-type", contentType]);
  headerEntries.sort((a, b) => a[0].localeCompare(b[0]));

  const canonicalHeaders = headerEntries.map(([name, value]) => `${name}:${value}\n`).join("");
  const signedHeaderNames = headerEntries.map(([name]) => name).join(";");

  const canonicalRequest = [
    method,
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaderNames,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256Hex(canonicalRequest)].join("\n");

  const kDate = hmac(`AWS4${config.secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, REGION);
  const kService = hmac(kRegion, SERVICE);
  const kSigning = hmac(kService, "aws4_request");
  const signature = createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  const headers: Record<string, string> = {
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    Authorization: `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${scope}, SignedHeaders=${signedHeaderNames}, Signature=${signature}`,
  };
  if (contentType) headers["Content-Type"] = contentType;

  return { url, headers };
}

export function createR2Provider(config: R2Config): StorageProvider {
  return {
    name: "r2",

    async put(key, body, contentType) {
      const { url, headers } = signedHeaders(config, "PUT", key, body, contentType);
      const res = await fetch(url, { method: "PUT", headers, body: body as BodyInit });
      if (!res.ok) {
        throw new Error(`R2 upload failed with status ${res.status}`);
      }
    },

    async get(key): Promise<StoredObject | null> {
      const { url, headers } = signedHeaders(config, "GET", key, null);
      const res = await fetch(url, { method: "GET", headers });
      if (res.status === 404) return null;
      if (!res.ok) {
        throw new Error(`R2 download failed with status ${res.status}`);
      }
      const buffer = new Uint8Array(await res.arrayBuffer());
      return { body: buffer, contentLength: buffer.byteLength };
    },

    async delete(key) {
      const { url, headers } = signedHeaders(config, "DELETE", key, null);
      const res = await fetch(url, { method: "DELETE", headers });
      if (!res.ok && res.status !== 404) {
        throw new Error(`R2 delete failed with status ${res.status}`);
      }
    },
  };
}
