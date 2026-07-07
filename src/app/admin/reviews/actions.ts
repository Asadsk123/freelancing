"use server";

import { hasDatabase } from "@/db";
import { reviewRepository } from "@/lib/repositories/review";
import { requireAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function toggleReviewPublished(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const reviewId = (formData.get("reviewId") ?? "") as string;
  if (!reviewId) {
    return { success: false, error: "Review ID required." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const toggled = await reviewRepository.togglePublished(reviewId);
    if (!toggled) {
      return { success: false, error: "Review not found." };
    }

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Failed to toggle review:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function deleteReview(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const reviewId = (formData.get("reviewId") ?? "") as string;
  if (!reviewId) {
    return { success: false, error: "Review ID required." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const deleted = await reviewRepository.delete(reviewId);
    if (!deleted) {
      return { success: false, error: "Review not found." };
    }

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete review:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
