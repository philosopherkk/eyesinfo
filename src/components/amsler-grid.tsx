import { useId } from "react";

const CELLS = 20;

/** Stroke in viewBox units (scales with chart size). Was 0.045 / 0.08. */
const STROKE_THIN = 0.12;
const STROKE_THICK = 0.2;
const FIXATION_R = 0.34;

export type AmslerFinding = "normal" | "meta" | "central" | "para";

type Props = {
  sizePx: number;
  inverted: boolean;
  label?: string;
  finding?: AmslerFinding;
};

export function AmslerGrid({ sizePx, inverted, label, finding = "normal" }: Props) {
  const uid = useId().replace(/:/g, "");
  const bg = inverted ? "var(--color-amsler-dark)" : "var(--color-amsler-light)";
  const fg = inverted ? "var(--color-amsler-light)" : "var(--color-amsler-dark)";
  const lines = Array.from({ length: CELLS + 1 }, (_, i) => i);
  const scotoma = finding === "central" || finding === "para";
  const sc = finding === "central" ? { cx: 10, cy: 10, r: 3.15 } : { cx: 13.35, cy: 7.55, r: 2.45 };
  const maskId = `amsler-mask-${uid}`;
  const gradId = `amsler-sc-${uid}`;
  // Soft background-coloured veil: missing/blank region, not a painted black blob.
  // White chart → off-white hole; black chart → near-black hole.
  const veil = inverted ? "12,12,12" : "246,244,238";

  return (
    <div className="flex flex-col items-center">
      {label ? (
        <p className="mb-2 text-[0.85rem] font-semibold text-navy">{label}</p>
      ) : null}
      <svg
        width={sizePx}
        height={sizePx}
        viewBox={`0 0 ${CELLS} ${CELLS}`}
        role="img"
        aria-label={ariaFor(finding)}
        className="max-w-full touch-none select-none rounded-sm shadow-sm"
        style={{ background: bg }}
      >
        {scotoma ? (
          <defs>
            <radialGradient id={gradId}>
              <stop offset="0%" stopColor={`rgb(${veil})`} stopOpacity={inverted ? 0.98 : 1} />
              <stop offset="55%" stopColor={`rgb(${veil})`} stopOpacity={inverted ? 0.85 : 0.92} />
              <stop offset="100%" stopColor={`rgb(${veil})`} stopOpacity="0" />
            </radialGradient>
            <mask id={maskId}>
              <rect width={CELLS} height={CELLS} fill="white" />
              <circle cx={sc.cx} cy={sc.cy} r={sc.r * 0.95} fill="black" />
            </mask>
          </defs>
        ) : null}

        <g mask={scotoma ? `url(#${maskId})` : undefined}>
          {finding === "meta" ? (
            <>
              {lines.map((i) => (
                <path
                  key={`h${i}`}
                  d={hPath(i)}
                  fill="none"
                  stroke={fg}
                  strokeWidth={i === 0 || i === CELLS || i === 10 ? STROKE_THICK : STROKE_THIN}
                />
              ))}
              {lines.map((i) => (
                <path
                  key={`v${i}`}
                  d={vPath(i)}
                  fill="none"
                  stroke={fg}
                  strokeWidth={i === 0 || i === CELLS || i === 10 ? STROKE_THICK : STROKE_THIN}
                />
              ))}
            </>
          ) : (
            <>
              {lines.map((i) => (
                <line
                  key={`v${i}`}
                  x1={i}
                  y1={0}
                  x2={i}
                  y2={CELLS}
                  stroke={fg}
                  strokeWidth={i === 0 || i === CELLS || i === 10 ? STROKE_THICK : STROKE_THIN}
                />
              ))}
              {lines.map((i) => (
                <line
                  key={`h${i}`}
                  x1={0}
                  y1={i}
                  x2={CELLS}
                  y2={i}
                  stroke={fg}
                  strokeWidth={i === 0 || i === CELLS || i === 10 ? STROKE_THICK : STROKE_THIN}
                />
              ))}
            </>
          )}
          {finding !== "central" ? <circle cx={10} cy={10} r={FIXATION_R} fill={fg} /> : null}
        </g>

        {scotoma ? <circle cx={sc.cx} cy={sc.cy} r={sc.r * 1.12} fill={`url(#${gradId})`} /> : null}
      </svg>
    </div>
  );
}

function env(x: number, y: number) {
  const dx = x - 11.15;
  const dy = y - 9.35;
  return Math.exp(-(dx * dx + dy * dy) / 7.2);
}

function hPath(y: number) {
  const step = 0.2;
  let d = "";
  for (let x = 0; x <= CELLS; x += step) {
    const e = env(x, y);
    const yy = y + Math.sin(x * 1.55) * 0.72 * e + (x - 11.15) * 0.1 * e;
    d += `${x === 0 ? "M" : "L"}${x.toFixed(2)} ${yy.toFixed(3)} `;
  }
  return d;
}

function vPath(x: number) {
  const step = 0.2;
  let d = "";
  for (let y = 0; y <= CELLS; y += step) {
    const e = env(x, y);
    const xx = x + Math.sin(y * 1.55) * 0.72 * e + (y - 9.35) * 0.1 * e;
    d += `${y === 0 ? "M" : "L"}${xx.toFixed(3)} ${y.toFixed(2)} `;
  }
  return d;
}

function ariaFor(finding: AmslerFinding) {
  if (finding === "meta") return "阿姆斯勒方格示意：視物變形，直線變彎";
  if (finding === "central") return "阿姆斯勒方格示意：中央暗點，正中間缺了一塊";
  if (finding === "para") return "阿姆斯勒方格示意：旁中央暗點，中央圓點仍在、旁邊缺格";
  return "阿姆斯勒方格：二十乘二十直線格，中央有注視圓點";
}

export { CELLS, STROKE_THIN, STROKE_THICK };
