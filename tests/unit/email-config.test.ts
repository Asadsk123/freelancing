import { describe, it, expect, afterEach } from "vitest";
import { getEmailMode, getFromAddress } from "@/lib/email/config";

const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});

describe("getEmailMode", () => {
  it("never sends in development without an explicit override", () => {
    delete process.env.EMAIL_MODE;
    process.env.RESEND_API_KEY = "re_test";
    // NODE_ENV is "test" under vitest — not production.
    expect(getEmailMode()).toBe("log");
  });

  it("honors explicit EMAIL_MODE values", () => {
    process.env.EMAIL_MODE = "production";
    expect(getEmailMode()).toBe("production");
    process.env.EMAIL_MODE = "log";
    expect(getEmailMode()).toBe("log");
    process.env.EMAIL_MODE = "preview";
    expect(getEmailMode()).toBe("log");
  });
});

describe("getFromAddress", () => {
  it("formats Name <address> from env overrides", () => {
    process.env.EMAIL_FROM_DEFAULT = "hello@example.com";
    process.env.EMAIL_FROM_SUPPORT = "support@example.com";
    expect(getFromAddress()).toMatch(/<hello@example\.com>$/);
    expect(getFromAddress("support")).toMatch(/<support@example\.com>$/);
  });
});
