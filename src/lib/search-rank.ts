/**
 * Small ranking helpers for education site search.
 * Priority: exact title > title includes > SEARCH_SYNONYMS boost > keyword partial.
 */

export function normalizeSearchText(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Raw field match: exact / prefix / includes. */
export function scoreFieldMatch(hay: string, needle: string): number {
  const h = normalizeSearchText(hay);
  if (!needle || !h) return 0;
  if (h === needle) return 100;
  if (h.startsWith(needle)) return 80;
  if (h.includes(needle)) return 50;
  return 0;
}

export const SEARCH_RANK = {
  TITLE_EXACT: 1000,
  TITLE_STARTS: 900,
  TITLE_INCLUDES: 800,
  SYNONYM_EXACT: 600,
  SYNONYM_PARTIAL: 500,
  FIELD_EXACT: 400,
  FIELD_STARTS: 350,
  FIELD_INCLUDES: 300,
} as const;

export function scoreTitleRank(title: string, needle: string): number {
  const s = scoreFieldMatch(title, needle);
  if (s >= 100) return SEARCH_RANK.TITLE_EXACT;
  if (s >= 80) return SEARCH_RANK.TITLE_STARTS;
  if (s >= 50) return SEARCH_RANK.TITLE_INCLUDES;
  return 0;
}

export function scoreSynonymRank(keywords: string[], needle: string): number {
  let best = 0;
  for (const k of keywords) {
    const s = scoreFieldMatch(k, needle);
    if (s >= 100) best = Math.max(best, SEARCH_RANK.SYNONYM_EXACT);
    else if (s > 0) best = Math.max(best, SEARCH_RANK.SYNONYM_PARTIAL);
  }
  return best;
}

/** Tag / meta / other keyword fields — below synonym boost. */
export function scoreFieldRank(fields: string[], needle: string): number {
  let best = 0;
  for (const f of fields) {
    const s = scoreFieldMatch(f, needle);
    if (s >= 100) best = Math.max(best, SEARCH_RANK.FIELD_EXACT);
    else if (s >= 80) best = Math.max(best, SEARCH_RANK.FIELD_STARTS);
    else if (s >= 50) best = Math.max(best, SEARCH_RANK.FIELD_INCLUDES);
  }
  return best;
}
