import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Privacy Policy"
        description="How we collect, use, and protect your information."
      />
      <div className="mt-8 space-y-6 text-sm leading-6 text-[var(--muted-foreground)]">
        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--foreground)]">What we collect</h2>
          <p>
            We collect only what you give us: your name, email address, and any details you share
            through the contact form or your client portal (project briefs, messages, files, and
            reviews). We do not use third-party advertising trackers.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--foreground)]">How we use it</h2>
          <p>
            Your information is used to respond to inquiries, deliver your projects, send
            project-related notifications you can control from your settings, and keep your account
            secure. We never sell your data.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--foreground)]">Storage &amp; retention</h2>
          <p>
            Data is stored with reputable cloud providers and protected in transit with TLS. Project
            files and conversations are kept for the duration of our engagement and reasonable
            archival periods; you may request deletion of your account data at any time.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--foreground)]">Your choices</h2>
          <p>
            You can update your profile and notification preferences in your portal settings, and you
            can contact us at{" "}
            <a href={`mailto:${brand.contact.supportEmail}`} className="text-[var(--primary)] hover:underline">
              {brand.contact.supportEmail}
            </a>{" "}
            for access, correction, or deletion requests.
          </p>
        </section>
        <p className="text-xs">
          This summary will be replaced by a full legal policy before public launch.
        </p>
      </div>
    </div>
  );
}
