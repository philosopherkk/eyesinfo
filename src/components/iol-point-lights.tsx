import { HaloOverlay } from "@/components/halo-overlay";
import type { Optic } from "@/lib/iol-optics";
import { POINT_LIGHTS_DAY, POINT_LIGHTS_NIGHT } from "@/lib/night-lights";

type Props = {
  optic: Optic;
  time: "day" | "night";
  title: string;
};

/** Day and night point lights. Illustration only — cores are drawn, not a photo. */
export function IolPointLights({ optic, time, title }: Props) {
  const lights = time === "night" ? POINT_LIGHTS_NIGHT : POINT_LIGHTS_DAY;
  const ghost = optic === "mf";

  return (
    <figure
      className="overflow-hidden rounded-xl border border-line bg-card"
      data-optic={optic}
      data-points={time}
    >
      <figcaption className="px-3 pt-2.5 font-semibold text-navy">{title}</figcaption>
      <div
        className="relative mt-2 aspect-video overflow-hidden"
        style={{ background: time === "night" ? "#10151f" : "#d5e4f2" }}
      >
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden>
          {lights.map((L, i) => {
            const warm = L.warm > 0.5;
            const fill = warm ? "rgb(255, 214, 140)" : "rgb(255, 252, 245)";
            const cy = (L.y / 100) * 56;
            return (
              <g key={i}>
                <circle cx={L.x} cy={cy} r={Math.max(0.7, L.r * 0.85)} fill={fill} />
                {ghost ? (
                  <circle
                    cx={L.x + 2.6}
                    cy={cy - 1.4}
                    r={Math.max(0.55, L.r * 0.7)}
                    fill={fill}
                    opacity={time === "night" ? 0.72 : 0.42}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>
        <HaloOverlay kind={optic} time={time} lights={lights} showGhost={false} />
      </div>
    </figure>
  );
}
