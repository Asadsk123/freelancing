import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our digital services — web development, design, and marketing.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Our Services"
        description="Premium digital solutions tailored to grow your business."
      />
    </div>
  );
}
