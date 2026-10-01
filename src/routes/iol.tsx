import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { IolScene } from "@/components/iol-scene";
import { IolDefocusChart } from "@/components/iol-chart";
import { EditorialFooter } from "@/components/editorial-footer";
import { SaveButton } from "@/components/save-button";
import { toolSaveKey } from "@/lib/saved";
import { useI18n } from "@/i18n";
import type { UiKey } from "@/i18n/ui";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch } from "@/lib/locale-path";
import { uiText } from "@/lib/ui-text";
import { seoDescriptionFor } from "@/lib/seo-description";
import {
  DEFAULTS,
  FAR_M,
  LENSES,
  MID_OPTIONS,
  NEAR_OPTIONS,
  ORDER,
  contrastLoss,
  encodeHash,
  formatD,
  formatDistance,
  haloParams,
  parseHash,
  resCyl,
  rotBandFromDeg,
  ROT_BAND_DEG,
  sigmaFor,
  sliderToTarget,
  smearAngle,
  smearPx,
  targetToSlider,
  toEye,
  vaInfo,
  veilVisual,
  viewVa,
  warnings,
  type AxisId,
  type LensId,
  type RotBand,
  type SimState,
  type ViewId,
} from "@/lib/iol-optics";

export const Route = createFileRoute("/iol")({
  head: ({ match }) => {
    const locale = localeFromMatch(match);
    return pageHead({
      title: uiText(locale, "iolTitle"),
      description: seoDescriptionFor("/iol", locale, uiText(locale, "toolsLead")),
      path: "/iol",
      locale,
    });
  },
  component: IolPage,
});

const LENS_KEYS: Record<LensId, { title: UiKey; short: UiKey; note: UiKey }> = {
  mono: { title: "iolOpticMono", short: "iolOpticMonoShort", note: "iolOpticMonoNote" },
  enh: { title: "iolOpticEmono", short: "iolOpticEmonoShort", note: "iolOpticEmonoNote" },
  edof: { title: "iolOpticEdof", short: "iolOpticEdofShort", note: "iolOpticEdofNote" },
  tri: { title: "iolOpticMf", short: "iolOpticMfShort", note: "iolOpticMfNote" },
};

const VA_KEY: Record<ReturnType<typeof vaInfo>["txt"], UiKey> = {
  清晰: "iolVaClear",
  尚可: "iolVaOk",
  吃力: "iolVaHard",
  模糊: "iolVaBlur",
  很模糊: "iolVaVery",
};

const BADGE: Record<ReturnType<typeof vaInfo>["cls"], string> = {
  ok: "bg-navy text-paper",
  ok2: "bg-iris text-navy",
  warn: "border border-line bg-card text-steel",
  bad: "bg-danger-bg text-danger",
};

const HALO_KEY: Record<"glow" | "soft" | "rings", UiKey> = {
  glow: "iolHaloGlow",
  soft: "iolHaloSoft",
  rings: "iolHaloRings",
};

function IolPage() {
  const { t } = useI18n();
  const [state, setState] = useState<SimState>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const parsed = parseHash(window.location.hash);
    if (parsed) setState(parsed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const next = `#${encodeHash(state)}`;
    if (window.location.hash === next) return;
    const url = `${window.location.pathname}${window.location.search}${next}`;
    window.history.replaceState(window.history.state, "", url);
  }, [state, ready]);

  const eye = useMemo(() => toEye(state), [state]);
  const pupil = eye.pupil;
  const cyl = resCyl(eye);
  const notes = useMemo(() => warnings(state), [state]);

  function patch(p: Partial<SimState>) {
    setCopied(false);
    setState((s) => ({ ...s, ...p }));
  }

  function badgeFor(va: number): { text: string; cls: string } {
    const info = vaInfo(va);
    return {
      // Live setting: qualitative band only — no slider-linked 6/x or logMAR.
      text: t(VA_KEY[info.txt]),
      cls: BADGE[info.cls],
    };
  }

  const cylActive = state.cyl >= 0.01;
  const activeSettings = state.mv
    ? t("iolActiveSettingsMv", {
        lens: t(LENS_KEYS[state.lens].title),
        light: t(
          state.light === "day"
            ? "iolLightDay"
            : state.light === "dusk"
              ? "iolLightDusk"
              : "iolLightNight",
        ),
        mid: formatDistance(state.mid),
        near: formatDistance(state.near),
        t2: formatD(state.t2),
      })
    : t("iolActiveSettings", {
        lens: t(LENS_KEYS[state.lens].title),
        light: t(
          state.light === "day"
            ? "iolLightDay"
            : state.light === "dusk"
              ? "iolLightDusk"
              : "iolLightNight",
        ),
        mid: formatDistance(state.mid),
        near: formatDistance(state.near),
      });

  const scenesFor = (lensId: LensId) => {
    const L = LENSES[lensId];
    const loss = veilVisual(contrastLoss(L, eye));
    const halo = state.light === "night" ? haloParams(L, eye) : null;
    const rows: {
      id: string;
      title: string;
      sub: string;
      src: string;
      d: number;
      night: boolean;
    }[] = [
      {
        id: "far",
        title: t("iolDistFar"),
        sub: t("iolDistFarSub"),
        src: state.light === "night" ? "/iol/night.jpg" : "/iol/far.jpg",
        d: FAR_M,
        night: state.light === "night",
      },
      {
        id: "mid",
        title: t("iolDistMid"),
        sub: formatDistance(state.mid),
        src: "/iol/mid.jpg",
        d: state.mid,
        night: false,
      },
      {
        id: "near",
        title: t("iolDistNear"),
        sub: formatDistance(state.near),
        src: "/iol/near.jpg",
        d: state.near,
        night: false,
      },
    ];
    return rows.map((row) => {
      const va = viewVa(L, row.d, eye, state.view);
      const b = badgeFor(va);
      return {
        ...row,
        va,
        badge: b.text,
        badgeClass: b.cls,
        sigma: sigmaFor(va),
        smear: smearPx(cyl),
        angle: smearAngle(state.axis),
        contrast: loss.contrast,
        veil: loss.alpha,
        halo: row.night ? halo : null,
      };
    });
  };

  const primaryScenes = scenesFor(state.lens);
  const compareScenes = state.sbs ? scenesFor(state.cmp) : null;
  const markers = [
    { x: defocusAt(FAR_M, state.t1), label: t("iolTableFar") },
    { x: defocusAt(state.mid, state.t1), label: t("iolTableMid") },
    { x: defocusAt(state.near, state.t1), label: t("iolTableNear") },
  ];

  return (
    <div className="iol-page min-w-0 pb-8" data-lens={state.lens} data-light={state.light}>
      <div className="flex items-center gap-1 px-2 pt-3">
        <Link
          to="/"
          className="grid size-11 place-items-center rounded-md text-navy no-underline"
          aria-label={t("back")}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="min-w-0 flex-1 text-[1.25rem] font-semibold text-navy">{t("iolTitle")}</h1>
        <SaveButton saveId={toolSaveKey("iol")} className="mr-2" />
      </div>
      <p className="px-4 pt-1 text-[0.88rem] leading-relaxed text-muted">{t("iolLead")}</p>

      <section className="mt-4 min-w-0 px-4">
        <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolOpticsH")}</h2>
        <div className="iol-lens-grid mt-2 grid grid-cols-2 gap-2">
          {ORDER.map((id) => {
            const keys = LENS_KEYS[id];
            const on = state.lens === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => patch({ lens: id })}
                className={cn(
                  "min-h-11 rounded-xl border px-3 py-2 text-left",
                  on ? "border-navy bg-navy text-paper" : "border-line bg-card text-ink",
                )}
              >
                <span className="block text-[0.88rem] font-semibold">{t(keys.title)}</span>
                <span className={cn("block text-[0.7rem]", on ? "text-paper/75" : "text-muted")}>
                  {t(keys.short)}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">
          {t(LENS_KEYS[state.lens].note)}
        </p>
      </section>

      <section className="mt-5 min-w-0 px-4">
        <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolLightH")}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["day", "iolLightDay"],
              ["dusk", "iolLightDusk"],
              ["night", "iolLightNight"],
            ] as const
          ).map(([id, key]) => (
            <button
              key={id}
              type="button"
              onClick={() => patch({ light: id })}
              className={chip(state.light === id)}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 min-w-0 px-4">
        <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolAgeH")}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["50", "iolAge50"],
              ["60", "iolAge60"],
              ["70", "iolAge70"],
            ] as const
          ).map(([id, key]) => (
            <button
              key={id}
              type="button"
              onClick={() => patch({ age: id })}
              className={chip(state.age === id)}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 min-w-0 px-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolPupilH")}</h2>
          <p className="text-[0.85rem] font-semibold text-navy">
            {t("iolPupilNow", { mm: pupil.toFixed(1) })}
          </p>
        </div>
        <input
          type="range"
          min={2}
          max={7}
          step={0.5}
          value={pupil}
          onChange={(e) => patch({ pupil: Number(e.target.value), pupilAuto: false })}
          className="mt-3 w-full max-w-full accent-[var(--color-navy)]"
          aria-label={t("iolPupilAria")}
        />
        <label className="mt-2 flex min-h-11 items-center gap-2 text-[0.85rem]">
          <input
            type="checkbox"
            className="size-5"
            checked={state.pupilAuto}
            onChange={(e) => patch({ pupilAuto: e.target.checked, pupil })}
          />
          {t("iolPupilAuto")}
        </label>
      </section>

      <section className="mt-5 min-w-0 px-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolTargetH")}</h2>
          <p className="text-[0.85rem] font-semibold text-navy">{formatD(state.t1)}</p>
        </div>
        <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">{t("iolTargetHint")}</p>
        <input
          type="range"
          min={-12}
          max={12}
          step={1}
          value={targetToSlider(state.t1)}
          onChange={(e) => patch({ t1: sliderToTarget(Number(e.target.value)) })}
          className="mt-3 w-full max-w-full accent-[var(--color-navy)]"
          aria-label={t("iolTargetAria")}
        />
        <div className="mt-1 flex justify-between text-[0.7rem] text-faint">
          <span>{t("iolMyope")}</span>
          <span>{t("iolEmme")}</span>
          <span>{t("iolHyper")}</span>
        </div>
        <label className="mt-3 flex min-h-11 items-center gap-2 text-[0.85rem]">
          <input
            type="checkbox"
            className="size-5"
            checked={state.mv}
            onChange={(e) => patch({ mv: e.target.checked })}
          />
          {t("iolMv")}
        </label>
        {state.mv ? (
          <div className="mt-2">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h3 className="text-[0.8rem] font-semibold text-muted">{t("iolT2H")}</h3>
              <p className="text-[0.85rem] font-semibold text-navy">{formatD(state.t2)}</p>
            </div>
            <input
              type="range"
              min={-12}
              max={12}
              step={1}
              value={targetToSlider(state.t2)}
              onChange={(e) => patch({ t2: sliderToTarget(Number(e.target.value)) })}
              className="mt-2 w-full max-w-full accent-[var(--color-navy)]"
              aria-label={t("iolT2Aria")}
            />
          </div>
        ) : null}
      </section>

      <section className="mt-5 min-w-0 px-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolCylH")}</h2>
          <p className="text-[0.85rem] font-semibold text-navy">{state.cyl.toFixed(2)} D</p>
        </div>
        <input
          type="range"
          min={0}
          max={3}
          step={0.25}
          value={state.cyl}
          onChange={(e) => {
            const cyl = Number(e.target.value);
            // 0.00 D must not look like cylinder correction is on.
            if (cyl < 0.01) patch({ cyl: 0, toric: false, rot: 0 });
            else patch({ cyl });
          }}
          className="mt-3 w-full max-w-full accent-[var(--color-navy)]"
          aria-label={t("iolCylAria")}
        />
        {cylActive ? (
          <>
            <label className="mt-2 flex min-h-11 items-center gap-2 text-[0.85rem]">
              <input
                type="checkbox"
                className="size-5"
                checked={state.toric}
                onChange={(e) =>
                  patch({ toric: e.target.checked, rot: e.target.checked ? state.rot : 0 })
                }
              />
              {state.toric ? t("iolToricOn") : t("iolToricOff")}
            </label>
            <h3 className="mt-3 text-[0.8rem] font-semibold text-muted">{t("iolAxisH")}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["h", "iolAxisHori"],
                  ["v", "iolAxisVert"],
                  ["o", "iolAxisObl"],
                ] as const
              ).map(([id, key]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => patch({ axis: id satisfies AxisId })}
                  className={chip(state.axis === id)}
                >
                  {t(key)}
                </button>
              ))}
            </div>
            {state.toric ? (
              <div className="mt-3">
                <h3 className="text-[0.8rem] font-semibold text-muted">{t("iolRotH")}</h3>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={t("iolRotAria")}>
                  {(
                    [
                      ["aligned", "iolRotAligned"],
                      ["little", "iolRotLittle"],
                      ["more", "iolRotMore"],
                    ] as const
                  ).map(([id, key]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => patch({ rot: ROT_BAND_DEG[id satisfies RotBand] })}
                      className={chip(rotBandFromDeg(state.rot) === id)}
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">{t("iolToricOff")}</p>
        )}
        <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">{t("iolToricHint")}</p>
      </section>

      <section className="mt-5 min-w-0 px-4">
        <div className="flex flex-wrap gap-3">
          <label className="min-w-[8.5rem] flex-1 text-[0.8rem] font-semibold text-muted">
            {t("iolMidH")}
            <select
              className="mt-1 h-11 w-full rounded-xl border border-line bg-card px-2 text-[0.85rem] font-medium text-ink"
              value={state.mid}
              onChange={(e) => patch({ mid: Number(e.target.value) })}
            >
              {MID_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {formatDistance(m)}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-[8.5rem] flex-1 text-[0.8rem] font-semibold text-muted">
            {t("iolNearH")}
            <select
              className="mt-1 h-11 w-full rounded-xl border border-line bg-card px-2 text-[0.85rem] font-medium text-ink"
              value={state.near}
              onChange={(e) => patch({ near: Number(e.target.value) })}
            >
              {NEAR_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {formatDistance(m)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="mt-5 min-w-0 px-4">
        <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolViewH")}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["bin", "iolViewBin"],
              ["dom", "iolViewDom"],
              ["non", "iolViewNon"],
            ] as const
          ).map(([id, key]) => (
            <button
              key={id}
              type="button"
              onClick={() => patch({ view: id satisfies ViewId })}
              className={chip(state.view === id)}
            >
              {t(key)}
            </button>
          ))}
        </div>
        <label className="mt-3 flex min-h-11 items-center gap-2 text-[0.85rem]">
          <input
            type="checkbox"
            className="size-5"
            checked={state.dry}
            onChange={(e) => patch({ dry: e.target.checked })}
          />
          {t("iolDry")}
        </label>
      </section>

      <section className="mt-5 min-w-0 px-4">
        <label className="block text-[0.8rem] font-semibold text-muted">
          {t("iolCmpH")}
          <select
            className="mt-1 h-11 w-full max-w-full rounded-xl border border-line bg-card px-2 text-[0.85rem] font-medium text-ink"
            value={state.cmp}
            onChange={(e) => patch({ cmp: e.target.value as LensId })}
          >
            {ORDER.map((id) => (
              <option key={id} value={id}>
                {t(LENS_KEYS[id].title)}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-2 flex min-h-11 items-center gap-2 text-[0.85rem]">
          <input
            type="checkbox"
            className="size-5"
            checked={state.sbs}
            onChange={(e) => patch({ sbs: e.target.checked })}
          />
          {t("iolSbs")}
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className={chip(false)} onClick={() => patch(DEFAULTS)}>
            {t("iolReset")}
          </button>
          <button
            type="button"
            className={chip(copied)}
            onClick={() => {
              const url = window.location.href;
              void navigator.clipboard?.writeText(url).then(
                () => setCopied(true),
                () => setCopied(false),
              );
            }}
          >
            {copied ? t("iolCopied") : t("iolCopy")}
          </button>
        </div>
      </section>

      <p className="mt-5 px-4 text-[0.82rem] leading-relaxed text-navy">{activeSettings}</p>

      <SceneBlock
        label={state.sbs ? `${t("iolRowA")} · ${t(LENS_KEYS[state.lens].title)}` : undefined}
        scenes={primaryScenes}
      />
      {compareScenes ? (
        <SceneBlock
          label={`${t("iolRowB")} · ${t(LENS_KEYS[state.cmp].title)}`}
          scenes={compareScenes}
        />
      ) : null}

      <section className="mt-6 min-w-0 px-4">
        <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolChartH")}</h2>
        <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">{t("iolChartNote")}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-[0.75rem]">
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-0.5 w-6"
              style={{ background: LENSES[state.lens].color }}
            />
            {t(LENS_KEYS[state.lens].title)}
          </span>
          {state.lens === state.cmp ? null : (
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-0.5 w-6 border-t-2 border-dashed"
                style={{ borderColor: LENSES[state.cmp].color }}
              />
              {t(LENS_KEYS[state.cmp].title)}
            </span>
          )}
        </div>
        <div className="iol-scroll mt-2 rounded-xl border border-line bg-card text-ink">
          <IolDefocusChart
            primary={LENSES[state.lens]}
            compare={LENSES[state.cmp]}
            eye={eye}
            primaryName={t(LENS_KEYS[state.lens].title)}
            compareName={t(LENS_KEYS[state.cmp].title)}
            markers={markers}
            lineLabel={t("iolChart020")}
          />
        </div>
      </section>

      <section className="mt-6 min-w-0 px-4">
        <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolTableH")}</h2>
        <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">{t("iolTableCap")}</p>
        <div className="iol-scroll mt-2 rounded-xl border border-line bg-card">
          <table className="w-full min-w-[36rem] border-collapse text-left text-[0.78rem]">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="px-2 py-2 font-semibold">{t("iolTableDesign")}</th>
                <th className="px-2 py-2 font-semibold">{t("iolTableFar")}</th>
                <th className="px-2 py-2 font-semibold">{t("iolTableMid")}</th>
                <th className="px-2 py-2 font-semibold">{t("iolTableNear")}</th>
                <th className="px-2 py-2 font-semibold">{t("iolTableHalo")}</th>
              </tr>
            </thead>
            <tbody>
              {ORDER.map((id) => {
                const L = LENSES[id];
                const far = viewVa(L, FAR_M, eye, "bin");
                const mid = viewVa(L, state.mid, eye, "bin");
                const near = viewVa(L, state.near, eye, "bin");
                const kind = haloParams(L, eye).type;
                return (
                  <tr
                    key={id}
                    className={cn("border-b border-line/70", state.lens === id && "bg-iris/40")}
                  >
                    <th className="px-2 py-2 text-left font-semibold text-navy">
                      <button
                        type="button"
                        className="min-h-11 text-left"
                        onClick={() => patch({ lens: id })}
                      >
                        {t(LENS_KEYS[id].title)}
                      </button>
                    </th>
                    <td className="px-2 py-2">{cell(far, t)}</td>
                    <td className="px-2 py-2">{cell(mid, t)}</td>
                    <td className="px-2 py-2">{cell(near, t)}</td>
                    <td className="px-2 py-2">{t(HALO_KEY[kind])}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[0.75rem] leading-relaxed text-muted">{t("iolTableNote")}</p>
      </section>

      <section className="mt-6 min-w-0 px-4">
        <h2 className="text-[1.05rem] font-semibold text-navy">{t("iolHowH")}</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.88rem] leading-relaxed">
          {notes.length === 0 ? <li>{t("iolWarnNone")}</li> : null}
          {notes.map((n) => (
            <li key={n.id}>
              {n.id === "cyl" ? t("iolWarnCyl", { d: n.d }) : null}
              {n.id === "rot"
                ? t("iolWarnRot", {
                    band: t(n.band === "more" ? "iolRotMore" : "iolRotLittle"),
                  })
                : null}
              {n.id === "diff" ? t("iolWarnDiff") : null}
              {n.id === "hyper" ? t("iolWarnHyper") : null}
              {n.id === "mf" ? t("iolWarnMf") : null}
              {n.id === "mv" ? t("iolWarnMv", { d: n.d }) : null}
              {n.id === "rings" ? t("iolWarnRings") : null}
              {n.id === "edof" ? t("iolWarnEdof") : null}
              {n.id === "dry" ? t("iolWarnDry") : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 min-w-0 px-4">
        <details className="rounded-xl border border-line bg-card px-3">
          <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-navy">
            {t("iolSummaryH")}
          </summary>
          <ul className="space-y-2 pb-3 text-[0.85rem] leading-relaxed">
            {ORDER.map((id) => (
              <li key={id}>
                <span className="font-semibold text-navy">{t(LENS_KEYS[id].title)}</span>
                {" — "}
                {t(LENS_KEYS[id].note)}
              </li>
            ))}
          </ul>
        </details>
        <p className="mt-4 text-[0.78rem] leading-relaxed text-faint">{t("iolLimits")}</p>
      </section>

      <div className="mt-5 flex flex-wrap gap-2 px-4">
        <Link
          to="/t/$topicId"
          params={{ topicId: "t-iol" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("iolLinkDetail")}
        </Link>
        <Link
          to="/t/$topicId"
          params={{ topicId: "t-mfiol" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("iolLinkMf")}
        </Link>
        <Link
          to="/tools/$toolId"
          params={{ toolId: "halo" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          {t("iolLinkHalo")}
        </Link>
      </div>
      <div className="px-4">
        <p className="mt-6 text-[0.78rem] leading-relaxed text-faint">{t("iolFoot")}</p>
        <EditorialFooter lastReviewed="2026-10-01" />
      </div>
    </div>
  );
}

function chip(on: boolean): string {
  return cn(
    "inline-flex min-h-11 items-center justify-center rounded-xl border px-3 text-[0.82rem] font-semibold",
    on ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
  );
}

function SceneBlock({
  label,
  scenes,
}: {
  label?: string;
  scenes: {
    id: string;
    title: string;
    sub: string;
    src: string;
    badge: string;
    badgeClass: string;
    sigma: number;
    smear: number;
    angle: number;
    contrast: number;
    veil: number;
    halo: ReturnType<typeof haloParams> | null;
  }[];
}) {
  return (
    <section className="mt-5 min-w-0 px-4">
      {label ? <h2 className="mb-2 text-[0.85rem] font-semibold text-navy">{label}</h2> : null}
      <div className="iol-scenes">
        {scenes.map((s) => (
          <IolScene
            key={s.id}
            src={s.src}
            title={s.title}
            sub={s.sub}
            badge={s.badge}
            badgeClass={s.badgeClass}
            sigma={s.sigma}
            smear={s.smear}
            angle={s.angle}
            contrast={s.contrast}
            veil={s.veil}
            halo={s.halo}
          />
        ))}
      </div>
    </section>
  );
}

function cell(va: number, t: (key: UiKey, vars?: Record<string, string | number>) => string) {
  const info = vaInfo(va);
  return <span className="font-semibold">{t(VA_KEY[info.txt])}</span>;
}

function defocusAt(distanceM: number, target: number): number {
  return -1 / distanceM - target;
}
