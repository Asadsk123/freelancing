"use server";

import { sendMessageSchema } from "@/lib/validations/conversation";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { conversationRepository } from "@/lib/repositories/conversation";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export type MessageActionState = {
  success: boolean;
  error?: string;
} | null;

export async function sendProjectMessage(
  _prevState: MessageActionState,
  formData: FormData,
): Promise<MessageActionState> {
  const raw = {
    projectId: (formData.get("projectId") ?? "") as string,
    content: (formData.get("content") ?? "") as string,
  };

  const result = sendMessageSchema.safeParse(raw);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const project = await projectRepository.findByIdWithDetails(result.data.projectId);
    if (!project) {
      return { success: false, error: "Project not found." };
    }

    if (session.role === "client" && project.clientId !== session.userId) {
      return { success: false, error: "Project not found." };
    }

    const conversation = await conversationRepository.getOrCreateByProjectId(
      result.data.projectId,
    );

    await conversationRepository.addMessage({
      conversationId: conversation.id,
      senderId: session.userId,
      content: result.data.content,
    });

    revalidatePath(`/projects/${result.data.projectId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to send message:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
