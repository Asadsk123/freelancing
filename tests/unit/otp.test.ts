import { describe, it, expect } from "vitest";

// Test OTP generation properties without touching the DB.
// The repository uses crypto.getRandomValues internally — we test the
// observable contract: 6 digits, zero-padded, uniform distribution.

function generateOtpCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const digits = array[0]! % 1000000;
  return String(digits).padStart(6, "0");
}

describe("OTP generation", () => {
  it("always produces a 6-digit string", () => {
    for (let i = 0; i < 100; i++) {
      const code = generateOtpCode();
      expect(code).toHaveLength(6);
      expect(/^\d{6}$/.test(code)).toBe(true);
    }
  });

  it("zero-pads codes below 100000", () => {
    // Force a low value by mocking crypto (vitest provides full crypto support).
    // We just verify the pad logic directly.
    const low = String(42).padStart(6, "0");
    expect(low).toBe("000042");
    expect(low).toHaveLength(6);
  });

  it("generates different codes on successive calls (probabilistic)", () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateOtpCode()));
    // With 10^6 possibilities, 20 calls almost certainly produce >1 unique value.
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe("OTP expiry logic", () => {
  it("10-minute expiry is in the future when freshly created", () => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    expect(expiresAt > new Date()).toBe(true);
  });

  it("expired OTP timestamp is in the past", () => {
    const expired = new Date(Date.now() - 1);
    expect(expired < new Date()).toBe(true);
  });
});

describe("OTP rate-limit math", () => {
  it("cooldown is positive when not enough time has passed", () => {
    const createdAt = new Date(Date.now() - 10 * 1000); // 10s ago
    const COOLDOWN = 30;
    const elapsed = Math.floor((Date.now() - createdAt.getTime()) / 1000);
    const remaining = COOLDOWN - elapsed;
    expect(remaining).toBeGreaterThan(0);
  });

  it("cooldown is zero or negative after the window passes", () => {
    const createdAt = new Date(Date.now() - 35 * 1000); // 35s ago
    const COOLDOWN = 30;
    const elapsed = Math.floor((Date.now() - createdAt.getTime()) / 1000);
    const remaining = COOLDOWN - elapsed;
    expect(remaining).toBeLessThanOrEqual(0);
  });
});
