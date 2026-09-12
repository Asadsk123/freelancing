"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const faqs = [
  {
    q: "How much does a website cost?",
    a: "A business website starts from a simple landing page (delivered in 3–5 days) to a full custom web application. Cost depends on features, pages, and integrations. We provide a detailed quote — no hidden fees — after a free discovery call.",
  },
  {
    q: "How long does it take to build?",
    a: "A landing page takes 3–5 business days. A full business website takes 1–3 weeks. A complex web application or AI automation system typically takes 3–6 weeks depending on scope. We share a clear timeline upfront.",
  },
  {
    q: "Do you work with businesses outside Pakistan?",
    a: "Yes — we work with clients across the USA, UK, UAE, Canada, and worldwide. All communication is in English, and we handle payments, contracts, and delivery remotely.",
  },
  {
    q: "What if I need changes after launch?",
    a: "Every project includes a revision period. After that, we offer ongoing support packages. Most clients continue working with us for updates, new features, and improvements.",
  },
  {
    q: "I'm not technical — can you still help me?",
    a: "Absolutely. We explain everything in plain language. You don't need to know anything about code or tech — just tell us your business goals and we'll handle the rest.",
  },
  {
    q: "Can you help with an existing website?",
    a: "Yes. We can redesign, improve, or extend an existing website. We can also integrate AI automation into your current tools without rebuilding everything from scratch.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            Common questions — honest answers.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-[var(--border)]">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="flex w-full items-center justify-between py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-[var(--foreground)]">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-[var(--muted-foreground)] transition-transform",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <div className="pb-5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
