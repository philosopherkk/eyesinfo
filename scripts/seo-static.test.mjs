/**
 * Regression: /sitemap.xml and /robots.txt must ship as Vite public/
 * static assets so Vercel Nitro's `filesystem` stage serves them before
 * the SPA/SSR catch-all `/(.*) → /__server`. Missing files fall through
 * to SSR and break crawlers.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { isDocumentPath } from "./grok-pwa-shared.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITEMAP = join(ROOT, "public/sitemap.xml");
const ROBOTS = join(ROOT, "public/robots.txt");

/** Every edu tool href from src/data/tools.ts (not /qr). */
const REQUIRED_TOOL_PATHS = [
  "/amsler",
  "/iol",
  "/tools/map",
  "/tools/drops",
  "/tools/ask",
  "/tools/tunnel",
  "/tools/haze",
  "/tools/floaters",
  "/tools/halo",
  "/tools/warm",
  "/tools/visit",
  "/tools/outdoor",
  "/tools/rx",
];

test("public/sitemap.xml and public/robots.txt exist", () => {
  assert.ok(existsSync(SITEMAP), "public/sitemap.xml missing — crawlers hit SSR catch-all");
  assert.ok(existsSync(ROBOTS), "public/robots.txt missing");
});

test("robots.txt allows crawl and points at apex sitemap", () => {
  const text = readFileSync(ROBOTS, "utf8");
  assert.match(text, /User-agent:\s*\*/);
  assert.match(text, /Allow:\s*\//);
  assert.match(text, /Sitemap:\s*https:\/\/eyesinfo\.org\/sitemap\.xml/);
});

test("sitemap.xml is a valid urlset covering edu tools including outdoor", () => {
  const xml = readFileSync(SITEMAP, "utf8");
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<\/urlset>\s*$/);
  assert.doesNotMatch(xml, /\/qr[<\s]/, "/qr is Lattice-only and must stay off the public sitemap");

  for (const path of REQUIRED_TOOL_PATHS) {
    assert.match(
      xml,
      new RegExp(`<loc>https://eyesinfo\\.org${path.replaceAll("/", "\\/")}</loc>`),
      `sitemap missing ${path}`,
    );
  }

  for (const core of ["/urgent", "/tools", "/legal", "/privacy", "/accessibility", "/t/d1", "/t/d10"]) {
    assert.match(
      xml,
      new RegExp(`<loc>https://eyesinfo\\.org${core.replaceAll("/", "\\/")}</loc>`),
      `sitemap missing ${core}`,
    );
  }
});

test("PWA middleware treats .xml and .txt as non-document paths", () => {
  // isDocumentPath gates head injection; file extensions must skip it so
  // static sitemap/robots are never rewritten as HTML documents.
  assert.equal(isDocumentPath("/sitemap.xml"), false);
  assert.equal(isDocumentPath("/robots.txt"), false);
  assert.equal(isDocumentPath("/urgent"), true);
});
