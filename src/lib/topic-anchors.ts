/** Stable in-page anchors for topic section headings (TOC + deep links). */

const MAX_ID_LEN = 48;

/** Slugify heading text for use as an HTML id (CJK-safe). */
export function slugifyHeading(text: string): string {
  const raw = text
    .normalize("NFKC")
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_ID_LEN)
    .toLowerCase();
  return raw || "section";
}

/**
 * Resolve a unique heading id. Prefer an explicit `block.id` when present;
 * otherwise slugify the heading text and disambiguate duplicates.
 */
export function resolveHeadingId(
  text: string,
  explicit: string | undefined,
  used: Set<string>,
): string {
  const base = (explicit?.trim() || slugifyHeading(text)).replace(/^#+/, "");
  let id = base || "section";
  if (!used.has(id)) {
    used.add(id);
    return id;
  }
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;
  id = `${base}-${n}`;
  used.add(id);
  return id;
}

export type TocEntry = { id: string; text: string };

/** Collect major body headings for the in-page TOC (order preserved). */
export function collectTocEntries(
  blocks: { type: string; text?: string; id?: string }[],
): TocEntry[] {
  const used = new Set<string>();
  const entries: TocEntry[] = [];
  for (const block of blocks) {
    if (block.type !== "h" || !block.text) continue;
    entries.push({
      id: resolveHeadingId(block.text, block.id, used),
      text: block.text,
    });
  }
  return entries;
}

/** Show「本頁目錄」when the factsheet has this many body sections or more. */
export const TOC_MIN_SECTIONS = 6;
