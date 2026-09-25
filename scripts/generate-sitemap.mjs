/**
 * Generate public/sitemap.xml with per-URL lastmod from content sources.
 *
 * Sources (max wins):
 * 1. SITEMAP_BASELINE (2026-09-18) — historical bulk stamp
 * 2. ROUTE_OVERRIDES — explicit chrome / known content edits
 * 3. Topic `lastReviewed` in src/data/topics.ts + extra-topics.ts
 * 4. SEO_META_REFRESH (2026-09-24) — floor for *non-topic* paths listed in
 *    seo-descriptions.ts (1.77 head meta rewrite). Topics keep lastReviewed
 *    so body review dates stay visible instead of flattening to one day.
 *
 * Usage: node scripts/generate-sitemap.mjs
 * Keep SITEMAP_PATHS order identical to the public sitemap URL list (99 entries).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://www.eyesinfo.org";
const SITEMAP_BASELINE = "2026-09-18";
const SEO_META_REFRESH = "2026-09-24";

/** Explicit last content change — update when that route’s visible content changes. */
const ROUTE_OVERRIDES = {
  "/": "2026-09-21",
  "/en": "2026-09-21",
  "/zh-Hans": "2026-09-21",
  "/ja": "2026-09-21",
  "/urgent": "2026-09-24", // 1.78
  "/resources": "2026-09-24", // 1.76
};

/** Canonical public URL order (99). Do not drop locale homes or /resources. */
const SITEMAP_PATHS = [
  "/",
  "/en",
  "/zh-Hans",
  "/ja",
  "/urgent",
  "/search",
  "/tools",
  "/saved",
  "/install",
  "/clinic",
  "/legal",
  "/privacy",
  "/accessibility",
  "/resources",
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
  "/c/lens",
  "/c/lid",
  "/c/glaucoma",
  "/c/retina",
  "/c/surface",
  "/c/macula",
  "/t/d1",
  "/t/d2",
  "/t/d3",
  "/t/d4",
  "/t/d5",
  "/t/d6",
  "/t/d7",
  "/t/d8",
  "/t/d9",
  "/t/d10",
  "/t/t-allergy",
  "/t/t-vegf",
  "/t/t-chalazion",
  "/t/t-myopia",
  "/t/t-cataract",
  "/t/t-warm",
  "/t/t-demodex",
  "/t/t-dry",
  "/t/t-drops",
  "/t/t-iol",
  "/t/t-early",
  "/t/t-yag",
  "/t/t-mfiol",
  "/t/t-octm",
  "/t/t-presbyopia",
  "/t/t-tacrolimus-eyelid",
  "/t/t-ptk",
  "/t/t-rd",
  "/t/t-entropion",
  "/t/t-epiblepharon",
  "/t/t-ptosis",
  "/t/t-nldo",
  "/t/t-strab",
  "/t/parent-gaps",
  "/t/t-child",
  "/t/t-cl",
  "/t/water-acanthamoeba",
  "/t/ok-hygiene",
  "/t/t-steroid",
  "/t/t-ted",
  "/t/t-roles",
  "/t/t-dilate",
  "/t/t-pterygium",
  "/t/t-lube",
  "/t/t-rvo",
  "/t/t-lasik",
  "/t/t-uveitis",
  "/t/t-gldrops",
  "/t/t-migraine",
  "/t/t-strabsx",
  "/t/t-scleritis",
  "/t/t-gca",
  "/t/t-chem",
  "/t/t-high-myopia-pathology",
  "/t/t-keratoconus",
  "/t/t-allergy-hk",
  "/t/t-bluelight",
  "/t/t-colour-vision",
  "/t/t-steroid-sparing",
  "/t/t-glaucoma-monitor",
  "/t/t-optic-neuritis",
  "/t/t-corneal-transplant",
  "/t/t-nystagmus",
  "/t/t-ocular-tumours",
  "/t/t-macular-hole",
  "/t/t-erm",
];

function maxIso(...dates) {
  return dates.filter(Boolean).sort().at(-1) ?? SITEMAP_BASELINE;
}

function topicLastReviewedById() {
  const text =
    readFileSync(join(ROOT, "src/data/topics.ts"), "utf8") +
    "\n" +
    readFileSync(join(ROOT, "src/data/extra-topics.ts"), "utf8");
  const map = new Map();
  for (const m of text.matchAll(/lastReviewed:\s*"(\d{4}-\d{2}-\d{2})"/g)) {
    const before = text.slice(Math.max(0, m.index - 1200), m.index);
    const ids = [...before.matchAll(/\bid:\s*"([^"]+)"/g)].map((x) => x[1]);
    if (ids.length) map.set(ids.at(-1), m[1]);
  }
  return map;
}

function seoDescriptionPaths() {
  const text = readFileSync(join(ROOT, "src/data/seo-descriptions.ts"), "utf8");
  return new Set([...text.matchAll(/^  "(\/[^"]+)":/gm)].map((m) => m[1]));
}

function lastmodForPath(path, topicReviewed, seoPaths) {
  const override = ROUTE_OVERRIDES[path];
  // Topics: use lastReviewed when set (even if older than the bulk baseline).
  // Do not max() against SITEMAP_BASELINE — that would hide real review dates.
  // Do not apply the 1.77 SEO meta floor — that would flatten every leaflet.
  if (path.startsWith("/t/")) {
    const reviewed = topicReviewed.get(path.slice(3));
    return maxIso(override, reviewed ?? SITEMAP_BASELINE);
  }
  // Non-topics with a 1.77 seo-descriptions entry: meta rewrite counts.
  const seoFloor = seoPaths.has(path) ? SEO_META_REFRESH : undefined;
  return maxIso(SITEMAP_BASELINE, override, seoFloor);
}

function buildXml(pathLastmods) {
  const body = pathLastmods
    .map(
      ([path, lastmod]) =>
        `  <url><loc>${ORIGIN}${path === "/" ? "/" : path}</loc><lastmod>${lastmod}</lastmod></url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function main() {
  if (SITEMAP_PATHS.length !== 99) {
    throw new Error(`expected 99 sitemap paths, got ${SITEMAP_PATHS.length}`);
  }
  const topicReviewed = topicLastReviewedById();
  const seoPaths = seoDescriptionPaths();
  const rows = SITEMAP_PATHS.map((path) => [
    path,
    lastmodForPath(path, topicReviewed, seoPaths),
  ]);
  const xml = buildXml(rows);
  const out = join(ROOT, "public/sitemap.xml");
  writeFileSync(out, xml);
  const dates = new Set(rows.map(([, d]) => d));
  const urgent = rows.find(([p]) => p === "/urgent")[1];
  console.log(
    `wrote ${out} (${rows.length} urls, ${dates.size} distinct lastmods, /urgent=${urgent})`,
  );
}

main();
