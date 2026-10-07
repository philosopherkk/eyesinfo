import type { Locale } from "@/i18n/locale";
import { hrefWithLang, pathForLocale } from "@/lib/locale-path";
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
  /**
   * When true, use `title` as `<title>` / og:title verbatim (no `｜brand` suffix).
   * For locked SEO titles that must match copy exactly.
   */
  verbatimTitle?: boolean;
};

const HREFLANG_LOCALES: Locale[] = ["zh-Hant", "zh-Hans", "en", "ja"];

/** Bare pathname: drop query/hash and trailing slash (keep `/`). */
export function barePathname(path: string): string {
  const noHash = path.split("#")[0] || "/";
  const noQuery = noHash.split("?")[0] || "/";
  const normalized = noQuery.startsWith("/") ? noQuery : `/${noQuery}`;
  if (normalized !== "/" && normalized.endsWith("/")) {
    return normalized.replace(/\/+$/, "") || "/";
  }
  return normalized || "/";
}

/**
 * Path (+ optional `?lang=`) for a locale alternate — shared by canonical,
 * og:url, and hreflang. Locale entry homes (`/`, `/en`, `/ja`, `/zh-Hans`) use
 * `pathForLocale`. Deep routes: zh-Hant bare; other langs `path?lang=<code>`
 * (lang only; other query params stripped).
 */
export function hreflangPath(path: string, locale: Locale): string {
  const bare = barePathname(path);
  if (bare === "/" || bare === "/en" || bare === "/ja" || bare === "/zh-Hans") {
    return pathForLocale(locale);
  }
  return hrefWithLang(bare, locale);
}

/** Absolute canonical URL on the public www origin (matches PUBLIC_ORIGIN). */
export function canonicalUrl(path: string): string {
  if (!path || path === "/") return `${PUBLIC_ORIGIN}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_ORIGIN}${normalized}`;
}

/** Self-referencing absolute canonical for a page locale. */
export function canonicalUrlForLocale(
  path: string,
  locale: Locale = "zh-Hant",
): string {
  return canonicalUrl(hreflangPath(path, locale));
}

/**
 * Per-route document head: unique title, description, og tags, and canonical.
 * Child route meta overrides the root defaults (TanStack dedupes by name/property).
 * Canonical is omitted from `__root` so it is not duplicated (links are not deduped).
 * Canonical is self-referencing per locale (matches that locale’s hreflang href);
 * hreflang lists all locales + x-default → TC.
 */
export function pageHead({
  title,
  description,
  path,
  locale = "zh-Hant",
  verbatimTitle = false,
}: PageSeoInput) {
  const brand = seoSiteName(locale);
  const fullTitle = verbatimTitle
    ? title
    : title === brand || title === SEO_SITE_NAME
      ? brand
      : `${title}｜${brand}`;
  const bare = barePathname(path);
  const canonical = canonicalUrlForLocale(bare, locale);
  const xDefault = canonicalUrlForLocale(bare, "zh-Hant");
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
    ],
    links: [
      { rel: "canonical", href: canonical },
      ...HREFLANG_LOCALES.map((loc) => ({
        rel: "alternate",
        hrefLang:
          loc === "zh-Hant" ? "zh-Hant" : loc === "zh-Hans" ? "zh-Hans" : loc,
        href: canonicalUrlForLocale(bare, loc),
      })),
      { rel: "alternate", hrefLang: "x-default", href: xDefault },
    ],
  };
}
