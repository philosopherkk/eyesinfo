import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { IolScene } from "@/components/iol-scene";
import { EditorialFooter } from "@/components/editorial-footer";
import { SaveButton } from "@/components/save-button";
import { toolSaveKey } from "@/lib/saved";
import { useI18n } from "@/i18n";
import type { UiKey } from "@/i18n/ui";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/page-seo";
import {
  DISTANCES,
  OPTICS,
  RANGE_STOPS,
  astigDefocus,
  contrastLoss,
  formatD,
  formatDegrees,
  haloStrength,
  sphereDefocus,
  type Optic,
} from "@/lib/iol-optics";

export const Route = createFileRoute("/iol")({
  head: () =>
    pageHead({
      title: "人工晶體視力示意",
      description:
        "單焦目標度數與多焦光暈的教育示意。不是手術建議，亦不能代替面診。",
      path: "/iol",
    }),
  component: IolPage,
});

const TARGETS = Array.from({ length: 25 }, (_, i) =>
  Number((3 - i * 0.25).toFixed(2)),
);

const OPTIC_KEYS: Record<
  Optic,
  { title: UiKey; short: UiKey; note: UiKey }
> = {
  mono: {
    title: "iolOpticMono",
    short: "iolOpticMonoShort",
    note: "iolOpticMonoNote",
  },
  emono: {
    title: "iolOpticEmono",
    short: "iolOpticEmonoShort",
    note: "iolOpticEmonoNote",
  },
  edof: {
    title: "iolOpticEdof",
    short: "iolOpticEdofShort",
    note: "iolOpticEdofNote",
  },
  mf: {
    title: "iolOpticMf",
    short: "iolOpticMfShort",
    note: "iolOpticMfNote",
  },
};

function IolPage() {
  const { t } = useI18n();
  const [optic, setOptic] = useState<Optic>("mono");
  const [target, setTarget] = useState(0);
  const [cyl, setCyl] = useState(0);
  const [toric, setToric] = useState(false);
  const [night, setNight] = useState(false);
  const [glasses, setGlasses] = useState(false);

  const astig = glasses ? 0 : astigDefocus(cyl, toric);
  const contrast = glasses ? 0 : contrastLoss(optic);
  const halo = haloStrength(optic, night);
  const opticKeys = OPTIC_KEYS[optic];

  const scenes = useMemo(
    () =>
      DISTANCES.map((d) => {
        const sph = glasses ? 0 : sphereDefocus(optic, target, d.demand);
        const src = d.id === "far" && night ? "/iol/night.jpg" : d.img;
        const sample =
          d.id === "far"
            ? t("iolSampleFar")
            : d.id === "mid"
              ? t("iolSampleMid")
              : t("iolSampleNear");
        const title =
          d.id === "far"
            ? t("iolDistFar")
            : d.id === "mid"
              ? t("iolDistMid")
              : t("iolDistNear");
        const sub =
          d.id === "far"
            ? t("iolDistFarSub")
            : d.id === "mid"
              ? t("iolDistMidSub")
              : t("iolDistNearSub");
        return { ...d, src, sph, sample, title, sub };
      }),
    [optic, target, glasses, night, t],
  );

  return (
    <div className="pb-8">
      <div className="flex items-center gap-1 px-2 pt-3">
        <Link
          to="/"
          className="grid size-10 place-items-center rounded-md text-navy no-underline"
          aria-label={t("back")}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="min-w-0 flex-1 text-[1.25rem] font-semibold text-navy">
          {t("iolTitle")}
        </h1>
        <SaveButton saveId={toolSaveKey("iol")} className="mr-2" />
      </div>
      <p className="px-4 pt-1 text-[0.88rem] leading-relaxed text-muted">
        {t("iolLead")}
      </p>

      <section className="mt-4 px-4">
        <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolOpticsH")}</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {OPTICS.map((o) => {
            const keys = OPTIC_KEYS[o.id];
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setOptic(o.id)}
                className={cn(
                  "min-h-12 rounded-xl border px-3 py-2 text-left",
                  optic === o.id
                    ? "border-navy bg-navy text-paper"
                    : "border-line bg-card text-ink",
                )}
              >
                <span className="block text-[0.88rem] font-semibold">
                  {t(keys.title)}
                </span>
                <span
                  className={cn(
                    "block text-[0.7rem]",
                    optic === o.id ? "text-paper/75" : "text-muted",
                  )}
                >
                  {t(keys.short)}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">
          {t(opticKeys.note)}
        </p>
      </section>

      <section className="mt-5 px-4">
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolTargetH")}</h2>
          <p className="text-[0.85rem] font-semibold text-navy">
            {formatD(target)} · {formatDegrees(target)}
          </p>
        </div>
        <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">
          {t("iolTargetHint")}
        </p>
        <input
          type="range"
          min={0}
          max={24}
          step={1}
          value={TARGETS.indexOf(target)}
          onChange={(e) => setTarget(TARGETS[Number(e.target.value)] ?? 0)}
          className="mt-3 w-full accent-[var(--color-navy)]"
          aria-label={t("iolTargetAria")}
        />
        <div className="mt-1 flex justify-between text-[0.7rem] text-faint">
          <span>{t("iolHyper")}</span>
          <span>{t("iolEmme")}</span>
          <span>{t("iolMyope")}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { val: 3, label: t("iolTickShort") },
            { val: 0, label: t("iolTickZero") },
            { val: -3, label: t("iolTickNear") },
          ].map((b) => (
            <button
              key={b.val}
              type="button"
              onClick={() => setTarget(b.val)}
              className={cn(
                "h-11 rounded-xl border text-[0.72rem] font-semibold",
                target === b.val
                  ? "border-navy bg-navy text-paper"
                  : "border-line bg-card text-navy",
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-[0.8rem] font-semibold text-muted">{t("iolCylH")}</h2>
          <p className="text-[0.85rem] font-semibold text-navy">
            {cyl.toFixed(2)} D
            {cyl > 0 ? `（${Math.round(cyl * 100)}）` : ""}
          </p>
        </div>
        <input
          type="range"
          min={0}
          max={2.5}
          step={0.25}
          value={cyl}
          onChange={(e) => setCyl(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--color-navy)]"
          aria-label={t("iolCylAria")}
        />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { c: 0, l: t("iolCylNone") },
            { c: 1, l: "1.00 D" },
            { c: 2, l: "2.00 D" },
          ].map((b) => (
            <button
              key={b.c}
              type="button"
              onClick={() => setCyl(b.c)}
              className={cn(
                "h-11 rounded-xl border text-[0.75rem] font-semibold",
                cyl === b.c
                  ? "border-navy bg-navy text-paper"
                  : "border-line bg-card text-navy",
              )}
            >
              {b.l}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setToric((v) => !v)}
          className={cn(
            "mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border text-[0.85rem] font-semibold",
            toric
              ? "border-navy bg-navy text-paper"
              : "border-line bg-card text-navy",
          )}
        >
          {toric ? t("iolToricOn") : t("iolToricOff")}
        </button>
        <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
          {t("iolToricHint")}
        </p>
      </section>

      <section className="mt-4 flex gap-2 px-4">
        <button
          type="button"
          onClick={() => setNight((v) => !v)}
          className={cn(
            "inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border text-[0.82rem] font-semibold",
            night
              ? "border-navy bg-navy text-paper"
              : "border-line bg-card text-navy",
          )}
        >
          {night ? <Moon className="size-4" /> : <Sun className="size-4" />}
          {night ? t("iolNightOn") : t("iolNightOff")}
        </button>
        <button
          type="button"
          onClick={() => setGlasses((v) => !v)}
          className={cn(
            "inline-flex h-11 flex-1 items-center justify-center rounded-xl border text-[0.82rem] font-semibold",
            glasses
              ? "border-navy bg-navy text-paper"
              : "border-line bg-card text-navy",
          )}
        >
          {glasses ? t("iolGlassesOn") : t("iolGlassesOff")}
        </button>
      </section>
      {glasses ? (
        <p className="px-4 pt-2 text-[0.78rem] text-muted">{t("iolGlassesHint")}</p>
      ) : null}

      <section className="mt-5 px-4">
        <h2 className="mb-2 text-[0.8rem] font-semibold text-muted">{t("iolRangeH")}</h2>
        <div className="grid grid-cols-5 gap-1">
          {RANGE_STOPS.map((s) => {
            const d =
              (glasses ? 0 : sphereDefocus(optic, target, s.demand)) + astig;
            const h = Math.max(12, Math.round((1 - Math.min(1, d / 2.2)) * 56));
            return (
              <div key={s.label} className="flex flex-col items-center">
                <div className="flex h-14 items-end">
                  <div
                    className="w-6 rounded-sm bg-navy"
                    style={{ height: h, opacity: 0.35 + (h / 56) * 0.65 }}
                  />
                </div>
                <span className="mt-1 text-[0.65rem] text-muted">{s.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-5 grid gap-3 px-4">
        {scenes.map((s) => (
          <IolScene
            key={s.id}
            src={s.src}
            title={s.title}
            sub={s.sub}
            sample={s.sample}
            sphere={s.sph}
            astig={astig}
            contrast={contrast}
            halo={s.id === "far" ? halo : 0}
            night={s.id === "far" && night}
            optic={optic === "mf" ? "mf" : optic === "edof" ? "edof" : "mono"}
          />
        ))}
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-[1.05rem] font-semibold text-navy">{t("iolHowH")}</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.88rem] leading-relaxed">
          <li>{t("iolHow1")}</li>
          <li>{t("iolHow2")}</li>
          <li>{t("iolHow3")}</li>
          <li>{t("iolHow4")}</li>
          <li>{t("iolHow5")}</li>
          <li>{t("iolHow6")}</li>
        </ul>
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
        <EditorialFooter />
      </div>
    </div>
  );
}
