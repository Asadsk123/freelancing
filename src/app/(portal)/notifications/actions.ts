"use server";

import { hasDatabase } from "@/db";
import { notificationRepository } from "@/lib/repositories/notification";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function markNotificationRead(formData: FormData): Promise<ActionResult> {
  const notificationId = (formData.get("notificationId") ?? "") as string;
  if (!notificationId) {
    return { success: false, error: "Notification ID required." };
  }

  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const updated = await notificationRepository.markAsRead(notificationId, session.userId);
    if (!updated) {
      return { success: false, error: "Notification not found." };
    }

    revalidatePath("/notifications");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    await notificationRepository.markAllAsRead(session.userId);

    revalidatePath("/notifications");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Failed to mark all notifications as read:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
