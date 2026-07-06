/**
 * i18n configuration.
 *
 * To add a new language:
 *   1. Add its code to `locales` below and an entry to `localeMeta`.
 *   2. Create `src/lib/i18n/dictionaries/<code>.json` (copy `en.json`, translate).
 *   3. Register the loader in `src/lib/i18n/dictionary.ts`.
 * Missing keys automatically fall back to English, so partial files are fine.
 */

export const locales = [
  "en", // English
  "ur", // Urdu
  "ar", // Arabic
  "hi", // Hindi
  "bn", // Bengali
  "fr", // French
  "de", // German
  "es", // Spanish
  "pt", // Portuguese
  "ru", // Russian
  "tr", // Turkish
  "zh", // Chinese (Simplified)
  "ja", // Japanese
  "ko", // Korean
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale = "en" satisfies Locale;

export const LOCALE_COOKIE = "ra_locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type LocaleInfo = {
  /** English name of the language. */
  name: string;
  /** The language's own name, shown in the switcher. */
  nativeName: string;
  /** Text direction. */
  dir: "ltr" | "rtl";
};

export const localeMeta: Record<Locale, LocaleInfo> = {
  en: { name: "English", nativeName: "English", dir: "ltr" },
  ur: { name: "Urdu", nativeName: "اردو", dir: "rtl" },
  ar: { name: "Arabic", nativeName: "العربية", dir: "rtl" },
  hi: { name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  bn: { name: "Bengali", nativeName: "বাংলা", dir: "ltr" },
  fr: { name: "French", nativeName: "Français", dir: "ltr" },
  de: { name: "German", nativeName: "Deutsch", dir: "ltr" },
  es: { name: "Spanish", nativeName: "Español", dir: "ltr" },
  pt: { name: "Portuguese", nativeName: "Português", dir: "ltr" },
  ru: { name: "Russian", nativeName: "Русский", dir: "ltr" },
  tr: { name: "Turkish", nativeName: "Türkçe", dir: "ltr" },
  zh: { name: "Chinese (Simplified)", nativeName: "简体中文", dir: "ltr" },
  ja: { name: "Japanese", nativeName: "日本語", dir: "ltr" },
  ko: { name: "Korean", nativeName: "한국어", dir: "ltr" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}

/**
 * Picks the best supported locale from an Accept-Language header value.
 * Handles region subtags (e.g. "en-US" → "en", "zh-CN" → "zh") and quality
 * weights. Returns null when nothing matches.
 */
export function matchAcceptLanguage(acceptLanguage: string | null | undefined): Locale | null {
  if (!acceptLanguage) return null;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: (tag ?? "").trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (isLocale(tag)) return tag;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}
