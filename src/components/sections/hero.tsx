import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Globe, Bot, Zap } from "lucide-react";

const capabilities = [
  { icon: Globe, label: "Business Websites" },
  { icon: Bot, label: "AI Automation" },
  { icon: Zap, label: "WhatsApp Systems" },
  { icon: Sparkles, label: "Web Applications" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-violet-950/30 dark:via-[var(--background)] dark:to-indigo-950/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI Automation + Web Development Agency
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
            We Build Websites &{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                AI Systems
              </span>
            </span>{" "}
            That Work
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-[var(--muted-foreground)] sm:text-xl max-w-2xl mx-auto">
            ROYAL-ASAD builds custom websites, AI automation workflows, and business tools
            for companies that want real results — not just a pretty page.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25 px-8">
              <Link href="/contact?form=quote">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/portfolio">See Our Work</Link>
            </Button>
          </div>

          {/* Capability pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {capabilities.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--muted-foreground)] shadow-sm"
              >
                <Icon className="h-4 w-4 text-violet-600" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
