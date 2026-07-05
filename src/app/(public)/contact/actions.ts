"use server";

import { inquiryFormSchema } from "@/lib/validations/inquiry";
import { hasDatabase } from "@/db";
import { inquiryRepository } from "@/lib/repositories/inquiry";
import { formatTrackingId } from "@/lib/utils/formatting";
import { brand } from "@/config/brand";

type SubmitResult = {
  success: boolean;
  error?: string;
  trackingId?: string;
};

function generateTrackingId(): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 999999) + 1;
  return formatTrackingId(brand.tracking.inquiryPrefix, year, sequence);
}

export async function submitInquiry(formData: FormData): Promise<SubmitResult> {
  const field = (name: string) => (formData.get(name) ?? "") as string;
  const raw = {
    name: field("name"),
    email: field("email"),
    phone: field("phone"),
    company: field("company"),
    service: field("service"),
    budget: field("budget"),
    message: field("message"),
  };

  const result = inquiryFormSchema.safeParse(raw);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return {
      success: false,
      error: firstError?.[0] ?? "Please check your input.",
    };
  }

  if (!hasDatabase()) {
    return {
      success: false,
      error: "Service temporarily unavailable. Please email us directly.",
    };
  }

  try {
    const trackingId = generateTrackingId();
    await inquiryRepository.create(result.data, trackingId);
    return { success: true, trackingId };
  } catch (err) {
    console.error("Failed to save inquiry:", err);
    return {
      success: false,
      error: "Something went wrong. Please try again or email us directly.",
    };
  }
}
