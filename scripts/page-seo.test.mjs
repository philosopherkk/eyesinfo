#!/usr/bin/env node
/**
 * Self-referencing canonical / hreflang helpers (mirrors src/lib/page-seo.ts).
 * Inlined so npm test runs without TS path aliases.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_ORIGIN = "https://www.eyesinfo.org";

function pathForLocale(locale) {
  if (locale === "zh-Hant") return "/";
  return { en: "/en", ja: "/ja", "zh-Hans": "/zh-Hans" }[locale];
}

function hrefWithLang(path, locale) {
  if (locale === "zh-Hant") return path;
  const hashIdx = path.indexOf("#");
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  const withoutHash = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const qIdx = withoutHash.indexOf("?");
  const pathname = qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash;
  const existing = qIdx >= 0 ? withoutHash.slice(qIdx + 1) : "";
  const params = new URLSearchParams(existing);
  params.set("lang", locale);
  return `${pathname}?${params.toString()}${hash}`;
}

function barePathname(path) {
  const noHash = path.split("#")[0] || "/";
  const noQuery = noHash.split("?")[0] || "/";
  const normalized = noQuery.startsWith("/") ? noQuery : `/${noQuery}`;
  if (normalized !== "/" && normalized.endsWith("/")) {
    return normalized.replace(/\/+$/, "") || "/";
  }
  return normalized || "/";
}

function hreflangPath(path, locale) {
  const bare = barePathname(path);
  if (bare === "/" || bare === "/en" || bare === "/ja" || bare === "/zh-Hans") {
    return pathForLocale(locale);
  }
  return hrefWithLang(bare, locale);
}

function canonicalUrl(path) {
  if (!path || path === "/") return `${PUBLIC_ORIGIN}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_ORIGIN}${normalized}`;
}

function canonicalUrlForLocale(path, locale = "zh-Hant") {
  return canonicalUrl(hreflangPath(path, locale));
}

test("page-seo.ts exports self-canonical helpers and uses locale in pageHead", () => {
  const src = readFileSync(join(ROOT, "src/lib/page-seo.ts"), "utf8");
  assert.match(src, /export function hreflangPath/);
  assert.match(src, /export function canonicalUrlForLocale/);
  assert.match(src, /canonicalUrlForLocale\(bare,\s*locale\)/);
  assert.match(src, /property:\s*"og:url".*canonical/s);
  assert.doesNotMatch(
    src,
    /TC \(zh-Hant\) is the standing canonical/,
  );
});

test("deep routes: TC bare; other langs ?lang= only; strips other query", () => {
  assert.equal(hreflangPath("/t/t-strab", "zh-Hant"), "/t/t-strab");
  assert.equal(hreflangPath("/t/t-strab", "en"), "/t/t-strab?lang=en");
  assert.equal(hreflangPath("/t/t-strab?utm=1", "ja"), "/t/t-strab?lang=ja");
  assert.equal(
    canonicalUrlForLocale("/privacy", "zh-Hans"),
    "https://www.eyesinfo.org/privacy?lang=zh-Hans",
  );
  assert.equal(
    canonicalUrlForLocale("/t/t-strab", "en"),
    canonicalUrl(hreflangPath("/t/t-strab", "en")),
  );
});

test("locale homes use / /en /zh-Hans /ja, not ?lang=", () => {
  assert.equal(hreflangPath("/", "en"), "/en");
  assert.equal(hreflangPath("/en", "zh-Hant"), "/");
  assert.equal(hreflangPath("/ja", "zh-Hans"), "/zh-Hans");
  assert.equal(canonicalUrlForLocale("/en", "en"), "https://www.eyesinfo.org/en");
});
