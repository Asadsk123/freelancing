import { getSession, type SessionPayload } from "./session";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";

export type AdminGuardResult =
  | { ok: true; session: SessionPayload }
  | { ok: false; error: string };

/**
 * Server-side admin authorization check. Use inside every admin server action
 * as defense in depth — it does not rely on middleware, which only protects
 * page routes. Returns the session so callers can compare against the actor
 * (e.g. to prevent self-targeting destructive actions).
 *
 * Beyond the JWT, the actor is re-validated against the database so that
 * demotion, deactivation, or deletion takes effect immediately instead of
 * whenever the 30-day cookie expires.
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not authenticated." };
  if (session.role !== "admin") return { ok: false, error: "Not authorized." };

  if (hasDatabase()) {
    const user = await userRepository.findById(session.userId);
    if (!user || !user.isActive || user.role !== "admin") {
      return { ok: false, error: "Not authorized." };
    }
  }

  return { ok: true, session };
}
