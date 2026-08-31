import { NextResponse } from "next/server";
export const runtime = "nodejs";
export function GET() {
  const db = process.env.DATABASE_URL ?? "";
  const resend = process.env.RESEND_API_KEY ?? "";
  const mode = process.env.EMAIL_MODE ?? "";
  const auth = process.env.AUTH_SECRET ?? "";
  return NextResponse.json({
    db: db.length > 0,
    dbLen: db.length,
    dbOk: db.startsWith("postgresql://"),
    resend: resend.length > 0,
    emailMode: mode,
    authSecret: auth.length > 0,
    node: process.env.NODE_ENV,
  });
}
