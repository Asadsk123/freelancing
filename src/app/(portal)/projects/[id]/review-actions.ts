"use server";

import { submitReviewSchema } from "@/lib/validations/review";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { reviewRepository } from "@/lib/repositories/review";
import { auditLogRepository } from "@/lib/repositories/audit-log";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

type ActionResult = { success: boolean; error?: string };

/**
 * A client submits a review for one of their own completed projects.
 * Guards: authenticated client, owns the project, project is completed, and has
 * not already reviewed it. Reviews are unpublished until an admin publishes.
 */
export async function submitReview(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated." };

  const parsed = submitReviewSchema.safeParse({
    projectId: (formData.get("projectId") ?? "") as string,
    rating: (formData.get("rating") ?? "") as string,
    testimonial: (formData.get("testimonial") ?? "") as string,
  });
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  try {
    const project = await projectRepository.findByIdWithDetails(parsed.data.projectId);
    if (!project) return { success: false, error: "Project not found." };

    // Ownership: only the project's own client may review it.
    if (project.clientId !== session.userId) {
      return { success: false, error: "Project not found." };
    }
    if (project.status !== "completed") {
      return { success: false, error: "You can review a project once it is completed." };
    }

    const existing = await reviewRepository.findByProjectAndClient(project.id, session.userId);
    if (existing) {
      return { success: false, error: "You have already reviewed this project." };
    }

    const review = await reviewRepository.create({
      projectId: project.id,
      clientId: session.userId,
      rating: parsed.data.rating,
      testimonial: parsed.data.testimonial || null,
    });
    await auditLogRepository.record({
      userId: session.userId,
      action: "review.submitted",
      entityType: "review",
      entityId: review.id,
      metadata: { projectId: project.id, rating: parsed.data.rating },
    });

    revalidatePath(`/projects/${project.id}`);
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (err) {
    console.error("Failed to submit review:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
