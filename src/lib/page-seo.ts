import type { Locale } from "@/i18n/locale";
import { PUBLIC_ORIGIN } from "@/lib/site";

/** Brand in document titles (zh-Hant primary for SSR / crawlers). */
export const SEO_SITE_NAME = "護眼學堂";

/** Localized brand for `<title>` / og:title by UI locale. */
export const SEO_SITE_NAME_BY_LOCALE: Record<Locale, string> = {
  "zh-Hant": "護眼學堂",
  "zh-Hans": "护眼学堂",
  en: "Eye School",
  ja: "眼の学堂",
};

export function seoSiteName(locale: Locale = "zh-Hant"): string {
  return SEO_SITE_NAME_BY_LOCALE[locale] ?? SEO_SITE_NAME;
}

export type PageSeoInput = {
  /** Page-specific title without brand suffix. */
  title: string;
  description: string;
  /** Path beginning with `/`, or `/` for home. */
  path: string;
  /** Drives localized brand in the document title. Defaults to zh-Hant. */
  locale?: Locale;
};

/** Absolute canonical URL on the public www origin (matches PUBLIC_ORIGIN). */
export function canonicalUrl(path: string): string {
  if (!path || path === "/") return `${PUBLIC_ORIGIN}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_ORIGIN}${normalized}`;
}

/**
 * Per-route document head: unique title, description, og tags, and canonical.
 * Child route meta overrides the root defaults (TanStack dedupes by name/property).
 * Canonical is omitted from `__root` so it is not duplicated (links are not deduped).
 */
export function pageHead({ title, description, path, locale = "zh-Hant" }: PageSeoInput) {
  const brand = seoSiteName(locale);
  const fullTitle =
    title === brand || title === SEO_SITE_NAME ? brand : `${title}｜${brand}`;
  const url = canonicalUrl(path);
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
