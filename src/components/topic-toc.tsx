import {
  TOC_MIN_SECTIONS,
  type TocEntry,
} from "@/lib/topic-anchors";
import { useI18n } from "@/i18n";

/**
 * Compact in-page directory for long factsheets (6+ body H2 sections).
 * Labels come from existing headings only — no new clinical copy.
 */
export function TopicToc({
  entries,
  includeRefs,
}: {
  entries: TocEntry[];
  /** When the page has a bibliography, append「主要公開文獻」jump. */
  includeRefs?: boolean;
}) {
  const { t } = useI18n();
  if (entries.length < TOC_MIN_SECTIONS) return null;

  const items: TocEntry[] = includeRefs
    ? [...entries, { id: "topic-refs", text: t("refsH") }]
    : entries;

  return (
    <nav
      className="mt-3 rounded-lg border border-line/80 bg-line/20 px-3 py-2.5"
      aria-label={t("pageToc")}
    >
      <p className="text-[0.78rem] font-semibold text-muted">{t("pageToc")}</p>
      <ol className="mt-1.5 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 text-[0.8rem] leading-snug">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-navy underline-offset-2 hover:underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
