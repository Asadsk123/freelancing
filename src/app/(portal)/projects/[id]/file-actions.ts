"use server";

import { requestRevisionSchema } from "@/lib/validations/file";
import { hasDatabase } from "@/db";
import { fileRepository } from "@/lib/repositories/file";
import { projectRepository } from "@/lib/repositories/project";
import { auditLogRepository } from "@/lib/repositories/audit-log";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

type ActionResult = { success: boolean; error?: string };

/**
 * A client requests changes on a delivered file. Guards: authenticated,
 * owns the project, and the file is in a reviewable state (not a draft and
 * not already awaiting a revision).
 */
export async function requestFileRevision(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated." };

  const parsed = requestRevisionSchema.safeParse({
    fileId: (formData.get("fileId") ?? "") as string,
    note: (formData.get("note") ?? "") as string,
  });
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  try {
    const file = await fileRepository.findById(parsed.data.fileId);
    if (!file) return { success: false, error: "File not found." };

    // Ownership: only the project's own client may request revisions.
    const project = await projectRepository.findByIdWithDetails(file.projectId);
    if (!project || project.clientId !== session.userId || file.status === "draft") {
      return { success: false, error: "File not found." };
    }
    if (file.status === "revision_requested") {
      return { success: false, error: "A revision is already requested for this file." };
    }
    if (file.status === "final") {
      return { success: false, error: "This file is final — please message the team instead." };
    }

    await fileRepository.updateStatus(file.id, "revision_requested", parsed.data.note);
    await auditLogRepository.record({
      userId: session.userId,
      action: "file.revision_requested",
      entityType: "file",
      entityId: file.id,
      metadata: { fileName: file.fileName, projectId: file.projectId },
    });

    revalidatePath(`/projects/${file.projectId}`);
    revalidatePath(`/admin/projects/${file.projectId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to request file revision:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
