#!/usr/bin/env node
/**
 * Build-time MCHK / Cap. 231 publicity-language gate for eyesinfo.org.
 *
 * Scans education content that ships to the public SPA:
 *   - src/data/**   (topics, legal, tools, urgent, editorial, citations notes)
 *   - src/i18n/**   (UI packs, EN/JA topic packs, catalog)
 *   - any *.md under src/ or content/
 *
 * Skips node_modules, dist, build artefacts.
 *
 * Fail closed (exit 1) on banned publicity / guarantee / clinic-contact
 * patterns in TC or EN. Latin matches are case-insensitive.
 *
 * Negated educational phrasing is allowed when the banned token is clearly
 * denied in a short preceding window, e.g. 「不是根治」「不能保證」「no
 * testimonials」「不作效果保證」. Prefer promotional multi-word phrases
 * over bare tokens when possible.
 *
 * Inline allowlist (use sparingly). Place on the same line or the line above:
 *   // compliance-allow: phrase
 *   Or a block comment containing: compliance-allow: phrase
 * Multiple phrases may be comma-separated.
 *
 * Soft warnings (exit 0 still): topic objects that cite literature-style rates
 * in blocks but omit `refs` — printed as WARN, not a hard failure.
 *
 * Usage:
 *   npm run check:compliance
 *   node scripts/check-mchk-compliance.mjs [--root <dir>]
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = join(__dirname, "..");

/** @typedef {{ id: string, pattern: RegExp, label: string, skipNegated?: boolean }} BanRule */

/** Promotional / guarantee phrases. */
const BAN_RULES = /** @type {BanRule[]} */ ([
  // English
  { id: "best-doctor", pattern: /\bbest\s+doctor\b/i, label: "best doctor" },
  { id: "no1-doctor", pattern: /\bno\.?\s*1\s+doctor\b/i, label: "no.1 doctor" },
  { id: "hash1-doctor", pattern: /#\s*1\s+doctor\b/i, label: "#1 doctor" },
  { id: "number-one-doctor", pattern: /\bnumber\s+one\s+doctor\b/i, label: "number one doctor" },
  { id: "guaranteed-cure", pattern: /\bguaranteed\s+cure\b/i, label: "guaranteed cure" },
  { id: "100-success", pattern: /\b100\s*%\s*success\b/i, label: "100% success" },
  { id: "100-cure", pattern: /\b100\s*%\s*cure\b/i, label: "100% cure" },
  {
    id: "patient-testimonial",
    pattern: /\bpatient\s+testimonials?\b/i,
    label: "patient testimonial(s)",
    skipNegated: true,
  },
  {
    id: "testimonials",
    pattern: /\btestimonials?\b/i,
    label: "testimonial(s)",
    skipNegated: true,
  },
  { id: "special-offer", pattern: /\bspecial\s+offers?\b/i, label: "special offer" },
  { id: "discount", pattern: /\bdiscounts?\b/i, label: "discount", skipNegated: true },
  { id: "cheapest", pattern: /\bcheapest\b/i, label: "cheapest" },
  { id: "miracle-cure", pattern: /\bmiracle\s+cure\b/i, label: "miracle cure" },
  // Traditional / Simplified Chinese publicity
  { id: "最好醫生", pattern: /最好醫生|最好医生/, label: "最好醫生" },
  { id: "保證痊癒", pattern: /保證痊癒|保证痊愈/, label: "保證痊癒" },
  { id: "保證治癒", pattern: /保證治癒|保证治愈/, label: "保證治癒" },
  { id: "根治保證", pattern: /根治保證|根治保证/, label: "根治保證" },
  { id: "百分百", pattern: /百分百/, label: "百分百" },
  { id: "100%成功", pattern: /100\s*%\s*成功/, label: "100%成功" },
  { id: "病人見證", pattern: /病人見證|病人见证|病人證言|病人证言/, label: "病人見證／證言", skipNegated: true },
  { id: "見證", pattern: /見證|见证/, label: "見證", skipNegated: true },
  { id: "折扣", pattern: /折扣/, label: "折扣" },
  { id: "特價", pattern: /特價|特价/, label: "特價" },
  {
    id: "優惠",
    pattern: /(?:限時)?優惠(?:價|碼|套餐)?|(?:特别|特別)优惠|优惠价/,
    label: "優惠（招徠）",
  },
  { id: "一定好", pattern: /一定好/, label: "一定好" },
  { id: "包靚", pattern: /包靚|包靓/, label: "包靚" },
  // Bare 「保證」when not clearly negated (「不能保證」「不作…保證」OK).
  // Bare 「根治」is NOT banned — educational 「不是根治」/「根治通道」are common;
  // promotional cure claims are covered by 根治保證 / 保證痊癒 / 保證治癒.
  {
    id: "保證-bare",
    pattern: /保證|保证/,
    label: "保證（非否定）",
    skipNegated: true,
  },
]);

/** Clinic contact / booking pitches that education copy must not carry. */
const CONTACT_RULES = /** @type {BanRule[]} */ ([
  {
    id: "whatsapp",
    pattern: /\bwhats\s*app\b|WhatsApp|撳.*WhatsApp|WhatsApp.*預約|預約.*WhatsApp/i,
    label: "WhatsApp",
  },
  {
    id: "booking-pitch",
    pattern: /WhatsApp\s*booking|book\s+via\s+whatsapp|即時預約|立刻預約|網上預約診所/i,
    label: "booking pitch",
  },
  {
    id: "tel-label",
    pattern: /(?:電話|致電|查詢熱線|聯絡電話|Tel\.?|Phone)[:：\s]*[+\d][\d\s\-]{7,}/i,
    label: "phone contact",
  },
  {
    // Raw HK mobile (8 digits, common leading 5/6/9). Not applied inside pmid: fields.
    id: "hk-mobile",
    pattern: /(?<!pmid:\s*")(?<!pmid:\s*')\b[569]\d{7}\b/,
    label: "HK mobile number",
  },
]);

const ALLOW_RE = /compliance-allow:\s*([^\n*]+)/i;

/** Negation / disclaimer cues in a short window before a match. */
const NEGATION_WINDOW_RE =
  /不(?:能|是|會|会|作|以|屬|属|等於|等于)?|並非|并非|非|無|无|沒有|没有|唔係|唔系|無需|无需|勿|莫|\bnever\b|\bno\b|\bnot\b|\bwithout\b|\bneither\b|\bnor\b/i;

const SCAN_ROOTS = ["src/data", "src/i18n"];
const SCAN_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts", ".md", ".json"]);

/**
 * @param {string} root
 * @returns {string[]}
 */
export function listContentFiles(root) {
  /** @type {string[]} */
  const out = [];
  for (const rel of SCAN_ROOTS) {
    walk(join(root, rel), out);
  }
  for (const extra of ["content", "src"]) {
    const base = join(root, extra);
    try {
      if (!statSync(base).isDirectory()) continue;
    } catch {
      continue;
    }
    for (const name of readdirSync(base)) {
      if (!name.endsWith(".md")) continue;
      out.push(join(base, name));
    }
  }
  return [...new Set(out)].sort();
}

/**
 * @param {string} dir
 * @param {string[]} out
 */
function walk(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const ent of entries) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "dist" || ent.name.startsWith(".")) continue;
      walk(p, out);
      continue;
    }
    const dot = ent.name.lastIndexOf(".");
    const ext = dot >= 0 ? ent.name.slice(dot) : "";
    if (SCAN_EXTS.has(ext)) out.push(p);
  }
}

/**
 * @param {string} line
 * @param {number} lineIndex 0-based
 * @param {string[]} allLines
 */
function allowlistForLine(line, lineIndex, allLines) {
  /** @type {string[]} */
  const phrases = [];
  const collect = (s) => {
    const m = s.match(ALLOW_RE);
    if (!m) return;
    for (const part of m[1].split(",")) {
      const t = part.trim().toLowerCase();
      if (t) phrases.push(t);
    }
  };
  collect(line);
  if (lineIndex > 0) collect(allLines[lineIndex - 1]);
  return phrases;
}

/**
 * @param {string} line
 * @param {number} matchIndex
 */
export function isNegatedAt(line, matchIndex) {
  const before = line.slice(Math.max(0, matchIndex - 100), matchIndex);
  if (NEGATION_WINDOW_RE.test(before)) return true;
  // English disclaimer sentences often put "no / does not" early on the line.
  if (/\b(?:there\s+are\s+)?no\b|\bdoes\s+not\b|\bdo\s+not\b|\bwithout\b|\bnever\b/i.test(before)) {
    return true;
  }
  return false;
}

/**
 * @param {string} filePath
 * @param {string} text
 * @param {BanRule[]} rules
 */
export function findViolationsInText(filePath, text, rules = [...BAN_RULES, ...CONTACT_RULES]) {
  const lines = text.split(/\r?\n/);
  /** @type {{ file: string, line: number, phrase: string, snippet: string }[]} */
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const allows = allowlistForLine(line, i, lines);
    for (const rule of rules) {
      rule.pattern.lastIndex = 0;
      let m;
      const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : `${rule.pattern.flags}g`);
      while ((m = re.exec(line)) !== null) {
        const matched = m[0];
        if (allows.some((a) => matched.toLowerCase().includes(a) || a.includes(matched.toLowerCase()) || rule.label.toLowerCase().includes(a))) {
          continue;
        }
        if (rule.skipNegated && isNegatedAt(line, m.index)) continue;
        // Skip PMID field assignments for the mobile rule.
        if (rule.id === "hk-mobile" && /pmid\s*:/.test(line)) continue;
        const snippet = line.trim().slice(0, 120);
        hits.push({
          file: filePath,
          line: i + 1,
          phrase: rule.label,
          snippet,
        });
      }
    }
  }
  return hits;
}

/**
 * Soft warn: Topic-like objects with rate language in nearby blocks but no refs.
 * Heuristic on source text — not a full TS parse.
 * @param {string} filePath
 * @param {string} text
 */
export function findMissingRefsWarnings(filePath, text) {
  if (!/topics\.ts$|extra-topics\.ts$/.test(filePath)) return [];
  /** @type {{ file: string, line: number, message: string }[]} */
  const warnings = [];
  // Split on topic object starts: `id: "..."`
  const topicBlocks = text.split(/(?=^\s*\{\s*$)/m);
  let offsetLines = 0;
  for (const block of topicBlocks) {
    const blockLines = block.split(/\r?\n/);
    const idMatch = block.match(/\bid:\s*"([^"]+)"/);
    if (!idMatch) {
      offsetLines += blockLines.length - 1;
      continue;
    }
    const hasRefs = /\brefs\s*:\s*\[/.test(block);
    const rateLang =
      /文獻|相对风险|相對風險|約\s*\d|约\s*\d|\d\s*[–\-〜~]\s*\d\s*%|\d+\s*%|PMID|trial|study reports/i.test(
        block,
      ) && /相對|相对|盛行|發生|发生|復位|复位|約|约|風險|风险/.test(block);
    if (rateLang && !hasRefs) {
      const idLine = blockLines.findIndex((l) => l.includes(`id: "${idMatch[1]}"`));
      warnings.push({
        file: filePath,
        line: offsetLines + Math.max(1, idLine + 1),
        message: `topic "${idMatch[1]}" has literature-rate language but no refs[] (soft warning)`,
      });
    }
    offsetLines += blockLines.length - 1;
  }
  return warnings;
}

/**
 * @param {string} root
 */
export function runComplianceCheck(root = DEFAULT_ROOT) {
  const files = listContentFiles(root);
  /** @type {{ file: string, line: number, phrase: string, snippet: string }[]} */
  const violations = [];
  /** @type {{ file: string, line: number, message: string }[]} */
  const warnings = [];

  for (const abs of files) {
    const text = readFileSync(abs, "utf8");
    const rel = relative(root, abs);
    violations.push(...findViolationsInText(rel, text));
    warnings.push(...findMissingRefsWarnings(rel, text));
  }

  return { filesScanned: files.length, violations, warnings };
}

function main(argv = process.argv.slice(2)) {
  let root = DEFAULT_ROOT;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--root" && argv[i + 1]) {
      root = argv[++i];
    }
  }

  const { filesScanned, violations, warnings } = runComplianceCheck(root);

  for (const w of warnings) {
    console.warn(`WARN  ${w.file}:${w.line}: ${w.message}`);
  }

  if (violations.length > 0) {
    for (const v of violations) {
      console.error(
        `FAIL  ${v.file}:${v.line}: banned «${v.phrase}» — ${v.snippet}`,
      );
    }
    console.error(
      `[check-mchk-compliance] ${violations.length} violation(s) in ${filesScanned} file(s).`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `[check-mchk-compliance] OK — scanned ${filesScanned} content file(s), 0 banned phrases` +
      (warnings.length ? `, ${warnings.length} soft warning(s)` : ""),
  );
}

const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isMain) main();
