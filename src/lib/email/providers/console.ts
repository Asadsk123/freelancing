import type { EmailProvider } from "../types";

/**
 * Development / preview provider. Does NOT send anything — logs a sanitized
 * one-line summary (recipient + subject only, never the body or secrets) so
 * local development works without an API key.
 */
export function createConsoleProvider(): EmailProvider {
  return {
    name: "console",
    async send(message) {
      console.info(`[email:log] → ${message.to} · "${message.subject}"`);
      return { id: `log-${Date.now()}` };
    },
  };
}
