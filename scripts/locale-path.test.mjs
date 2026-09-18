#!/usr/bin/env node
/**
 * Locale entry paths — `/en`, `/ja`, `/zh-Hans` must resolve (not Not Found).
 * Helpers inlined (npm test runs scripts without --experimental-strip-types).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const ENTRY_BY_PATH = new Map([
  ["/en", "en"],
  ["/ja", "ja"],
  ["/zh-Hans", "zh-Hans"],
]);

const LOCALE_ALIASES = {
  "zh-CN": "zh-Hans",
  "zh-cn": "zh-Hans",
  zh_CN: "zh-Hans",
};

function localeFromPath(pathname) {
  const clean = pathname.replace(/\/$/, "") || "/";
  return ENTRY_BY_PATH.get(clean) ?? null;
}

function isLocaleHomePath(pathname) {
  const clean = pathname.replace(/\/$/, "") || "/";
  return clean === "/" || ENTRY_BY_PATH.has(clean);
}

function pathForLocale(locale) {
  if (locale === "zh-Hant") return "/";
  return { en: "/en", ja: "/ja", "zh-Hans": "/zh-Hans" }[locale];
}

function stripLocalePrefix(pathname) {
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

test("locale entry paths map to locales", () => {
  assert.equal(localeFromPath("/en"), "en");
  assert.equal(localeFromPath("/ja"), "ja");
  assert.equal(localeFromPath("/zh-Hans"), "zh-Hans");
  assert.equal(localeFromPath("/en/"), "en");
  assert.equal(localeFromPath("/"), null);
  assert.equal(localeFromPath("/urgent"), null);
});

test("isLocaleHomePath covers zh + locale entries", () => {
  assert.equal(isLocaleHomePath("/"), true);
  assert.equal(isLocaleHomePath("/en"), true);
  assert.equal(isLocaleHomePath("/ja"), true);
  assert.equal(isLocaleHomePath("/zh-Hans"), true);
  assert.equal(isLocaleHomePath("/urgent"), false);
});

test("pathForLocale and stripLocalePrefix", () => {
  assert.equal(pathForLocale("zh-Hant"), "/");
  assert.equal(pathForLocale("en"), "/en");
  assert.deepEqual(stripLocalePrefix("/en/urgent"), {
    locale: "en",
    rest: "/urgent",
  });
  assert.deepEqual(stripLocalePrefix("/zh-CN/tools"), {
    locale: "zh-Hans",
    rest: "/tools",
  });
  assert.deepEqual(stripLocalePrefix("/ja"), {
    locale: "ja",
    rest: "/",
  });
});

test("route files exist for locale entries (no hide-switcher fallback)", () => {
  const routes = [
    "src/routes/en.tsx",
    "src/routes/en.index.tsx",
    "src/routes/en.$.tsx",
    "src/routes/ja.tsx",
    "src/routes/ja.index.tsx",
    "src/routes/ja.$.tsx",
    "src/routes/zh-Hans.tsx",
    "src/routes/zh-Hans.index.tsx",
    "src/routes/zh-Hans.$.tsx",
    "src/routes/zh-CN.tsx",
    "src/routes/zh-CN.index.tsx",
    "src/routes/zh-CN.$.tsx",
  ];
  for (const rel of routes) {
    const text = readFileSync(join(ROOT, rel), "utf8");
    assert.ok(text.length > 40, `${rel} too thin`);
  }
  const lang = readFileSync(join(ROOT, "src/components/lang-switch.tsx"), "utf8");
  assert.match(lang, /LOCALES\.map/);
  assert.doesNotMatch(lang, /return null/);
  const i18n = readFileSync(join(ROOT, "src/i18n/index.ts"), "utf8");
  assert.match(i18n, /stripLocalePrefix/);
  assert.match(i18n, /useEffectiveLocale|fromPath/);
});

test("ui packs include localeTopicFallback in zh/en/ja", () => {
  const ui = readFileSync(join(ROOT, "src/i18n/ui.ts"), "utf8");
  const hits = ui.match(/localeTopicFallback:/g) || [];
  assert.equal(hits.length, 3, "localeTopicFallback must appear in zh/en/ja packs");
});
