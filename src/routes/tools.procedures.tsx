import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { EditorialFooter } from "@/components/editorial-footer";
import { toHans } from "@/i18n/hans";
import type { Locale } from "@/i18n/locale";
import { useI18n } from "@/i18n";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch } from "@/lib/locale-path";

const PROCEDURE_IDS = ["rrd", "injection", "chalazion"] as const;
type ProcedureId = (typeof PROCEDURE_IDS)[number];

const searchSchema = z.object({
  procedure: z.enum(PROCEDURE_IDS).optional().catch(undefined),
  lang: z.enum(["en", "ja", "zh-Hans", "zh-Hant"]).optional().catch(undefined),
});

/**
 * KK's viewer is 繁 / EN only (`?lang=zh|en`).
 * ja → en and zh-Hans → zh; this pass does not add Japanese or simplified stage copy.
 */
function procedureViewerLang(locale: Locale): "zh" | "en" {
  if (locale === "en" || locale === "ja") return "en";
  return "zh";
}

const HANT = {
  title: "手術教學示意",
  lead: "三項手術的示意圖。不是模擬器、不是檢查，亦不是手術操作指引。",
  caveat: "不能代替註冊醫生。不提供診斷、處方、預約、購買或轉介。",
};

const EN = {
  title: "Procedure teaching illustration",
  lead: "A schematic illustration of three procedures. Not a simulator, not a test, and not an operative guide.",
  caveat:
    "This cannot replace a registered doctor. It does not diagnose, prescribe, book, sell, or refer.",
};

function shellCopy(locale: Locale) {
  if (locale === "en" || locale === "ja") return EN;
  if (locale === "zh-Hans") {
    return {
      title: toHans(HANT.title),
      lead: toHans(HANT.lead),
      caveat: toHans(HANT.caveat),
    };
  }
  return HANT;
}

export const Route = createFileRoute("/tools/procedures")({
  validateSearch: searchSchema,
  head: ({ match }) => {
    const locale = localeFromMatch(match);
    const copy = shellCopy(locale);
    return pageHead({
      title: copy.title,
      description: `${copy.lead} ${copy.caveat}`,
      path: "/tools/procedures",
      locale,
    });
  },
  component: ProcedureTeachingPage,
});

function ProcedureTeachingPage() {
  const { procedure } = Route.useSearch();
  const { locale } = useI18n();
  const copy = shellCopy(locale);
  const id: ProcedureId = procedure ?? "rrd";
  const src = `/procedures-3d.html?procedure=${id}&lang=${procedureViewerLang(locale)}`;

  return (
    <div className="px-4 pb-8 pt-4 layout-lg:px-6">
      <h1 className="text-[1.2rem] font-semibold text-navy sm:text-[1.35rem]">
        {copy.title}
      </h1>
      <p className="mt-2 max-w-prose text-[0.88rem] leading-relaxed text-muted">
        {copy.lead}
      </p>
      <p className="mt-2 max-w-prose text-[0.88rem] leading-relaxed text-navy">
        {copy.caveat}
      </p>
      <iframe
        id="eyesinfo-procedure-viewer"
        src={src}
        title={copy.title}
        className="procedure-viewer-frame mt-4"
      />
      <EditorialFooter showEdition />
    </div>
  );
}
