import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { IolOpticsStudio } from "@/components/iol-optics-studio/iol-optics-studio";
import { EduToolCaveat } from "@/components/edu-tool-caveat";
import { EditorialFooter } from "@/components/editorial-footer";
import { SaveButton } from "@/components/save-button";
import { ShareButton } from "@/components/share-button";
import { toolSaveKey } from "@/lib/saved";
import { useI18n } from "@/i18n";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch } from "@/lib/locale-path";
import { uiText } from "@/lib/ui-text";
import { COPYRIGHT_LINE } from "@/lib/site";
import { seoDescriptionFor } from "@/lib/seo-description";

export const Route = createFileRoute("/iol-optics")({
  head: ({ match }) => {
    const locale = localeFromMatch(match);
    return pageHead({
      title: uiText(locale, "iolOpticsTitle"),
      description: seoDescriptionFor(
        "/iol-optics",
        locale,
        uiText(locale, "iolOpticsLead"),
      ),
      path: "/iol-optics",
      locale,
    });
  },
  component: IolOpticsPage,
});

function IolOpticsPage() {
  const { t } = useI18n();

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
          {t("iolOpticsTitle")}
        </h1>
        <div className="mr-2 flex shrink-0 items-center gap-1.5">
          <SaveButton saveId={toolSaveKey("iolOptics")} />
          <ShareButton path="/iol-optics" pageTitle={t("iolOpticsTitle")} />
        </div>
      </div>
      <p className="px-4 pt-1 text-[0.88rem] leading-relaxed text-muted">
        {t("iolOpticsLead")}
      </p>

      <div className="mt-3 px-4">
        <EduToolCaveat />
      </div>

      <div className="mt-2 px-4">
        <IolOpticsStudio />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 px-4">
        <Link
          to="/iol"
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("iolTitle")} →
        </Link>
        <Link
          to="/tools/$toolId"
          params={{ toolId: "halo" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("iolLinkHalo")} →
        </Link>
      </div>

      <div className="px-4">
        <p className="mt-6 text-[0.78rem] leading-relaxed text-faint">
          {t("iolOpticsFoot")}
        </p>
        <p className="mt-2 text-[0.7rem] leading-relaxed text-faint">
          {COPYRIGHT_LINE}
        </p>
        <EditorialFooter />
      </div>
    </div>
  );
}
