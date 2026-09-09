import { EduLink } from "@/components/edu-link";
import { useI18n } from "@/i18n";
import {
  groupRelatedItems,
  PRIMARY_TOPIC_CAP,
  type RelatedItem,
} from "@/lib/topic-related";

export type { RelatedItem };

function Chip({ href, label }: RelatedItem) {
  return (
    <EduLink
      href={href}
      className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
    >
      {label}
    </EduLink>
  );
}

function ChipRow({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip key={item.href} href={item.href} label={item.label} />
      ))}
    </div>
  );
}

/**
 * Related navigation for topic pages — before references.
 * Groups「相關專題」vs「教育工具」; long topic lists keep 4–5 priority chips
 * on the primary row and demote the rest.
 */
export function TopicRelated({ items }: { items: RelatedItem[] }) {
  const { t, tx } = useI18n();
  if (items.length === 0) return null;

  const localized = items.map((i) => ({ href: i.href, label: tx(i.label) }));
  const { topics, tools, other } = groupRelatedItems(localized);
  const primaryTopics = topics.slice(0, PRIMARY_TOPIC_CAP);
  const moreTopics = topics.slice(PRIMARY_TOPIC_CAP);
  const onlyTools = topics.length === 0 && other.length === 0 && tools.length > 0;

  return (
    <nav className="mt-6 border-t border-line pt-4" aria-label={t("relatedNav")}>
      {topics.length > 0 || other.length > 0 ? (
        <div className={tools.length > 0 ? "mb-4" : undefined}>
          <p className="mb-2 text-[0.8rem] font-semibold text-muted">
            {t("relatedTopics")}
          </p>
          <ChipRow items={[...primaryTopics, ...other]} />
          {moreTopics.length > 0 ? (
            <div className="mt-2">
              <p className="mb-1.5 text-[0.72rem] text-steel">{t("relatedMore")}</p>
              <ChipRow items={moreTopics} />
            </div>
          ) : null}
        </div>
      ) : null}
      {tools.length > 0 ? (
        <div>
          <p className="mb-2 text-[0.8rem] font-semibold text-muted">
            {onlyTools ? t("related") : t("relatedTools")}
          </p>
          <ChipRow items={tools} />
        </div>
      ) : null}
    </nav>
  );
}
