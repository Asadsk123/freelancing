import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";

export async function Hero() {
  const { t, dir } = await getI18n();

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--accent)] to-transparent opacity-50" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            {t("home.hero.title")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--muted-foreground)] sm:text-xl">
            {t("home.hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact?form=quote">
                {t("home.hero.ctaQuote")}
                <ArrowRight className="ml-2 h-4 w-4" style={dir === "rtl" ? { transform: "scaleX(-1)" } : undefined} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">{t("home.hero.ctaServices")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
