"use server";

import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { requireAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function toggleClientActive(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const clientId = (formData.get("clientId") ?? "") as string;
  if (!clientId) {
    return { success: false, error: "Client ID required." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const toggled = await userRepository.toggleActive(clientId);
    if (!toggled) {
      return { success: false, error: "Client not found." };
    }

    revalidatePath("/admin/clients");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Failed to toggle client status:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
