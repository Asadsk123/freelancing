import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

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

      <div className="mt-12">
        <Card>
          <CardContent className="py-16">
            <EmptyState
              icon={FileText}
              title="Articles coming soon"
              description="We're preparing our first articles. Subscribe to be notified when we publish."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
