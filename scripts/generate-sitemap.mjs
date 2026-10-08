/**
 * Regenerate public/sitemap.xml with per-URL <lastmod> from git history
 * (Asia/Hong_Kong calendar dates), and write a committed lastmod mapping
 * for shallow clones (e.g. Vercel).
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs          # git → mapping + sitemap
 *   node scripts/generate-sitemap.mjs --from-map  # mapping only → sitemap
 *
 * Shared chrome (header, disclaimer, CSP, CONTENT_VERSION) is intentionally
 * omitted from path → source maps so site-wide layout bumps do not refresh
 * every lastmod.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://www.eyesinfo.org";
const SITEMAP_PATH = join(ROOT, "public/sitemap.xml");
const LASTMOD_PATH = join(ROOT, "public/sitemap-lastmod.json");

/** Section heading ids that were wrongly listed as /t/* routes — never sitemap. */
export const ORPHAN_SECTION_REDIRECTS = {
  "/t/parent-gaps": "/t/t-strab#parent-gaps",
  "/t/water-acanthamoeba": "/t/t-cl#water-acanthamoeba",
  "/t/ok-hygiene": "/t/t-cl#ok-hygiene",
};

/** Procedure-day lands exist as routes but are not in the public sitemap (yet). */
const SITEMAP_EXCLUDE_TOPIC_IDS = new Set([
  "t-ivt-day",
  "t-chalazion-day",
  "t-barrier-laser",
  "t-yag-cap",
  "t-cataract-day",
]);

const LOCALE_HOME_PATHS = ["/", "/en", "/zh-Hans", "/ja"];

const CATEGORY_IDS = ["lens", "lid", "glaucoma", "retina", "surface", "macula"];

/** Path → content source files (page body / data only). */
const STATIC_SOURCES = {
  "/": [
    "src/components/home-page.tsx",
    "src/routes/index.tsx",
    "src/data/editorial.ts",
  ],
  "/en": [
    "src/components/home-page.tsx",
    "src/routes/en.index.tsx",
    "src/data/editorial.ts",
  ],
  "/zh-Hans": [
    "src/components/home-page.tsx",
    "src/routes/zh-Hans.index.tsx",
    "src/data/editorial.ts",
  ],
  "/ja": [
    "src/components/home-page.tsx",
    "src/routes/ja.index.tsx",
    "src/data/editorial.ts",
  ],
  "/urgent": ["src/routes/urgent.tsx", "src/data/urgent.ts"],
  "/search": ["src/routes/search.tsx", "src/data/search-index.ts", "src/lib/site-search.ts"],
  "/tools": ["src/routes/tools.index.tsx", "src/data/tools.ts"],
  "/saved": ["src/routes/saved.tsx"],
  "/install": ["src/routes/install.tsx", "scripts/install-page.html"],
  "/clinic": ["src/routes/clinic.tsx"],
  "/legal": ["src/routes/legal.tsx", "src/data/legal.ts", "src/data/editorial.ts"],
  "/privacy": ["src/routes/privacy.tsx", "src/data/legal.ts"],
  "/accessibility": ["src/routes/accessibility.tsx"],
  "/resources": ["src/routes/resources.tsx", "src/data/resources.ts"],
  "/amsler": ["src/routes/amsler.tsx", "src/components/amsler-grid.tsx"],
  "/iol": ["src/routes/iol.tsx", "src/components/iol-scene.tsx", "src/lib/iol-optics.ts"],
  "/iol-optics": [
    "src/routes/iol-optics.tsx",
    "src/lib/iol-optics-studio/optics.ts",
    "public/iol-optics-studio.html",
  ],
  "/tools/map": ["src/components/eye-map.tsx", "src/data/anatomy-related.ts"],
  "/tools/procedures": [
    "src/routes/tools.procedures.tsx",
    "src/components/procedure-frames.tsx",
    "public/procedures-3d.html",
  ],
  "/tools/drops": ["src/components/tool-demos.tsx", "src/components/care-tools.tsx"],
  "/tools/ask": ["src/components/ask-visit-rx.tsx"],
  "/tools/tunnel": ["src/components/tool-demos.tsx"],
  "/tools/haze": ["src/components/tool-demos.tsx"],
  "/tools/floaters": ["src/components/tool-demos.tsx"],
  "/tools/halo": ["src/components/tool-demos.tsx", "src/components/halo-overlay.tsx"],
  "/tools/warm": ["src/components/care-tools.tsx"],
  "/tools/visit": ["src/components/ask-visit-rx.tsx"],
  "/tools/outdoor": ["src/components/care-tools.tsx"],
  "/tools/rx": ["src/components/ask-visit-rx.tsx"],
};

/**
 * @param {string} file
 * @returns {{ id: string, start: number, end: number }[]}
 */
function parseTopLevelIds(file) {
  const abs = join(ROOT, file);
  if (!existsSync(abs)) return [];
  const lines = readFileSync(abs, "utf8").split("\n");
  /** @type {{ id: string, start: number }[]} */
  const starts = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^    id: "([^"]+)",\s*$/);
    if (!m) continue;
    const id = m[1];
    // Skip CATEGORIES / non-topic ids in topics.ts
    if (["lens", "lid", "glaucoma", "retina", "surface", "macula"].includes(id)) continue;
    starts.push({ id, start: i + 1 });
  }
  return starts.map((s, idx) => ({
    id: s.id,
    start: s.start,
    end: idx + 1 < starts.length ? starts[idx + 1].start - 1 : lines.length,
  }));
}

/**
 * Locale pack keys: `  "t-strab": {` at column 0 indent 2.
 * @param {string} file
 */
function parsePackRanges(file) {
  const abs = join(ROOT, file);
  if (!existsSync(abs)) return new Map();
  const lines = readFileSync(abs, "utf8").split("\n");
  /** @type {{ id: string, start: number }[]} */
  const starts = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^  "([^"]+)": \{\s*$/);
    if (m) starts.push({ id: m[1], start: i + 1 });
  }
  /** @type {Map<string, { start: number, end: number }>} */
  const map = new Map();
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1].start - 1 : lines.length;
    map.set(starts[i].id, { start: starts[i].start, end });
  }
  return map;
}

function gitAvailable() {
  try {
    const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
      cwd: ROOT,
      encoding: "utf8",
    }).trim();
    if (shallow === "true") return false;
    // Need enough history for -L; a tiny clone still reports false sometimes.
    const count = Number(
      execFileSync("git", ["rev-list", "--count", "HEAD"], {
        cwd: ROOT,
        encoding: "utf8",
      }).trim(),
    );
    return Number.isFinite(count) && count >= 10;
  } catch {
    return false;
  }
}

/**
 * @param {string[]} args
 * @returns {string | null}
 */
function gitLogDate(args) {
  try {
    const out = execFileSync(
      "git",
      ["-c", "log.showSignature=false", "log", "-1", "-s", "--format=%cd", "--date=format:%Y-%m-%d", ...args],
      {
        cwd: ROOT,
        encoding: "utf8",
        env: { ...process.env, TZ: "Asia/Hong_Kong" },
        stdio: ["ignore", "pipe", "pipe"],
      },
    ).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

/** @param {string} file @param {number} start @param {number} end */
function lastmodForRange(file, start, end) {
  if (start < 1 || end < start) return gitLogDate(["--", file]);
  return gitLogDate([`-L`, `${start},${end}:${file}`]) ?? gitLogDate(["--", file]);
}

/** @param {string[]} files */
function lastmodForFiles(files) {
  /** @type {string[]} */
  const dates = [];
  for (const file of files) {
    if (!existsSync(join(ROOT, file))) continue;
    const d = gitLogDate(["--", file]);
    if (d) dates.push(d);
  }
  if (!dates.length) return null;
  return dates.sort().at(-1) ?? null;
}

function collectTopicSources() {
  const files = [
    "src/data/topics.ts",
    "src/data/extra-topics.ts",
    "src/data/procedure-day-topics.ts",
  ];
  /** @type {Map<string, { file: string, start: number, end: number }>} */
  const byId = new Map();
  for (const file of files) {
    for (const block of parseTopLevelIds(file)) {
      byId.set(block.id, { file, start: block.start, end: block.end });
    }
  }
  /** @type {{ file: string, ranges: Map<string, { start: number, end: number }> }[]} */
  const localePacks = [
    { file: "src/i18n/topics-en.ts", ranges: parsePackRanges("src/i18n/topics-en.ts") },
    { file: "src/i18n/topics-ja.ts", ranges: parsePackRanges("src/i18n/topics-ja.ts") },
    {
      file: "src/i18n/procedure-day-en.ts",
      ranges: parsePackRanges("src/i18n/procedure-day-en.ts"),
    },
    {
      file: "src/i18n/procedure-day-ja.ts",
      ranges: parsePackRanges("src/i18n/procedure-day-ja.ts"),
    },
  ];
  return { byId, localePacks };
}

/**
 * @param {{ byId: Map<string, { file: string, start: number, end: number }>, localePacks: { file: string, ranges: Map<string, { start: number, end: number }> }[] }} packs
 */
function lastmodForTopic(topicId, packs) {
  /** @type {string[]} */
  const dates = [];
  const block = packs.byId.get(topicId);
  if (block) {
    const d = lastmodForRange(block.file, block.start, block.end);
    if (d) dates.push(d);
  }
  for (const { file, ranges } of packs.localePacks) {
    const range = ranges.get(topicId);
    if (!range) continue;
    const d = lastmodForRange(file, range.start, range.end);
    if (d) dates.push(d);
  }
  if (!dates.length) return null;
  return dates.sort().at(-1) ?? null;
}

function buildPathList(packs) {
  /** @type {string[]} */
  const paths = [];
  for (const p of LOCALE_HOME_PATHS) paths.push(p);
  for (const p of Object.keys(STATIC_SOURCES)) {
    if (!LOCALE_HOME_PATHS.includes(p)) paths.push(p);
  }
  for (const id of CATEGORY_IDS) paths.push(`/c/${id}`);
  const topicIds = [...packs.byId.keys()]
    .filter((id) => !SITEMAP_EXCLUDE_TOPIC_IDS.has(id))
    .sort((a, b) => a.localeCompare(b));
  for (const id of topicIds) paths.push(`/t/${id}`);
  return paths;
}

function isLocaleHome(path) {
  return LOCALE_HOME_PATHS.includes(path);
}

function hreflangLinks(path) {
  if (isLocaleHome(path)) {
    return [
      ["zh-Hant", `${ORIGIN}/`],
      ["zh-Hans", `${ORIGIN}/zh-Hans`],
      ["en", `${ORIGIN}/en`],
      ["ja", `${ORIGIN}/ja`],
      ["x-default", `${ORIGIN}/`],
    ];
  }
  return [
    ["zh-Hant", `${ORIGIN}${path}`],
    ["zh-Hans", `${ORIGIN}${path}?lang=zh-Hans`],
    ["en", `${ORIGIN}${path}?lang=en`],
    ["ja", `${ORIGIN}${path}?lang=ja`],
    ["x-default", `${ORIGIN}${path}`],
  ];
}

function renderSitemap(entries) {
  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ];
  for (const { path, lastmod } of entries) {
    lines.push(`  <url>`);
    lines.push(`    <loc>${ORIGIN}${path}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    for (const [lang, href] of hreflangLinks(path)) {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`,
      );
    }
    lines.push(`  </url>`);
  }
  lines.push(`</urlset>`);
  lines.push(``);
  return lines.join("\n");
}

function computeLastmodsFromGit() {
  const packs = collectTopicSources();
  const paths = buildPathList(packs);
  /** @type {Record<string, string>} */
  const map = {};
  /** @type {{ path: string, lastmod: string, source?: string }[]} */
  const meta = [];

  for (const path of paths) {
    let lastmod = null;
    let source = "";
    if (STATIC_SOURCES[path]) {
      lastmod = lastmodForFiles(STATIC_SOURCES[path]);
      source = STATIC_SOURCES[path].join(", ");
    } else if (path.startsWith("/c/")) {
      /** @type {string[]} */
      const dates = [];
      const hub = lastmodForFiles([
        "src/routes/c.$catId.tsx",
        "src/data/anatomy-related.ts",
      ]);
      if (hub) dates.push(hub);
      // CATEGORIES block only — not the whole topics.ts (would bump on any core topic edit).
      const catDate = lastmodForRange("src/data/topics.ts", 124, 158);
      if (catDate) dates.push(catDate);
      lastmod = dates.sort().at(-1) ?? null;
      source = "category hub sources";
    } else if (path.startsWith("/t/")) {
      const id = path.slice(3);
      lastmod = lastmodForTopic(id, packs);
      source = `topic ${id}`;
    }
    if (!lastmod) {
      // Fallback: sitemap file itself should not invent build date — use editorial stamp day.
      lastmod = "2026-09-18";
      source = `${source || path} (fallback)`;
    }
    map[path] = lastmod;
    meta.push({ path, lastmod, source });
  }
  return { map, meta, paths };
}

function main() {
  const fromMap = process.argv.includes("--from-map");
  /** @type {Record<string, string>} */
  let map;
  /** @type {string[]} */
  let paths;

  if (fromMap || !gitAvailable()) {
    if (!existsSync(LASTMOD_PATH)) {
      console.error(
        "sitemap-lastmod.json missing and git history unavailable. Run without --from-map on a full clone.",
      );
      process.exit(1);
    }
    const raw = JSON.parse(readFileSync(LASTMOD_PATH, "utf8"));
    map = raw.lastmod ?? raw;
    paths = Object.keys(map).sort((a, b) => {
      // Keep stable order: locale homes, static (as STATIC_SOURCES order), /c, /t
      const order = buildPathList(collectTopicSources());
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    // Drop orphans if an old map still has them
    paths = paths.filter((p) => !ORPHAN_SECTION_REDIRECTS[p]);
    console.log(
      fromMap
        ? `Building sitemap from ${LASTMOD_PATH}`
        : `Shallow/unavailable git — building sitemap from ${LASTMOD_PATH}`,
    );
  } else {
    const computed = computeLastmodsFromGit();
    map = computed.map;
    paths = computed.paths.filter((p) => !ORPHAN_SECTION_REDIRECTS[p]);
    const payload = {
      generatedAt: new Date().toISOString(),
      timezone: "Asia/Hong_Kong",
      note: "Per-URL content lastmod from git (page body/data only). Regenerate with: npm run sitemap:regen",
      lastmod: Object.fromEntries(paths.map((p) => [p, map[p]])),
    };
    writeFileSync(LASTMOD_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log(`Wrote ${LASTMOD_PATH} (${paths.length} urls)`);
  }

  const entries = paths.map((path) => ({
    path,
    lastmod: map[path] ?? "2026-09-18",
  }));

  // Guard: never emit orphan section routes
  for (const orphan of Object.keys(ORPHAN_SECTION_REDIRECTS)) {
    if (entries.some((e) => e.path === orphan)) {
      console.error(`Refusing to emit orphan sitemap path ${orphan}`);
      process.exit(1);
    }
  }

  writeFileSync(SITEMAP_PATH, renderSitemap(entries), "utf8");
  const uniqueDates = new Set(entries.map((e) => e.lastmod));
  console.log(
    `Wrote ${SITEMAP_PATH} (${entries.length} urls, ${uniqueDates.size} distinct lastmod dates)`,
  );
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) main();
