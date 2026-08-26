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
  it("wraps a bare email address with the brand name", () => {
    process.env.EMAIL_FROM_DEFAULT = "hello@example.com";
    process.env.EMAIL_FROM_SUPPORT = "support@example.com";
    expect(getFromAddress()).toMatch(/<hello@example\.com>$/);
    expect(getFromAddress("support")).toMatch(/<support@example\.com>$/);
  });

  it("passes through a pre-formatted 'Name <email>' value unchanged (no double-wrapping)", () => {
    process.env.EMAIL_FROM_DEFAULT = "ROYAL-ASAD <onboarding@resend.dev>";
    const result = getFromAddress();
    // Must NOT produce "Brand Name <ROYAL-ASAD <onboarding@resend.dev>>"
    expect(result).toBe("ROYAL-ASAD <onboarding@resend.dev>");
    expect(result).not.toContain("<<");
  });

  it("support variant also passes through pre-formatted value", () => {
    process.env.EMAIL_FROM_SUPPORT = "ROYAL-ASAD Support <support@resend.dev>";
    const result = getFromAddress("support");
    expect(result).toBe("ROYAL-ASAD Support <support@resend.dev>");
    expect(result).not.toContain("<<");
  });
});
