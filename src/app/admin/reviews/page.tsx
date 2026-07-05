import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { hasDatabase } from "@/db";
import { reviewRepository } from "@/lib/repositories/review";
import { formatDate } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Manage Reviews",
  description: "View and manage client reviews.",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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

export default async function AdminReviewsPage() {
  const dbAvailable = hasDatabase();
  const reviews = dbAvailable ? await reviewRepository.findAll() : [];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Reviews" description="Manage client reviews and testimonials." />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">
            Database not connected. Set <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">DATABASE_URL</code> in <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">.env.local</code> to manage reviews.
          </p>
        </div>
      )}

      {dbAvailable && reviews.length === 0 ? (
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
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="py-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs">{getInitials(review.clientName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{review.clientName}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {review.projectTitle}
                      </p>
                      <div className="mt-1">
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={review.isPublished ? "success" : "warning"}>
                      {review.isPublished ? "Published" : "Pending"}
                    </Badge>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
                {review.testimonial && (
                  <p className="mt-3 text-sm text-[var(--muted-foreground)]">{review.testimonial}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
