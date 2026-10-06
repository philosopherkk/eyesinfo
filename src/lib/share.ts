import { PUBLIC_ORIGIN } from "./site.ts";

/** Canonical site name in shared text (繁體; not a clinic brand). */
export const SHARE_SITE_NAME = "護眼學堂";

/**
 * Absolute education URL on www.eyesinfo.org.
 * Pass an already locale-aware path (`hrefWithLang`). Never use window.location.
 */
export function absolutePublicUrl(path: string): string {
  if (!path || path === "/") return `${PUBLIC_ORIGIN}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_ORIGIN}${normalized}`;
}

/** Title + site name only. No prognosis, brands, or clinic contact. */
export function sharePayload(
  pageTitle: string,
  url: string,
): { title: string; text: string; url: string } {
  const title = pageTitle.trim();
  return {
    title: `${title}｜${SHARE_SITE_NAME}`,
    text: `${title} · ${SHARE_SITE_NAME}`,
    url,
  };
}

export function isShareAbort(err: unknown): boolean {
  return (
    (typeof DOMException !== "undefined" &&
      err instanceof DOMException &&
      err.name === "AbortError") ||
    (err instanceof Error && err.name === "AbortError")
  );
}
