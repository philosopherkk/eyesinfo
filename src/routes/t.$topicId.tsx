import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { getTopic, topicEditorial, TOPICS } from "@/data/topics";
import { TOPIC_TOOLS } from "@/data/tools";
import { TopicBody } from "@/components/topic-body";
import { TopicRefs } from "@/components/topic-refs";
import { EditorialFooter } from "@/components/editorial-footer";
import { SaveButton } from "@/components/save-button";
import { topicSaveKey } from "@/lib/saved";
import { useI18n, useLocalizedTopic } from "@/i18n";
import type { UiKey } from "@/i18n/ui";
import { pageHead } from "@/lib/page-seo";

/** Retired stub IA: former hubs → merged / filled topics. */
const TOPIC_ALIASES: Record<string, string> = {
  "t-screen": "t-bluelight",
  /** Former I / P / AF tiles → glaucoma monitoring hub. */
  "t-glaucoma": "t-glaucoma-monitor",
  "t-octrnfl": "t-glaucoma-monitor",
  "t-reports": "t-glaucoma-monitor",
};

export const Route = createFileRoute("/t/$topicId")({
  beforeLoad: ({ params }) => {
    const alias = TOPIC_ALIASES[params.topicId];
    if (alias) {
      throw redirect({
        to: "/t/$topicId",
        params: { topicId: alias },
        replace: true,
      });
    }
  },
  head: ({ params }) => {
    const resolved = TOPIC_ALIASES[params.topicId] ?? params.topicId;
    const topic = getTopic(resolved);
    const title = topic?.title ?? "專題";
    const description =
      topic?.meta ||
      topic?.tag ||
      `眼科教育專題：${title}。公眾教育，不能代替面診。`;
    return pageHead({
      title,
      description,
      path: `/t/${resolved}`,
    });
  },
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
  const tools = TOPIC_TOOLS[raw?.id ?? ""] ?? [];
  const { t, tx } = useI18n();
  if (!raw) throw notFound();
  const { lastReviewed, reviewer } = topicEditorial(raw);

  return (
    <article>
      {/* Desktop: keep icon back; mobile uses collapsed breadcrumb 「返回分類」. */}
      <div className="hidden items-center px-2 pt-3 sm:flex">
        <Link
          to="/c/$catId"
          params={{ catId: raw.category }}
          className="grid size-11 place-items-center rounded-md text-navy no-underline"
          aria-label={t("backCat")}
        >
          <ArrowLeft className="size-5" />
        </Link>
      </div>
      <header className="px-4 pb-3 pt-3 sm:pt-1">
        <p className="text-[0.75rem] text-steel">
          {t(CAT_TITLE[raw.category])} · {topic.num}
        </p>
        <div className="mt-1 flex items-start gap-3">
          <h1 className="min-w-0 flex-1 text-[1.2rem] font-semibold leading-snug text-navy sm:text-[1.35rem]">
            {topic.title}
          </h1>
          <SaveButton saveId={topicSaveKey(raw.id)} className="mt-0.5 shrink-0" />
        </div>
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
