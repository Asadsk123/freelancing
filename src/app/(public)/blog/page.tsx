import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, guides, and updates from the Royal Asad team.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Blog"
        description="Insights, guides, and updates from our team."
      />
    </div>
  );
}
