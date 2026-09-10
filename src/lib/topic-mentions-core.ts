/** Pure first-mention linkify (no data imports — safe for node:test). */

export type MentionLink = { phrase: string; href: string };

export type TextPart = { type: "text" | "link"; text: string; href?: string };

/**
 * Split `text` into plain + first-mention link parts.
 * Each `href` is linked at most once per page (tracked via `usedHrefs`).
 * Skips self-page href when `selfHref` is set.
 */
export function linkifyFirstMentions(
  text: string,
  mentions: MentionLink[],
  usedHrefs: Set<string>,
  selfHref?: string,
): TextPart[] {
  if (!text) return [{ type: "text", text: "" }];

  type Hit = { start: number; end: number; href: string; phrase: string };
  const hits: Hit[] = [];

  for (const { phrase, href } of mentions) {
    if (selfHref && href === selfHref) continue;
    if (usedHrefs.has(href)) continue;
    const idx = text.indexOf(phrase);
    if (idx < 0) continue;
    const end = idx + phrase.length;
    const overlaps = hits.some((h) => !(end <= h.start || idx >= h.end));
    if (overlaps) continue;
    hits.push({ start: idx, end, href, phrase });
    usedHrefs.add(href);
  }

  if (hits.length === 0) return [{ type: "text", text }];

  hits.sort((a, b) => a.start - b.start);
  const parts: TextPart[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start > cursor) {
      parts.push({ type: "text", text: text.slice(cursor, hit.start) });
    }
    parts.push({ type: "link", text: hit.phrase, href: hit.href });
    cursor = hit.end;
  }
  if (cursor < text.length) {
    parts.push({ type: "text", text: text.slice(cursor) });
  }
  return parts;
}
