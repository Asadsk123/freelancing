import type { Dictionary } from "./dictionary";

/** A translate function: takes a dot-path key and returns the localized string. */
export type TranslateFn = (key: string) => string;

/**
 * Builds a translator over a dictionary. `t("nav.services")` walks the nested
 * object by dot-path. If a key is missing (should not happen thanks to the
 * English fallback merge), the key itself is returned so nothing renders blank.
 */
export function createTranslator(dict: Dictionary): TranslateFn {
  return (key: string): string => {
    const value = key
      .split(".")
      .reduce<unknown>((acc, part) => {
        if (acc && typeof acc === "object" && part in acc) {
          return (acc as Record<string, unknown>)[part];
        }
        return undefined;
      }, dict);

    return typeof value === "string" ? value : key;
  };
}
