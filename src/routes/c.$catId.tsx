import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES, topicsByCategory, type CategoryId } from "@/data/topics";
import { TopicRow } from "@/components/topic-row";
import { EditorialFooter } from "@/components/editorial-footer";
import { LegalBanner } from "@/components/legal-banner";
import { useI18n } from "@/i18n";
import type { UiKey } from "@/i18n/ui";

export const Route = createFileRoute("/c/$catId")({
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
      <div className="mx-4 mt-3 overflow-hidden rounded-xl border border-line bg-card">
        {topics.map((topic) => (
          <TopicRow key={topic.id} topic={topic} />
        ))}
      </div>
      <div className="px-4 pb-8">
        <EditorialFooter />
        <LegalBanner compact />
      </div>
    </div>
  );
}
