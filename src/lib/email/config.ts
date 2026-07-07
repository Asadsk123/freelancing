import { brand } from "@/config/brand";

/**
 * Email delivery mode:
 *   - "production" → send real emails via the configured provider
 *   - "log"        → do not send; log a sanitized line (dev/preview)
 *
 * Safety: development NEVER sends real emails unless `EMAIL_MODE=production`
 * is set explicitly. Otherwise real sending requires production + an API key.
 */
export type EmailMode = "production" | "log";

export function getEmailMode(): EmailMode {
  const explicit = (process.env.EMAIL_MODE ?? "").toLowerCase();
  if (explicit === "production") return "production";
  if (explicit === "log" || explicit === "preview") return "log";

  if (process.env.NODE_ENV === "production" && process.env.RESEND_API_KEY) {
    return "production";
  }
  return "log";
}

/** Builds a `Name <address>` from address from env, with safe defaults. */
export function getFromAddress(kind: "default" | "support" = "default"): string {
  const address =
    kind === "support"
      ? process.env.EMAIL_FROM_SUPPORT ?? brand.contact.supportEmail
      : process.env.EMAIL_FROM_DEFAULT ?? brand.contact.email;
  return `${brand.name} <${address}>`;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
