"use server";

import { getSession } from "@/lib/auth/session";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { updateProfileSchema, notificationPreferenceSchema } from "@/lib/validations/settings";
import { revalidatePath } from "next/cache";

type ActionResult = { success: boolean; error?: string };

/** Updates the signed-in user's own profile. Ownership is the session itself. */
export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated." };

  const parsed = updateProfileSchema.safeParse({
    name: (formData.get("name") ?? "") as string,
    phone: (formData.get("phone") ?? "") as string,
    company: (formData.get("company") ?? "") as string,
  });
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  try {
    await userRepository.updateProfile(session.userId, {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
    });
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Failed to update profile:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateNotificationPreference(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated." };

  const parsed = notificationPreferenceSchema.safeParse({
    preference: (formData.get("preference") ?? "") as string,
  });
  if (!parsed.success) return { success: false, error: "Invalid preference." };

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  try {
    await userRepository.updateNotificationPreference(session.userId, parsed.data.preference);
    revalidatePath("/settings");
    return { success: true };
  } catch (err) {
    console.error("Failed to update notification preference:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
