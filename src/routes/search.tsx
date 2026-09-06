import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Search as SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TOPICS } from "@/data/topics";
import { TOOLS } from "@/data/tools";
import { TopicRow } from "@/components/topic-row";
import { EduLink } from "@/components/edu-link";
import { searchSite } from "@/lib/site-search";
import { useI18n, TOOL_TEXT, localizeTopic } from "@/i18n";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  component: SearchPage,
});

function SearchPage() {
  const { q: qParam } = Route.useSearch();
  const [q, setQ] = useState(qParam ?? "");
  const { t, locale } = useI18n();

  useEffect(() => {
    if (qParam != null) setQ(qParam);
  }, [qParam]);

  const localized = useMemo(
    () => TOPICS.map((topic) => localizeTopic(topic, locale)),
    [locale],
  );

  const indexed = useMemo(
    () => (q.trim() ? searchSite(q, locale, t, 40) : []),
    [q, locale, t],
  );

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return localized;
    const fromIndex = new Set(
      indexed.filter((h) => h.kind === "topic").map((h) => h.href.replace(/^\/t\//, "")),
    );
    return localized.filter((topic) => {
      if (fromIndex.has(topic.id)) return true;
      const hay = [topic.title, topic.tag, topic.meta, topic.num]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [q, localized, indexed]);

  const toolText = TOOL_TEXT[locale];
  const tools = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return TOOLS;
    const fromIndex = new Set(
      indexed
        .filter((h) => h.kind === "tool")
        .map((h) => {
          if (h.href === "/amsler") return "amsler";
          if (h.href === "/iol") return "iol";
          return h.href.split("/").pop() ?? "";
        }),
    );
    return TOOLS.filter((x) => {
      if (fromIndex.has(x.id)) return true;
      const loc = toolText[x.id];
      return `${loc.title}${loc.blurb}${loc.canto}${x.id}`.toLowerCase().includes(needle);
    });
  }, [q, toolText, indexed]);

  return (
    <div className="px-4 pt-5">
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("search")}</h1>
      <label className="relative mt-3 block">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPh")}
          className="h-12 w-full rounded-xl border border-line bg-card pl-10 pr-3 text-[0.95rem] outline-none"
          autoComplete="off"
          type="search"
        />
      </label>
      <p className="mt-3 text-[0.78rem] text-muted">
        {q.trim()
          ? t("searchFound", { n: results.length + tools.length })
          : t("searchIdle", { a: results.length, b: tools.length })}
      </p>
      {tools.length > 0 ? (
        <div className="mt-2 overflow-hidden rounded-xl border border-line bg-card">
          {tools.map((tool) => (
            <ToolHit
              key={tool.id}
              href={tool.href}
              title={toolText[tool.id].title}
              blurb={toolText[tool.id].blurb}
            />
          ))}
        </div>
      ) : null}
      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-card">
        {results.length === 0 ? (
          <p className="px-4 py-8 text-center text-muted">{t("searchEmpty")}</p>
        ) : (
          results.map((topic) => <TopicRow key={topic.id} topic={topic} />)
        )}
      </div>
    </div>
  );
}

function ToolHit({
  href,
  title,
  blurb,
}: {
  href: string;
  title: string;
  blurb: string;
}) {
  const cls =
    "flex items-center gap-3 border-b border-line px-4 py-3.5 no-underline last:border-b-0";
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-[0.78rem] text-muted">{blurb}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-faint" />
    </>
  );
  if (href === "/amsler") return <Link to="/amsler" className={cls}>{body}</Link>;
  if (href === "/iol") return <Link to="/iol" className={cls}>{body}</Link>;
  return (
    <EduLink href={href} className={cls}>
      {body}
    </EduLink>
  );
}
