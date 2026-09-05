/** Public education origin — no clinic shopfront on this host. */
export const PUBLIC_HOST = "eyesinfo.org";
export const PUBLIC_ORIGIN = "https://eyesinfo.org";
export const PUBLIC_HOSTS = ["eyesinfo.org", "www.eyesinfo.org"] as const;

/**
 * Public content edition. Bump on every published medical/education change
 * pushed to GitHub / eyesinfo.org (minor for new or rewritten pages, patch for
 * wording/typos). Shown at the bottom of every page.
 */
export const CONTENT_VERSION = "1.24";
export const CONTENT_UPDATED = "2026-09-05";

/** Copyright identity for watermark, copy-attribution and metadata. Education site only. */
export const COPYRIGHT_YEAR = "2026";
export const COPYRIGHT_HOLDER = "護眼學堂";
export const COPYRIGHT_LINE =
  "© 2026 護眼學堂 · 公眾教育 https://eyesinfo.org （保留版權，不得作為醫療廣告或診所推廣）";
export const WATERMARK_TEXT = "護眼學堂 · 公眾教育 · eyesinfo.org";
