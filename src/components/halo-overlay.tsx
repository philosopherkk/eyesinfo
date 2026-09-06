import { NIGHT_LIGHTS, haloScale, type HaloKind } from "@/lib/night-lights";

type Props = {
  kind: HaloKind;
  /** Soft concentric rings around lamps (default on). */
  showHalo?: boolean;
  /** Radial spikes from the same cores (default on; intensity still follows kind). */
  showStarburst?: boolean;
};

/**
 * Night photic phenomena over real lamp positions on /iol/night.jpg.
 * Halo = soft ring(s), dimmer than the lamp core, warm/cool lamp colour only.
 * Starburst = radial spikes that fade outward. No rainbow / neon / white-out.
 */
export function HaloOverlay({ kind, showHalo = true, showStarburst = true }: Props) {
  const s = haloScale(kind);
  const uid = `halo-${kind}`;
  const burstLights = NIGHT_LIGHTS.filter((L) => L.r >= 0.65);
  const spikes = kind === "mf" ? 12 : kind === "edof" ? 10 : 8;

  return (
    <div className="halo-glow pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 56" preserveAspectRatio="none">
        <defs>
          {NIGHT_LIGHTS.map((L, i) => {
            const warm = L.warm > 0.5;
            const col = warm ? "255,196,110" : "255,248,230";
            const ringPeak = 0.26 + s.ring * 0.2;
            const outerPeak = ringPeak * 0.5;
            return (
              <radialGradient
                key={`g-${i}`}
                id={`${uid}-ring-${i}`}
                gradientUnits="userSpaceOnUse"
                cx={L.x}
                cy={(L.y / 100) * 56}
                r={Math.max(3.2, L.r * s.size * 7.2)}
              >
                <stop offset="0%" stopColor={`rgb(${col})`} stopOpacity="0" />
                <stop offset="14%" stopColor={`rgb(${col})`} stopOpacity="0" />
                <stop offset="26%" stopColor={`rgb(${col})`} stopOpacity={ringPeak * 0.4} />
                <stop offset="34%" stopColor={`rgb(${col})`} stopOpacity={ringPeak} />
                <stop offset="46%" stopColor={`rgb(${col})`} stopOpacity={ringPeak * 0.32} />
                {s.rings >= 2 ? (
                  <>
                    <stop offset="58%" stopColor={`rgb(${col})`} stopOpacity={outerPeak * 0.15} />
                    <stop offset="68%" stopColor={`rgb(${col})`} stopOpacity={outerPeak} />
                    <stop offset="82%" stopColor={`rgb(${col})`} stopOpacity={outerPeak * 0.2} />
                  </>
                ) : (
                  <stop offset="62%" stopColor={`rgb(${col})`} stopOpacity={ringPeak * 0.06} />
                )}
                <stop offset="100%" stopColor={`rgb(${col})`} stopOpacity="0" />
              </radialGradient>
            );
          })}

          {showStarburst && s.burst > 0.05
            ? burstLights.flatMap((L, i) => {
                const warm = L.warm > 0.5;
                const col = warm ? "255,200,120" : "255,250,235";
                const cx = L.x;
                const cy = (L.y / 100) * 56;
                const len = Math.max(5.5, L.r * s.size * 9.2);
                return Array.from({ length: spikes }, (_, k) => {
                  const a = (k * Math.PI * 2) / spikes + (i % 2) * 0.07;
                  const x2 = cx + Math.cos(a) * len;
                  const y2 = cy + Math.sin(a) * len;
                  return (
                    <linearGradient
                      key={`sg-${i}-${k}`}
                      id={`${uid}-spk-${i}-${k}`}
                      gradientUnits="userSpaceOnUse"
                      x1={cx}
                      y1={cy}
                      x2={x2}
                      y2={y2}
                    >
                      <stop offset="0%" stopColor={`rgb(${col})`} stopOpacity={0.5 * s.burst} />
                      <stop offset="40%" stopColor={`rgb(${col})`} stopOpacity={0.22 * s.burst} />
                      <stop offset="100%" stopColor={`rgb(${col})`} stopOpacity="0" />
                    </linearGradient>
                  );
                });
              })
            : null}
        </defs>

        {showHalo
          ? NIGHT_LIGHTS.map((L, i) => {
              const cx = L.x;
              const cy = (L.y / 100) * 56;
              const r = Math.max(3.2, L.r * s.size * 7.2);
              return (
                <circle
                  key={`h-${i}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={`url(#${uid}-ring-${i})`}
                  opacity={s.opacity * (0.7 + L.r * 0.18)}
                />
              );
            })
          : null}

        {showStarburst && s.burst > 0.05
          ? burstLights.map((L, i) => {
              const cx = L.x;
              const cy = (L.y / 100) * 56;
              const len = Math.max(5.5, L.r * s.size * 9.2);
              const halfW = kind === "mf" ? 0.22 : 0.16;
              return (
                <g key={`b-${i}`} opacity={Math.min(0.8, 0.32 + s.burst * 0.4)}>
                  {Array.from({ length: spikes }, (_, k) => {
                    const a = (k * Math.PI * 2) / spikes + (i % 2) * 0.07;
                    const tipX = cx + Math.cos(a) * len;
                    const tipY = cy + Math.sin(a) * len;
                    const ox = Math.sin(a) * halfW;
                    const oy = -Math.cos(a) * halfW;
                    return (
                      <path
                        key={k}
                        d={`M ${cx + ox} ${cy + oy} L ${tipX} ${tipY} L ${cx - ox} ${cy - oy} Z`}
                        fill={`url(#${uid}-spk-${i}-${k})`}
                      />
                    );
                  })}
                </g>
              );
            })
          : null}
      </svg>
    </div>
  );
}
