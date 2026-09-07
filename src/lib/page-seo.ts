import { PUBLIC_ORIGIN } from "@/lib/site";

/** Brand in document titles (zh-Hant primary for SSR / crawlers). */
export const SEO_SITE_NAME = "護眼學堂";

export type PageSeoInput = {
  /** Page-specific title without brand suffix. */
  title: string;
  description: string;
  /** Path beginning with `/`, or `/` for home. */
  path: string;
};

/** Absolute canonical URL on the public apex origin (matches PUBLIC_ORIGIN). */
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
export function pageHead({ title, description, path }: PageSeoInput) {
  const url = canonicalUrl(path);
  const fullTitle =
    title === SEO_SITE_NAME ? SEO_SITE_NAME : `${title}｜${SEO_SITE_NAME}`;
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
