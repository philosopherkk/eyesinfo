import type { Locale } from "@/i18n/locale";
import { toHans } from "@/i18n/hans";
import {
  SEO_DESCRIPTIONS,
  type SeoDescription,
} from "@/data/seo-descriptions";

/** Resolve a head-only SEO description for a bare path (`/t/d1`, `/c/retina`, …). */
export function seoDescriptionFor(
  path: string,
  locale: Locale,
  fallback: string,
): string {
  const bare = path.split("?")[0] || path;
  const entry = SEO_DESCRIPTIONS[bare];
  if (!entry) return fallback;
  return pickSeoLocale(entry, locale);
}

export function seoEntryFor(path: string): SeoDescription | undefined {
  const bare = path.split("?")[0] || path;
  return SEO_DESCRIPTIONS[bare];
}

export function pickSeoLocale(entry: SeoDescription, locale: Locale): string {
  if (locale === "zh-Hant") return entry.zh;
  if (locale === "zh-Hans") return toHans(entry.zh);
  if (locale === "en") return entry.en;
  if (locale === "ja") return entry.ja;
  return entry.zh;
}

export function seoAboutNames(
  path: string,
  locale: Locale,
): string[] | undefined {
  const entry = seoEntryFor(path);
  if (!entry?.about) return undefined;
  if (locale === "zh-Hant") return entry.about.zh;
  if (locale === "zh-Hans") return entry.about.zh.map(toHans);
  if (locale === "en") return entry.about.en;
  if (locale === "ja") return entry.about.ja;
  return entry.about.zh;
}
