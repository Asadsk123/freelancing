import "server-only";
import { cookies, headers } from "next/headers";
import {
  defaultLocale,
  getDir,
  isLocale,
  LOCALE_COOKIE,
  matchAcceptLanguage,
  type Locale,
} from "./config";
import { getDictionary, type Dictionary } from "./dictionary";
import { createTranslator, type TranslateFn } from "./translator";

/**
 * Resolves the active locale for the current request:
 *   1. saved preference (cookie)
 *   2. browser language (Accept-Language header)
 *   3. English fallback
 */
export async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const acceptLanguage = (await headers()).get("accept-language");
  return matchAcceptLanguage(acceptLanguage) ?? defaultLocale;
}

export type ServerI18n = {
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dictionary;
  t: TranslateFn;
};

/** Server-side i18n bundle for the current request. */
export async function getI18n(): Promise<ServerI18n> {
  const locale = await resolveLocale();
  const dict = await getDictionary(locale);
  return {
    locale,
    dir: getDir(locale),
    dict,
    t: createTranslator(dict),
  };
}
