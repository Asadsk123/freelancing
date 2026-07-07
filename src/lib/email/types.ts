/** A fully-rendered email (produced by a template). */
export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

/** A message ready to hand to a provider. */
export type EmailMessage = RenderedEmail & {
  to: string;
  from: string;
  /** Small, non-sensitive tags (e.g. `{ type: "otp" }`) stored with the queue row. */
  metadata?: Record<string, string>;
};

/** Result of an attempted delivery. Never throws to callers. */
export type SendOutcome = {
  delivered: boolean;
  /** Provider message id when available. */
  providerId?: string;
  /** Sanitized error message when delivery failed. */
  error?: string;
};

/**
 * Provider abstraction. New providers (SendGrid, SES, SMTP) only need to
 * implement this interface — business logic never changes.
 */
export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<{ id?: string }>;
}
