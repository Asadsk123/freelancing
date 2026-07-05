import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "Manage Reviews",
  description: "View and manage client reviews.",
};

const mockReviews = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    clientInitials: "SJ",
    company: "Acme Corp",
    project: "Brand Identity Design",
    rating: 5,
    comment: "Exceptional work on our brand identity. The team understood our vision perfectly and delivered beyond expectations.",
    status: "published",
    date: "Jun 20, 2026",
  },
  {
    id: "2",
    clientName: "David Park",
    clientInitials: "DP",
    company: "FinTech Solutions",
    project: "Company Website Redesign",
    rating: 5,
    comment: "Professional team with excellent communication throughout the project. The new website has significantly improved our conversion rates.",
    status: "published",
    date: "Apr 15, 2025",
  },
  {
    id: "3",
    clientName: "Emma Wilson",
    clientInitials: "EW",
    company: "Global Retail",
    project: "Marketing Campaign",
    rating: 4,
    comment: "Great results from the digital marketing campaign. Would love to see even more detailed analytics reporting.",
    status: "pending",
    date: "Jul 1, 2026",
  },
];

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  published: { label: "Published", variant: "success" },
  pending: { label: "Pending Review", variant: "warning" },
  hidden: { label: "Hidden", variant: "secondary" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-[var(--warning)] text-[var(--warning)]"
              : "text-[var(--muted-foreground)]"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Reviews" description="Manage client reviews and testimonials." />

      {mockReviews.length === 0 ? (
        <div className="mt-8">
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={Star}
                title="No reviews yet"
                description="Client reviews will appear here once projects are completed."
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {mockReviews.map((review) => {
            const badge = statusBadge[review.status] ?? { label: "Pending", variant: "warning" as const };
            return (
              <Card key={review.id}>
                <CardContent className="py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs">{review.clientInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{review.clientName}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {review.company} &middot; {review.project}
                        </p>
                        <div className="mt-1">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <span className="text-xs text-[var(--muted-foreground)]">{review.date}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted-foreground)]">{review.comment}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
