import { describe, it, expect, vi, afterEach } from "vitest";
import { logger } from "@/lib/observability/logger";
import { captureError } from "@/lib/observability/capture";

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.SENTRY_DSN;
});

describe("logger redaction", () => {
  it("masks sensitive keys and token patterns in values", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("test.event", {
      otpCode: "123456",
      password: "hunter2",
      apiKey: "re_abc",
      note: "Bearer abc.def.ghi failed",
      url: "postgresql://user:pass@host/db",
      safe: "visible",
    });
    const [, fields] = spy.mock.calls[0]!;
    expect(fields).toMatchObject({
      otpCode: "***",
      password: "***",
      apiKey: "***",
      note: "Bearer *** failed",
      url: "postgresql://***",
      safe: "visible",
    });
  });
});

describe("captureError", () => {
  it("logs without a DSN and never throws", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(
      captureError(new Error("boom"), { scope: "unit", extra: { id: "x" } }),
    ).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalled();
  });

  it("posts a Sentry envelope when a DSN is configured", async () => {
    process.env.SENTRY_DSN = "https://publickey@o1.ingest.sentry.io/42";
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    await captureError(new Error("boom"), { scope: "unit" });

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(String(url)).toBe("https://o1.ingest.sentry.io/api/42/envelope/");
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers["X-Sentry-Auth"]).toContain("sentry_key=publickey");
    const body = String((init as RequestInit).body);
    expect(body).toContain('"type":"event"');
    expect(body).toContain("boom");
  });

  it("swallows delivery failures (monitoring never cascades)", async () => {
    process.env.SENTRY_DSN = "https://publickey@o1.ingest.sentry.io/42";
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));
    await expect(captureError(new Error("boom"), { scope: "unit" })).resolves.toBeUndefined();
  });
});
