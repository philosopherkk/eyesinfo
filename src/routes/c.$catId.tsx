import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES, topicsByCategory, type CategoryId } from "@/data/topics";
import { TopicRow } from "@/components/topic-row";
import { EditorialFooter } from "@/components/editorial-footer";
import { EduLink } from "@/components/edu-link";
import { useI18n } from "@/i18n";
import type { UiKey } from "@/i18n/ui";
import { pageHead } from "@/lib/page-seo";

export const Route = createFileRoute("/c/$catId")({
  head: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.id === params.catId);
    const title = cat?.title ?? "分類";
    const description = cat
      ? `${cat.title}：${cat.subtitle}。香港眼科公眾教育專題。`
      : "眼科教育專題分類。";
    return pageHead({
      title,
      description,
      path: `/c/${params.catId}`,
    });
  },
  component: CategoryPage,
});

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
  surface: {
    label: "cat_surface_research_label",
    text: "cat_surface_research_text",
    link: "cat_surface_research_link",
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
      className="mx-4 mt-3 rounded-lg border border-line bg-line/25 px-3.5 py-3"
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

function CategoryPage() {
  const { catId } = Route.useParams();
  const cat = CATEGORIES.find((c) => c.id === catId);
  if (!cat) throw notFound();
  const topics = topicsByCategory(cat.id as CategoryId);
  const { t } = useI18n();

  return (
    <div>
      <div className="flex items-center gap-2 px-2 pt-3">
        <Link
          to="/"
          className="grid size-10 place-items-center rounded-md text-navy no-underline"
          aria-label={t("back")}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-[1.15rem] font-semibold text-navy">{t(CAT_TITLE[cat.id])}</h1>
          <p className="text-[0.78rem] text-muted">{t(CAT_SUB[cat.id])}</p>
        </div>
      </div>
      {cat.researchNote ? (
        <CategoryResearchNote
          catId={cat.id as CategoryId}
          href={cat.researchNote.href}
        />
      ) : null}
      <div className="mx-4 mt-3 overflow-hidden rounded-xl border border-line bg-card">
        {topics.map((topic) => (
          <TopicRow key={topic.id} topic={topic} />
        ))}
      </div>
      <div className="px-4 pb-8">
        <EditorialFooter />
      </div>
    </div>
  );
}
