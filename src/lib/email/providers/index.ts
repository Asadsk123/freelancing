import type { EmailProvider } from "../types";
import { getEmailMode } from "../config";
import { createResendProvider } from "./resend";
import { createConsoleProvider } from "./console";

/**
 * Selects the active provider. Real providers are only used in "production"
 * mode with the relevant key present; otherwise the safe console/log provider
 * is used so development never sends real email.
 *
 * To add SendGrid / SES / SMTP: implement `EmailProvider` and branch here on an
 * `EMAIL_PROVIDER` env value — no business-logic changes needed.
 */
export function getProvider(): EmailProvider {
  if (getEmailMode() === "production") {
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) return createResendProvider(resendKey);
  }
  return createConsoleProvider();
}
