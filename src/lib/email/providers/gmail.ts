import type { EmailProvider } from "../types";

/**
 * Gmail SMTP provider via nodemailer.
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD env vars.
 * Use a Gmail App Password (not your real password):
 * https://myaccount.google.com/apppasswords
 */
export function createGmailProvider(user: string, appPassword: string): EmailProvider {
  return {
    name: "gmail",
    async send(message) {
      // Dynamic import keeps nodemailer out of edge bundles
      const nodemailer = await import("nodemailer");
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass: appPassword },
      });
      const info = await transport.sendMail({
        from: message.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });
      return { id: info.messageId };
    },
  };
}
