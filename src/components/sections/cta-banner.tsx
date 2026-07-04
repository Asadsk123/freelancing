import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[var(--primary)] px-8 py-16 text-center sm:px-16">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--primary-foreground)]">
            Ready to grow your business?
          </h2>
          <p className="mt-4 text-lg text-[var(--primary-foreground)]/80">
            Tell us about your project and get a free, no-obligation quote within 24 hours.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact?form=quote">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
