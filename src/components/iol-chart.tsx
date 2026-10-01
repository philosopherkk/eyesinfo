import { vaAtDefocus, type EyeState, type Lens } from "@/lib/iol-optics";

type Marker = { x: number; label: string };

type Props = {
  primary: Lens;
  compare: Lens;
  eye: EyeState;
  primaryName: string;
  compareName: string;
  markers: Marker[];
  lineLabel: string;
};

const X0 = 1;
const X1 = -4;
const Y0 = -0.2;
const Y1 = 1.3;
const W = 640;
const H = 240;
const L = 36;
const R = 12;
const T = 12;
const B = 28;

function xp(x: number): number {
  return L + ((X0 - x) / (X0 - X1)) * (W - L - R);
}

function yp(va: number): number {
  const c = Math.min(Y1, Math.max(Y0, va));
  return T + ((c - Y0) / (Y1 - Y0)) * (H - T - B);
}

function pathFor(lens: Lens, eye: EyeState): string {
  let d = "";
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const x = X0 + ((X1 - X0) * i) / steps;
    const va = vaAtDefocus(lens, x, eye);
    d += `${i === 0 ? "M" : "L"}${xp(x).toFixed(1)},${yp(va).toFixed(1)}`;
  }
  return d;
}

export function IolDefocusChart({
  primary,
  compare,
  eye,
  primaryName,
  compareName,
  markers,
  lineLabel,
}: Props) {
  const yTicks = [0, 0.2, 0.5, 1];
  const xTicks = [1, 0, -1, -2, -3, -4];
  const same = primary.id === compare.id;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full min-w-[34rem]"
      role="img"
      aria-label={`${primaryName} / ${compareName}`}
    >
      {yTicks.map((y) => (
        <g key={y}>
          <line
            x1={L}
            x2={W - R}
            y1={yp(y)}
            y2={yp(y)}
            stroke="currentColor"
            className="text-line"
            strokeWidth={1}
          />
          <text x={4} y={yp(y) + 3} className="fill-muted" fontSize={10}>
            {y.toFixed(1)}
          </text>
        </g>
      ))}
      <line
        x1={L}
        x2={W - R}
        y1={yp(0.2)}
        y2={yp(0.2)}
        stroke="currentColor"
        className="text-danger"
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={W - R - 4} y={yp(0.2) - 4} textAnchor="end" className="fill-danger" fontSize={10}>
        {lineLabel}
      </text>
      {xTicks.map((x) => (
        <text key={x} x={xp(x)} y={H - 8} textAnchor="middle" className="fill-muted" fontSize={10}>
          {x > 0 ? `+${x}` : x}
        </text>
      ))}
      {markers.map((m) =>
        m.x <= X0 + 0.05 && m.x >= X1 - 0.05 ? (
          <g key={m.label}>
            <line
              x1={xp(m.x)}
              x2={xp(m.x)}
              y1={T}
              y2={H - B}
              stroke="currentColor"
              className="text-steel"
              strokeDasharray="2 3"
              strokeWidth={1}
            />
            <text x={xp(m.x)} y={T + 10} textAnchor="middle" className="fill-steel" fontSize={9}>
              {m.label}
            </text>
          </g>
        ) : null,
      )}
      <path d={pathFor(primary, eye)} fill="none" stroke={primary.color} strokeWidth={2.6} />
      {same ? null : (
        <path
          d={pathFor(compare, eye)}
          fill="none"
          stroke={compare.color}
          strokeWidth={2.2}
          strokeDasharray="7 4"
        />
      )}
    </svg>
  );
}
