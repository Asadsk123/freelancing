"use server";

import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { requireAdmin } from "@/lib/auth/guards";
import {
  setAdminActiveSchema,
  adminUserIdSchema,
  promoteAdminSchema,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string;
};

function revalidateTeam() {
  revalidatePath("/admin/team");
  revalidatePath("/admin/dashboard");
}

/**
 * Activate or deactivate an administrator account.
 * Guards (enforced server-side): cannot deactivate your own account, and the
 * last active administrator cannot be deactivated.
 */
export async function setAdminActive(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const parsed = setAdminActiveSchema.safeParse({
    userId: (formData.get("userId") ?? "") as string,
    active: (formData.get("active") ?? "") as string,
  });
  if (!parsed.success) return { success: false, error: "Invalid request." };

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  const { userId } = parsed.data;
  const nextActive = parsed.data.active === "true";

  try {
    const target = await userRepository.findById(userId);
    if (!target || target.role !== "admin") {
      return { success: false, error: "Administrator not found." };
    }

    if (!nextActive) {
      if (userId === auth.session.userId) {
        return { success: false, error: "You cannot deactivate your own account." };
      }
      if (target.isActive) {
        const activeAdmins = await userRepository.countActiveAdmins();
        if (activeAdmins <= 1) {
          return { success: false, error: "At least one active administrator must remain." };
        }
      }
    }

    await userRepository.setActive(userId, nextActive);
    revalidateTeam();
    return { success: true };
  } catch (err) {
    console.error("Failed to update administrator status:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/** Promote an existing user to administrator (by email). */
export async function promoteToAdmin(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const parsed = promoteAdminSchema.safeParse({
    email: (formData.get("email") ?? "") as string,
  });
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Invalid email." };
  }

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  try {
    const user = await userRepository.findByEmail(parsed.data.email.toLowerCase());
    if (!user) {
      return { success: false, error: "No user with that email. They must sign in once first." };
    }
    if (user.role === "admin") {
      return { success: false, error: "That user is already an administrator." };
    }

    await userRepository.setRole(user.id, "admin");
    revalidateTeam();
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (err) {
    console.error("Failed to promote administrator:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Demote an administrator back to a client account.
 * Guards: cannot demote yourself, and the last active administrator cannot be
 * demoted.
 */
export async function demoteToClient(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const parsed = adminUserIdSchema.safeParse({
    userId: (formData.get("userId") ?? "") as string,
  });
  if (!parsed.success) return { success: false, error: "Invalid request." };

  if (!hasDatabase()) return { success: false, error: "Database not connected." };

  const { userId } = parsed.data;

  try {
    if (userId === auth.session.userId) {
      return { success: false, error: "You cannot remove your own administrator access." };
    }

    const target = await userRepository.findById(userId);
    if (!target || target.role !== "admin") {
      return { success: false, error: "Administrator not found." };
    }

    if (target.isActive) {
      const activeAdmins = await userRepository.countActiveAdmins();
      if (activeAdmins <= 1) {
        return { success: false, error: "At least one active administrator must remain." };
      }
    }

    await userRepository.setRole(userId, "client");
    revalidateTeam();
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (err) {
    console.error("Failed to demote administrator:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
