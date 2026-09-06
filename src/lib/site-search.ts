import { SEARCH_SYNONYMS, type SearchEntry } from "@/data/search-index";
import { CATEGORIES, TOPICS, getTopic } from "@/data/topics";
import { TOOLS } from "@/data/tools";
import { localizeTopic } from "@/i18n";
import { TOOL_TEXT } from "@/i18n/catalog";
import type { Locale } from "@/i18n/locale";
import type { UiKey } from "@/i18n/ui";

export type SiteSearchHit = {
  id: string;
  kind: SearchEntry["kind"] | "topic-body";
  href: string;
  title: string;
  blurb: string;
  score: number;
};

const CAT_UI: Record<string, UiKey> = {
  lens: "cat_lens",
  lid: "cat_lid",
  glaucoma: "cat_glaucoma",
  retina: "cat_retina",
  surface: "cat_surface",
};

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function scoreMatch(hay: string, needle: string): number {
  const h = norm(hay);
  const n = needle;
  if (!n) return 0;
  if (h === n) return 100;
  if (h.startsWith(n)) return 80;
  if (h.includes(n)) return 50;
  return 0;
}

function bestKeywordScore(keywords: string[], needle: string): number {
  let best = 0;
  for (const k of keywords) {
    best = Math.max(best, scoreMatch(k, needle));
  }
  return best;
}

function topicTitle(id: string, locale: Locale): string {
  const raw = getTopic(id);
  if (!raw) return id;
  return localizeTopic(raw, locale).title;
}

function toolTitle(id: string, locale: Locale): string {
  const pack = TOOL_TEXT[locale]?.[id as keyof (typeof TOOL_TEXT)["zh-Hant"]];
  if (pack) return pack.title;
  return TOOLS.find((t) => t.id === id)?.title ?? id;
}

function resolveTitle(entry: SearchEntry, locale: Locale, t: (k: UiKey) => string): string {
  if (entry.kind === "topic") return topicTitle(entry.id, locale) || entry.titleFallback;
  if (entry.kind === "tool") return toolTitle(entry.id, locale) || entry.titleFallback;
  if (entry.id === "urgent") return t("urgentTitle");
  return entry.titleFallback;
}

function resolveBlurb(entry: SearchEntry, locale: Locale, t: (k: UiKey) => string): string {
  if (entry.kind === "topic") {
    const raw = getTopic(entry.id);
    if (!raw) return "";
    const loc = localizeTopic(raw, locale);
    return loc.meta || loc.tag;
  }
  if (entry.kind === "tool") {
    const pack = TOOL_TEXT[locale]?.[entry.id as keyof (typeof TOOL_TEXT)["zh-Hant"]];
    return pack?.blurb ?? "";
  }
  if (entry.id === "urgent") return t("urgentLead");
  return "";
}

/**
 * Client-side education search. Synonym index first, then topic title/tag/meta
 * (not full body — avoids pulling brand-like strings from dense copy).
 */
export function searchSite(
  query: string,
  locale: Locale,
  t: (k: UiKey) => string,
  limit = 12,
): SiteSearchHit[] {
  const needle = norm(query);
  if (!needle) return [];

  const byId = new Map<string, SiteSearchHit>();

  const upsert = (hit: SiteSearchHit) => {
    const prev = byId.get(hit.id);
    if (!prev || hit.score > prev.score) byId.set(hit.id, hit);
  };

  for (const entry of SEARCH_SYNONYMS) {
    const score = bestKeywordScore(entry.keywords, needle);
    if (score <= 0) continue;
    upsert({
      id: `${entry.kind}:${entry.id}`,
      kind: entry.kind,
      href: entry.href,
      title: resolveTitle(entry, locale, t),
      blurb: resolveBlurb(entry, locale, t),
      score,
    });
  }

  for (const topic of TOPICS) {
    const loc = localizeTopic(topic, locale);
    const fields = [loc.title, loc.tag, loc.meta, topic.title, topic.tag, topic.meta];
    let score = 0;
    for (const f of fields) score = Math.max(score, scoreMatch(f, needle));
    if (score <= 0) continue;
    upsert({
      id: `topic:${topic.id}`,
      kind: "topic",
      href: `/t/${topic.id}`,
      title: loc.title,
      blurb: loc.meta || loc.tag,
      score: score - 5, // slight preference for curated synonym hits
    });
  }

  for (const tool of TOOLS) {
    const pack = TOOL_TEXT[locale][tool.id];
    const fields = [pack.title, pack.blurb, pack.canto, tool.title, tool.blurb, tool.canto, tool.id];
    let score = 0;
    for (const f of fields) score = Math.max(score, scoreMatch(f, needle));
    if (score <= 0) continue;
    upsert({
      id: `tool:${tool.id}`,
      kind: "tool",
      href: tool.href,
      title: pack.title,
      blurb: pack.blurb,
      score: score - 5,
    });
  }

  for (const cat of CATEGORIES) {
    const title = t(CAT_UI[cat.id]);
    const score = Math.max(scoreMatch(title, needle), scoreMatch(cat.title, needle), scoreMatch(cat.subtitle, needle));
    if (score <= 0) continue;
    upsert({
      id: `page:c-${cat.id}`,
      kind: "page",
      href: `/c/${cat.id}`,
      title,
      blurb: t(`${CAT_UI[cat.id]}_sub` as UiKey) || cat.subtitle,
      score: score - 10,
    });
  }

  // Static education pages (no clinic / booking pages beyond existing /clinic education stub)
  const pages: { id: string; href: string; titleKey: UiKey; extra: string[] }[] = [
    { id: "urgent", href: "/urgent", titleKey: "urgentTitle", extra: ["急症", "999", "urgent", "emergency"] },
    { id: "tools", href: "/tools", titleKey: "toolsTitle", extra: ["工具", "tools"] },
    { id: "search", href: "/search", titleKey: "search", extra: ["搜尋", "search"] },
    { id: "privacy", href: "/privacy", titleKey: "privacyTitle", extra: ["私隱", "privacy"] },
    { id: "a11y", href: "/accessibility", titleKey: "a11yTitle", extra: ["無障礙", "accessibility"] },
    { id: "legal", href: "/legal", titleKey: "legalTitle", extra: ["法律", "legal", "231"] },
  ];
  for (const page of pages) {
    const title = t(page.titleKey);
    let score = scoreMatch(title, needle);
    for (const e of page.extra) score = Math.max(score, scoreMatch(e, needle));
    if (score <= 0) continue;
    upsert({
      id: `page:${page.id}`,
      kind: "page",
      href: page.href,
      title,
      blurb: "",
      score: score - 15,
    });
  }

  return [...byId.values()]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "zh-Hant"))
    .slice(0, limit);
}
