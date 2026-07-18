import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatTrackingId,
} from "@/lib/utils/formatting";

describe("formatFileSize", () => {
  it("formats bytes, KB, MB, GB", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
    expect(formatFileSize(3.25 * 1024 * 1024 * 1024)).toBe("3.3 GB");
  });
});

describe("formatTrackingId", () => {
  it("zero-pads the sequence to six digits", () => {
    expect(formatTrackingId("RA", 2026, 7)).toBe("RA-2026-000007");
    expect(formatTrackingId("INQ", 2026, 123456)).toBe("INQ-2026-123456");
  });
});

describe("formatDate", () => {
  it("renders a fixed date consistently", () => {
    expect(formatDate(new Date(Date.UTC(2026, 6, 14, 12)))).toBe("14 July 2026");
  });
});

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-14T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("buckets seconds, minutes, hours, days, and falls back to a date", () => {
    expect(formatRelativeTime(new Date("2026-07-14T11:59:30Z"))).toBe("Just now");
    expect(formatRelativeTime(new Date("2026-07-14T11:15:00Z"))).toBe("45m ago");
    expect(formatRelativeTime(new Date("2026-07-14T05:00:00Z"))).toBe("7h ago");
    expect(formatRelativeTime(new Date("2026-07-11T12:00:00Z"))).toBe("3d ago");
    expect(formatRelativeTime(new Date("2026-07-01T12:00:00Z"))).toBe("1 July 2026");
  });
});
