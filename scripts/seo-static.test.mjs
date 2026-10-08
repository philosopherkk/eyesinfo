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
  "/iol-optics",
  "/tools/map",
  "/tools/procedures",
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

test("robots.txt allows crawl and points at www sitemap", () => {
  const text = readFileSync(ROBOTS, "utf8");
  assert.match(text, /User-agent:\s*\*/);
  assert.match(text, /Allow:\s*\//);
  assert.match(text, /Sitemap:\s*https:\/\/www\.eyesinfo\.org\/sitemap\.xml/);
});

test("vercel.json redirects apex host to www and disables trailing slash", () => {
  const raw = readFileSync(join(ROOT, "vercel.json"), "utf8");
  const conf = JSON.parse(raw);
  assert.equal(
    conf.trailingSlash,
    false,
    "trailingSlash:false makes /path/ → /path a permanent redirect (308)",
  );
  assert.ok(Array.isArray(conf.redirects), "vercel.json must declare redirects");
  const apex = conf.redirects.find(
    (r) =>
      Array.isArray(r.has) &&
      r.has.some((h) => h.type === "host" && h.value === "eyesinfo.org") &&
      typeof r.destination === "string" &&
      r.destination.startsWith("https://www.eyesinfo.org"),
  );
  assert.ok(apex, "missing eyesinfo.org → www.eyesinfo.org redirect");
  assert.equal(apex.permanent, true);
});

test("sitemap.xml is a valid urlset covering edu tools including outdoor", () => {
  const xml = readFileSync(SITEMAP, "utf8");
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(
    xml,
    /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"\s+xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml">/,
  );
  assert.match(xml, /<\/urlset>\s*$/);
  assert.doesNotMatch(xml, /\/qr[<\s]/, "/qr is Lattice-only and must stay off the public sitemap");
  assert.doesNotMatch(
    xml,
    /<loc>https:\/\/eyesinfo\.org\//,
    "sitemap locs must use www host (apex redirects to www)",
  );
  assert.doesNotMatch(
    xml,
    /<loc>[^<]*\?lang=/,
    "sitemap must not list ?lang= URLs as separate loc entries",
  );
  assert.match(
    xml,
    /<xhtml:link rel="alternate" hreflang="en" href="https:\/\/www\.eyesinfo\.org\/t\/t-strab\?lang=en"\/>/,
  );
  assert.match(
    xml,
    /<xhtml:link rel="alternate" hreflang="x-default" href="https:\/\/www\.eyesinfo\.org\/t\/t-strab"\/>/,
  );
  assert.match(
    xml,
    /<xhtml:link rel="alternate" hreflang="en" href="https:\/\/www\.eyesinfo\.org\/en"\/>/,
  );

  for (const path of REQUIRED_TOOL_PATHS) {
    assert.match(
      xml,
      new RegExp(`<loc>https://www.eyesinfo\\.org${path.replaceAll("/", "\\/")}</loc>`),
      `sitemap missing ${path}`,
    );
  }

  for (const core of [
    "/urgent",
    "/tools",
    "/legal",
    "/privacy",
    "/accessibility",
    "/resources",
    "/search",
    "/install",
    "/saved",
    "/clinic",
    "/c/lens",
    "/c/macula",
    "/t/d1",
    "/t/d10",
    "/t/t-tacrolimus-eyelid",
  ]) {
    assert.match(
      xml,
      new RegExp(`<loc>https://www.eyesinfo\\.org${core.replaceAll("/", "\\/")}</loc>`),
      `sitemap missing ${core}`,
    );
  }

  for (const localePath of ["/en", "/zh-Hans", "/ja"]) {
    assert.match(
      xml,
      new RegExp(`<loc>https://www.eyesinfo\\.org${localePath.replaceAll("/", "\\/")}</loc>`),
      `sitemap missing locale entry ${localePath}`,
    );
  }

  // Canonical INN slug only — old Protopic alias must not be listed.
  assert.doesNotMatch(xml, /\/t\/t-protopic[<\s]/);
  // Section heading stubs (never real topics) — 308 to parent anchors; keep off sitemap.
  for (const orphan of ["/t/parent-gaps", "/t/water-acanthamoeba", "/t/ok-hygiene"]) {
    assert.doesNotMatch(
      xml,
      new RegExp(`<loc>https://www\\.eyesinfo\\.org${orphan.replaceAll("/", "\\/")}</loc>`),
      `sitemap must not list orphan section route ${orphan}`,
    );
  }
  const urlCount = (xml.match(/<url>/g) || []).length;
  assert.equal(urlCount, 98, `sitemap expected 98 canonical urls, got ${urlCount}`);

  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  assert.equal(lastmods.length, urlCount);
  for (const d of lastmods) {
    assert.match(d, /^\d{4}-\d{2}-\d{2}$/, `bad lastmod ${d}`);
  }
  const distinct = new Set(lastmods);
  assert.ok(
    distinct.size >= 5,
    `lastmod should vary by page content (got ${distinct.size} distinct dates)`,
  );
});

test("vercel.json permanently redirects orphan section /t/* stubs to parent anchors", () => {
  const conf = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
  const expected = {
    "/t/parent-gaps": "/t/t-strab#parent-gaps",
    "/t/water-acanthamoeba": "/t/t-cl#water-acanthamoeba",
    "/t/ok-hygiene": "/t/t-cl#ok-hygiene",
  };
  for (const [source, destination] of Object.entries(expected)) {
    const rule = conf.redirects.find((r) => r.source === source);
    assert.ok(rule, `missing redirect for ${source}`);
    assert.equal(rule.destination, destination);
    assert.equal(rule.permanent, true, `${source} must be permanent (308)`);
  }
});

test("sitemap-lastmod.json covers every sitemap loc and excludes orphans", () => {
  const mapPath = join(ROOT, "public/sitemap-lastmod.json");
  assert.ok(existsSync(mapPath), "public/sitemap-lastmod.json missing");
  const payload = JSON.parse(readFileSync(mapPath, "utf8"));
  const lastmod = payload.lastmod ?? payload;
  const xml = readFileSync(SITEMAP, "utf8");
  const locs = [...xml.matchAll(/<loc>https:\/\/www\.eyesinfo\.org([^<]*)<\/loc>/g)].map(
    (m) => m[1],
  );
  assert.equal(Object.keys(lastmod).length, locs.length);
  for (const path of locs) {
    assert.equal(typeof lastmod[path], "string", `missing lastmod for ${path}`);
    assert.match(lastmod[path], /^\d{4}-\d{2}-\d{2}$/);
  }
  for (const orphan of ["/t/parent-gaps", "/t/water-acanthamoeba", "/t/ok-hygiene"]) {
    assert.equal(lastmod[orphan], undefined, `mapping must not keep orphan ${orphan}`);
  }
});

test("PWA middleware treats .xml and .txt as non-document paths", () => {
  // isDocumentPath gates head injection; file extensions must skip it so
  // static sitemap/robots are never rewritten as HTML documents.
  assert.equal(isDocumentPath("/sitemap.xml"), false);
  assert.equal(isDocumentPath("/robots.txt"), false);
  assert.equal(isDocumentPath("/6c0a3657fd6bdda1a9630426f9fe3bac.txt"), false);
  assert.equal(isDocumentPath("/urgent"), true);
});

test("IndexNow key file is present in public/ as exact key text", () => {
  const key = "6c0a3657fd6bdda1a9630426f9fe3bac";
  const keyPath = join(ROOT, `public/${key}.txt`);
  assert.ok(existsSync(keyPath), `missing IndexNow key file public/${key}.txt`);
  const body = readFileSync(keyPath);
  assert.equal(body.toString("utf8"), key);
  assert.equal(body.length, 32);
});
