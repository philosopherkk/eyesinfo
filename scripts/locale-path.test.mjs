#!/usr/bin/env node
/**
 * Interim multilingual policy: hide language chrome; locale URLs redirect to TC home.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

test("LangSwitch is hidden (returns null) — no 繁简EN日 chrome", () => {
  const src = read("src/components/lang-switch.tsx");
  assert.match(src, /return null/);
  assert.doesNotMatch(src, /LOCALES\.map/);
});

test("home and app-shell do not mount LangSwitch", () => {
  assert.doesNotMatch(read("src/components/home-page.tsx"), /LangSwitch/);
  assert.doesNotMatch(read("src/components/app-shell.tsx"), /LangSwitch/);
});

test("useI18n is locked to zh-Hant interim", () => {
  const src = read("src/i18n/index.ts");
  assert.match(src, /locale:\s*Locale\s*=\s*"zh-Hant"/);
  assert.doesNotMatch(src, /useEffectiveLocale|stripLocalePrefix/);
});

test("locale entry routes redirect to TC home (no stub clinical pages)", () => {
  for (const rel of [
    "src/routes/en.tsx",
    "src/routes/ja.tsx",
    "src/routes/zh-Hans.tsx",
    "src/routes/zh-CN.tsx",
  ]) {
    const text = read(rel);
    assert.match(text, /redirect/);
    assert.match(text, /to:\s*"\/"/);
  }
});

test("schema.org inLanguage is TC-only interim", () => {
  const root = read("src/routes/__root.tsx");
  assert.match(root, /inLanguage:\s*\["zh-Hant"\]/);
  assert.doesNotMatch(root, /"en".*"ja"/);
});
