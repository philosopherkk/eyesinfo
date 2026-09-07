import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { TOPICS } from "@/data/topics";
import { TOOLS, type ToolId } from "@/data/tools";
import { usePrefs } from "@/lib/prefs";
import { parseSaveKey } from "@/lib/saved";
import { TopicRow } from "@/components/topic-row";
import { useI18n, TOOL_TEXT } from "@/i18n";
import { pageHead } from "@/lib/page-seo";

export const Route = createFileRoute("/saved")({
  head: () =>
    pageHead({
      title: "收藏",
      description: "本機收藏的眼科教育專題與工具。資料只存在此裝置，不上載。",
      path: "/saved",
    }),
  component: SavedPage,
});

function SavedPage() {
  const saved = usePrefs((s) => s.saved);
  const { t, locale } = useI18n();
  const toolText = TOOL_TEXT[locale];

  const items = saved
    .map((key) => {
      const parsed = parseSaveKey(key);
      if (parsed.kind === "topic") {
        const topic = TOPICS.find((x) => x.id === parsed.id);
        return topic ? ({ kind: "topic" as const, key, topic }) : null;
      }
      const tool = TOOLS.find((x) => x.id === parsed.id);
      return tool ? ({ kind: "tool" as const, key, tool }) : null;
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  return (
    <div className="px-4 pt-5">
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("saved")}</h1>
      <p className="mt-1 text-[0.88rem] text-muted">{t("savedLead")}</p>
      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-line px-4 py-10 text-center">
          <p className="text-muted">{t("savedEmpty")}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/"
              className="inline-flex h-10 items-center rounded-full bg-navy px-4 text-[0.85rem] font-semibold text-paper no-underline"
            >
              {t("savedGo")}
            </Link>
            <Link
              to="/tools"
              className="inline-flex h-10 items-center rounded-full border-2 border-navy px-4 text-[0.85rem] font-semibold text-navy no-underline"
            >
              {t("tools")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-card">
          {items.map((item) => {
            if (item.kind === "topic") {
              return <TopicRow key={item.key} topic={item.topic} />;
            }
            const text = toolText[item.tool.id as ToolId];
            return (
              <SavedToolRow
                key={item.key}
                href={item.tool.href}
                title={text.title}
                blurb={`${text.blurb} · ${text.canto}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function SavedToolRow({
  href,
  title,
  blurb,
}: {
  href: string;
  title: string;
  blurb: string;
}) {
  const { t } = useI18n();
  const inner = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-steel/15 text-[0.65rem] font-semibold text-navy">
        {t("tools")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block truncate text-[0.78rem] text-muted">
          {blurb}
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-faint" />
    </>
  );
  const cls =
    "flex items-center gap-3 border-b border-line px-4 py-3.5 no-underline last:border-b-0";
  if (href === "/amsler") {
    return (
      <Link to="/amsler" className={cls}>
        {inner}
      </Link>
    );
  }
  if (href === "/iol") {
    return (
      <Link to="/iol" className={cls}>
        {inner}
      </Link>
    );
  }
  const id = href.split("/").pop() ?? "map";
  return (
    <Link to="/tools/$toolId" params={{ toolId: id }} className={cls}>
      {inner}
    </Link>
  );
}
