import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  ShallowAcSim,
  ShallowAcTeachingCaveat,
  ShallowAcTeachingFooter,
} from "@/components/shallow-ac-sim";
import { EditorialFooter } from "@/components/editorial-footer";
import { SaveButton } from "@/components/save-button";
import { ShareButton } from "@/components/share-button";
import { toolSaveKey } from "@/lib/saved";
import { useI18n, TOOL_TEXT } from "@/i18n";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch } from "@/lib/locale-path";
import { COPYRIGHT_LINE } from "@/lib/site";
import { seoDescriptionFor } from "@/lib/seo-description";

export const Route = createFileRoute("/tools/shallow-ac")({
  head: ({ match }) => {
    const locale = localeFromMatch(match);
    const pack = TOOL_TEXT[locale]["shallow-ac"];
    return pageHead({
      title: pack.title,
      description: seoDescriptionFor(
        "/tools/shallow-ac",
        locale,
        `${pack.blurb} · ${pack.canto}`,
      ),
      path: "/tools/shallow-ac",
      locale,
    });
  },
  component: ShallowAcToolPage,
});

function ShallowAcToolPage() {
  const { t, locale } = useI18n();
  const text = TOOL_TEXT[locale]["shallow-ac"];

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
          <SaveButton saveId={toolSaveKey("shallow-ac")} />
          <ShareButton path="/tools/shallow-ac" pageTitle={text.title} />
        </div>
      </div>
      <p className="px-4 pt-1 text-[0.88rem] leading-relaxed text-muted">
        {text.blurb}
      </p>
      <p className="px-4 text-[0.75rem] text-steel">{text.canto}</p>

      <div className="mt-3 px-4">
        <ShallowAcTeachingCaveat />
      </div>

      <div className="mt-2 px-4">
        <ShallowAcSim showChrome={false} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 px-4">
        <Link
          to="/t/$topicId"
          params={{ topicId: "t-early" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("shallowAcTopicLink")} →
        </Link>
        <Link
          to="/urgent"
          className="inline-flex h-11 items-center rounded-full border border-danger/40 bg-danger-bg px-4 text-[0.85rem] font-semibold text-danger no-underline"
        >
          {t("urgent")} →
        </Link>
        <Link
          to="/tools/$toolId"
          params={{ toolId: "tunnel" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {TOOL_TEXT[locale].tunnel.title} →
        </Link>
      </div>

      <div className="px-4">
        <ShallowAcTeachingFooter />
        <p className="mt-2 text-[0.7rem] leading-relaxed text-faint">
          {COPYRIGHT_LINE}
        </p>
        <EditorialFooter />
      </div>
    </div>
  );
}
