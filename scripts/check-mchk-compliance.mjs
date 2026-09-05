#!/usr/bin/env node
/**
 * Site-policy lint gate for eyesinfo.org education copy.
 *
 * This is a **build-time publicity / contact lint**, not Cap. 231 legal
 * certification and not Medical Council advice. It fails closed when
 * promotional guarantee language or clinic-contact patterns appear in
 * content that ships to the public SPA.
 *
 * Scans:
 *   - src/data/**
 *   - src/i18n/**
 *   - src/components/**
 *   - src/routes/**
 *   - index.html (if present)
 *   - any *.md under src/ or content/
 *
 * Skips node_modules, dist, build artefacts.
 *
 * Matching:
 *   - Lines are normalised (NFKC, strip zero-width, collapse whitespace)
 *     before pattern match; reports still cite the original file:line.
 *   - Latin matches are case-insensitive.
 *   - Negated educational phrasing is allowed for rules marked
 *     skipNegated when a tight negation cue precedes the match
 *     (e.g. 「不能保證痊癒」「本站沒有 WhatsApp」「no testimonials」).
 *
 * Inline allowlist (use sparingly). Same line or the line above:
 *   // compliance-allow: phrase
 * Allowlist entries must **exactly** equal the matched text (case-folded).
 * `compliance-allow: 保證` does NOT exempt `保證痊癒` / `保證治癒` /
 * `根治保證` (no substring punch-through).
 *
 * Soft warnings (exit 0 still): topic objects that cite literature-style
 * rates in blocks but omit `refs`.
 *
 * Usage:
 *   npm run check:compliance
 *   node scripts/check-mchk-compliance.mjs [--root <dir>]
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = join(__dirname, "..");

/** @typedef {{ id: string, pattern: RegExp, label: string, skipNegated?: boolean }} BanRule */

/** Promotional / guarantee phrases (TC + SC variants). */
const BAN_RULES = /** @type {BanRule[]} */ ([
  // English
  { id: "best-doctor", pattern: /\bbest\s+doctor\b/i, label: "best doctor" },
  { id: "no1-doctor", pattern: /\bno\.?\s*1\s+doctor\b/i, label: "no.1 doctor" },
  { id: "hash1-doctor", pattern: /#\s*1\s+doctor\b/i, label: "#1 doctor" },
  { id: "number-one-doctor", pattern: /\bnumber\s+one\s+doctor\b/i, label: "number one doctor" },
  {
    id: "guaranteed-cure",
    pattern: /\bguaranteed\s+cure\b/i,
    label: "guaranteed cure",
    skipNegated: true,
  },
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

  // Multi-word TC/SC publicity — longer phrases first; skipNegated for honest disclaimers
  {
    id: "保證痊癒",
    pattern: /保證痊癒|保证痊愈|保證痊愈|保证痊癒/,
    label: "保證痊癒",
    skipNegated: true,
  },
  {
    id: "保證治癒",
    pattern: /保證治癒|保证治愈|保證治愈|保证治癒/,
    label: "保證治癒",
    skipNegated: true,
  },
  {
    id: "根治保證",
    pattern: /根治保證|根治保证/,
    label: "根治保證",
    skipNegated: true,
  },
  { id: "最好醫生", pattern: /最好醫生|最好医生/, label: "最好醫生" },
  { id: "百分百", pattern: /百分百|百分之百/, label: "百分百" },
  { id: "100%成功", pattern: /100\s*%\s*成功/, label: "100%成功" },
  {
    id: "病人見證",
    pattern: /病人見證|病人见证|病人證言|病人证言/,
    label: "病人見證／證言",
    skipNegated: true,
  },
  { id: "見證", pattern: /見證|见证/, label: "見證", skipNegated: true },
  { id: "折扣", pattern: /折扣/, label: "折扣", skipNegated: true },
  { id: "特價", pattern: /特價|特价/, label: "特價", skipNegated: true },
  {
    id: "優惠",
    pattern: /(?:限時|限时)?優惠(?:價|码|碼|套餐)?|(?:特别|特別)优惠|优惠价|優惠價|特惠/,
    label: "優惠（招徠）",
    skipNegated: true,
  },
  { id: "一定好", pattern: /一定好/, label: "一定好" },
  { id: "包靚", pattern: /包靚|包靓/, label: "包靚" },

  // Bare 「保證」when not clearly negated. Bare 「根治」is NOT banned.
  {
    id: "保證-bare",
    pattern: /保證|保证/,
    label: "保證（非否定）",
    skipNegated: true,
  },
]);

/** Clinic contact / booking pitches. */
const CONTACT_RULES = /** @type {BanRule[]} */ ([
  {
    id: "whatsapp",
    pattern: /\bwhats\s*app\b|WhatsApp|whatsapp/i,
    label: "WhatsApp",
    skipNegated: true,
  },
  {
    id: "wechat",
    pattern: /\bwe\s*chat\b|WeChat|微信/i,
    label: "WeChat／微信",
    skipNegated: true,
  },
  {
    id: "telegram",
    pattern: /\btelegram\b|t\.me\//i,
    label: "Telegram",
    skipNegated: true,
  },
  {
    id: "wa-me",
    pattern: /(?:https?:\/\/)?(?:wa\.me|api\.whatsapp\.com)\b/i,
    label: "wa.me / api.whatsapp.com",
  },
  {
    id: "tel-href",
    pattern: /\btel:\s*[+\d]/i,
    label: "tel: href",
  },
  {
    id: "mailto-href",
    pattern: /\bmailto:\s*\S+/i,
    label: "mailto: href",
  },
  {
    id: "plus-852",
    pattern: /\+852[\s-]?\d{4}[\s-]?\d{4}\b/,
    label: "+852 phone",
  },
  {
    id: "booking-pitch",
    pattern:
      /WhatsApp\s*booking|book\s+via\s+whatsapp|即時預約|即时预约|立刻預約|立刻预约|網上預約診所|网上预约诊所/i,
    label: "booking pitch",
  },
  {
    id: "tel-label",
    pattern: /(?:電話|电话|致電|致电|查詢熱線|查询热线|聯絡電話|联络电话|Tel\.?|Phone)[:：\s]*[+\d][\d\s\-]{7,}/i,
    label: "phone contact",
  },
  {
    id: "hk-mobile",
    pattern: /(?<!pmid:\s*")(?<!pmid:\s*')\b[569]\d{7}\b/,
    label: "HK mobile number",
  },
]);

const ALLOW_RE = /compliance-allow:\s*([^\n*]+)/i;

const EN_NEGATION_RE =
  /\b(?:there\s+are\s+)?(?:no|not|never|without|neither|nor)\b/i;

/**
 * Tight negation: a denial cue must appear in a short window immediately
 * before the match (covers 「不能保證痊癒」「不是術後保證」「不作效果保證」
 * 「本站沒有 WhatsApp」). English uses a modestly longer window so
 * “There are no … testimonials” still works.
 * @param {string} line  (preferably already normalised)
 * @param {number} matchIndex
 */
export function isNegatedAt(line, matchIndex) {
  const before = line.slice(Math.max(0, matchIndex - 14), matchIndex);
  if (
    /(?:不(?:能|是|足|作|以|會|会|屬|属)?|並非|并非|沒有|没有|唔係|唔系|無需|无需|非|無|无|勿|莫)/.test(
      before,
    )
  ) {
    return true;
  }

  const beforeEn = line.slice(Math.max(0, matchIndex - 80), matchIndex);
  if (EN_NEGATION_RE.test(beforeEn)) return true;

  return false;
}

const SCAN_ROOTS = ["src/data", "src/i18n", "src/components", "src/routes"];
const SCAN_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts", ".md", ".json", ".html"]);

/**
 * @param {string} s
 */
export function normalizeForMatch(s) {
  return s
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF\u2060]/g, "")
    .replace(/\s+/g, " ");
}

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
  const indexHtml = join(root, "index.html");
  if (existsSync(indexHtml)) out.push(indexHtml);
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
      const t = normalizeForMatch(part).trim().toLowerCase();
      if (t) phrases.push(t);
    }
  };
  collect(line);
  if (lineIndex > 0) collect(allLines[lineIndex - 1]);
  return phrases;
}

/**
 * Exact allowlist only — no substring punch-through.
 * @param {string} matched
 * @param {string[]} allows
 */
export function isExactAllowlisted(matched, allows) {
  const m = normalizeForMatch(matched).toLowerCase();
  return allows.some((a) => m === a);
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
    const original = lines[i];
    const line = normalizeForMatch(original);
    const allows = allowlistForLine(original, i, lines).concat(
      allowlistForLine(line, i, lines.map(normalizeForMatch)),
    );
    for (const rule of rules) {
      let m;
      const re = new RegExp(
        rule.pattern.source,
        rule.pattern.flags.includes("g") ? rule.pattern.flags : `${rule.pattern.flags}g`,
      );
      while ((m = re.exec(line)) !== null) {
        const matched = m[0];
        if (isExactAllowlisted(matched, allows)) continue;
        if (rule.skipNegated && isNegatedAt(line, m.index)) continue;
        if (rule.id === "hk-mobile" && /pmid\s*:/i.test(line)) continue;
        hits.push({
          file: filePath,
          line: i + 1,
          phrase: rule.label,
          snippet: original.trim().slice(0, 120),
        });
      }
    }
  }
  return hits;
}

/**
 * @param {string} filePath
 * @param {string} text
 */
export function findMissingRefsWarnings(filePath, text) {
  if (!/topics\.ts$|extra-topics\.ts$/.test(filePath)) return [];
  /** @type {{ file: string, line: number, message: string }[]} */
  const warnings = [];
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
