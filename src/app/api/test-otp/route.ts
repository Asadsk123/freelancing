import { NextRequest, NextResponse } from "next/server";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { otpRepository } from "@/lib/repositories/otp";
import { email as mailer } from "@/lib/email";
import { getEmailMode } from "@/lib/email/config";

// Temporary test endpoint — remove after verification
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("s");
  if (secret !== "ra-test-2026") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const testEmail = "fahadasadmuz@gmail.com";
  const results: Record<string, unknown> = {
    hasDb: hasDatabase(),
    emailMode: getEmailMode(),
    resendKey: !!process.env.RESEND_API_KEY,
    node: process.env.NODE_ENV,
  };

  if (!hasDatabase()) {
    return NextResponse.json({ ...results, error: "no db" });
  }

  try {
    await userRepository.findOrCreate(testEmail);
    const code = await otpRepository.create(testEmail);
    results.otpCreated = true;
    results.codeLen = code.length;

    const outcome = await mailer.otp(testEmail, code, 10);
    results.delivered = outcome.delivered;
    results.providerId = outcome.providerId;
    results.error = outcome.error;
  } catch (e) {
    results.exception = String(e);
  }

  return NextResponse.json(results);
}
