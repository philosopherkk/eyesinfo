import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Contrast,
  EyeOff,
  Maximize2,
  Printer,
  Smartphone,
  Monitor,
} from "lucide-react";
import { AmslerGrid, type AmslerFinding } from "@/components/amsler-grid";
import { SimDisclaimer } from "@/components/sim-disclaimer";
import { EduToolCaveat } from "@/components/edu-tool-caveat";
import { EditorialFooter } from "@/components/editorial-footer";
import { SaveButton } from "@/components/save-button";
import { usePrefs, type AmslerResult } from "@/lib/prefs";
import { toolSaveKey } from "@/lib/saved";
import { useI18n } from "@/i18n";
import { UI } from "@/i18n/ui";
import { pageHead } from "@/lib/page-seo";

export const Route = createFileRoute("/amsler")({
  head: () =>
    pageHead({
      title: UI["zh-Hant"].amslerTitle,
      description: UI["zh-Hant"].amslerSeoDesc,
      path: "/amsler",
    }),
  component: AmslerPage,
});

const CARD_W_MM = 85.6;
const GRID_MM = 100;
const DEG_PER_CELL = 1;
const TAN1 = Math.tan((DEG_PER_CELL * Math.PI) / 180);

function distanceCm(gridMm: number) {
  const squareMm = gridMm / 20;
  return Math.round(squareMm / TAN1 / 10);
}

function AmslerPage() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const [boxW, setBoxW] = useState(320);
  const [vp, setVp] = useState({ w: 360, h: 640 });
  const [inverted, setInverted] = useState(true);
  const [eye, setEye] = useState<"left" | "right">("right");
  const [testing, setTesting] = useState(false);
  const [cardPx, setCardPx] = useState(220);
  const pxPerMm = usePrefs((s) => s.amslerPxPerMm);
  const setPxPerMm = usePrefs((s) => s.setAmslerPxPerMm);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || testing) return;
    const apply = () => setBoxW(el.clientWidth);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [testing]);

  useEffect(() => {
    const apply = () => {
      const vv = window.visualViewport;
      setVp({
        w: Math.round(vv?.width ?? window.innerWidth),
        h: Math.round(vv?.height ?? window.innerHeight),
      });
    };
    apply();
    window.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("scroll", apply);
    return () => {
      window.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("scroll", apply);
    };
  }, []);

  useEffect(() => {
    if (!testing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [testing]);

  const calibrated = pxPerMm != null && pxPerMm > 0;
  const browseCap = Math.min(boxW, 360);
  const idealPx = calibrated ? GRID_MM * pxPerMm : browseCap;
  // Focus mode: size from the real viewport and cover shell chrome so the
  // grid stays on-screen and large enough to use (old layout kept grid under
  // sticky header / fixed tab bar, often scrolled away or tiny).
  const testFit = Math.max(200, Math.min(vp.w - 32, vp.h - 210));
  const browseGridPx = Math.max(180, Math.min(boxW, idealPx));
  const testGridPx = Math.max(220, Math.min(testFit, calibrated ? idealPx : testFit));
  const gridPx = testing ? testGridPx : browseGridPx;
  const sizeRef = testing ? testFit : Math.max(idealPx, 1);
  const shownMm = calibrated ? gridPx / pxPerMm : GRID_MM * (gridPx / sizeRef);
  const holdCm = distanceCm(shownMm);

  function saveCalibration() {
    setPxPerMm(cardPx / CARD_W_MM);
  }

  if (testing) {
    const onDark = inverted;
    const fg = onDark ? "text-paper" : "text-navy";
    const muted = onDark ? "text-paper/80" : "text-navy/75";
    const ghostBtn = onDark
      ? "border border-paper/35 text-paper"
      : "border border-navy/30 text-navy";
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]"
        style={{
          background: inverted ? "var(--color-amsler-dark)" : "var(--color-amsler-light)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={t("amslerTestAria")}
      >
        <div className="flex shrink-0 items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setTesting(false)}
            className="inline-flex h-11 items-center rounded-full bg-navy px-4 text-[0.85rem] font-semibold text-paper"
          >
            {t("amslerTestEnd")}
          </button>
          <button
            type="button"
            onClick={() => setInverted((v) => !v)}
            className={`inline-flex h-11 items-center gap-1 rounded-full px-3 text-[0.8rem] font-semibold ${ghostBtn}`}
            aria-pressed={inverted}
          >
            <Contrast className="size-4" aria-hidden />
            {t("amslerTestInvert")}
          </button>
        </div>
        <p className={`mt-3 shrink-0 text-center text-[1.05rem] font-semibold ${fg}`}>
          {t("amslerTestCover", {
            eye: eye === "right" ? t("amslerEyeLeft") : t("amslerEyeRight"),
          })}
        </p>
        <p className={`mt-1 shrink-0 text-center text-[0.8rem] ${muted}`}>
          {t("amslerTestHold", { n: holdCm })}
        </p>
        <p className={`mt-1 shrink-0 text-center text-[0.72rem] leading-snug ${muted}`}>
          {t("amslerMidFlowCaveat")}
        </p>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-2">
          <AmslerGrid sizePx={testGridPx} inverted={inverted} />
        </div>
        <div className="mx-auto grid w-full max-w-sm shrink-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setEye((e) => (e === "right" ? "left" : "right"))}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-navy text-[0.9rem] font-semibold text-paper"
          >
            {t("amslerTestSwitch")}
          </button>
          <Link
            to="/urgent"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-danger text-[0.9rem] font-semibold text-paper no-underline"
          >
            {t("amslerTestAbnormal")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="amsler-page pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-1 px-2 pt-3">
        <Link
          to="/"
          className="grid size-11 place-items-center rounded-md text-navy no-underline no-print"
          aria-label={t("back")}
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <h1 className="min-w-0 flex-1 text-[1.25rem] font-semibold text-navy">
          {t("amslerTitle")}
        </h1>
        <SaveButton saveId={toolSaveKey("amsler")} />
        <button
          type="button"
          onClick={() => window.print()}
          className="mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-[0.8rem] font-semibold text-navy no-print"
        >
          <Printer className="size-3.5" aria-hidden />
          {t("printPage")}
        </button>
      </div>

      <div className="amsler-print-keep px-4 pt-2">
        <EduToolCaveat />
      </div>

      <p className="amsler-print-keep px-4 pt-1 text-[0.88rem] leading-relaxed text-muted">
        {t("amslerLead")}
      </p>
      <p className="amsler-print-keep px-4 pt-2 text-[0.85rem] leading-relaxed text-muted">
        {t("amslerMidFlowCaveat")}
      </p>

      <div ref={boxRef} className="amsler-print-keep px-4 pt-4">
        <div className="rounded-xl bg-navy p-3 print:bg-transparent print:p-0">
          <AmslerGrid sizePx={gridPx} inverted={inverted} />
          <p className="mt-3 text-center text-[0.78rem] text-paper/85 print:text-ink">
            {t("amslerDist", { n: holdCm })}
            {calibrated ? t("amslerCal") : t("amslerUncal")}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 no-print">
          <button
            type="button"
            onClick={() => setInverted((v) => !v)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-card text-[0.82rem] font-semibold text-navy"
            aria-pressed={inverted}
          >
            <Contrast className="size-4" aria-hidden />
            {inverted ? t("amslerWhite") : t("amslerBlack")}
          </button>
          <button
            type="button"
            onClick={() => setTesting(true)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy text-[0.82rem] font-semibold text-paper"
          >
            <Maximize2 className="size-4" />
            {t("amslerStart")}
          </button>
        </div>
      </div>

      <div className="no-print">
        <AmslerFindingDemo sizePx={Math.max(200, Math.min(gridPx, 320))} inverted={inverted} />
      </div>

      <section className="mt-6 px-4 no-print">
        <h2 className="text-[1.05rem] font-semibold text-navy">
          {t("amslerCalH")}
        </h2>
        <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">
          {t("amslerCalP")}
        </p>
        <div className="mt-3 rounded-xl border border-line bg-card p-3">
          <div
            className="rounded-sm border-2 border-dashed border-navy bg-paper"
            style={{
              width: cardPx,
              height: cardPx * (54 / CARD_W_MM),
              maxWidth: "100%",
            }}
          />
          <p className="mt-2 text-[0.75rem] text-muted">
            {t("amslerCalCardHint")}
          </p>
          <input
            type="range"
            min={120}
            max={Math.max(200, boxW)}
            value={Math.min(cardPx, boxW)}
            onChange={(e) => setCardPx(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-navy)]"
            aria-label={t("amslerCalSliderAria")}
          />
          <button
            type="button"
            onClick={saveCalibration}
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-navy text-[0.88rem] font-semibold text-paper"
          >
            {t("amslerCalSave")}
          </button>
          {calibrated ? (
            <p className="mt-2 text-[0.78rem] text-steel">
              {t("amslerCalSaved")}
            </p>
          ) : null}
        </div>
      </section>

      <section className="amsler-print-keep mt-6 px-4">
        <h2 className="text-[1.05rem] font-semibold text-navy">{t("amslerStepsH")}</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-[0.9rem] leading-relaxed">
          <li>{t("amslerStep1")}</li>
          <li>{t("amslerStep2")}</li>
          <li>{t("amslerStep3")}</li>
          <li>{t("amslerStep4")}</li>
          <li>{t("amslerStep5")}</li>
          <li>{t("amslerStep6")}</li>
        </ol>
      </section>

      <section className="mt-6 grid gap-3 px-4 no-print">
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="flex items-center gap-2 font-semibold text-navy">
            <Smartphone className="size-4" />
            {t("amslerPhoneH")}
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.88rem] leading-relaxed">
            <li>{t("amslerPhone1")}</li>
            <li>{t("amslerPhone2", { n: holdCm })}</li>
            <li>{t("amslerPhone3")}</li>
            <li>{t("amslerPhone4")}</li>
            <li>{t("amslerPhone5")}</li>
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="flex items-center gap-2 font-semibold text-navy">
            <Monitor className="size-4" />
            {t("amslerPcH")}
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.88rem] leading-relaxed">
            <li>{t("amslerPc1")}</li>
            <li>{t("amslerPc2")}</li>
            <li>{t("amslerPc3")}</li>
            <li>{t("amslerPc4")}</li>
            <li>{t("amslerPc5")}</li>
          </ul>
        </div>
      </section>

      <section className="amsler-print-keep mt-6 px-4">
        <h2 className="text-[1.05rem] font-semibold text-navy">
          {t("amslerAbnormalH")}
        </h2>
        <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">
          {t("amslerAbnormalLead")}
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.9rem] leading-relaxed">
          <li>{t("amslerAbnormal1")}</li>
          <li>{t("amslerAbnormal2")}</li>
          <li>{t("amslerAbnormal3")}</li>
          <li>{t("amslerAbnormal4")}</li>
        </ul>
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-danger-bg px-3 py-3 text-[0.88rem] leading-relaxed text-danger">
          <EyeOff className="mt-0.5 size-4 shrink-0" />
          {t("distortionUrgent")}
        </p>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">
          {t("amslerMidFlowCaveat")}
        </p>
      </section>

      <div className="no-print">
        <AmslerNotebook />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 px-4 no-print">
        <Link
          to="/t/$topicId"
          params={{ topicId: "d5" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("amslerAmdLink")}
        </Link>
      </div>

      <div className="amsler-print-keep px-4">
        <SimDisclaimer />
        <EditorialFooter />
      </div>
    </div>
  );
}

function AmslerNotebook() {
  const { t, locale } = useI18n();
  const notes = usePrefs((s) => s.amslerNotes);
  const add = usePrefs((s) => s.addAmslerNote);
  const clear = usePrefs((s) => s.clearAmslerNotes);
  const last = notes[notes.length - 1];
  const dateLocale =
    locale === "en" ? "en-HK" : locale === "ja" ? "ja-JP" : "zh-HK";

  function save(result: AmslerResult) {
    add(result);
  }

  function resultLabel(result: AmslerResult) {
    if (result === "same") return t("amslerNoteSameShort");
    if (result === "warp") return t("amslerNoteWarpShort");
    return t("amslerNoteSpotShort");
  }

  return (
    <section className="mt-6 px-4">
      <h2 className="text-[1.05rem] font-semibold text-navy">{t("amslerNoteH")}</h2>
      <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">
        {t("amslerNoteLead")}
      </p>
      <div className="mt-3 grid gap-2">
        <button
          type="button"
          onClick={() => save("same")}
          className="min-h-12 rounded-xl border border-line bg-card px-3 text-left text-[0.88rem] font-semibold text-navy"
        >
          {t("amslerNoteSame")}
        </button>
        <button
          type="button"
          onClick={() => save("warp")}
          className="min-h-12 rounded-xl border border-line bg-card px-3 text-left text-[0.88rem] font-semibold text-navy"
        >
          {t("amslerNoteWarp")}
        </button>
        <button
          type="button"
          onClick={() => save("spot")}
          className="min-h-12 rounded-xl border border-line bg-card px-3 text-left text-[0.88rem] font-semibold text-navy"
        >
          {t("amslerNoteSpot")}
        </button>
      </div>
      {last?.result === "warp" || last?.result === "spot" ? (
        <p className="mt-3 rounded-xl bg-danger-bg px-3 py-3 text-[0.88rem] leading-relaxed text-danger">
          {t("distortionUrgent")}
        </p>
      ) : null}
      {notes.length > 0 ? (
        <div className="mt-3">
          <p className="text-[0.75rem] text-muted">{t("amslerNoteRecent")}</p>
          <ul className="mt-1 space-y-1 text-[0.8rem] text-steel">
            {notes.slice(-5).reverse().map((n) => (
              <li key={n.t}>
                {new Date(n.t).toLocaleString(dateLocale)} · {resultLabel(n.result)}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={clear}
            className="mt-2 text-[0.75rem] text-faint underline"
          >
            {t("amslerNoteClear")}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function AmslerFindingDemo({ sizePx, inverted }: { sizePx: number; inverted: boolean }) {
  const { t } = useI18n();
  const [finding, setFinding] = useState<AmslerFinding>("normal");
  const items: { id: AmslerFinding; title: string; en: string }[] = [
    { id: "normal", title: t("amslerFindNormal"), en: "" },
    { id: "meta", title: t("amslerFindMeta"), en: t("amslerFindMetaEn") },
    { id: "central", title: t("amslerFindCentral"), en: t("amslerFindCentralEn") },
    { id: "para", title: t("amslerFindPara"), en: t("amslerFindParaEn") },
  ];
  const caption =
    finding === "meta"
      ? t("amslerFindMetaP")
      : finding === "central"
        ? t("amslerFindCentralP")
        : finding === "para"
          ? t("amslerFindParaP")
          : t("amslerFindLead");

  return (
    <section className="mt-6 px-4">
      <h2 className="text-[1.05rem] font-semibold text-navy">{t("amslerFindH")}</h2>
      <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">{t("amslerFindLead")}</p>
      <div className="mt-3 rounded-xl bg-navy p-3">
        <AmslerGrid sizePx={sizePx} inverted={inverted} finding={finding} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFinding(item.id)}
            className={
              finding === item.id
                ? "min-h-12 rounded-xl border border-navy bg-navy px-2 py-1.5 text-paper"
                : "min-h-12 rounded-xl border border-line bg-card px-2 py-1.5 text-navy"
            }
          >
            <span className="block text-[0.82rem] font-semibold leading-tight">{item.title}</span>
            {item.en ? (
              <span
                className={
                  finding === item.id
                    ? "mt-0.5 block text-[0.68rem] text-paper/75"
                    : "mt-0.5 block text-[0.68rem] text-muted"
                }
              >
                {item.en}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-ink">{caption}</p>
      <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">{t("amslerFindNote")}</p>
    </section>
  );
}
