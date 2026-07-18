import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import { buildStorageKey } from "@/lib/storage";
import { getStorageMode } from "@/lib/storage/config";
import { createLocalProvider } from "@/lib/storage/providers/local";

describe("buildStorageKey", () => {
  it("scopes keys to the project and keeps a sanitized filename", () => {
    const key = buildStorageKey("proj-1", "My Report (final).pdf");
    expect(key.startsWith("projects/proj-1/")).toBe(true);
    expect(key.endsWith("-My_Report_final_.pdf")).toBe(true);
  });

  it("neutralizes path-traversal characters in filenames", () => {
    const key = buildStorageKey("proj-1", "../../etc/passwd");
    expect(key).not.toContain("..");
    expect(key.split("/").length).toBe(3); // projects / <id> / <object>
  });

  it("produces unique keys for identical filenames", () => {
    expect(buildStorageKey("p", "a.txt")).not.toBe(buildStorageKey("p", "a.txt"));
  });
});

describe("getStorageMode", () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
  });

  it("defaults to local without R2 credentials", () => {
    delete process.env.STORAGE_MODE;
    delete process.env.R2_ACCOUNT_ID;
    expect(getStorageMode()).toBe("local");
  });

  it("selects r2 when all credentials are present", () => {
    delete process.env.STORAGE_MODE;
    process.env.R2_ACCOUNT_ID = "a";
    process.env.R2_ACCESS_KEY_ID = "b";
    process.env.R2_SECRET_ACCESS_KEY = "c";
    process.env.R2_BUCKET_NAME = "d";
    expect(getStorageMode()).toBe("r2");
  });

  it("explicit STORAGE_MODE=local overrides credentials", () => {
    process.env.STORAGE_MODE = "local";
    process.env.R2_ACCOUNT_ID = "a";
    process.env.R2_ACCESS_KEY_ID = "b";
    process.env.R2_SECRET_ACCESS_KEY = "c";
    process.env.R2_BUCKET_NAME = "d";
    expect(getStorageMode()).toBe("local");
  });
});

describe("local storage provider", () => {
  const provider = createLocalProvider();
  const testKey = `projects/vitest/${Date.now()}-unit.txt`;

  beforeEach(async () => {
    await provider.delete(testKey);
  });
  afterEach(async () => {
    await provider.delete(testKey);
    // Best-effort cleanup of the vitest scope directory.
    await fs.rm(path.join(process.cwd(), ".storage", "projects", "vitest"), { recursive: true, force: true });
  });

  it("round-trips put → get → delete", async () => {
    const body = new TextEncoder().encode("vitest storage round-trip");
    await provider.put(testKey, body, "text/plain");
    const got = await provider.get(testKey);
    expect(got).not.toBeNull();
    expect(new TextDecoder().decode(got!.body)).toBe("vitest storage round-trip");
    expect(got!.contentLength).toBe(body.byteLength);

    await provider.delete(testKey);
    expect(await provider.get(testKey)).toBeNull();
  });

  it("returns null for missing objects and tolerates deleting them", async () => {
    expect(await provider.get("projects/vitest/never-written.bin")).toBeNull();
    await expect(provider.delete("projects/vitest/never-written.bin")).resolves.toBeUndefined();
  });

  it("rejects keys that escape the storage root", async () => {
    await expect(provider.get("../outside.txt")).rejects.toThrow("Invalid storage key");
    await expect(
      provider.put("..\\outside.txt", new Uint8Array([1]), "application/octet-stream"),
    ).rejects.toThrow("Invalid storage key");
  });
});
