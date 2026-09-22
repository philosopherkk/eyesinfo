import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES, getTopic, topicsByCategory, type CategoryId } from "@/data/topics";
import {
  ANATOMY_CHOOSER_HUB_LABEL,
  ANATOMY_CHOOSER_LEAD,
  ANATOMY_CHOOSER_TITLE,
  ANATOMY_CHOOSER_TOPIC_LABELS,
  ANATOMY_RELATED,
  isAnatomyTopicsChooser,
  type AnatomyRegionId,
} from "@/data/anatomy-related";
import { TopicRow } from "@/components/topic-row";
import { EditorialFooter } from "@/components/editorial-footer";
import { EduLink } from "@/components/edu-link";
import { LocaleHrefLink, SpaHref } from "@/components/locale-href";
import { localizeTopic, useI18n } from "@/i18n";
import type { UiKey } from "@/i18n/ui";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch, pathForLocale } from "@/lib/locale-path";
import { uiText } from "@/lib/ui-text";

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

/** Known hubs: CATEGORIES + anatomy multi-topic choosers (e.g. /c/macula). */
function isKnownCategoryHub(catId: string): boolean {
  return (
    CATEGORIES.some((c) => c.id === catId) || isAnatomyTopicsChooser(catId)
  );
}

export const Route = createFileRoute("/c/$catId")({
  // Throw in beforeLoad so SSR returns HTTP 404 (component-only notFound → hollow 200).
  beforeLoad: ({ params }) => {
    if (!isKnownCategoryHub(params.catId)) throw notFound();
  },
  head: ({ params, match }) => {
    const locale = localeFromMatch(match);
    const cat = CATEGORIES.find((c) => c.id === params.catId);
    if (cat) {
      const title = uiText(locale, CAT_TITLE[cat.id]);
      const sub = uiText(locale, CAT_SUB[cat.id]);
      return pageHead({
        title,
        description: `${title}：${sub}`,
        path: `/c/${params.catId}`,
        locale,
      });
    }
    if (isAnatomyTopicsChooser(params.catId)) {
      const region = params.catId as AnatomyRegionId;
      const title =
        ANATOMY_CHOOSER_TITLE[locale]?.[region] ??
        ANATOMY_CHOOSER_TITLE["zh-Hant"][region] ??
        region;
      const lead =
        ANATOMY_CHOOSER_LEAD[locale]?.[region] ??
        ANATOMY_CHOOSER_LEAD["zh-Hant"][region] ??
        "";
      return pageHead({
        title,
        description: lead,
        path: `/c/${params.catId}`,
        locale,
      });
    }
    // Unknown slug: beforeLoad already threw; keep head defensive.
    throw notFound();
  },
  component: CategoryPage,
});

/** Optional per-category research callout UI keys (label / body / link phrase). */
const CAT_RESEARCH: Partial<
  Record<CategoryId, { label: UiKey; text: UiKey; link: UiKey }>
> = {
  lens: {
    label: "cat_lens_research_label",
    text: "cat_lens_research_text",
    link: "cat_lens_research_link",
  },
  retina: {
    label: "cat_retina_research_label",
    text: "cat_retina_research_text",
    link: "cat_retina_research_link",
  },
};

function CategoryResearchNote({
  catId,
  href,
}: {
  catId: CategoryId;
  href: string;
}) {
  const { t } = useI18n();
  const keys = CAT_RESEARCH[catId];
  if (!keys) return null;
  const label = t(keys.label);
  const text = t(keys.text);
  const linkPhrase = t(keys.link);
  const idx = text.indexOf(linkPhrase);
  return (
    <aside
      className="mx-4 mt-3 rounded-lg border border-line bg-line/25 px-3.5 py-3 layout-lg:mx-6"
      aria-label={label}
    >
      <p className="text-[0.78rem] font-semibold tracking-wide text-navy">
        {label}
      </p>
      <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted">
        {idx < 0 ? (
          text
        ) : (
          <>
            {text.slice(0, idx)}
            <EduLink
              href={href}
              className="font-medium text-navy underline underline-offset-2"
            >
              {linkPhrase}
            </EduLink>
            {text.slice(idx + linkPhrase.length)}
          </>
        )}
      </p>
    </aside>
  );
}

function AnatomyChooserPage({ regionId }: { regionId: AnatomyRegionId }) {
  const { locale, t } = useI18n();
  const related = ANATOMY_RELATED[regionId];
  if (!related || related.kind !== "topics") throw notFound();
  const title =
    ANATOMY_CHOOSER_TITLE[locale]?.[regionId] ??
    ANATOMY_CHOOSER_TITLE["zh-Hant"][regionId] ??
    regionId;
  const lead =
    ANATOMY_CHOOSER_LEAD[locale]?.[regionId] ??
    ANATOMY_CHOOSER_LEAD["zh-Hant"][regionId] ??
    "";
  const labels =
    ANATOMY_CHOOSER_TOPIC_LABELS[locale] ?? ANATOMY_CHOOSER_TOPIC_LABELS["zh-Hant"];
  const hubLabel =
    ANATOMY_CHOOSER_HUB_LABEL[locale] ?? ANATOMY_CHOOSER_HUB_LABEL["zh-Hant"];
  const linkCls =
    "flex min-h-11 items-center border-b border-line px-4 py-3 text-[0.9rem] font-semibold text-navy no-underline last:border-b-0 layout-lg:rounded-xl layout-lg:border layout-lg:border-line layout-lg:bg-card layout-lg:last:border-b";

  return (
    <div>
      <div className="flex items-center gap-2 px-2 pt-3 layout-lg:px-6">
        <SpaHref
          href={pathForLocale(locale)}
          className="grid size-10 place-items-center rounded-md text-navy no-underline"
          aria-label={t("back")}
        >
          <ArrowLeft className="size-5" />
        </SpaHref>
        <div>
          <h1 className="text-[1.15rem] font-semibold text-navy layout-lg:text-[1.35rem]">{title}</h1>
          <p className="max-w-prose text-[0.78rem] text-muted">{lead}</p>
        </div>
      </div>
      <nav
        className="mx-4 mt-3 overflow-hidden rounded-xl border border-line bg-card layout-lg:mx-6 layout-lg:grid layout-lg:grid-cols-2 layout-lg:gap-2 layout-xl:grid-cols-3 layout-lg:overflow-visible layout-lg:rounded-none layout-lg:border-0 layout-lg:bg-transparent"
        aria-label={title}
      >
        {related.topicIds.map((topicId) => {
          const topic = getTopic(topicId);
          const label =
            labels[topicId] ??
            (topic ? localizeTopic(topic, locale).title : topicId);
          return (
            <LocaleHrefLink key={topicId} path={`/t/${topicId}`} className={linkCls}>
              {label}
            </LocaleHrefLink>
          );
        })}
        <LocaleHrefLink path={`/c/${related.hub.catId}`} className={linkCls}>
          {hubLabel}
        </LocaleHrefLink>
      </nav>
      <div className="px-4 pb-8 layout-lg:px-6">
        <EditorialFooter />
      </div>
    </div>
  );
}

function CategoryPage() {
  const { catId } = Route.useParams();
  const cat = CATEGORIES.find((c) => c.id === catId);
  const { t, locale } = useI18n();

  if (!cat && isAnatomyTopicsChooser(catId)) {
    return <AnatomyChooserPage regionId={catId} />;
  }
  if (!cat) throw notFound();

  const topics = topicsByCategory(cat.id as CategoryId);

  return (
    <div>
      <div className="flex items-center gap-2 px-2 pt-3 layout-lg:px-6">
        <SpaHref
          href={pathForLocale(locale)}
          className="grid size-10 place-items-center rounded-md text-navy no-underline"
          aria-label={t("back")}
        >
          <ArrowLeft className="size-5" />
        </SpaHref>
        <div>
          <h1 className="text-[1.15rem] font-semibold text-navy layout-lg:text-[1.35rem]">{t(CAT_TITLE[cat.id])}</h1>
          <p className="text-[0.78rem] text-muted">{t(CAT_SUB[cat.id])}</p>
        </div>
      </div>
      {cat.researchNote ? (
        <CategoryResearchNote
          catId={cat.id as CategoryId}
          href={cat.researchNote.href}
        />
      ) : null}
      <div className="mx-4 mt-3 overflow-hidden rounded-xl border border-line bg-card layout-lg:mx-6 layout-lg:grid layout-lg:grid-cols-2 layout-lg:gap-2 layout-xl:grid-cols-3 layout-lg:overflow-visible layout-lg:rounded-none layout-lg:border-0 layout-lg:bg-transparent">
        {topics.map((topic) => (
          <TopicRow key={topic.id} topic={topic} />
        ))}
      </div>
      <div className="px-4 pb-8 layout-lg:px-6">
        <EditorialFooter />
      </div>
    </div>
  );
}
