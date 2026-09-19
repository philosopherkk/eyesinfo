import type { Locale } from "@/i18n/locale";
import { LOCALES } from "@/i18n/locale";

/** URL segment → locale. Traditional Chinese stays at `/` (no prefix). */
export const LOCALE_ENTRY: Record<Exclude<Locale, "zh-Hant">, string> = {
  en: "/en",
  ja: "/ja",
  "zh-Hans": "/zh-Hans",
};

/** Accepted aliases that must not 404. */
export const LOCALE_ALIASES: Record<string, Locale> = {
  "zh-CN": "zh-Hans",
  "zh-cn": "zh-Hans",
  "zh_CN": "zh-Hans",
};

const ENTRY_BY_PATH = new Map<string, Locale>([
  ["/en", "en"],
  ["/ja", "ja"],
  ["/zh-Hans", "zh-Hans"],
]);

export function localeFromPath(pathname: string): Locale | null {
  const clean = pathname.replace(/\/$/, "") || "/";
  return ENTRY_BY_PATH.get(clean) ?? null;
}

export function isLocaleHomePath(pathname: string): boolean {
  const clean = pathname.replace(/\/$/, "") || "/";
  return clean === "/" || ENTRY_BY_PATH.has(clean);
}

/** Path to land on after picking a language in the switcher. */
export function pathForLocale(locale: Locale): string {
  if (locale === "zh-Hant") return "/";
  return LOCALE_ENTRY[locale];
}

export function isKnownLocale(id: string): id is Locale {
  return LOCALES.some((l) => l.id === id);
}

/** Strip `/en`, `/ja`, `/zh-Hans`, `/zh-CN` prefix from a pathname. */
export function stripLocalePrefix(pathname: string): {
  locale: Locale | null;
  rest: string;
} {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  for (const [alias, locale] of Object.entries(LOCALE_ALIASES)) {
    const prefix = `/${alias}`;
    if (clean === prefix || clean.startsWith(`${prefix}/`)) {
      const rest = clean.slice(prefix.length) || "/";
      return { locale, rest: rest.startsWith("/") ? rest : `/${rest}` };
    }
  }
  for (const [path, locale] of ENTRY_BY_PATH) {
    if (clean === path || clean.startsWith(`${path}/`)) {
      const rest = clean.slice(path.length) || "/";
      return { locale, rest: rest.startsWith("/") ? rest : `/${rest}` };
    }
  }
  return { locale: null, rest: clean };
}
