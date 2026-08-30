import { createFileRoute, Link } from "@tanstack/react-router";
import { TOPICS } from "@/data/topics";
import { usePrefs } from "@/lib/prefs";
import { TopicRow } from "@/components/topic-row";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/saved")({ component: SavedPage });

function SavedPage() {
  const saved = usePrefs((s) => s.saved);
  const topics = TOPICS.filter((t) => saved.includes(t.id));
  const { t } = useI18n();

  return (
    <div className="px-4 pt-5">
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("saved")}</h1>
      <p className="mt-1 text-[0.88rem] text-muted">{t("savedLead")}</p>
      {topics.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-line px-4 py-10 text-center">
          <p className="text-muted">{t("savedEmpty")}</p>
          <Link
            to="/"
            className="mt-3 inline-flex h-10 items-center rounded-full bg-navy px-4 text-[0.85rem] font-semibold text-paper no-underline"
          >
            {t("savedGo")}
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-card">
          {topics.map((topic) => (
            <TopicRow key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
