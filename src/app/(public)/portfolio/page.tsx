import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { CtaBanner } from "@/components/sections/cta-banner";
import { FolderOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "See our latest work and client success stories.",
};

export default function PortfolioPage() {
  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          title="Portfolio"
          description="A selection of our recent projects and client success stories."
        />

        <div className="mt-12">
          <Card>
            <CardContent className="py-16">
              <EmptyState
                icon={FolderOpen}
                title="Portfolio coming soon"
                description="We're putting the finishing touches on our project showcase. Check back soon to see our latest work."
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
