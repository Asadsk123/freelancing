"use server";

import { redirect } from "next/navigation";
import { loginSchema, otpSchema } from "@/lib/validations/auth";
import { createSession, destroySession } from "./session";

type ActionResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

const MOCK_USERS: Record<string, { name: string; role: "admin" | "client" }> = {
  "admin@royalasad.com": { name: "Admin", role: "admin" },
};

function getMockUser(email: string): { name: string; role: "admin" | "client" } {
  const known = MOCK_USERS[email];
  if (known) return known;
  const namePart = email.split("@")[0] ?? "User";
  const name = namePart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { name, role: "client" };
}

export async function requestOtp(formData: FormData): Promise<ActionResult> {
  const raw = { email: formData.get("email") as string };
  const result = loginSchema.safeParse(raw);

  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Invalid input." };
  }

  // Mock: In production this would generate an OTP, store it in the database,
  // and send it via email. For now we accept any email and skip sending.
  await new Promise((resolve) => setTimeout(resolve, 300));

  return { success: true };
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

  // Mock: accept "123456" as the valid OTP for any email
  if (code !== "123456") {
    return {
      success: false,
      error: "Invalid code. Please try again or request a new one.",
    };
  }

  const user = getMockUser(email);

  await createSession({
    userId: email,
    email,
    name: user.name,
    role: user.role,
  });

  const redirectTo = user.role === "admin" ? "/admin/dashboard" : "/dashboard";
  return { success: true, redirectTo };
}

export async function logout(): Promise<never> {
  await destroySession();
  redirect("/login");
}
