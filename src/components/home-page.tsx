import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ChevronRight, Download } from "lucide-react";
import {
  CATEGORIES,
  getTopic,
  topicCardTitle,
  topicsByCategory,
  TOPICS,
  type CategoryId,
  type Topic,
} from "@/data/topics";
import { TOOLS } from "@/data/tools";
import { FontControl } from "@/components/font-control";
import { ThemeControl } from "@/components/theme-control";
import { LayoutControl } from "@/components/layout-control";
import { LangSwitch } from "@/components/lang-switch";
import { TopicRow } from "@/components/topic-row";
import { EmergencyShell } from "@/components/emergency-shell";
import { LocaleHrefLink, SpaHref } from "@/components/locale-href";
import { editorialBits, localizeTopic, useI18n, TOOL_TEXT } from "@/i18n";
import type { UiKey } from "@/i18n/ui";
import { CONTENT_VERSION } from "@/lib/site";
import { hrefWithLang } from "@/lib/locale-path";
import type { Locale } from "@/i18n/locale";
import {
  ANATOMY_RELATED,
  type AnatomyHomeBranchId,
} from "@/data/anatomy-related";

/** Shown on their own pages, not as front-page leaflets. */
const FRONT_PAGE_OMIT = new Set([
  "t-optic-neuritis",
  "t-corneal-transplant",
  "t-nystagmus",
  "t-ocular-tumours",
]);

const HOME_TOOLS = TOOLS.filter((t) => t.home);

const CAT_TITLE: Record<string, UiKey> = {
  lens: "cat_lens",
  lid: "cat_lid",
  glaucoma: "cat_glaucoma",
  retina: "cat_retina",
  surface: "cat_surface",
  macula: "cat_macula",
};
const CAT_SUB: Record<string, UiKey> = {
  lens: "cat_lens_sub",
  lid: "cat_lid_sub",
  glaucoma: "cat_glaucoma_sub",
  retina: "cat_retina_sub",
  surface: "cat_surface_sub",
  macula: "cat_macula_sub",
};

/** Home strip hubs: CATEGORIES + anatomy chooser /c/macula (not a CategoryId). */
const HOME_CATEGORY_HUBS: { id: string }[] = [
  ...CATEGORIES.map((c) => ({ id: c.id })),
  { id: "macula" },
];

export function HomePage() {
  const featured = TOPICS.filter((t) => t.featured);
  const { t, locale } = useI18n();
  const tools = TOOL_TEXT[locale];
  const [openBranch, setOpenBranch] = useState<AnatomyHomeBranchId | null>(null);
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    if (hash.replace(/^#/, "") !== "home-topics") return;
    document.getElementById("home-topics")?.scrollIntoView({ block: "start" });
  }, [hash]);

  useEffect(() => {
    if (!openBranch) return;
    document.getElementById(`anatomy-branch-${openBranch}`)?.scrollIntoView({
      block: "nearest",
    });
  }, [openBranch]);

  return (
    <div>
      <section className="px-4 pb-3 pt-4 sm:pb-4 sm:pt-5 layout-lg:px-6">
        <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-steel">
          {t("homeKicker")}
        </p>
        <p className="mt-1 text-[0.78rem] text-muted">
          {t("reviewed")}
            {locale === "en" ? ": " : "："}
            {editorialBits(locale).reviewed} · {editorialBits(locale).name}
          <span aria-hidden="true"> · </span>
          {t("siteVersionLabel")}：{CONTENT_VERSION}
        </p>
        <h1 className="mt-1 text-[1.45rem] font-semibold leading-tight tracking-tight text-navy sm:text-[1.55rem]">
          {t("homeTitle")}
        </h1>
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted sm:mt-2 sm:text-[0.9rem]">
          {t("homeLead")}
        </p>
        <details className="mt-3 rounded-xl border border-line bg-card open:pb-3">
          <summary className="cursor-pointer list-none px-3.5 py-2.5 text-[0.8rem] font-semibold text-navy marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="inline-flex w-full items-center justify-between gap-2">
              {t("displayOpts")}
              <span className="text-[0.7rem] font-normal text-muted" aria-hidden>
                ▾
              </span>
            </span>
          </summary>
          <div className="space-y-3 border-t border-line/70 px-3.5 pt-3">
            <LangSwitch surface="paper" />
            <FontControl />
            <ThemeControl surface="paper" />
            <LayoutControl surface="paper" />
            <SpaHref
              href={hrefWithLang("/install", locale)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-brand px-3.5 text-[0.8rem] font-semibold text-paper no-underline sm:w-auto"
            >
              <Download className="size-4" />
              {t("install")}
            </SpaHref>
          </div>
        </details>
      </section>

      <div className="mx-4 mb-3 sm:mb-4 layout-lg:mx-6">
        <EmergencyShell />
      </div>

      <section className="px-4 pb-4 layout-lg:px-6">
        <h2 className="mb-2 text-[0.8rem] font-semibold text-muted">{t("tools")}</h2>
        <div className="grid grid-cols-2 gap-2 layout-lg:grid-cols-3 layout-xl:grid-cols-5">
          {HOME_TOOLS.map((item) => (
            <HomeTool
              key={item.id}
              href={item.href}
              title={tools[item.id].title}
              blurb={tools[item.id].canto}
              locale={locale}
            />
          ))}
        </div>
        <LocaleHrefLink
          path="/tools"
          className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl border border-line bg-card text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("allTools")}
        </LocaleHrefLink>
      </section>

      <section className="px-4 pb-2 layout-lg:px-6">
        <h2 className="mb-2 text-[0.8rem] font-semibold text-muted">
          {t("byAnatomy")}
        </h2>
        <LocaleHrefLink
          path="/tools/map"
          className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-line bg-card text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("homeAnatomyCta")}
        </LocaleHrefLink>
        <div
          id="home-topics"
          className="mt-3 grid scroll-mt-24 gap-2 layout-lg:grid-cols-2 layout-xl:grid-cols-3"
        >
          {HOME_CATEGORY_HUBS.map((cat) => (
            <AnatomyBranch
              key={cat.id}
              id={cat.id as AnatomyHomeBranchId}
              title={t(CAT_TITLE[cat.id])}
              subtitle={t(CAT_SUB[cat.id])}
              topics={topicsForHub(cat.id)}
              open={openBranch === cat.id}
              locale={locale}
              onToggle={() =>
                setOpenBranch((current) => (current === cat.id ? null : (cat.id as AnatomyHomeBranchId)))
              }
            />
          ))}
        </div>
      </section>

      <section className="mt-1">
        <h2 className="px-4 pb-1 text-[0.8rem] font-semibold text-muted layout-lg:px-6">
          {t("top10")}
        </h2>
        <div className="mx-4 overflow-hidden rounded-xl border border-line bg-card layout-lg:mx-6 layout-lg:grid layout-lg:grid-cols-2 layout-lg:gap-2 layout-lg:overflow-visible layout-lg:rounded-none layout-lg:border-0 layout-lg:bg-transparent">
          {featured.map((topic) => (
            <TopicRow key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <p className="mx-4 mt-6 mb-4 text-[0.75rem] leading-relaxed text-muted layout-lg:mx-6">
        <LocaleHrefLink path="/legal" className="text-navy underline">
          {t("legalLink")}
        </LocaleHrefLink>
        <span aria-hidden="true"> · </span>
        <LocaleHrefLink path="/privacy" className="text-navy underline">
          {t("privacyLink")}
        </LocaleHrefLink>
        <span aria-hidden="true"> · </span>
        <LocaleHrefLink path="/accessibility" className="text-navy underline">
          {t("a11yLink")}
        </LocaleHrefLink>
        <span aria-hidden="true"> · </span>
        <LocaleHrefLink path="/resources" className="text-navy underline">
          {t("resourcesLink")}
        </LocaleHrefLink>
      </p>
    </div>
  );
}

function topicsForHub(hubId: string): Topic[] {
  const topics =
    hubId === "macula"
      ? (() => {
          const related = ANATOMY_RELATED.macula;
          if (related.kind !== "topics") return [];
          return related.topicIds.flatMap((id) => {
            const topic = getTopic(id);
            return topic ? [topic] : [];
          });
        })()
      : topicsByCategory(hubId as CategoryId);
  return topics.filter((topic) => !FRONT_PAGE_OMIT.has(topic.id));
}

function AnatomyBranch({
  id,
  title,
  subtitle,
  topics,
  open,
  locale,
  onToggle,
}: {
  id: AnatomyHomeBranchId;
  title: string;
  subtitle: string;
  topics: Topic[];
  open: boolean;
  locale: Locale;
  onToggle: () => void;
}) {
  const listId = `anatomy-topics-${id}`;
  return (
    <div id={`anatomy-branch-${id}`} className="overflow-hidden rounded-xl bg-navy">
      <div className="flex items-stretch">
        <LocaleHrefLink
          path={`/c/${id}`}
          className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3.5 text-paper no-underline"
        >
          <span className="block font-semibold">{title}</span>
          <span className="mt-0.5 block text-[0.78rem] text-paper/70">{subtitle}</span>
        </LocaleHrefLink>
        <button
          type="button"
          className="grid w-12 shrink-0 place-items-center text-paper/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={title}
          onClick={onToggle}
        >
          <ChevronRight className={open ? "size-5 rotate-90" : "size-5"} />
        </button>
      </div>
      {topics.length > 0 ? (
        <ul id={listId} hidden={!open} className="border-t border-paper/20 bg-card">
          {topics.map((topic) => {
            const loc = localizeTopic(topic, locale);
            return (
              <li key={topic.id} className="border-b border-line last:border-b-0">
                <LocaleHrefLink
                  path={`/t/${topic.id}`}
                  className="flex min-h-11 items-center px-4 py-2.5 text-[0.85rem] font-semibold text-navy no-underline"
                >
                  {topicCardTitle(loc.title)}
                </LocaleHrefLink>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function HomeTool({
  href,
  title,
  blurb,
  locale,
}: {
  href: string;
  title: string;
  blurb: string;
  locale: import("@/i18n/locale").Locale;
}) {
  const cls =
    "flex min-h-14 min-w-0 flex-col justify-center overflow-hidden rounded-xl border border-line bg-card px-3 py-2 no-underline";
  const inner = (
    <>
      <span className="font-semibold leading-snug text-navy">{title}</span>
      <span className="block w-full truncate text-[0.72rem] text-muted">{blurb}</span>
    </>
  );
  return (
    <SpaHref href={hrefWithLang(href, locale)} className={cls}>
      {inner}
    </SpaHref>
  );
}
