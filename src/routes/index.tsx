import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Download, ShieldAlert } from "lucide-react";
import { CATEGORIES, TOPICS } from "@/data/topics";
import { TOOLS } from "@/data/tools";
import { FontControl } from "@/components/font-control";
import { TopicRow } from "@/components/topic-row";
import { LegalBanner } from "@/components/legal-banner";
import { useI18n, TOOL_TEXT } from "@/i18n";
import type { UiKey } from "@/i18n/ui";
import { CONTENT_UPDATED, CONTENT_VERSION } from "@/lib/site";

export const Route = createFileRoute("/")({ component: Home });

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

function Home() {
  const featured = TOPICS.filter((t) => t.featured);
  const { t, locale } = useI18n();
  const tools = TOOL_TEXT[locale];

  return (
    <div>
      <section className="px-4 pb-4 pt-5">
        <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-steel">
          {t("homeKicker")}
        </p>
        <p className="mt-1 text-[0.78rem] text-muted">
          {t("contentVer")} {CONTENT_VERSION} · {t("contentUpdated")} {CONTENT_UPDATED}
        </p>
        <h1 className="mt-1 text-[1.55rem] font-semibold leading-tight tracking-tight text-navy">
          {t("homeTitle")}
        </h1>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
          {t("homeLead")}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <FontControl />
          <Link
            to="/install"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-navy px-3.5 text-[0.8rem] font-semibold text-paper no-underline"
          >
            <Download className="size-4" />
            {t("install")}
          </Link>
        </div>
      </section>

      <Link
        to="/urgent"
        className="mx-4 mb-4 flex items-start gap-3 rounded-xl bg-danger px-3.5 py-3 text-paper no-underline"
      >
        <ShieldAlert className="mt-0.5 size-5 shrink-0" />
        <span>
          <span className="block text-[0.9rem] font-semibold">{t("homeUrgentTitle")}</span>
          <span className="mt-0.5 block text-[0.8rem] leading-snug text-paper/90">
            {t("homeUrgentBody")}
          </span>
        </span>
      </Link>

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

      <LegalBanner />

      <section className="px-4 pb-2">
        <h2 className="mb-2 text-[0.8rem] font-semibold text-muted">
          {t("byAnatomy")}
        </h2>
        <div className="grid gap-2">
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

      <section className="mt-5">
        <h2 className="px-4 pb-1 text-[0.8rem] font-semibold text-muted">
          {t("top10")}
        </h2>
        <div className="mx-4 overflow-hidden rounded-xl border border-line bg-card">
          {featured.map((topic) => (
            <TopicRow key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <p className="mx-4 mt-6 mb-4 text-[0.75rem] leading-relaxed text-faint">
        {t("homeFoot")}
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
    "flex min-h-16 flex-col justify-center rounded-xl border border-line bg-card px-3 py-2.5 no-underline";
  if (href === "/amsler") {
    return (
      <Link to="/amsler" className={cls}>
        <span className="font-semibold text-navy">{title}</span>
        <span className="text-[0.72rem] text-muted">{blurb}</span>
      </Link>
    );
  }
  if (href === "/iol") {
    return (
      <Link to="/iol" className={cls}>
        <span className="font-semibold text-navy">{title}</span>
        <span className="text-[0.72rem] text-muted">{blurb}</span>
      </Link>
    );
  }
  if (href === "/urgent") {
    return (
      <Link to="/urgent" className={cls}>
        <span className="font-semibold text-navy">{title}</span>
        <span className="text-[0.72rem] text-muted">{blurb}</span>
      </Link>
    );
  }
  const id = href.split("/").pop() ?? "map";
  return (
    <Link to="/tools/$toolId" params={{ toolId: id }} className={cls}>
      <span className="font-semibold text-navy">{title}</span>
      <span className="text-[0.72rem] text-muted">{blurb}</span>
    </Link>
  );
}
