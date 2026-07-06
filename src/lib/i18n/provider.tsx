"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionary";
import { createTranslator, type TranslateFn } from "./translator";

type I18nContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dictionary;
  t: TranslateFn;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  dir,
  dict,
  children,
}: {
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dictionary;
  children: ReactNode;
}) {
  const value = useMemo<I18nContextValue>(
    () => ({ locale, dir, dict, t: createTranslator(dict) }),
    [locale, dir, dict],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

/** Current locale + direction (for client components). */
export function useLocale(): { locale: Locale; dir: "ltr" | "rtl" } {
  const { locale, dir } = useI18n();
  return { locale, dir };
}

/** Returns the translate function `t("nav.services")` for client components. */
export function useTranslations(): TranslateFn {
  return useI18n().t;
}
