"use server";

import { redirect } from "next/navigation";
import { loginSchema, otpSchema } from "@/lib/validations/auth";
import { createSession, destroySession, SESSION_DURATION_MS } from "./session";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { otpRepository } from "@/lib/repositories/otp";
import { sessionRepository } from "@/lib/repositories/session";

type ActionResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

const DEV_OTP = "123456";
const isDev = process.env.NODE_ENV !== "production";

function deriveNameFromEmail(email: string): string {
  const namePart = email.split("@")[0] ?? "User";
  return namePart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function requestOtp(formData: FormData): Promise<ActionResult> {
  const raw = { email: (formData.get("email") ?? "") as string };
  const result = loginSchema.safeParse(raw);

  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Invalid input." };
  }

  if (!hasDatabase()) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  try {
    await userRepository.findOrCreate(result.data.email);
    const code = await otpRepository.create(result.data.email);

    if (isDev) {
      console.log(`[DEV OTP] ${result.data.email}: ${code}`);
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to create OTP:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function verifyOtp(
  email: string,
  code: string,
): Promise<ActionResult> {
  const codeResult = otpSchema.safeParse({ code });
  if (!codeResult.success) {
    const firstError = Object.values(codeResult.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Invalid code." };
  }

  const emailResult = loginSchema.safeParse({ email });
  if (!emailResult.success) {
    return { success: false, error: "Invalid email." };
  }

  if (!hasDatabase()) {
    if (code !== DEV_OTP) {
      return {
        success: false,
        error: "Invalid code. Please try again or request a new one.",
      };
    }
    const isAdmin = email === "admin@royalasad.com";
    await createSession({
      userId: email,
      email,
      name: deriveNameFromEmail(email),
      role: isAdmin ? "admin" : "client",
    });
    return {
      success: true,
      redirectTo: isAdmin ? "/admin/dashboard" : "/dashboard",
    };
  }

  try {
    const isValidOtp =
      (isDev && code === DEV_OTP) ||
      (await otpRepository.verify(email, code));

    if (!isValidOtp) {
      return {
        success: false,
        error: "Invalid code. Please try again or request a new one.",
      };
    }

    const user = await userRepository.findOrCreate(email);

    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await sessionRepository.create(user.id, expiresAt);

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const redirectTo =
      user.role === "admin" ? "/admin/dashboard" : "/dashboard";
    return { success: true, redirectTo };
  } catch (err) {
    console.error("Failed to verify OTP:", err);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function logout(): Promise<never> {
  await destroySession();
  redirect("/login");
}
