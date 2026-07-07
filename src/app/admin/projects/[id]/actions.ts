"use server";

import {
  createMilestoneSchema,
  updateMilestoneSchema,
  updateMilestoneStatusSchema,
} from "@/lib/validations/milestone";
import { hasDatabase } from "@/db";
import { milestoneRepository } from "@/lib/repositories/milestone";
import { projectRepository } from "@/lib/repositories/project";
import { requireAdmin } from "@/lib/auth/guards";
import { email as mailer } from "@/lib/email";
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

    await milestoneRepository.create({
      projectId: result.data.projectId,
      title: result.data.title,
      description: result.data.description || null,
      status: result.data.status,
      sortOrder: result.data.sortOrder,
      dueDate: parseDueDate(result.data.dueDate),
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

    revalidateProject(existing.projectId);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete milestone:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
