import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { hasDatabase } from "@/db";
import { reviewRepository } from "@/lib/repositories/review";

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

export async function Testimonials() {
  const dbAvailable = hasDatabase();
  const reviews = dbAvailable ? await reviewRepository.findPublished() : [];

  if (reviews.length === 0) return null;

  return (
    <section className="border-t border-[var(--border)] bg-[var(--muted)]/30 py-16 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            What Our Clients Say
          </h2>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Real feedback from real clients.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review) => (
            <Card key={review.id}>
              <CardContent className="py-6">
                <StarRating rating={review.rating} />
                {review.testimonial && (
                  <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)] line-clamp-4">
                    &ldquo;{review.testimonial}&rdquo;
                  </p>
                )}
                <div className="mt-4">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {review.clientName}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {review.projectTitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
