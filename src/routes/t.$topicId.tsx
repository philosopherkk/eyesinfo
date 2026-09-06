import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, BookmarkCheck, ShieldAlert } from "lucide-react";
import { getTopic, topicEditorial, TOPICS } from "@/data/topics";
import { TOPIC_TOOLS } from "@/data/tools";
import { TopicBody } from "@/components/topic-body";
import { TopicRefs } from "@/components/topic-refs";
import { EditorialFooter } from "@/components/editorial-footer";
import { usePrefs } from "@/lib/prefs";
import { useI18n, useLocalizedTopic } from "@/i18n";
import type { UiKey } from "@/i18n/ui";

export const Route = createFileRoute("/t/$topicId")({
  component: TopicPage,
});

const CAT_TITLE: Record<string, UiKey> = {
  lens: "cat_lens",
  lid: "cat_lid",
  glaucoma: "cat_glaucoma",
  retina: "cat_retina",
  surface: "cat_surface",
};

function TopicPage() {
  const { topicId } = Route.useParams();
  const raw = getTopic(topicId);
  const topic = useLocalizedTopic(raw ?? TOPICS[0]);
  const saved = usePrefs((s) => s.saved.includes(raw?.id ?? ""));
  const toggleSaved = usePrefs((s) => s.toggleSaved);
  const tools = TOPIC_TOOLS[raw?.id ?? ""] ?? [];
  const { t, tx } = useI18n();
  if (!raw) throw notFound();
  const { lastReviewed, reviewer } = topicEditorial(raw);

  return (
    <article>
      <div className="flex items-center justify-between px-2 pt-3">
        <Link
          to="/c/$catId"
          params={{ catId: raw.category }}
          className="grid size-10 place-items-center rounded-md text-navy no-underline"
          aria-label={t("backCat")}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <button
          type="button"
          onClick={() => toggleSaved(raw.id)}
          className="mr-2 inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-[0.8rem] font-semibold text-navy"
        >
          {saved ? (
            <BookmarkCheck className="size-4" />
          ) : (
            <Bookmark className="size-4" />
          )}
          {saved ? t("bookmarked") : t("bookmark")}
        </button>
      </div>
      <header className="px-4 pb-3 pt-1">
        <p className="text-[0.75rem] text-steel">
          {t(CAT_TITLE[raw.category])} · {topic.num}
        </p>
        <h1 className="mt-1 text-[1.35rem] font-semibold leading-snug text-navy">
          {topic.title}
        </h1>
        {topic.meta ? (
          <p className="mt-1 text-[0.85rem] text-muted">{topic.meta}</p>
        ) : null}
      </header>
      {raw.isAcuteEmergency ? (
        <Link
          to="/urgent"
          className="mx-4 mb-4 flex items-start gap-3 rounded-xl bg-danger px-3.5 py-3 text-paper no-underline"
        >
          <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
          <span>
            <span className="block text-[0.9rem] font-semibold">
              {t("homeUrgentTitle")}
            </span>
            <span className="mt-0.5 block text-[0.8rem] leading-snug text-paper/90">
              {t("homeUrgentBody")}
            </span>
          </span>
        </Link>
      ) : null}
      <div className="px-4 pb-6">
        <TopicBody blocks={topic.blocks} />
        <TopicRefs ids={raw.refs} />
        {tools.length > 0 ? (
          <div className="mt-4">
            <p className="mb-2 text-[0.8rem] font-semibold text-muted">
              {t("related")}
            </p>
            <div className="flex flex-wrap gap-2">
              {tools.map((item) => (
                <RelatedLink key={item.href} href={item.href} label={tx(item.label)} />
              ))}
            </div>
          </div>
        ) : null}
        <EditorialFooter lastReviewed={lastReviewed} reviewer={reviewer} />
      </div>
    </article>
  );
}

function RelatedLink({ href, label }: { href: string; label: string }) {
  const cls =
    "inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline";
  if (href === "/amsler") return <Link to="/amsler" className={cls}>{label}</Link>;
  if (href === "/iol") return <Link to="/iol" className={cls}>{label}</Link>;
  if (href === "/urgent") return <Link to="/urgent" className={cls}>{label}</Link>;
  if (href.startsWith("/tools/")) {
    const id = href.split("/").pop() ?? "map";
    return (
      <Link to="/tools/$toolId" params={{ toolId: id }} className={cls}>
        {label}
      </Link>
    );
  }
  if (href.startsWith("/t/")) {
    const id = href.split("/").pop() ?? "";
    return (
      <Link to="/t/$topicId" params={{ topicId: id }} className={cls}>
        {label}
      </Link>
    );
  }
  if (href.startsWith("/c/")) {
    const id = href.split("/").pop() ?? "lid";
    return (
      <Link to="/c/$catId" params={{ catId: id }} className={cls}>
        {label}
      </Link>
    );
  }
  return null;
}
