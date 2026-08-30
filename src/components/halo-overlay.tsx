import { NIGHT_LIGHTS, haloScale, type HaloKind } from "@/lib/night-lights";

export function HaloOverlay({ kind }: { kind: HaloKind }) {
  const s = haloScale(kind);
  return (
    <div className="halo-glow pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {NIGHT_LIGHTS.map((L, i) => {
        const warm = L.warm > 0.5;
        const col = warm ? "255,196,110" : "255,248,230";
        const d = Math.max(8, L.r * s.size * (kind === "mf" ? 22 : 18));
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${L.x}%`,
              top: `${L.y}%`,
              width: `${d}%`,
              aspectRatio: "1",
              transform: "translate(-50%, -50%)",
              opacity: s.opacity * (0.55 + L.r * 0.4),
              background: `radial-gradient(circle, rgba(${col},0.95) 0%, rgba(${col},${0.45 + s.ring * 0.25}) 28%, rgba(${col},${0.12 + s.ring * 0.18}) 52%, rgba(${col},0) 72%)`,
            }}
          />
        );
      })}
      {s.burst > 0.4
        ? NIGHT_LIGHTS.filter((L) => L.r >= 0.7).map((L, i) => (
            <svg
              key={`b-${i}`}
              className="absolute overflow-visible"
              style={{
                left: `${L.x}%`,
                top: `${L.y}%`,
                width: `${Math.max(14, L.r * 28)}%`,
                height: `${Math.max(14, L.r * 28)}%`,
                transform: "translate(-50%, -50%)",
                opacity: 0.55,
              }}
              viewBox="-10 -10 20 20"
            >
              {Array.from({ length: 12 }, (_, k) => {
                const a = (k * Math.PI) / 6;
                return (
                  <line
                    key={k}
                    x1={0}
                    y1={0}
                    x2={Math.cos(a) * 9}
                    y2={Math.sin(a) * 9}
                    stroke={L.warm > 0.5 ? "rgba(255,200,120,0.7)" : "rgba(255,250,235,0.8)"}
                    strokeWidth="0.45"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          ))
        : null}
    </div>
  );
}
