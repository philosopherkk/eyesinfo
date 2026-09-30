import { useId } from "react";
import {
  NIGHT_LIGHTS,
  haloScale,
  type HaloKind,
} from "@/lib/night-lights";

type Light = { x: number; y: number; r: number; warm: number };

type Props = {
  kind: HaloKind;
  /** Soft concentric rings around lamps (default on). */
  showHalo?: boolean;
  /** Radial spikes from the same cores (default on; intensity still follows kind). */
  showStarburst?: boolean;
  /** Second, fainter image of each point (multifocal). */
  showGhost?: boolean;
  /** Day scenes keep only a hint. Night is the full illustration. */
  time?: "day" | "night";
  lights?: Light[];
};

function scaled(kind: HaloKind, time: "day" | "night") {
  const s = haloScale(kind);
  if (time === "night") return s;
  return {
    ...s,
    ring: s.ring * 0.12,
    burst: s.burst * 0.08,
    opacity: s.opacity * 0.18,
    glare: s.glare * 0.08,
    ghost: s.ghost * 0.35,
  };
}

/**
 * Photic phenomena over lamp positions.
 * Halo = soft ring(s). Starburst = radial spikes. Glare = a wide dim veil.
 * Ghost = a second, fainter core. Lamp colour only — no rainbow.
 */
export function HaloOverlay({
  kind,
  showHalo = true,
  showStarburst = true,
  showGhost = true,
  time = "night",
  lights = NIGHT_LIGHTS,
}: Props) {
  const s = scaled(kind, time);
  const uid = `halo-${useId().replace(/:/g, "")}`;
  const burstLights = lights.filter((L) => L.r >= 0.65);
  const spikes = s.spikes;

  return (
    <div className="halo-glow pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 56" preserveAspectRatio="none">
        <defs>
          {lights.map((L, i) => {
            const warm = L.warm > 0.5;
            const col = warm ? "255,196,110" : "255,248,230";
            const ringPeak = s.ring < 0.22 ? s.ring * 0.45 : 0.2 + s.ring * 0.22;
            const outerPeak = ringPeak * 0.55;
            return (
              <radialGradient
                key={`g-${i}`}
                id={`${uid}-ring-${i}`}
                gradientUnits="userSpaceOnUse"
                cx={L.x}
                cy={(L.y / 100) * 56}
                r={Math.max(2.4, L.r * s.size * 7.2)}
              >
                <stop offset="0%" stopColor={`rgb(${col})`} stopOpacity="0" />
                <stop offset="18%" stopColor={`rgb(${col})`} stopOpacity="0" />
                <stop offset="28%" stopColor={`rgb(${col})`} stopOpacity={ringPeak * 0.35} />
                <stop offset="36%" stopColor={`rgb(${col})`} stopOpacity={ringPeak} />
                <stop offset="48%" stopColor={`rgb(${col})`} stopOpacity={ringPeak * 0.28} />
                {s.rings >= 2 ? (
                  <>
                    <stop offset="60%" stopColor={`rgb(${col})`} stopOpacity={outerPeak * 0.12} />
                    <stop offset="70%" stopColor={`rgb(${col})`} stopOpacity={outerPeak} />
                    <stop offset="84%" stopColor={`rgb(${col})`} stopOpacity={outerPeak * 0.18} />
                  </>
                ) : (
                  <stop offset="64%" stopColor={`rgb(${col})`} stopOpacity={ringPeak * 0.05} />
                )}
                <stop offset="100%" stopColor={`rgb(${col})`} stopOpacity="0" />
              </radialGradient>
            );
          })}

          {lights.map((L, i) => {
            const warm = L.warm > 0.5;
            const col = warm ? "255,210,140" : "255,250,240";
            return (
              <radialGradient
                key={`gl-${i}`}
                id={`${uid}-glare-${i}`}
                gradientUnits="userSpaceOnUse"
                cx={L.x}
                cy={(L.y / 100) * 56}
                r={Math.max(8, L.r * s.size * 16)}
              >
                <stop offset="0%" stopColor={`rgb(${col})`} stopOpacity={0.55 * s.glare} />
                <stop offset="45%" stopColor={`rgb(${col})`} stopOpacity={0.18 * s.glare} />
                <stop offset="100%" stopColor={`rgb(${col})`} stopOpacity="0" />
              </radialGradient>
            );
          })}

          {showStarburst && s.burst > 0.05 && spikes > 0
            ? burstLights.flatMap((L, i) => {
                const warm = L.warm > 0.5;
                const col = warm ? "255,200,120" : "255,250,235";
                const cx = L.x;
                const cy = (L.y / 100) * 56;
                const len = Math.max(2.4, L.r * s.size * 8.4) * (0.35 + s.burst);
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
                      <stop offset="0%" stopColor={`rgb(${col})`} stopOpacity={0.55 * s.burst} />
                      <stop offset="42%" stopColor={`rgb(${col})`} stopOpacity={0.2 * s.burst} />
                      <stop offset="100%" stopColor={`rgb(${col})`} stopOpacity="0" />
                    </linearGradient>
                  );
                });
              })
            : null}
        </defs>

        {s.glare > 0.08
          ? lights.map((L, i) => {
              const cx = L.x;
              const cy = (L.y / 100) * 56;
              const r = Math.max(8, L.r * s.size * 16);
              return (
                <circle
                  key={`glare-${i}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={`url(#${uid}-glare-${i})`}
                />
              );
            })
          : null}

        {showHalo
          ? lights.map((L, i) => {
              const cx = L.x;
              const cy = (L.y / 100) * 56;
              const r = Math.max(2.4, L.r * s.size * 7.2);
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

        {showGhost && s.ghost > 0.08
          ? lights.map((L, i) => {
              const warm = L.warm > 0.5;
              const col = warm ? "255,196,110" : "255,248,230";
              const cx = L.x + 2.6;
              const cy = (L.y / 100) * 56 - 1.5;
              const r = Math.max(1.1, L.r * 1.35);
              return (
                <circle
                  key={`gh-${i}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={`rgb(${col})`}
                  opacity={0.55 * s.ghost}
                />
              );
            })
          : null}

        {showStarburst && s.burst > 0.05 && spikes > 0
          ? burstLights.map((L, i) => {
              const cx = L.x;
              const cy = (L.y / 100) * 56;
              const len = Math.max(2.4, L.r * s.size * 8.4) * (0.35 + s.burst);
              const halfW = kind === "mf" ? 0.2 : 0.12;
              return (
                <g key={`b-${i}`} opacity={Math.min(0.85, 0.28 + s.burst * 0.45)}>
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
