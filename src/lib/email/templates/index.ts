import { brand } from "@/config/brand";
import { getSiteUrl } from "../config";
import type { RenderedEmail } from "../types";
import { renderLayout, renderText, esc } from "./layout";

/** A single paragraph row for the layout body table. */
function p(html: string): string {
  return `<tr><td style="padding:0 0 12px;">${html}</td></tr>`;
}

const site = () => getSiteUrl();

export function otpEmail(code: string, expiryMinutes: number): RenderedEmail {
  const subject = `Your ${brand.name} verification code`;
  const html = renderLayout({
    preheader: `Your code is ${code}`,
    heading: "Verify your sign-in",
    bodyHtml:
      p("Use this one-time code to finish signing in:") +
      `<tr><td style="padding:4px 0 16px;">
        <div style="font-size:30px;font-weight:700;letter-spacing:8px;color:#171717;background:#f0f4ff;border:1px solid #dbe4ff;border-radius:10px;padding:14px 0;text-align:center;">${esc(code)}</div>
      </td></tr>` +
      p(`This code expires in <strong>${expiryMinutes} minutes</strong>. If you didn't request it, you can safely ignore this email.`),
  });
  const text = renderText([
    "Verify your sign-in",
    "",
    `Your one-time code: ${code}`,
    `This code expires in ${expiryMinutes} minutes.`,
    "If you didn't request it, you can ignore this email.",
  ]);
  return { subject, html, text };
}

export function inquiryConfirmationEmail(name: string, trackingId: string): RenderedEmail {
  const subject = `We received your inquiry (${trackingId})`;
  const html = renderLayout({
    heading: "Thanks for reaching out",
    bodyHtml:
      p(`Hi ${esc(name)},`) +
      p(`We've received your inquiry and our team will respond within 24 business hours.`) +
      p(`Your reference number is <strong>${esc(trackingId)}</strong> — keep it handy for any follow-up.`),
    cta: { label: "Visit our website", url: site() },
  });
  const text = renderText([
    `Hi ${name},`,
    "",
    "We've received your inquiry and will respond within 24 business hours.",
    `Reference number: ${trackingId}`,
  ]);
  return { subject, html, text };
}

export function newInquiryNotificationEmail(params: {
  name: string;
  email: string;
  service?: string | null;
  message: string;
  trackingId: string;
}): RenderedEmail {
  const subject = `New inquiry: ${params.name} (${params.trackingId})`;
  const html = renderLayout({
    heading: "New inquiry received",
    bodyHtml:
      p(`<strong>${esc(params.name)}</strong> submitted a new inquiry.`) +
      p(`Email: ${esc(params.email)}<br>Service: ${esc(params.service || "General")}<br>Reference: ${esc(params.trackingId)}`) +
      p(`Message:<br><em>${esc(params.message)}</em>`),
    cta: { label: "Open admin inquiries", url: `${site()}/admin/inquiries` },
  });
  const text = renderText([
    "New inquiry received",
    "",
    `Name: ${params.name}`,
    `Email: ${params.email}`,
    `Service: ${params.service || "General"}`,
    `Reference: ${params.trackingId}`,
    "",
    `Message: ${params.message}`,
  ]);
  return { subject, html, text };
}

export function projectCreatedEmail(clientName: string, projectTitle: string, trackingId: string): RenderedEmail {
  const subject = `Your project is set up: ${projectTitle}`;
  const html = renderLayout({
    heading: "Your project is ready",
    bodyHtml:
      p(`Hi ${esc(clientName)},`) +
      p(`We've created your project <strong>${esc(projectTitle)}</strong> (${esc(trackingId)}). You can track progress, files, and messages in your portal.`),
    cta: { label: "Open your dashboard", url: `${site()}/dashboard` },
  });
  const text = renderText([
    `Hi ${clientName},`,
    "",
    `We've created your project "${projectTitle}" (${trackingId}).`,
    `Track it in your portal: ${site()}/dashboard`,
  ]);
  return { subject, html, text };
}

export function projectStatusChangedEmail(clientName: string, projectTitle: string, status: string): RenderedEmail {
  const label = status.replace(/_/g, " ");
  const subject = `Project update: ${projectTitle} is now ${label}`;
  const html = renderLayout({
    heading: "Project status updated",
    bodyHtml:
      p(`Hi ${esc(clientName)},`) +
      p(`Your project <strong>${esc(projectTitle)}</strong> is now <strong>${esc(label)}</strong>.`),
    cta: { label: "View project", url: `${site()}/dashboard` },
  });
  const text = renderText([
    `Hi ${clientName},`,
    "",
    `Your project "${projectTitle}" is now ${label}.`,
  ]);
  return { subject, html, text };
}

export function milestoneCreatedEmail(clientName: string, projectTitle: string, milestoneTitle: string): RenderedEmail {
  const subject = `New milestone: ${milestoneTitle}`;
  const html = renderLayout({
    heading: "A new milestone was added",
    bodyHtml:
      p(`Hi ${esc(clientName)},`) +
      p(`A new milestone <strong>${esc(milestoneTitle)}</strong> was added to <strong>${esc(projectTitle)}</strong>.`),
    cta: { label: "View milestones", url: `${site()}/dashboard` },
  });
  const text = renderText([
    `Hi ${clientName},`,
    "",
    `New milestone "${milestoneTitle}" added to "${projectTitle}".`,
  ]);
  return { subject, html, text };
}

export function milestoneCompletedEmail(clientName: string, projectTitle: string, milestoneTitle: string): RenderedEmail {
  const subject = `Milestone completed: ${milestoneTitle}`;
  const html = renderLayout({
    heading: "Milestone completed",
    bodyHtml:
      p(`Hi ${esc(clientName)},`) +
      p(`The milestone <strong>${esc(milestoneTitle)}</strong> on <strong>${esc(projectTitle)}</strong> has been completed. 🎉`),
    cta: { label: "View progress", url: `${site()}/dashboard` },
  });
  const text = renderText([
    `Hi ${clientName},`,
    "",
    `Milestone "${milestoneTitle}" on "${projectTitle}" is complete.`,
  ]);
  return { subject, html, text };
}

export function fileUploadedEmail(clientName: string, projectTitle: string, fileName: string): RenderedEmail {
  const subject = `New file on ${projectTitle}`;
  const html = renderLayout({
    heading: "A new file is available",
    bodyHtml:
      p(`Hi ${esc(clientName)},`) +
      p(`A new file <strong>${esc(fileName)}</strong> was shared on <strong>${esc(projectTitle)}</strong>. You can preview it and request revisions in your portal.`),
    cta: { label: "View files", url: `${site()}/dashboard` },
  });
  const text = renderText([
    `Hi ${clientName},`,
    "",
    `New file "${fileName}" shared on "${projectTitle}".`,
  ]);
  return { subject, html, text };
}

export function newMessageEmail(recipientName: string, projectTitle: string, senderName: string): RenderedEmail {
  const subject = `New message on ${projectTitle}`;
  const html = renderLayout({
    heading: "You have a new message",
    bodyHtml:
      p(`Hi ${esc(recipientName)},`) +
      p(`<strong>${esc(senderName)}</strong> sent a new message on <strong>${esc(projectTitle)}</strong>.`),
    cta: { label: "Open conversation", url: `${site()}/dashboard` },
  });
  const text = renderText([
    `Hi ${recipientName},`,
    "",
    `${senderName} sent a new message on "${projectTitle}".`,
  ]);
  return { subject, html, text };
}

// ---- Future-ready templates (defined now; not yet triggered) ----

export function welcomeEmail(name: string): RenderedEmail {
  const subject = `Welcome to ${brand.name}`;
  const html = renderLayout({
    heading: `Welcome to ${brand.name}`,
    bodyHtml:
      p(`Hi ${esc(name)},`) +
      p(`Welcome aboard! Your client portal gives you real-time visibility into every project — progress, files, and messages in one place.`),
    cta: { label: "Go to your dashboard", url: `${site()}/dashboard` },
  });
  const text = renderText([`Hi ${name},`, "", `Welcome to ${brand.name}!`, `${site()}/dashboard`]);
  return { subject, html, text };
}

export function securityAlertEmail(name: string, detail: string): RenderedEmail {
  const subject = `Security alert for your ${brand.name} account`;
  const html = renderLayout({
    heading: "Security alert",
    bodyHtml:
      p(`Hi ${esc(name)},`) +
      p(esc(detail)) +
      p(`If this wasn't you, please contact ${esc(brand.contact.supportEmail)} immediately.`),
  });
  const text = renderText([
    `Hi ${name},`,
    "",
    detail,
    `If this wasn't you, contact ${brand.contact.supportEmail} immediately.`,
  ]);
  return { subject, html, text };
}
