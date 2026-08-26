"use server";

import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { requireAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function createClient(formData: FormData): Promise<ActionResult & { clientId?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const name = ((formData.get("name") ?? "") as string).trim();
  const email = ((formData.get("email") ?? "") as string).trim().toLowerCase();
  const company = ((formData.get("company") ?? "") as string).trim() || null;
  const phone = ((formData.get("phone") ?? "") as string).trim() || null;

  if (!name) return { success: false, error: "Name is required." };
  if (!email || !email.includes("@")) return { success: false, error: "Valid email is required." };

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  try {
    const client = await userRepository.createClient({ name, email, company, phone });
    revalidatePath("/admin/clients");
    revalidatePath("/admin/projects/new");
    return { success: true, clientId: client.id };
  } catch (err) {
    console.error("Failed to create client:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

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
