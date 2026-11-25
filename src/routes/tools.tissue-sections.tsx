import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  TissueSectionsSim,
  TissueSectionsTeachingCaveat,
  TissueSectionsTeachingFooter,
} from "@/components/tissue-sections-sim";
import { EditorialFooter } from "@/components/editorial-footer";
import { SaveButton } from "@/components/save-button";
import { ShareButton } from "@/components/share-button";
import { toolSaveKey } from "@/lib/saved";
import { useI18n, TOOL_TEXT } from "@/i18n";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch } from "@/lib/locale-path";
import { COPYRIGHT_LINE } from "@/lib/site";
import { seoDescriptionFor } from "@/lib/seo-description";

export const Route = createFileRoute("/tools/tissue-sections")({
  head: ({ match }) => {
    const locale = localeFromMatch(match);
    const pack = TOOL_TEXT[locale]["tissue-sections"];
    return pageHead({
      title: pack.title,
      description: seoDescriptionFor(
        "/tools/tissue-sections",
        locale,
        `${pack.blurb} · ${pack.canto}`,
      ),
      path: "/tools/tissue-sections",
      locale,
    });
  },
  component: TissueSectionsToolPage,
});

function TissueSectionsToolPage() {
  const { t, locale } = useI18n();
  const text = TOOL_TEXT[locale]["tissue-sections"];

  return (
    <div className="pb-8">
      <div className="flex items-center gap-1 px-2 pt-3">
        <Link
          to="/tools"
          className="grid size-10 place-items-center rounded-md text-navy no-underline"
          aria-label={t("backTools")}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="min-w-0 flex-1 text-[1.25rem] font-semibold text-navy">
          {text.title}
        </h1>
        <div className="mr-2 flex shrink-0 items-center gap-1.5">
          <SaveButton saveId={toolSaveKey("tissue-sections")} />
          <ShareButton path="/tools/tissue-sections" pageTitle={text.title} />
        </div>
      </div>
      <p className="px-4 pt-1 text-[0.88rem] leading-relaxed text-muted">
        {text.blurb}
      </p>
      <p className="px-4 text-[0.75rem] text-steel">{text.canto}</p>

      <div className="mt-3 px-4">
        <TissueSectionsTeachingCaveat />
      </div>

      <div className="mt-2 px-4">
        <TissueSectionsSim showChrome={false} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 px-4">
        <Link
          to="/c/$catId"
          params={{ catId: "surface" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("cat_surface")} →
        </Link>
        <Link
          to="/c/$catId"
          params={{ catId: "lens" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("cat_lens")} →
        </Link>
        <Link
          to="/c/$catId"
          params={{ catId: "macula" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("cat_macula")} →
        </Link>
        <Link
          to="/c/$catId"
          params={{ catId: "glaucoma" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("cat_glaucoma")} →
        </Link>
        <Link
          to="/tools/$toolId"
          params={{ toolId: "map" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {TOOL_TEXT[locale].map.title} →
        </Link>
      </div>

      <div className="px-4">
        <TissueSectionsTeachingFooter />
        <p className="mt-2 text-[0.7rem] leading-relaxed text-faint">
          {COPYRIGHT_LINE}
        </p>
        <EditorialFooter />
      </div>
    </div>
  );
}
