import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "ra_session";

const PROTECTED_PREFIXES = ["/dashboard", "/projects", "/notifications", "/settings"];
const ADMIN_PREFIXES = ["/admin"];
const AUTH_ROUTES = ["/login"];

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }
  return new TextEncoder().encode(
    "dev-only-secret-do-not-use-in-production!",
  );
}

type TokenPayload = {
  email: string;
  role: "admin" | "client";
};

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    // Signature proves the token is ours; still validate the claim shape so a
    // malformed payload can never flow through role checks untyped.
    if (
      typeof payload.email !== "string" ||
      (payload.role !== "admin" && payload.role !== "client")
    ) {
      return null;
    }
    return { email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAdmin = ADMIN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if ((isProtected || isAdmin) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && session && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthRoute && session) {
    const destination = session.role === "admin" ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login/:path*",
  ],
};
