import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET() {
  const dbUrl = process.env.DATABASE_URL ?? "";
  return NextResponse.json({
    db: dbUrl.length > 0,
    dbLen: dbUrl.length,
    dbPrefix: dbUrl.slice(0, 12) || "(empty)",
    nodeEnv: process.env.NODE_ENV,
    resend: !!process.env.RESEND_API_KEY,
  });
}
