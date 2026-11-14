import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PalStairsSim } from "@/components/pal-stairs-sim";
import { EduToolCaveat } from "@/components/edu-tool-caveat";
import { EditorialFooter } from "@/components/editorial-footer";
import { SimDisclaimer } from "@/components/sim-disclaimer";
import { SaveButton } from "@/components/save-button";
import { ShareButton } from "@/components/share-button";
import { toolSaveKey } from "@/lib/saved";
import { useI18n, TOOL_TEXT } from "@/i18n";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch } from "@/lib/locale-path";
import { COPYRIGHT_LINE } from "@/lib/site";
import { seoDescriptionFor } from "@/lib/seo-description";

export const Route = createFileRoute("/tools/pal-stairs")({
  head: ({ match }) => {
    const locale = localeFromMatch(match);
    const pack = TOOL_TEXT[locale].palStairs;
    return pageHead({
      title: pack.title,
      description: seoDescriptionFor(
        "/tools/pal-stairs",
        locale,
        `${pack.blurb} · ${pack.canto}`,
      ),
      path: "/tools/pal-stairs",
      locale,
    });
  },
  component: PalStairsToolPage,
});

function PalStairsToolPage() {
  const { t, locale } = useI18n();
  const text = TOOL_TEXT[locale].palStairs;

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
          <SaveButton saveId={toolSaveKey("palStairs")} />
          <ShareButton path="/tools/pal-stairs" pageTitle={text.title} />
        </div>
      </div>
      <p className="px-4 pt-1 text-[0.88rem] leading-relaxed text-muted">
        {text.blurb}
      </p>
      <p className="px-4 text-[0.75rem] text-steel">{text.canto}</p>

      <div className="mt-3 px-4">
        <EduToolCaveat />
      </div>

      <div className="mt-2 px-4">
        <PalStairsSim showChrome={false} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 px-4">
        <Link
          to="/t/$topicId"
          params={{ topicId: "t-pal-stairs" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("palStairsTopicLink")} →
        </Link>
        <Link
          to="/tools/$toolId"
          params={{ toolId: "rx" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {TOOL_TEXT[locale].rx.title} →
        </Link>
      </div>

      <div className="px-4">
        <SimDisclaimer />
        <p className="mt-2 text-[0.7rem] leading-relaxed text-faint">
          {COPYRIGHT_LINE}
        </p>
        <EditorialFooter />
      </div>
    </div>
  );
}
