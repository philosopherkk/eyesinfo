import { useId } from "react";
import { cn } from "@/lib/utils";
import { qualityLabel, type Optic, type QualityKey } from "@/lib/iol-optics";
import { HaloOverlay } from "@/components/halo-overlay";
import type { HaloKind } from "@/lib/night-lights";
import { useI18n } from "@/i18n";
import type { UiKey } from "@/i18n/ui";

const QUALITY_KEY: Record<QualityKey, UiKey> = {
  clear: "iolQClear",
  fair: "iolQFair",
  blur: "iolQBlur",
  very: "iolQVery",
};

type Props = {
  src: string;
  title: string;
  sub: string;
  sample: string;
  sphere: number;
  astig: number;
  contrast: number;
  halo: number;
  ghost?: number;
  night?: boolean;
  optic?: Optic;
};

export function IolScene({
  src,
  title,
  sub,
  sample,
  sphere,
  astig,
  contrast,
  halo,
  ghost = 0,
  night,
  optic = "mono",
}: Props) {
  const { t } = useI18n();
  const fid = useId().replace(/:/g, "");
  const ghostId = useId().replace(/:/g, "");
  const total = sphere + astig;
  const q = qualityLabel(total);
  const sx = blurPxSafe(sphere + astig);
  const sy = blurPxSafe(sphere);
  const kind: HaloKind = optic;
  const showChips = optic === "mf";

  return (
    <figure
      className="overflow-hidden rounded-xl border border-line bg-card"
      data-optic={optic}
      data-quality={q.key}
    >
      <div className="flex items-baseline justify-between gap-2 px-3 pt-2.5">
        <figcaption>
          <span className="block font-semibold text-navy">{title}</span>
          <span className="text-[0.72rem] text-muted">{sub}</span>
        </figcaption>
        <span className="flex flex-wrap justify-end gap-1">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[0.72rem] font-semibold",
              q.tone === "ok" && "bg-navy text-paper",
              q.tone === "mid" && "bg-paper text-steel",
              q.tone === "bad" && "bg-danger-bg text-danger",
            )}
          >
            {t(QUALITY_KEY[q.key])}
          </span>
          {showChips ? (
            <span className="rounded-full bg-paper px-2 py-0.5 text-[0.72rem] font-semibold text-steel">
              {t("iolQContrast")}
            </span>
          ) : null}
          {showChips ? (
            <span className="rounded-full bg-paper px-2 py-0.5 text-[0.72rem] font-semibold text-steel">
              {t("iolQGhost")}
            </span>
          ) : null}
        </span>
      </div>
      <div className="relative mt-2 aspect-video overflow-hidden bg-navy">
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
          style={{
            filter: `url(#${fid}) contrast(${1 - contrast})`,
          }}
        />
        {ghost > 0.05 ? (
          <img
            src={src}
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover"
            style={{
              filter: `url(#${ghostId}) contrast(${1 - contrast})`,
              opacity: ghost,
              transform: "translate(3.2%, 2%)",
            }}
          />
        ) : null}
        {night && halo > 0.05 ? (
          <div
            className="absolute inset-0"
            style={{ opacity: Math.min(1, 0.22 + halo * 0.78) }}
            aria-hidden
          >
            <HaloOverlay kind={kind} />
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 bg-navy/70 px-3 py-2 text-center">
          {ghost > 0.05 ? (
            <p
              className="pointer-events-none absolute inset-x-0 top-1 font-semibold tracking-widest text-paper/80"
              style={{
                filter: `blur(${Math.min(8, total * 2.2 + 1.2)}px)`,
                transform: "translate(7px, -2px)",
                opacity: 0.55,
              }}
              aria-hidden
            >
              {sample}
            </p>
          ) : null}
          <p
            className="relative font-semibold tracking-widest text-paper"
            style={{ filter: `blur(${Math.min(8, total * 2.2)}px)` }}
          >
            {sample}
          </p>
        </div>
      </div>
    </figure>
  );
}

function blurPxSafe(d: number) {
  return Math.min(16, Math.max(0, d) * 3.1);
}
