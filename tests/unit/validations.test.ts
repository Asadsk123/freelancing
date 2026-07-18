import { describe, it, expect } from "vitest";
import { inquiryFormSchema } from "@/lib/validations/inquiry";
import { createBlogPostSchema, updateBlogPostSchema } from "@/lib/validations/blog-post";
import { submitReviewSchema } from "@/lib/validations/review";
import { updateProfileSchema, notificationPreferenceSchema } from "@/lib/validations/settings";
import { updateFileStatusSchema, requestRevisionSchema } from "@/lib/validations/file";

describe("inquiryFormSchema", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "",
    company: "",
    service: "ai-solutions",
    budget: "",
    message: "We need an AI assistant for support.",
  };

  it("accepts a valid inquiry", () => {
    expect(inquiryFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a missing name, bad email, and empty message", () => {
    expect(inquiryFormSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
    expect(inquiryFormSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
    expect(inquiryFormSchema.safeParse({ ...valid, message: "" }).success).toBe(false);
  });

  it("enforces the 5000-char message cap", () => {
    expect(inquiryFormSchema.safeParse({ ...valid, message: "x".repeat(5000) }).success).toBe(true);
    expect(inquiryFormSchema.safeParse({ ...valid, message: "x".repeat(5001) }).success).toBe(false);
  });
});

describe("createBlogPostSchema", () => {
  const valid = {
    title: "Hello World",
    slug: "hello-world",
    excerpt: "",
    content: "Body",
    coverImageUrl: "",
    categoryId: "",
    status: "draft",
  };

  it("accepts a valid post and defaults status to draft", () => {
    const parsed = createBlogPostSchema.safeParse({ ...valid, status: undefined });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.status).toBe("draft");
  });

  it("rejects invalid slugs (uppercase, spaces, leading/trailing hyphens)", () => {
    for (const slug of ["Hello", "hello world", "-hello", "hello-", "hello--world!", ""]) {
      expect(createBlogPostSchema.safeParse({ ...valid, slug }).success).toBe(false);
    }
  });

  it("accepts hyphenated lowercase slugs", () => {
    for (const slug of ["a", "a-b", "post-123", "2026-review"]) {
      expect(createBlogPostSchema.safeParse({ ...valid, slug }).success).toBe(true);
    }
  });

  it("rejects unknown statuses", () => {
    expect(createBlogPostSchema.safeParse({ ...valid, status: "published" }).success).toBe(true);
    expect(createBlogPostSchema.safeParse({ ...valid, status: "live" }).success).toBe(false);
  });

  it("update variant requires postId and allows partial fields", () => {
    expect(updateBlogPostSchema.safeParse({ postId: "abc", title: "New" }).success).toBe(true);
    expect(updateBlogPostSchema.safeParse({ title: "New" }).success).toBe(false);
  });
});

describe("submitReviewSchema", () => {
  it("coerces rating strings and enforces the 1-5 range", () => {
    const base = { projectId: "p1", testimonial: "" };
    const ok = submitReviewSchema.safeParse({ ...base, rating: "5" });
    expect(ok.success).toBe(true);
    if (ok.success) expect(ok.data.rating).toBe(5);
    expect(submitReviewSchema.safeParse({ ...base, rating: "0" }).success).toBe(false);
    expect(submitReviewSchema.safeParse({ ...base, rating: "6" }).success).toBe(false);
    expect(submitReviewSchema.safeParse({ ...base, rating: "4.5" }).success).toBe(false);
  });

  it("caps the testimonial at 2000 chars", () => {
    const base = { projectId: "p1", rating: "5" };
    expect(submitReviewSchema.safeParse({ ...base, testimonial: "x".repeat(2000) }).success).toBe(true);
    expect(submitReviewSchema.safeParse({ ...base, testimonial: "x".repeat(2001) }).success).toBe(false);
  });
});

describe("settings schemas", () => {
  it("profile requires a non-blank name and trims it", () => {
    const ok = updateProfileSchema.safeParse({ name: "  Jane  ", phone: "", company: "" });
    expect(ok.success).toBe(true);
    if (ok.success) expect(ok.data.name).toBe("Jane");
    expect(updateProfileSchema.safeParse({ name: "   ", phone: "", company: "" }).success).toBe(false);
  });

  it("notification preference is a closed enum", () => {
    for (const preference of ["all", "portal_only", "critical_only"]) {
      expect(notificationPreferenceSchema.safeParse({ preference }).success).toBe(true);
    }
    expect(notificationPreferenceSchema.safeParse({ preference: "email_only" }).success).toBe(false);
  });
});

describe("file schemas", () => {
  it("status is a closed enum", () => {
    for (const status of ["draft", "preview", "revision_requested", "approved", "final"]) {
      expect(updateFileStatusSchema.safeParse({ fileId: "f1", status }).success).toBe(true);
    }
    expect(updateFileStatusSchema.safeParse({ fileId: "f1", status: "published" }).success).toBe(false);
    expect(updateFileStatusSchema.safeParse({ fileId: "", status: "draft" }).success).toBe(false);
  });

  it("revision note is required and capped at 2000 chars", () => {
    expect(requestRevisionSchema.safeParse({ fileId: "f1", note: "" }).success).toBe(false);
    expect(requestRevisionSchema.safeParse({ fileId: "f1", note: "Make it blue" }).success).toBe(true);
    expect(requestRevisionSchema.safeParse({ fileId: "f1", note: "x".repeat(2001) }).success).toBe(false);
  });
});
