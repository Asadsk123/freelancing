import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { matchAcceptLanguage, isLocale, getDir, locales } from "@/lib/i18n/config";
import { createTranslator } from "@/lib/i18n/translator";
import type { Dictionary } from "@/lib/i18n/dictionary";

describe("matchAcceptLanguage", () => {
  it("matches exact tags and region subtags", () => {
    expect(matchAcceptLanguage("fr")).toBe("fr");
    expect(matchAcceptLanguage("en-US,en;q=0.9")).toBe("en");
    expect(matchAcceptLanguage("zh-CN,zh;q=0.9")).toBe("zh");
  });

  it("respects quality weights", () => {
    expect(matchAcceptLanguage("da;q=0.9,ur;q=0.8,fr;q=1.0")).toBe("fr");
  });

  it("returns null for unsupported or empty input", () => {
    expect(matchAcceptLanguage("da,sv;q=0.9")).toBeNull();
    expect(matchAcceptLanguage("")).toBeNull();
    expect(matchAcceptLanguage(null)).toBeNull();
  });
});

describe("locale helpers", () => {
  it("isLocale accepts only configured locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("xx")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("only ur and ar are RTL", () => {
    const rtl = locales.filter((l) => getDir(l) === "rtl");
    expect(rtl.sort()).toEqual(["ar", "ur"]);
  });
});

describe("createTranslator", () => {
  const dict = { nav: { services: "Services" }, plain: "Top" } as unknown as Dictionary;
  const t = createTranslator(dict);

  it("resolves dot-paths and top-level keys", () => {
    expect(t("nav.services")).toBe("Services");
    expect(t("plain")).toBe("Top");
  });

  it("returns the key itself for missing paths (never blank)", () => {
    expect(t("nav.missing")).toBe("nav.missing");
    expect(t("totally.absent.key")).toBe("totally.absent.key");
  });
});

describe("dictionary integrity", () => {
  const dir = path.resolve(__dirname, "../../src/lib/i18n/dictionaries");
  const load = (file: string) =>
    JSON.parse(readFileSync(path.join(dir, file), "utf8")) as Record<string, unknown>;

  function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
    return Object.entries(obj).flatMap(([key, value]) =>
      value && typeof value === "object"
        ? flattenKeys(value as Record<string, unknown>, `${prefix}${key}.`)
        : [`${prefix}${key}`],
    );
  }

  it("has one JSON file per configured locale", () => {
    const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
    expect(files).toEqual([...locales].map((l) => `${l}.json`).sort());
  });

  it("every locale has full assistant key parity with English", () => {
    const enAssistant = flattenKeys(load("en.json").assistant as Record<string, unknown>).sort();
    for (const locale of locales) {
      const keys = flattenKeys(load(`${locale}.json`).assistant as Record<string, unknown>).sort();
      expect(keys, `assistant keys for ${locale}`).toEqual(enAssistant);
    }
  });

  it("no locale value is an empty string", () => {
    for (const locale of locales) {
      const empties = flattenKeys(load(`${locale}.json`)).filter((key) => {
        const value = key
          .split(".")
          .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)?.[part], load(`${locale}.json`));
        return value === "";
      });
      expect(empties, `empty strings in ${locale}`).toEqual([]);
    }
  });
});
