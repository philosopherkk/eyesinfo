import { useId } from "react";
import { cn } from "@/lib/utils";
import { qualityLabel, type Optic, type QualityKey } from "@/lib/iol-optics";
import { HaloOverlay } from "@/components/halo-overlay";
import { useI18n } from "@/i18n";
import type { UiKey } from "@/i18n/ui";

const QUALITY_KEY: Record<QualityKey, UiKey> = {
  clear: "iolQClear",
  fair: "iolQFair",
  blur: "iolQBlur",
  very: "iolQVery",
};

export type QuadCell = {
  optic: Optic;
  label: string;
  sphere: number;
  astig: number;
  contrast: number;
  halo: number;
  ghost: number;
  night: boolean;
};

type Props = {
  distanceId: "far" | "mid" | "near";
  title: string;
  sub: string;
  src: string;
  sample: string;
  cells: QuadCell[];
};

/** One distance, split into four class quadrants. */
export function IolDistanceQuad({ distanceId, title, sub, src, sample, cells }: Props) {
  return (
    <figure
      className="overflow-hidden rounded-xl border border-line bg-card"
      data-split="distance"
      data-distance={distanceId}
    >
      <figcaption className="px-3 pt-2.5">
        <span className="block font-semibold text-navy">{title}</span>
        <span className="text-[0.72rem] text-muted">{sub}</span>
      </figcaption>
      <div className="mt-2 grid grid-cols-2 gap-px bg-line">
        {cells.map((cell) => (
          <Quadrant key={cell.optic} src={src} sample={sample} cell={cell} />
        ))}
      </div>
    </figure>
  );
}

function Quadrant({
  src,
  sample,
  cell,
}: {
  src: string;
  sample: string;
  cell: QuadCell;
}) {
  const { t } = useI18n();
  const fid = useId().replace(/:/g, "");
  const ghostId = useId().replace(/:/g, "");
  const total = cell.sphere + cell.astig;
  const q = qualityLabel(total);
  const sx = blurPxSafe(cell.sphere + cell.astig);
  const sy = blurPxSafe(cell.sphere);
  const showChips = cell.optic === "mf";

  return (
    <div
      className="relative aspect-video overflow-hidden bg-navy"
      data-optic={cell.optic}
      data-quality={q.key}
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={`${sx} ${sy}`} />
        </filter>
        <filter id={ghostId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={`${sx + 1.4} ${sy + 1.1}`} />
        </filter>
      </svg>
      <img
        src={src}
        alt=""
        className="size-full object-cover"
        style={{ filter: `url(#${fid}) contrast(${1 - cell.contrast})` }}
      />
      {cell.ghost > 0.05 ? (
        <img
          src={src}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover"
          style={{
            filter: `url(#${ghostId}) contrast(${1 - cell.contrast})`,
            opacity: cell.ghost,
            transform: "translate(3.2%, 2%)",
          }}
        />
      ) : null}
      {cell.night && cell.halo > 0.05 ? (
        <div
          className="absolute inset-0"
          style={{ opacity: Math.min(1, 0.22 + cell.halo * 0.78) }}
          aria-hidden
        >
          <HaloOverlay kind={cell.optic} />
        </div>
      ) : null}
      <div className="absolute inset-x-0 top-0 bg-navy/80 px-1.5 py-1">
        <p className="text-[0.72rem] font-semibold leading-tight text-paper">{cell.label}</p>
        <div className="mt-0.5 flex flex-wrap gap-0.5">
          <span
            className={cn(
              "rounded-full px-1.5 py-px text-[0.62rem] font-semibold",
              q.tone === "ok" && "bg-paper text-navy",
              q.tone === "mid" && "bg-paper/80 text-steel",
              q.tone === "bad" && "bg-danger-bg text-danger",
            )}
          >
            {t(QUALITY_KEY[q.key])}
          </span>
          {showChips ? (
            <span className="rounded-full bg-paper/80 px-1.5 py-px text-[0.62rem] font-semibold text-steel">
              {t("iolQContrast")}
            </span>
          ) : null}
          {showChips ? (
            <span className="rounded-full bg-paper/80 px-1.5 py-px text-[0.62rem] font-semibold text-steel">
              {t("iolQGhost")}
            </span>
          ) : null}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-navy/70 px-1 py-1 text-center">
        {cell.ghost > 0.05 ? (
          <p
            className="pointer-events-none absolute inset-x-0 top-0 text-[0.68rem] font-semibold tracking-wide text-paper/80"
            style={{
              filter: `blur(${Math.min(6, total * 2.2 + 1.2)}px)`,
              transform: "translate(4px, -1px)",
              opacity: 0.55,
            }}
            aria-hidden
          >
            {sample}
          </p>
        ) : null}
        <p
          className="relative text-[0.68rem] font-semibold tracking-wide text-paper"
          style={{ filter: `blur(${Math.min(6, total * 2.2)}px)` }}
        >
          {sample}
        </p>
      </div>
    </div>
  );
}

function blurPxSafe(d: number) {
  return Math.min(16, Math.max(0, d) * 3.1);
}
