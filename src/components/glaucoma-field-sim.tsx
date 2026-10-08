import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { toHans } from "@/i18n/hans";
import { walkStrings } from "@/i18n/walk";
import { GFS_TEXT, type GfsText } from "@/i18n/glaucoma-field-sim-text";
import { TopicRefs } from "@/components/topic-refs";
import {
  CHART_RADIUS,
  CHART_STEP,
  buildLossGrid,
  chartTiles,
  composeScene,
  lerpGrid,
  prepareScene,
  type FieldPattern,
  type FieldSeverity,
  type RenderStyle,
  type SceneBuffers,
} from "@/lib/glaucoma-field";

const W = 640;
const H = 360;
const GW = 128;
const GH = 72;
const SCENE_SRC = "/iol/street.jpg";

const PATTERNS: FieldPattern[] = ["arcuate", "nasal", "peripheral"];
const SEVERITIES: FieldSeverity[] = [0, 1, 2, 3];

const IOP_MIN = 10;
const IOP_MAX = 35;
const IOP_FRAC = (v: number) => (v - IOP_MIN) / (IOP_MAX - IOP_MIN);

type Mark =
  | { kind: "band"; from: number; to: number }
  | { kind: "tick"; at: number }
  | { kind: "cap"; at: number };
const AXIS_MARKS: Mark[][] = [
  [
    { kind: "tick", at: 20 },
    { kind: "cap", at: 30 },
  ],
  [{ kind: "band", from: 24, to: 32 }],
  [{ kind: "tick", at: 20 }],
];

const REF_IDS = [
  "crabb2013",
  "hu2014",
  "kerrigan2000",
  "kastner2020",
  "brusini2007",
  "mills2006",
  "agis2",
  "garwayheath2000",
  "emgt2002",
  "emgt2003",
  "emgt2007",
  "agis7",
  "cntgs1998a",
  "cntgs1998",
  "ohts2002",
  "ukgts2015",
  "heijl2013",
];

function useGfsText(): GfsText {
  const { locale } = useI18n();
  return useMemo(() => {
    if (locale === "en") return GFS_TEXT.en;
    if (locale === "ja") return GFS_TEXT.ja;
    if (locale === "zh-Hans") return walkStrings(GFS_TEXT["zh-Hant"], toHans);
    return GFS_TEXT["zh-Hant"];
  }, [locale]);
}

function zoneIndex(v: number): number {
  if (v <= 17) return 0;
  if (v <= 21) return 1;
  if (v <= 30) return 2;
  return 3;
}

function FieldCanvas({
  pattern,
  severity,
  style,
  compare,
  label,
}: {
  pattern: FieldPattern;
  severity: FieldSeverity;
  style: RenderStyle;
  compare: boolean;
  label: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneBuffers | null>(null);
  const imageRef = useRef<ImageData | null>(null);
  const curRef = useRef<Float32Array>(new Float32Array(GW * GH));
  const firstRef = useRef(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let dead = false;
    const img = new Image();
    img.onload = () => {
      if (dead) return;
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const ox = off.getContext("2d", { willReadFrequently: true });
      if (!ox) return;
      ox.drawImage(img, 0, 0, W, H);
      sceneRef.current = prepareScene(ox.getImageData(0, 0, W, H).data, W, H);
      setReady(true);
    };
    img.src = SCENE_SRC;
    return () => {
      dead = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!ready || !canvas || !scene) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!imageRef.current) imageRef.current = ctx.createImageData(W, H);
    const image = imageRef.current;
    const target = compare ? new Float32Array(GW * GH) : buildLossGrid(pattern, severity, GW, GH);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce || firstRef.current ? 0 : 280;
    firstRef.current = false;
    const from = Float32Array.from(curRef.current);
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = duration ? Math.min(1, (now - t0) / duration) : 1;
      lerpGrid(curRef.current, from, target, t * t * (3 - 2 * t));
      composeScene(image.data, scene, curRef.current, GW, GH, style);
      ctx.putImageData(image, 0, 0);
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [ready, pattern, severity, style, compare]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      role="img"
      aria-label={label}
      className="block aspect-video w-full bg-navy/20"
    />
  );
}

function FieldChart({
  pattern,
  severity,
  title,
  caption,
}: {
  pattern: FieldPattern;
  severity: FieldSeverity;
  title: string;
  caption: string;
}) {
  const tiles = useMemo(() => chartTiles(pattern, severity), [pattern, severity]);
  const half = CHART_STEP / 2;
  const R = CHART_RADIUS + 2;
  return (
    <figure className="flex items-center gap-3">
      <svg
        viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`}
        className="size-28 shrink-0 rounded-full bg-[#f2f0ea] ring-1 ring-line sm:size-32"
        role="img"
        aria-label={title}
      >
        <clipPath id="gfs-chart-clip">
          <circle r={CHART_RADIUS + 1} />
        </clipPath>
        <g clipPath="url(#gfs-chart-clip)">
          {tiles.map((t) => {
            const g = Math.round(26 + t.v * 212);
            return (
              <rect
                key={`${t.x},${t.y}`}
                x={t.x - half}
                y={-t.y - half}
                width={CHART_STEP}
                height={CHART_STEP}
                fill={`rgb(${g},${g},${g})`}
              />
            );
          })}
        </g>
        <path d={`M${-R},0H${R}M0,${-R}V${R}`} stroke="rgba(0,49,83,0.35)" strokeWidth="0.5" />
        <circle r={CHART_RADIUS + 1} fill="none" stroke="rgba(0,49,83,0.55)" strokeWidth="0.8" />
      </svg>
      <figcaption className="min-w-0 text-[0.76rem] leading-relaxed text-muted">
        <span className="block font-semibold text-navy">{title}</span>
        {caption}
      </figcaption>
    </figure>
  );
}

function Seg<T extends string | number>({
  items,
  value,
  onChange,
  cols,
  tall,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  cols: string;
  tall?: boolean;
}) {
  return (
    <div className={cn("grid gap-2", cols)}>
      {items.map((it) => (
        <button
          key={String(it.id)}
          type="button"
          aria-pressed={value === it.id}
          onClick={() => onChange(it.id)}
          className={cn(
            "rounded-xl border px-1.5 text-[0.8rem] font-semibold leading-tight",
            tall ? "min-h-12" : "min-h-11",
            value === it.id ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

function IopPanel({ text }: { text: GfsText }) {
  const [iop, setIop] = useState(20);
  const zone = text.iopZones[zoneIndex(iop)];
  const frac = IOP_FRAC(iop);
  const pos = (v: number) => `${IOP_FRAC(v) * 100}%`;

  return (
    <section
      className="mt-8 rounded-xl border border-line bg-card px-3.5 py-4"
      aria-labelledby="gfs-iop"
    >
      <h2 id="gfs-iop" className="text-[1rem] font-semibold leading-snug text-navy">
        {text.iopTitle}
      </h2>
      <p className="mt-3 rounded-lg border-2 border-danger bg-danger-bg px-3 py-2.5 text-[0.88rem] font-semibold leading-relaxed text-danger">
        {text.iopBig}
      </p>
      <p className="mt-3 text-[0.82rem] leading-relaxed text-muted">{text.iopNoLink}</p>

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor="gfs-iop-range" className="text-[0.85rem] font-semibold text-navy">
            {text.iopSlider}
          </label>
          <output
            htmlFor="gfs-iop-range"
            className="text-[1.25rem] font-semibold tabular-nums text-navy"
          >
            {iop} <span className="text-[0.8rem] font-medium text-muted">{text.iopUnit}</span>
          </output>
        </div>
        <p className="text-[0.74rem] text-muted">{text.iopSliderHint}</p>

        <div className="relative mt-3">
          <div className="space-y-1.5">
            {text.axisRows.map((row, ri) => (
              <div key={row.label} className="flex items-center gap-2">
                <span className="w-14 shrink-0 text-[0.72rem] font-semibold text-navy">
                  {row.label}
                </span>
                <div className="relative h-4 flex-1 rounded bg-line/50">
                  {AXIS_MARKS[ri].map((m, mi) =>
                    m.kind === "band" ? (
                      <span
                        key={mi}
                        className="absolute inset-y-0 rounded bg-steel/70"
                        style={{
                          left: pos(m.from),
                          width: `${(IOP_FRAC(m.to) - IOP_FRAC(m.from)) * 100}%`,
                        }}
                      />
                    ) : m.kind === "tick" ? (
                      <span
                        key={mi}
                        className="absolute inset-y-0 w-1.5 -translate-x-1/2 rounded bg-steel"
                        style={{ left: pos(m.at) }}
                      />
                    ) : (
                      <span
                        key={mi}
                        className="absolute inset-y-[-2px] w-0.5 -translate-x-1/2 bg-steel"
                        style={{ left: pos(m.at) }}
                      />
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-y-[-4px] w-0.5 bg-danger"
            style={{ left: `calc(4rem + (100% - 4rem) * ${frac})` }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-[-4px] border-l border-dashed border-ink/50"
            style={{ left: `calc(4rem + (100% - 4rem) * ${IOP_FRAC(18)})` }}
            aria-hidden
          />
        </div>
        <input
          id="gfs-iop-range"
          type="range"
          min={IOP_MIN}
          max={IOP_MAX}
          step={1}
          value={iop}
          onChange={(e) => setIop(Number(e.target.value))}
          aria-valuetext={`${iop} ${text.iopUnit}`}
          className="ml-16 mt-2 h-8 w-[calc(100%-4rem)] cursor-pointer accent-[var(--color-navy)]"
        />
        <div
          className="relative ml-16 h-4 w-[calc(100%-4rem)] text-[0.68rem] tabular-nums text-muted"
          aria-hidden
        >
          {[10, 15, 20, 25, 30, 35].map((v) => (
            <span key={v} className="absolute -translate-x-1/2" style={{ left: pos(v) }}>
              {v}
            </span>
          ))}
        </div>
        <p className="mt-1 text-[0.7rem] leading-snug text-muted">
          <span className="font-semibold text-navy">{text.axisTitle}</span> ·{" "}
          {text.axisRows.map((r) => `${r.label}: ${r.hint}`).join(" · ")} · {text.axisThreshold}
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-paper px-3 py-3" aria-live="polite">
        <p className="text-[0.74rem] font-semibold uppercase tracking-wide text-steel">
          {text.iopZoneTitle}
        </p>
        <p className="mt-0.5 text-[0.95rem] font-semibold text-navy">{zone.range}</p>
        <ul className="mt-2 list-disc space-y-2 pl-4 text-[0.82rem] leading-relaxed text-ink">
          {zone.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-[0.8rem] leading-relaxed text-muted">{text.iopAlways}</p>

      <h3 className="mt-5 text-[0.9rem] font-semibold text-navy">{text.barsTitle}</h3>
      <ul className="mt-2 space-y-3">
        {text.bars.map((b) => (
          <li key={b.label}>
            <p className="text-[0.78rem] font-semibold text-ink">{b.label}</p>
            {[
              { name: b.a, v: b.av, cls: "bg-steel" },
              { name: b.b, v: b.bv, cls: "bg-navy" },
            ].map((row) => (
              <div key={row.name} className="mt-1 flex items-center gap-2 text-[0.76rem]">
                <span className="w-16 shrink-0 text-muted">{row.name}</span>
                <div className="h-3 flex-1 rounded bg-line/40">
                  <div
                    className={cn("h-3 rounded", row.cls)}
                    style={{ width: `${(row.v / 70) * 100}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right font-semibold tabular-nums text-navy">
                  {row.v}%
                </span>
              </div>
            ))}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[0.75rem] leading-relaxed text-muted">{text.barsNote}</p>
      <p className="mt-3 border-t border-line pt-3 text-[0.75rem] leading-relaxed text-muted">
        {text.iopLimits}
      </p>
    </section>
  );
}

export function GlaucomaFieldSim() {
  const text = useGfsText();
  const { tx } = useI18n();
  const [severity, setSeverity] = useState<FieldSeverity>(0);
  const [pattern, setPattern] = useState<FieldPattern>("arcuate");
  const [style, setStyle] = useState<RenderStyle>("soft");
  const [compare, setCompare] = useState(false);

  const sev = text.sevs[severity];
  const pat = text.patterns[PATTERNS.indexOf(pattern)];
  const badge = compare ? text.compareBadge : `${text.eye} · ${sev.name} · ${pat.name}`;

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">{text.intro}</p>

      <aside
        className="mt-4 rounded-lg border-l-4 border-danger bg-line/25 px-3.5 py-3 text-[0.82rem] leading-relaxed text-ink"
        aria-label={text.simBoxTitle}
      >
        <p className="font-semibold text-danger">{text.simBoxTitle}</p>
        <ul className="mt-1.5 list-disc space-y-1 pl-4">
          {text.simBox.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </aside>

      <p className="mt-5 text-[0.75rem] font-semibold text-steel">{text.sevGroup}</p>
      <div className="mt-1.5">
        <Seg
          cols="grid-cols-4"
          tall
          value={severity}
          onChange={setSeverity}
          items={SEVERITIES.map((s) => ({ id: s, label: text.sevs[s].name }))}
        />
      </div>

      <div className="relative mt-3 overflow-hidden rounded-xl bg-navy">
        <FieldCanvas
          pattern={pattern}
          severity={severity}
          style={style}
          compare={compare}
          label={`${badge}. ${compare ? "" : sev.look}`}
        />
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-white/80 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-white/80 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
        </div>
        <span className="pointer-events-none absolute left-2 top-2 max-w-[92%] rounded bg-navy/80 px-2 py-0.5 text-[0.7rem] font-semibold leading-snug text-paper">
          {badge}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2">
        <button
          type="button"
          aria-pressed={compare}
          onClick={() => setCompare((v) => !v)}
          className={cn(
            "min-h-11 rounded-xl border px-3 text-[0.8rem] font-semibold",
            compare ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
          )}
        >
          {compare ? text.compareOn : text.compareOff}
        </button>
      </div>

      <section
        className="mt-3 rounded-xl border border-line bg-card px-3.5 py-3"
        aria-live="polite"
      >
        <h2 className="text-[1.05rem] font-semibold text-navy">{sev.name}</h2>
        <p className="mt-2 text-[0.84rem] leading-relaxed text-ink">
          <span className="font-semibold text-navy">
            {text.lookLabel}
            {/[A-Za-z]$/.test(text.lookLabel) ? ": " : "："}
          </span>
          {sev.look}
        </p>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">{sev.stage}</p>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">{sev.note}</p>
      </section>

      <p className="mt-5 text-[0.75rem] font-semibold text-steel">{text.patternGroup}</p>
      <div className="mt-1.5">
        <Seg
          cols="grid-cols-3"
          value={pattern}
          onChange={setPattern}
          items={PATTERNS.map((p, i) => ({ id: p, label: text.patterns[i].name }))}
        />
      </div>
      <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">
        {pat.desc} {severity === 3 ? text.patternConverge : null}
      </p>
      <p className="mt-1 text-[0.74rem] leading-relaxed text-faint">{text.patternSimplified}</p>

      <p className="mt-5 text-[0.75rem] font-semibold text-steel">{text.styleGroup}</p>
      <div className="mt-1.5">
        <Seg
          cols="grid-cols-2"
          value={style}
          onChange={setStyle}
          items={[
            { id: "soft" as RenderStyle, label: text.styleSoft },
            { id: "dark" as RenderStyle, label: text.styleDark },
          ]}
        />
      </div>
      <div className="mt-3 rounded-lg bg-line/25 px-3 py-2.5 text-[0.78rem] leading-relaxed text-muted">
        <p className="font-semibold text-navy">{text.perceptionTitle}</p>
        <p className="mt-1">{text.styleWhy}</p>
        <p className="mt-1">{text.perception}</p>
      </div>

      <div className="mt-5">
        <FieldChart
          pattern={pattern}
          severity={severity}
          title={text.chartTitle}
          caption={text.chartCaption}
        />
      </div>

      <Link
        to="/urgent"
        className="mt-5 flex min-h-12 items-center justify-center rounded-xl border border-navy bg-card px-4 text-center text-[0.86rem] font-semibold text-navy no-underline"
      >
        {text.urgent}
      </Link>

      <IopPanel text={text} />

      <TopicRefs ids={REF_IDS} />

      <Link
        to="/t/$topicId"
        params={{ topicId: "d4" }}
        className="mt-5 inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
      >
        {tx("青光眼專題")}
      </Link>
    </div>
  );
}
