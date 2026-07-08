"use server";

import {
  createMilestoneSchema,
  updateMilestoneSchema,
  updateMilestoneStatusSchema,
} from "@/lib/validations/milestone";
import { updateFileStatusSchema } from "@/lib/validations/file";
import { hasDatabase } from "@/db";
import { milestoneRepository } from "@/lib/repositories/milestone";
import { projectRepository } from "@/lib/repositories/project";
import { fileRepository } from "@/lib/repositories/file";
import { auditLogRepository } from "@/lib/repositories/audit-log";
import { requireAdmin } from "@/lib/auth/guards";
import { email as mailer } from "@/lib/email";
import { storage } from "@/lib/storage";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string;
};

function parseDueDate(raw: string | undefined): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function revalidateProject(projectId: string) {
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

export async function createMilestone(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const field = (name: string) => (formData.get(name) ?? "") as string;
  const raw = {
    projectId: field("projectId"),
    title: field("title"),
    description: field("description"),
    status: field("status") || "upcoming",
    sortOrder: field("sortOrder") || "0",
    dueDate: field("dueDate"),
  };

  const result = createMilestoneSchema.safeParse(raw);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const project = await projectRepository.findByIdWithDetails(result.data.projectId);
    if (!project) {
      return { success: false, error: "Project not found." };
    }

    const milestone = await milestoneRepository.create({
      projectId: result.data.projectId,
      title: result.data.title,
      description: result.data.description || null,
      status: result.data.status,
      sortOrder: result.data.sortOrder,
      dueDate: parseDueDate(result.data.dueDate),
    });
    await auditLogRepository.record({
      userId: auth.session.userId,
      action: "milestone.created",
      entityType: "milestone",
      entityId: milestone.id,
      metadata: { title: milestone.title, projectId: result.data.projectId },
    });

    // Best-effort notification to the client.
    if (result.data.status === "completed") {
      await mailer.milestoneCompleted(project.clientEmail, project.clientName, project.title, result.data.title);
    } else {
      await mailer.milestoneCreated(project.clientEmail, project.clientName, project.title, result.data.title);
    }

    revalidateProject(result.data.projectId);
    return { success: true };
  } catch (err) {
    console.error("Failed to create milestone:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateMilestone(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const field = (name: string) => (formData.get(name) ?? "") as string;
  const raw = {
    milestoneId: field("milestoneId"),
    title: field("title"),
    description: field("description"),
    status: field("status"),
    sortOrder: field("sortOrder") || "0",
    dueDate: field("dueDate"),
  };

  const result = updateMilestoneSchema.safeParse(raw);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const existing = await milestoneRepository.findById(result.data.milestoneId);
    if (!existing) {
      return { success: false, error: "Milestone not found." };
    }

    await milestoneRepository.update(result.data.milestoneId, {
      title: result.data.title,
      description: result.data.description || null,
      status: result.data.status,
      sortOrder: result.data.sortOrder,
      dueDate: parseDueDate(result.data.dueDate),
    });
    await auditLogRepository.record({
      userId: auth.session.userId,
      action: "milestone.updated",
      entityType: "milestone",
      entityId: result.data.milestoneId,
      metadata: { title: result.data.title, status: result.data.status, projectId: existing.projectId },
    });

    // Notify the client only when the milestone transitions into "completed".
    if (result.data.status === "completed" && existing.status !== "completed") {
      const project = await projectRepository.findByIdWithDetails(existing.projectId);
      if (project) {
        await mailer.milestoneCompleted(project.clientEmail, project.clientName, project.title, result.data.title);
      }
    }

    revalidateProject(existing.projectId);
    return { success: true };
  } catch (err) {
    console.error("Failed to update milestone:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateMilestoneStatus(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const raw = {
    milestoneId: (formData.get("milestoneId") ?? "") as string,
    status: (formData.get("status") ?? "") as string,
  };

  const result = updateMilestoneStatusSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: "Invalid status." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const existing = await milestoneRepository.findById(result.data.milestoneId);
    if (!existing) {
      return { success: false, error: "Milestone not found." };
    }

    await milestoneRepository.update(result.data.milestoneId, {
      status: result.data.status,
    });
    await auditLogRepository.record({
      userId: auth.session.userId,
      action: "milestone.status_changed",
      entityType: "milestone",
      entityId: result.data.milestoneId,
      metadata: { title: existing.title, status: result.data.status, projectId: existing.projectId },
    });

    // Notify the client only when the milestone transitions into "completed".
    if (result.data.status === "completed" && existing.status !== "completed") {
      const project = await projectRepository.findByIdWithDetails(existing.projectId);
      if (project) {
        await mailer.milestoneCompleted(project.clientEmail, project.clientName, project.title, existing.title);
      }
    }

    revalidateProject(existing.projectId);
    return { success: true };
  } catch (err) {
    console.error("Failed to update milestone status:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/** Admin changes a file's workflow status (draft/preview/approved/final...). */
export async function updateFileStatus(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const result = updateFileStatusSchema.safeParse({
    fileId: (formData.get("fileId") ?? "") as string,
    status: (formData.get("status") ?? "") as string,
  });
  if (!result.success) return { success: false, error: "Invalid request." };

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  try {
    const existing = await fileRepository.findById(result.data.fileId);
    if (!existing) return { success: false, error: "File not found." };

    // Leaving revision_requested clears the client's note; other transitions keep it.
    const keepNote = result.data.status === "revision_requested" ? existing.revisionNote : null;
    await fileRepository.updateStatus(result.data.fileId, result.data.status, keepNote);
    await auditLogRepository.record({
      userId: auth.session.userId,
      action: "file.status_changed",
      entityType: "file",
      entityId: result.data.fileId,
      metadata: { fileName: existing.fileName, status: result.data.status, projectId: existing.projectId },
    });

    revalidateProject(existing.projectId);
    return { success: true };
  } catch (err) {
    console.error("Failed to update file status:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/** Admin permanently deletes a file (DB row + stored object, best-effort). */
export async function deleteFile(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const fileId = (formData.get("fileId") ?? "") as string;
  if (!fileId) return { success: false, error: "File ID required." };

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  try {
    const deleted = await fileRepository.delete(fileId);
    if (!deleted) return { success: false, error: "File not found." };

    // Best-effort object removal — the DB row is already gone.
    try {
      await storage.delete(deleted.originalKey);
    } catch (storageErr) {
      console.error("Failed to delete stored object:", storageErr);
    }

    await auditLogRepository.record({
      userId: auth.session.userId,
      action: "file.deleted",
      entityType: "file",
      entityId: fileId,
      metadata: { fileName: deleted.fileName, projectId: deleted.projectId },
    });

    revalidateProject(deleted.projectId);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete file:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function deleteMilestone(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const milestoneId = (formData.get("milestoneId") ?? "") as string;
  if (!milestoneId) {
    return { success: false, error: "Milestone ID required." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const existing = await milestoneRepository.findById(milestoneId);
    if (!existing) {
      return { success: false, error: "Milestone not found." };
    }

    await milestoneRepository.delete(milestoneId);
    await auditLogRepository.record({
      userId: auth.session.userId,
      action: "milestone.deleted",
      entityType: "milestone",
      entityId: milestoneId,
      metadata: { title: existing.title, projectId: existing.projectId },
    });

    revalidateProject(existing.projectId);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete milestone:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
