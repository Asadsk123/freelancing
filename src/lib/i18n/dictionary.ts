import type { Locale } from "./config";
import { defaultLocale } from "./config";
import en from "./dictionaries/en.json";

export type Dictionary = typeof en;

/**
 * Loader registry. Add one line here when introducing a new language file.
 * English is imported statically so it is always available as the fallback.
 */
const loaders: Record<Exclude<Locale, "en">, () => Promise<{ default: unknown }>> = {
  ur: () => import("./dictionaries/ur.json"),
  ar: () => import("./dictionaries/ar.json"),
  hi: () => import("./dictionaries/hi.json"),
  bn: () => import("./dictionaries/bn.json"),
  fr: () => import("./dictionaries/fr.json"),
  de: () => import("./dictionaries/de.json"),
  es: () => import("./dictionaries/es.json"),
  pt: () => import("./dictionaries/pt.json"),
  ru: () => import("./dictionaries/ru.json"),
  tr: () => import("./dictionaries/tr.json"),
  zh: () => import("./dictionaries/zh.json"),
  ja: () => import("./dictionaries/ja.json"),
  ko: () => import("./dictionaries/ko.json"),
};

/** Recursively fills any keys missing from `target` with values from `base`. */
function deepMerge<T>(base: T, target: unknown): T {
  if (
    typeof base !== "object" ||
    base === null ||
    typeof target !== "object" ||
    target === null
  ) {
    return (target ?? base) as T;
  }

  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  const overrides = target as Record<string, unknown>;

  for (const key of Object.keys(result)) {
    if (key in overrides) {
      result[key] = deepMerge(result[key], overrides[key]);
    }
  }
  return result as T;
}

/**
 * Returns the dictionary for a locale, with every missing key falling back to
 * English. Guarantees full coverage even for partially-translated languages.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === defaultLocale) return en;
  try {
    const mod = await loaders[locale]();
    return deepMerge(en, mod.default);
  } catch {
    return en;
  }
}
