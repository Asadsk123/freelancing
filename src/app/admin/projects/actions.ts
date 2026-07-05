"use server";

import { createProjectSchema, updateProjectStatusSchema } from "@/lib/validations/project";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { formatTrackingId } from "@/lib/utils/formatting";
import { brand } from "@/config/brand";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string;
};

function generateTrackingId(): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 999999) + 1;
  return formatTrackingId(brand.tracking.prefix, year, sequence);
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  const field = (name: string) => (formData.get(name) ?? "") as string;
  const raw = {
    title: field("title"),
    clientId: field("clientId"),
    serviceId: field("serviceId"),
    description: field("description"),
    startDate: field("startDate"),
    targetDate: field("targetDate"),
  };

  const result = createProjectSchema.safeParse(raw);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const trackingId = generateTrackingId();
    await projectRepository.create({
      trackingId,
      clientId: result.data.clientId,
      title: result.data.title,
      serviceId: result.data.serviceId || null,
      description: result.data.description || null,
      startDate: result.data.startDate ? new Date(result.data.startDate) : null,
      targetDate: result.data.targetDate ? new Date(result.data.targetDate) : null,
    });

    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");
    revalidatePath("/projects");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Failed to create project:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateProjectStatus(formData: FormData): Promise<ActionResult> {
  const raw = {
    projectId: (formData.get("projectId") ?? "") as string,
    status: (formData.get("status") ?? "") as string,
  };

  const result = updateProjectStatusSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: "Invalid status." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const updated = await projectRepository.updateStatus(result.data.projectId, result.data.status);
    if (!updated) {
      return { success: false, error: "Project not found." };
    }

    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");
    revalidatePath("/projects");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Failed to update project status:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function deleteProject(formData: FormData): Promise<ActionResult> {
  const projectId = (formData.get("projectId") ?? "") as string;
  if (!projectId) {
    return { success: false, error: "Project ID required." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const deleted = await projectRepository.delete(projectId);
    if (!deleted) {
      return { success: false, error: "Project not found." };
    }

    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");
    revalidatePath("/projects");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete project:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
