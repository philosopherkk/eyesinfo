import { SEARCH_SYNONYMS, type SearchEntry } from "@/data/search-index";
import { CATEGORIES, TOPICS, getTopic } from "@/data/topics";
import { TOOLS } from "@/data/tools";
import { localizeTopic } from "@/i18n";
import { TOOL_TEXT } from "@/i18n/catalog";
import type { Locale } from "@/i18n/locale";
import type { UiKey } from "@/i18n/ui";
import {
  normalizeSearchText,
  scoreFieldRank,
  scoreSynonymRank,
  scoreTitleRank,
} from "@/lib/search-rank";

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
 * Client-side education search. Ranking:
 * exact title > title includes > SEARCH_SYNONYMS boost > keyword / field partial.
 * Synonym index still drives discovery; title matches outrank synonym-only hits.
 */
export function searchSite(
  query: string,
  locale: Locale,
  t: (k: UiKey) => string,
  limit = 12,
): SiteSearchHit[] {
  const needle = normalizeSearchText(query);
  if (!needle) return [];

  const byId = new Map<string, SiteSearchHit>();

  const upsert = (hit: SiteSearchHit) => {
    const prev = byId.get(hit.id);
    if (!prev || hit.score > prev.score) byId.set(hit.id, hit);
  };

  for (const entry of SEARCH_SYNONYMS) {
    const synonymScore = scoreSynonymRank(entry.keywords, needle);
    const titleScore = scoreTitleRank(resolveTitle(entry, locale, t), needle);
    const score = Math.max(synonymScore, titleScore);
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
    const titleScore = Math.max(
      scoreTitleRank(loc.title, needle),
      scoreTitleRank(topic.title, needle),
    );
    const fieldScore = scoreFieldRank(
      [loc.tag, loc.meta, topic.tag, topic.meta],
      needle,
    );
    const score = Math.max(titleScore, fieldScore);
    if (score <= 0) continue;
    upsert({
      id: `topic:${topic.id}`,
      kind: "topic",
      href: `/t/${topic.id}`,
      title: loc.title,
      blurb: loc.meta || loc.tag,
      score,
    });
  }

  for (const tool of TOOLS) {
    const pack = TOOL_TEXT[locale][tool.id];
    const titleScore = Math.max(
      scoreTitleRank(pack.title, needle),
      scoreTitleRank(tool.title, needle),
    );
    const fieldScore = scoreFieldRank(
      [pack.blurb, pack.canto, tool.blurb, tool.canto, tool.id],
      needle,
    );
    const score = Math.max(titleScore, fieldScore);
    if (score <= 0) continue;
    upsert({
      id: `tool:${tool.id}`,
      kind: "tool",
      href: tool.href,
      title: pack.title,
      blurb: pack.blurb,
      score,
    });
  }

  for (const cat of CATEGORIES) {
    const title = t(CAT_UI[cat.id]);
    const titleScore = Math.max(
      scoreTitleRank(title, needle),
      scoreTitleRank(cat.title, needle),
    );
    const fieldScore = scoreFieldRank([cat.subtitle], needle);
    const score = Math.max(titleScore, fieldScore);
    if (score <= 0) continue;
    upsert({
      id: `page:c-${cat.id}`,
      kind: "page",
      href: `/c/${cat.id}`,
      title,
      blurb: t(`${CAT_UI[cat.id]}_sub` as UiKey) || cat.subtitle,
      score,
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
    { id: "resources", href: "/resources", titleKey: "resourcesTitle", extra: ["延伸", "資料", "resources", "further", "reading", "関連"] },
  ];
  for (const page of pages) {
    const title = t(page.titleKey);
    let score = scoreTitleRank(title, needle);
    for (const e of page.extra) {
      score = Math.max(score, scoreFieldRank([e], needle));
    }
    if (score <= 0) continue;
    upsert({
      id: `page:${page.id}`,
      kind: "page",
      href: page.href,
      title,
      blurb: "",
      score,
    });
  }

  return [...byId.values()]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "zh-Hant"))
    .slice(0, limit);
}

export { normalizeSearchText } from "@/lib/search-rank";
