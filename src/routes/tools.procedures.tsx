import { useEffect, useRef, useState } from "react";
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

/** Cataract lives in its own HTML viewer; all other clips share procedures-3d. */
type ViewerShell = "cataract" | "bundle";

function viewerShellFor(id: ProcedureId): ViewerShell {
  return id === "cataract" ? "cataract" : "bundle";
}

function buildViewerSrc(
  id: ProcedureId,
  lang: "zh" | "en" | "ja"
): string {
  if (id === "cataract") {
    return `/cataract-phaco.html?lang=${lang}`;
  }
  return `/procedures-3d.html?procedure=${id}&lang=${lang}`;
}

/** Must match `TEACHING_FS_PERSIST_KEY` in public/js/teaching-fullscreen.js */
const TEACHING_FS_PERSIST_KEY = "eyesinfo-teaching-fs-persist";

/**
 * Same-origin iframe: if teaching chrome is fullscreen (native or CSS
 * fallback), mark persist before a document remount so the next viewer
 * restores FS from the user's POV.
 */
function markPersistIfViewerFullscreen(iframe: HTMLIFrameElement | null) {
  try {
    const doc = iframe?.contentDocument;
    if (!doc) return;
    const webkitDoc = doc as Document & {
      webkitFullscreenElement?: Element | null;
    };
    const native = doc.fullscreenElement || webkitDoc.webkitFullscreenElement;
    const chrome = doc.getElementById("teachingChrome");
    const cssOn = chrome?.classList.contains("is-fullscreen");
    if (native || cssOn) {
      sessionStorage.setItem(TEACHING_FS_PERSIST_KEY, "1");
    }
  } catch {
    /* cross-origin or unavailable document */
  }
}

const PROCEDURE_IDS = [
  "rrd",
  "injection",
  "chalazion",
  "cataract",
  "mlt",
  "lpi",
  "yag",
  "retinopexy",
  "elt",
] as const;
type ProcedureId = (typeof PROCEDURE_IDS)[number];

const searchSchema = z.object({
  procedure: z.enum(PROCEDURE_IDS).optional().catch(undefined),
  lang: z.enum(["en", "ja", "zh-Hans", "zh-Hant"]).optional().catch(undefined),
});

/**
 * Procedure viewers accept `?lang=zh|en|ja`.
 * zh-Hans → zh; JA uses dedicated stage copy in the HTML viewers.
 * Cataract line diagrams already have EN / JA / 简 via topic localization.
 */
function procedureViewerLang(locale: Locale): "zh" | "en" | "ja" {
  if (locale === "en") return "en";
  if (locale === "ja") return "ja";
  return "zh";
}

const CHOICES: { id: ProcedureId; hant: string; en: string; ja: string }[] = [
  { id: "cataract", hant: "白內障手術", en: "Cataract surgery", ja: "白内障手術" },
  { id: "rrd", hant: "視網膜脫離", en: "Retinal detachment", ja: "網膜剥離" },
  { id: "injection", hant: "玻璃體內注射", en: "Intravitreal injection", ja: "硝子体内注射" },
  { id: "chalazion", hant: "霰粒腫切開刮除術", en: "Chalazion", ja: "霰粒腫切開掻爬" },
  {
    id: "mlt",
    hant: "微脈衝雷射小樑成形術",
    en: "Micropulse laser trabeculoplasty",
    ja: "マイクロパルスレーザー線維柱帯形成術",
  },
  {
    id: "lpi",
    hant: "雷射周邊虹膜切開術",
    en: "Laser peripheral iridotomy",
    ja: "レーザー周辺虹彩切開術",
  },
  {
    id: "yag",
    hant: "Nd:YAG 雷射後囊切開術",
    en: "Nd:YAG posterior capsulotomy",
    ja: "Nd:YAGレーザー後嚢切開術",
  },
  {
    id: "retinopexy",
    hant: "氬雷射視網膜固定術",
    en: "Argon laser retinopexy",
    ja: "アルゴンレーザー網膜固定術",
  },
  {
    id: "elt",
    hant: "準分子雷射小樑造孔術",
    en: "Excimer laser trabeculostomy",
    ja: "エキシマレーザー線維柱帯造孔術",
  },
];

const HANT = {
  title: "手術教學示意",
  lead: "白內障、視網膜脫離、注射、霰粒腫與五項雷射的示意圖。不是模擬器、不是檢查，亦不是手術操作指引。",
  caveat: "不能代替註冊醫生。不提供診斷、處方、預約、購買或轉介。",
  choose: "選擇手術示意",
  diagrams: "線條結構示意",
};

const EN = {
  title: "Procedure teaching illustration",
  lead: "Schematic illustrations of cataract, retinal detachment, injection, chalazion, and five laser procedures. Not a simulator, not a test, and not an operative guide.",
  caveat:
    "This cannot replace a registered doctor. It does not diagnose, prescribe, book, sell, or refer.",
  choose: "Choose a procedure illustration",
  diagrams: "Line diagrams",
};

const JA = {
  title: "手術の示意図",
  lead: "白内障、網膜剥離、注射、霰粒腫と五つのレーザー示意。シミュレーターでも検査でも手術手技の指針でもありません。",
  caveat: "登録医師の代替にはなりません。診断・処方・予約・販売・紹介は行いません。",
  choose: "示意を選ぶ",
  diagrams: "線図による構造示意",
};

function shellCopy(locale: Locale) {
  if (locale === "en") return EN;
  if (locale === "ja") return JA;
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
  if (locale === "en") return choice.en;
  if (locale === "ja") return choice.ja;
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
  const shell = viewerShellFor(id);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const shellRef = useRef<ViewerShell>(shell);
  const langRef = useRef(viewerLang);
  // Remount only when crossing cataract ↔ bundle (or language changes).
  // Bundle↔bundle procedure swaps stay in-viewer so fullscreen is preserved.
  const [frameSrc, setFrameSrc] = useState(() => buildViewerSrc(id, viewerLang));

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

  useEffect(() => {
    const shellChanged = shellRef.current !== shell;
    const langChanged = langRef.current !== viewerLang;
    shellRef.current = shell;
    langRef.current = viewerLang;

    if (shellChanged || langChanged) {
      setFrameSrc(buildViewerSrc(id, viewerLang));
      return;
    }

    // Same shell: ask the live iframe to swap the clip (keeps #teachingChrome FS).
    if (shell === "bundle") {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "eyesinfo-select-procedure", procedure: id },
        window.location.origin
      );
    }
  }, [id, shell, viewerLang]);

  function chooseProcedure(next: ProcedureId) {
    if (next === id) return;
    const nextShell = viewerShellFor(next);
    // Document remount tears down native FS — mark persist synchronously.
    if (nextShell !== shell) {
      markPersistIfViewerFullscreen(iframeRef.current);
      iframeRef.current?.contentWindow?.postMessage(
        { type: "eyesinfo-prepare-procedure-nav", procedure: next },
        window.location.origin
      );
    }
    void navigate({
      search: (prev) => ({ ...prev, procedure: next }),
      replace: true,
    });
  }

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
              onClick={() => chooseProcedure(choice.id)}
            >
              {choiceLabel(locale, choice)}
            </button>
          );
        })}
      </div>
      <iframe
        ref={iframeRef}
        id="eyesinfo-procedure-viewer"
        src={frameSrc}
        title={copy.title}
        className="procedure-viewer-frame mt-4"
        allow="fullscreen"
        allowFullScreen
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
