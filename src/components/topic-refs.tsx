import { citationsFor } from "@/data/citations";
import { useI18n } from "@/i18n";

export function TopicRefs({ ids }: { ids?: string[] }) {
  const { t } = useI18n();
  const list = citationsFor(ids ?? []);
  if (list.length === 0) return null;
  return (
    <section className="mt-8 border-t border-line pt-4" aria-labelledby="topic-refs">
      <h2 id="topic-refs" className="text-[0.95rem] font-semibold text-navy">
        {t("refsH")}
      </h2>
      <p className="mt-1 text-[0.8rem] leading-relaxed text-muted">{t("refsLead")}</p>
      <ol className="mt-3 list-decimal space-y-3 pl-5 text-[0.78rem] leading-snug text-ink">
        {list.map((c) => (
          <li key={c.id}>
            <span className="font-medium">{c.authors}</span> {c.title}.{" "}
            <em>{c.source}</em>.{" "}
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/`}
              className="font-semibold text-navy"
              rel="noopener noreferrer"
              target="_blank"
            >
              PMID {c.pmid}
            </a>
            <span className="mt-0.5 block text-muted">{c.note}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
