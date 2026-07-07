import type { SendOutcome } from "./types";
import { sendRendered } from "./send";
import * as t from "./templates";

/**
 * High-level, type-safe email API. Every call is best-effort and never throws —
 * callers can `await` it without risking their main action. Business logic uses
 * only these methods; provider/template details stay encapsulated.
 */
export const email = {
  otp(to: string, code: string, expiryMinutes: number): Promise<SendOutcome> {
    return sendRendered(to, t.otpEmail(code, expiryMinutes), { metadata: { type: "otp" } });
  },

  inquiryConfirmation(to: string, name: string, trackingId: string): Promise<SendOutcome> {
    return sendRendered(to, t.inquiryConfirmationEmail(name, trackingId), {
      metadata: { type: "inquiry_confirmation", trackingId },
    });
  },

  newInquiryNotification(
    to: string,
    params: { name: string; email: string; service?: string | null; message: string; trackingId: string },
  ): Promise<SendOutcome> {
    return sendRendered(to, t.newInquiryNotificationEmail(params), {
      from: "support",
      metadata: { type: "inquiry_notification", trackingId: params.trackingId },
    });
  },

  projectCreated(to: string, clientName: string, projectTitle: string, trackingId: string): Promise<SendOutcome> {
    return sendRendered(to, t.projectCreatedEmail(clientName, projectTitle, trackingId), {
      metadata: { type: "project_created", trackingId },
    });
  },

  projectStatusChanged(to: string, clientName: string, projectTitle: string, status: string): Promise<SendOutcome> {
    return sendRendered(to, t.projectStatusChangedEmail(clientName, projectTitle, status), {
      metadata: { type: "project_status_changed", status },
    });
  },

  milestoneCreated(to: string, clientName: string, projectTitle: string, milestoneTitle: string): Promise<SendOutcome> {
    return sendRendered(to, t.milestoneCreatedEmail(clientName, projectTitle, milestoneTitle), {
      metadata: { type: "milestone_created" },
    });
  },

  milestoneCompleted(to: string, clientName: string, projectTitle: string, milestoneTitle: string): Promise<SendOutcome> {
    return sendRendered(to, t.milestoneCompletedEmail(clientName, projectTitle, milestoneTitle), {
      metadata: { type: "milestone_completed" },
    });
  },

  fileUploaded(to: string, clientName: string, projectTitle: string, fileName: string): Promise<SendOutcome> {
    return sendRendered(to, t.fileUploadedEmail(clientName, projectTitle, fileName), {
      metadata: { type: "file_uploaded" },
    });
  },

  newMessage(to: string, recipientName: string, projectTitle: string, senderName: string): Promise<SendOutcome> {
    return sendRendered(to, t.newMessageEmail(recipientName, projectTitle, senderName), {
      metadata: { type: "new_message" },
    });
  },

  // Future-ready (not yet triggered anywhere):
  welcome(to: string, name: string): Promise<SendOutcome> {
    return sendRendered(to, t.welcomeEmail(name), { metadata: { type: "welcome" } });
  },

  securityAlert(to: string, name: string, detail: string): Promise<SendOutcome> {
    return sendRendered(to, t.securityAlertEmail(name, detail), {
      from: "support",
      metadata: { type: "security_alert" },
    });
  },
};

export type { SendOutcome } from "./types";
