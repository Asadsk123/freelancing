import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Royal Asad — our mission, values, and team.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="About Us"
        description="Our mission is to deliver digital solutions that genuinely grow your business."
      />
    </div>
  );
}
