import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "See our latest work and client success stories.",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Portfolio"
        description="A selection of our recent projects and client success stories."
      />
    </div>
  );
}
