import { Link } from "@tanstack/react-router";
import { ChevronRight, Download } from "lucide-react";
import { CATEGORIES, getTopic, TOPICS } from "@/data/topics";
import { TOOLS } from "@/data/tools";
import { FontControl } from "@/components/font-control";
import { ThemeControl } from "@/components/theme-control";
import { TopicRow } from "@/components/topic-row";
import { EyeAnatomyViewer } from "@/components/eye-anatomy-viewer";
import { EmergencyShell } from "@/components/emergency-shell";
import { localizeTopic, useI18n, TOOL_TEXT } from "@/i18n";
import type { UiKey } from "@/i18n/ui";
import { CONTENT_VERSION } from "@/lib/site";
import { EDITORIAL } from "@/data/editorial";

const HOME_TOOLS = TOOLS.filter((t) => t.home);

const CAT_TITLE: Record<string, UiKey> = {
  lens: "cat_lens",
  lid: "cat_lid",
  glaucoma: "cat_glaucoma",
  retina: "cat_retina",
  surface: "cat_surface",
};
const CAT_SUB: Record<string, UiKey> = {
  lens: "cat_lens_sub",
  lid: "cat_lid_sub",
  glaucoma: "cat_glaucoma_sub",
  retina: "cat_retina_sub",
  surface: "cat_surface_sub",
};

/** Lead leaflets on the home hub — hide the whole block if none resolve. */
const NEW_SHEET_IDS: { id: string; labelKey: UiKey }[] = [
  { id: "t-optic-neuritis", labelKey: "leadOpticNeuritis" },
  { id: "t-corneal-transplant", labelKey: "leadCornealTransplant" },
  { id: "t-nystagmus", labelKey: "leadNystagmus" },
  { id: "t-ocular-tumours", labelKey: "leadOcularTumours" },
];

export function HomePage() {
  const featured = TOPICS.filter((t) => t.featured);
  const { t, locale } = useI18n();
  const tools = TOOL_TEXT[locale];

  const newSheets = NEW_SHEET_IDS.flatMap(({ id, labelKey }) => {
    const topic = getTopic(id);
    if (!topic) return [];
    const label = t(labelKey).trim() || localizeTopic(topic, locale).title;
    if (!label) return [];
    return [{ id, label }];
  });

  return (
    <div>
      <section className="px-4 pb-3 pt-4 sm:pb-4 sm:pt-5">
        <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-steel">
          {t("homeKicker")}
        </p>
        <p className="mt-1 text-[0.78rem] text-muted">
          {t("reviewed")}：{EDITORIAL.reviewedIso}
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
            <FontControl />
            <ThemeControl surface="paper" />
            <Link
              to="/install"
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-brand px-3.5 text-[0.8rem] font-semibold text-paper no-underline sm:w-auto"
            >
              <Download className="size-4" />
              {t("install")}
            </Link>
          </div>
        </details>
      </section>

      <div className="mx-4 mb-3 sm:mb-4">
        <EmergencyShell />
      </div>

      <section className="px-4 pb-4">
        <h2 className="mb-2 text-[0.8rem] font-semibold text-muted">{t("tools")}</h2>
        <div className="grid grid-cols-2 gap-2">
          {HOME_TOOLS.map((item) => (
            <HomeTool
              key={item.id}
              href={item.href}
              title={tools[item.id].title}
              blurb={tools[item.id].canto}
            />
          ))}
        </div>
        <Link
          to="/tools"
          className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl border border-line bg-card text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("allTools")}
        </Link>
      </section>

      <section className="px-4 pb-2">
        <h2 className="mb-2 text-[0.8rem] font-semibold text-muted">
          {t("byAnatomy")}
        </h2>
        <EyeAnatomyViewer />
        <Link
          to="/tools/$toolId"
          params={{ toolId: "map" }}
          className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-line bg-card text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("homeAnatomyCta")}
        </Link>
        <div className="mt-3 grid gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/c/$catId"
              params={{ catId: cat.id }}
              className="flex items-center justify-between rounded-xl bg-navy px-4 py-3.5 text-paper no-underline"
            >
              <span>
                <span className="block font-semibold">{t(CAT_TITLE[cat.id])}</span>
                <span className="mt-0.5 block text-[0.78rem] text-paper/70">
                  {t(CAT_SUB[cat.id])}
                </span>
              </span>
              <ChevronRight className="size-5 text-paper/60" />
            </Link>
          ))}
        </div>
      </section>

      {newSheets.length > 0 ? (
        <section className="px-4 pb-4">
          <h2 className="mb-2 text-[0.8rem] font-semibold text-muted">
            {t("newSheets")}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {newSheets.map(({ id, label }) => (
              <Link
                key={id}
                to="/t/$topicId"
                params={{ topicId: id }}
                className="flex min-h-11 items-center rounded-xl border border-line bg-card px-3 py-2 text-[0.82rem] font-semibold text-navy no-underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-1">
        <h2 className="px-4 pb-1 text-[0.8rem] font-semibold text-muted">
          {t("top10")}
        </h2>
        <div className="mx-4 overflow-hidden rounded-xl border border-line bg-card">
          {featured.map((topic) => (
            <TopicRow key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <p className="mx-4 mt-6 mb-4 text-[0.75rem] leading-relaxed text-muted">
        <Link to="/legal" className="text-navy underline">
          {t("legalLink")}
        </Link>
        <span aria-hidden="true"> · </span>
        <Link to="/privacy" className="text-navy underline">
          {t("privacyLink")}
        </Link>
        <span aria-hidden="true"> · </span>
        <Link to="/accessibility" className="text-navy underline">
          {t("a11yLink")}
        </Link>
      </p>
    </div>
  );
}

function HomeTool({
  href,
  title,
  blurb,
}: {
  href: string;
  title: string;
  blurb: string;
}) {
  const cls =
    "flex min-h-14 min-w-0 flex-col justify-center overflow-hidden rounded-xl border border-line bg-card px-3 py-2 no-underline";
  const inner = (
    <>
      <span className="font-semibold leading-snug text-navy">{title}</span>
      <span className="block w-full truncate text-[0.72rem] text-muted">{blurb}</span>
    </>
  );
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
  if (href === "/urgent") {
    return (
      <Link to="/urgent" className={cls}>
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
