"use server";

import { redirect } from "next/navigation";
import { loginSchema, otpSchema } from "@/lib/validations/auth";
import { createSession, getSession, destroySession, SESSION_DURATION_MS } from "./session";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { otpRepository, OTP_EXPIRY_MINUTES } from "@/lib/repositories/otp";
import { sessionRepository } from "@/lib/repositories/session";
import { email as mailer } from "@/lib/email";

type ActionResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
  retryAfter?: number;
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
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const code = String(array[0]! % 1000000).padStart(6, "0");
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const payload = Buffer.from(JSON.stringify({ email: result.data.email, code, expiresAt })).toString("base64");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.set("ra_otp_pending", payload, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
    await mailer.otp(result.data.email, code, 10);
    return { success: true };
  }

  try {
    const retryAfter = await otpRepository.secondsUntilResend(result.data.email);
    if (retryAfter > 0) {
      return {
        success: false,
        error: `Please wait ${retryAfter}s before requesting another code.`,
        retryAfter,
      };
    }

    await userRepository.findOrCreate(result.data.email);
    const code = await otpRepository.create(result.data.email);

    const outcome = await mailer.otp(result.data.email, code, OTP_EXPIRY_MINUTES);

    // In production with a real provider, surface delivery failures so the user
    // is not left waiting for an email that was never sent.
    if (!outcome.delivered && process.env.NODE_ENV === "production") {
      console.error("[auth] OTP email delivery failed:", outcome.error);
      return {
        success: false,
        error: "We couldn't send your code right now. Please try again in a moment.",
      };
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
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const raw = cookieStore.get("ra_otp_pending")?.value;
    let valid = false;
    if (raw) {
      try {
        const parsed = JSON.parse(Buffer.from(raw, "base64").toString());
        valid = parsed.email === email && parsed.code === code && parsed.expiresAt > Date.now();
      } catch { valid = false; }
    }
    if (!valid) {
      return { success: false, error: "Invalid or expired code. Please request a new one." };
    }
    cookieStore.delete("ra_otp_pending");
    const isAdmin = email === "admin@royalasad.com";
    await createSession({
      userId: email,
      email,
      name: deriveNameFromEmail(email),
      role: isAdmin ? "admin" : "client",
    });
    return { success: true, redirectTo: isAdmin ? "/admin/dashboard" : "/dashboard" };
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

    await sessionRepository.deleteByUserId(user.id);
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
  if (hasDatabase()) {
    const session = await getSession();
    if (session) {
      await sessionRepository.deleteByUserId(session.userId);
    }
  }
  await destroySession();
  redirect("/login");
}
