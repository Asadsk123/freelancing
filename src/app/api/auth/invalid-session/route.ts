import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export const runtime = "nodejs";

/**
 * Clears a session whose user no longer exists or was deactivated, then sends
 * the visitor to login. Layouts redirect here because server components cannot
 * mutate cookies during render.
 */
export async function GET(request: Request): Promise<NextResponse> {
  await destroySession();
  return NextResponse.redirect(new URL("/login", request.url));
}
