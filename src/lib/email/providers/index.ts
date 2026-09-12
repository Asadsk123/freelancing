import type { EmailProvider } from "../types";
import { getEmailMode } from "../config";
import { createResendProvider } from "./resend";
import { createConsoleProvider } from "./console";
import { createGmailProvider } from "./gmail";

/**
 * Selects the active provider. Gmail SMTP takes priority (sends to any email).
 * Falls back to Resend, then console logger in dev/preview.
 */
export function getProvider(): EmailProvider {
  if (getEmailMode() === "production") {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (gmailUser && gmailPass) return createGmailProvider(gmailUser, gmailPass);

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) return createResendProvider(resendKey);
  }
  return createConsoleProvider();
}
