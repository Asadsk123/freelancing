import Link from "next/link";
import { brand } from "@/config/brand";
import { publicNavigation, navKeyForHref } from "@/config/navigation";
import { Separator } from "@/components/ui/separator";
import { getI18n } from "@/lib/i18n/server";

export async function Footer() {
  const { t } = await getI18n();
  const currentYear = new Date().getFullYear();

  const legalKeyByHref: Record<string, string> = {
    "/privacy": "footer.privacy",
    "/security": "footer.security",
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">
                RA
              </span>
              <span className="text-lg font-bold text-[var(--foreground)]">
                {brand.name}
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-[var(--muted-foreground)]">
              {brand.tagline}
            </p>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              <a
                href={`mailto:${brand.contact.email}`}
                className="transition-colors hover:text-[var(--foreground)]"
              >
                {brand.contact.email}
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {t("footer.companyHeading")}
            </h3>
            <ul className="mt-3 space-y-2">
              {publicNavigation.footer.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {t(navKeyForHref(item.href))}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {t("footer.legalHeading")}
            </h3>
            <ul className="mt-3 space-y-2">
              {publicNavigation.footer.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {t(legalKeyByHref[item.href] ?? item.href)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-[var(--muted-foreground)]">
          &copy; {currentYear} {brand.legal.companyName}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
