import { NextResponse } from "next/server";
export const runtime = "nodejs";
export function GET() {
  const db = process.env.DATABASE_URL ?? "";
  const dbHost = db.split("@")[1]?.split("/")[0] ?? "none";
  return NextResponse.json({
    dbOk: db.startsWith("postgresql://"),
    dbHost,
    emailMode: process.env.EMAIL_MODE ?? "NOT_SET",
    resend: !!process.env.RESEND_API_KEY,
    authSecret: !!process.env.AUTH_SECRET,
    node: process.env.NODE_ENV,
  });
}
