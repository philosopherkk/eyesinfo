import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ProcedureFrames } from "@/components/procedure-frames";
import { EditorialFooter } from "@/components/editorial-footer";
import { ShareButton } from "@/components/share-button";
import { LocaleHrefLink } from "@/components/locale-href";
import { getTopic } from "@/data/topics";
import type { FrameSpec } from "@/data/topics";
import { toHans } from "@/i18n/hans";
import type { Locale } from "@/i18n/locale";
import { localizeTopic, useI18n } from "@/i18n";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch } from "@/lib/locale-path";

const PROCEDURE_IDS = ["rrd", "injection", "chalazion", "cataract"] as const;
type ProcedureId = (typeof PROCEDURE_IDS)[number];

const searchSchema = z.object({
  procedure: z.enum(PROCEDURE_IDS).optional().catch(undefined),
  lang: z.enum(["en", "ja", "zh-Hans", "zh-Hant"]).optional().catch(undefined),
});

/**
 * The procedure viewers are 繁 / EN only (`?lang=zh|en`).
 * ja → en and zh-Hans → zh; this pass does not add Japanese or simplified stage copy.
 * Cataract is KK's phaco page. Its line diagrams are the procedure-day frames, which already have EN / JA / 简.
 */
function procedureViewerLang(locale: Locale): "zh" | "en" {
  if (locale === "en" || locale === "ja") return "en";
  return "zh";
}

const CHOICES: { id: ProcedureId; hant: string; en: string }[] = [
  { id: "cataract", hant: "白內障手術", en: "Cataract surgery" },
  { id: "rrd", hant: "視網膜脫離", en: "Retinal detachment" },
  { id: "injection", hant: "玻璃體內注射", en: "Intravitreal injection" },
  { id: "chalazion", hant: "霰粒腫切開刮除術", en: "Chalazion" },
];

const HANT = {
  title: "手術教學示意",
  lead: "四項手術的示意圖。不是模擬器、不是檢查，亦不是手術操作指引。",
  caveat: "不能代替註冊醫生。不提供診斷、處方、預約、購買或轉介。",
  choose: "選擇手術示意",
  diagrams: "線條結構示意",
};

const EN = {
  title: "Procedure teaching illustration",
  lead: "A schematic illustration of four procedures. Not a simulator, not a test, and not an operative guide.",
  caveat:
    "This cannot replace a registered doctor. It does not diagnose, prescribe, book, sell, or refer.",
  choose: "Choose a procedure illustration",
  diagrams: "Line diagrams",
};

function shellCopy(locale: Locale) {
  if (locale === "en" || locale === "ja") return EN;
  if (locale === "zh-Hans") {
    return {
      title: toHans(HANT.title),
      lead: toHans(HANT.lead),
      caveat: toHans(HANT.caveat),
      choose: toHans(HANT.choose),
      diagrams: toHans(HANT.diagrams),
    };
  }
  return HANT;
}

function choiceLabel(locale: Locale, choice: (typeof CHOICES)[number]) {
  if (locale === "en" || locale === "ja") return choice.en;
  if (locale === "zh-Hans") return toHans(choice.hant);
  return choice.hant;
}

/** Existing cataract-day diagrams. The note immediately before the frames is the illustration caveat. */
function cataractDiagram(locale: Locale): { note: string; frames: FrameSpec[]; articleTitle: string } | null {
  const topic = getTopic("t-cataract-day");
  if (!topic) return null;
  const loc = localizeTopic(topic, locale);
  const idx = loc.blocks.findIndex((block) => block.type === "frames");
  if (idx < 0) return null;
  const framesBlock = loc.blocks[idx];
  if (framesBlock.type !== "frames") return null;
  let note = "";
  for (let i = idx - 1; i >= 0; i--) {
    const block = loc.blocks[i];
    if (block.type === "note") {
      note = block.text;
      break;
    }
  }
  return { note, frames: framesBlock.frames, articleTitle: loc.title };
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

function isProcedureId(value: unknown): value is ProcedureId {
  return typeof value === "string" && (PROCEDURE_IDS as readonly string[]).includes(value);
}

function ProcedureTeachingPage() {
  const { procedure } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { locale } = useI18n();
  const copy = shellCopy(locale);
  const id: ProcedureId = procedure ?? "cataract";
  const cataract = id === "cataract" ? cataractDiagram(locale) : null;
  const viewerLang = procedureViewerLang(locale);
  const src =
    id === "cataract"
      ? `/cataract-phaco.html?lang=${viewerLang}`
      : `/procedures-3d.html?procedure=${id}&lang=${viewerLang}`;

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; procedure?: unknown } | null;
      if (!data || data.type !== "eyesinfo-procedure") return;
      if (!isProcedureId(data.procedure) || data.procedure === id) return;
      const next = data.procedure;
      void navigate({
        search: (prev) => ({ ...prev, procedure: next }),
        replace: true,
      });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [id, navigate]);

  return (
    <div className="px-4 pb-8 pt-4 layout-lg:px-6">
      <div className="flex items-start gap-2 sm:gap-3">
        <h1 className="min-w-0 flex-1 text-[1.2rem] font-semibold text-navy sm:text-[1.35rem]">
          {copy.title}
        </h1>
        <ShareButton
          path={
            procedure
              ? `/tools/procedures?procedure=${procedure}`
              : "/tools/procedures"
          }
          pageTitle={copy.title}
          className="mt-0.5"
        />
      </div>
      <p className="mt-2 max-w-prose text-[0.88rem] leading-relaxed text-muted">
        {copy.lead}
      </p>
      <p className="mt-2 max-w-prose text-[0.88rem] leading-relaxed text-navy">
        {copy.caveat}
      </p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={copy.choose}>
        {CHOICES.map((choice) => {
          const selected = choice.id === id;
          return (
            <button
              key={choice.id}
              type="button"
              aria-pressed={selected}
              className={
                selected
                  ? "inline-flex h-11 items-center rounded-full border border-navy bg-navy px-4 text-[0.85rem] font-semibold text-paper"
                  : "inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy"
              }
              onClick={() => {
                if (choice.id === id) return;
                void navigate({
                  search: (prev) => ({ ...prev, procedure: choice.id }),
                  replace: true,
                });
              }}
            >
              {choiceLabel(locale, choice)}
            </button>
          );
        })}
      </div>
      <iframe
        id="eyesinfo-procedure-viewer"
        src={src}
        title={copy.title}
        className="procedure-viewer-frame mt-4"
      />
      {id === "cataract" && cataract ? (
        <div className="mt-4">
          <h2 className="text-[1rem] font-semibold text-navy">{copy.diagrams}</h2>
          {cataract.note ? (
            <p className="mt-2 max-w-prose text-[0.88rem] leading-relaxed text-muted">{cataract.note}</p>
          ) : null}
          <ProcedureFrames frames={cataract.frames} />
          <p className="mt-3">
            <LocaleHrefLink path="/t/t-cataract-day" className="text-[0.88rem] font-semibold text-navy underline">
              {cataract.articleTitle}
            </LocaleHrefLink>
          </p>
        </div>
      ) : null}
      <EditorialFooter showEdition />
    </div>
  );
}
