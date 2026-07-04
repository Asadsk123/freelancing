import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Royal Asad — we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Contact Us"
        description="Have a project in mind? Let's talk about how we can help."
      />
    </div>
  );
}
