"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/shared/form-error";
import { toast, Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import { submitReview } from "./review-actions";

export function ReviewForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [testimonial, setTestimonial] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    const fd = new FormData();
    fd.set("projectId", projectId);
    fd.set("rating", String(rating));
    fd.set("testimonial", testimonial);
    startTransition(async () => {
      const res = await submitReview(fd);
      if (res.success) {
        toast.success("Thank you for your review!");
        router.refresh();
      } else {
        setError(res.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Toaster />
      {error && <FormError message={error} />}

      <div className="space-y-2">
        <Label>Your rating</Label>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              disabled={isPending}
              className="rounded p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  (hover || rating) >= value
                    ? "fill-[var(--warning,#d97706)] text-[var(--warning,#d97706)]"
                    : "text-[var(--muted-foreground)]",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-testimonial">Your feedback (optional)</Label>
        <Textarea
          id="review-testimonial"
          name="testimonial"
          rows={3}
          maxLength={2000}
          autoResize
          value={testimonial}
          onChange={(e) => setTestimonial(e.target.value)}
          placeholder="Tell us about your experience working with us..."
          disabled={isPending}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit review"}
        </Button>
      </div>
    </form>
  );
}
