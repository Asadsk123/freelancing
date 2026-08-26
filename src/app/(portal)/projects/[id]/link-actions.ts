"use server";

import { submitLinkSchema } from "@/lib/validations/link";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { linkRepository } from "@/lib/repositories/link";
import { auditLogRepository } from "@/lib/repositories/audit-log";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

type ActionResult = { success: boolean; error?: string };

export async function submitProjectLink(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated." };

  const parsed = submitLinkSchema.safeParse({
    projectId: (formData.get("projectId") ?? "") as string,
    url: (formData.get("url") ?? "") as string,
    label: (formData.get("label") ?? "") as string,
    linkType: (formData.get("linkType") ?? "other") as string,
    note: (formData.get("note") ?? "") as string,
  });
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  try {
    const project = await projectRepository.findByIdWithDetails(parsed.data.projectId);
    if (!project) return { success: false, error: "Project not found." };

    // Clients can only submit links for their own projects.
    if (session.role === "client" && project.clientId !== session.userId) {
      return { success: false, error: "Project not found." };
    }

    const link = await linkRepository.create({
      projectId: parsed.data.projectId,
      submittedBy: session.userId,
      url: parsed.data.url,
      label: parsed.data.label,
      linkType: parsed.data.linkType,
      note: parsed.data.note || null,
    });

    await auditLogRepository.record({
      userId: session.userId,
      action: "project.link_submitted",
      entityType: "project",
      entityId: parsed.data.projectId,
      metadata: { label: link.label, linkType: link.linkType },
    });

    revalidatePath(`/projects/${parsed.data.projectId}`);
    revalidatePath(`/admin/projects/${parsed.data.projectId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to submit link:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
