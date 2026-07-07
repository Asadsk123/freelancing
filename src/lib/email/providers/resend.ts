import type { EmailProvider } from "../types";

/**
 * Resend provider using the REST API directly (no SDK dependency).
 * Docs: https://resend.com/docs/api-reference/emails/send-email
 */
export function createResendProvider(apiKey: string): EmailProvider {
  return {
    name: "resend",
    async send(message) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: message.from,
          to: [message.to],
          subject: message.subject,
          html: message.html,
          text: message.text,
        }),
      });

      if (!res.ok) {
        // Never surface the API key or full provider payloads upstream.
        const detail = await res.text().catch(() => "");
        throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 200)}`);
      }

      const data = (await res.json().catch(() => ({}))) as { id?: string };
      return { id: data.id };
    },
  };
}
