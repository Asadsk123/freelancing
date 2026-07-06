"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  locales,
  localeMeta,
  getDir,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from "@/lib/i18n/config";
import { useLocale, useTranslations } from "@/lib/i18n/provider";

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  function selectLocale(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    // Update direction/lang immediately for a snappy switch; the server render
    // that follows router.refresh() will confirm it.
    document.documentElement.lang = next;
    document.documentElement.dir = getDir(next);
    startTransition(() => router.refresh());
  }

  const label = t("common.language");

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={label} disabled={isPending}>
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="max-h-80 w-48 overflow-y-auto">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((code) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => selectLocale(code)}
            dir={getDir(code)}
          >
            <span className="flex-1">{localeMeta[code].nativeName}</span>
            {code === locale && (
              <Check className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
            )}
            <span className="sr-only">{localeMeta[code].name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
