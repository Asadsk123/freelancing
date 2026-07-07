import { brand } from "@/config/brand";
import { getSiteUrl } from "../config";

/** Escapes user-supplied text before interpolating it into HTML. */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type LayoutOptions = {
  /** Hidden preview line shown by inbox clients. */
  preheader?: string;
  /** Heading shown at the top of the card. */
  heading: string;
  /** Inner HTML for the message body (already escaped where needed). */
  bodyHtml: string;
  /** Optional call-to-action button. */
  cta?: { label: string; url: string };
};

/**
 * Branded, responsive, dark-mode-friendly HTML wrapper. Uses inline styles and
 * table layout for broad email-client support; a `prefers-color-scheme: dark`
 * block adjusts colors where supported.
 */
export function renderLayout(options: LayoutOptions): string {
  const site = getSiteUrl();
  const { preheader, heading, bodyHtml, cta } = options;

  const ctaHtml = cta
    ? `<tr><td style="padding:8px 0 4px;">
         <a href="${esc(cta.url)}" style="display:inline-block;background:#4c6ef5;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:8px;">${esc(cta.label)}</a>
       </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(heading)}</title>
<style>
  @media (prefers-color-scheme: dark) {
    .ra-body { background:#0a0a0a !important; }
    .ra-card { background:#171717 !important; border-color:#404040 !important; }
    .ra-text { color:#e5e5e5 !important; }
    .ra-muted { color:#a3a3a3 !important; }
  }
  @media only screen and (max-width:600px) {
    .ra-card { width:100% !important; border-radius:0 !important; }
  }
</style>
</head>
<body class="ra-body" style="margin:0;padding:0;background:#f5f5f5;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader ?? heading)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
  <tr><td align="center">
    <table role="presentation" class="ra-card" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:560px;background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
      <tr><td style="padding:24px 32px 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="width:36px;height:36px;background:#4c6ef5;border-radius:8px;color:#ffffff;font-weight:700;font-size:15px;text-align:center;vertical-align:middle;">RA</td>
          <td style="padding-left:10px;" class="ra-text"><span style="font-size:17px;font-weight:700;color:#171717;">${esc(brand.name)}</span></td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:8px 32px 0;">
        <h1 class="ra-text" style="margin:0;font-size:20px;font-weight:700;color:#171717;">${esc(heading)}</h1>
      </td></tr>
      <tr><td style="padding:12px 32px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="ra-text" style="font-size:15px;line-height:1.6;color:#404040;">
          ${bodyHtml}
          ${ctaHtml}
        </table>
      </td></tr>
      <tr><td style="padding:16px 32px 28px;border-top:1px solid #e5e5e5;">
        <p class="ra-muted" style="margin:0;font-size:12px;line-height:1.5;color:#737373;">
          ${esc(brand.name)} · <a href="${esc(site)}" style="color:#737373;">${esc(site.replace(/^https?:\/\//, ""))}</a><br>
          You received this email because of activity on your ${esc(brand.name)} account.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/** Wraps plain-text bodies with a consistent signature. */
export function renderText(lines: string[]): string {
  return [...lines, "", `— ${brand.name}`, getSiteUrl()].join("\n");
}
