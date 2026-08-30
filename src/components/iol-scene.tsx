import { useId } from "react";
import { cn } from "@/lib/utils";
import { qualityLabel } from "@/lib/iol-optics";
import { HaloOverlay } from "@/components/halo-overlay";
import type { HaloKind } from "@/lib/night-lights";

type Props = {
  src: string;
  title: string;
  sub: string;
  sample: string;
  sphere: number;
  astig: number;
  contrast: number;
  halo: number;
  night?: boolean;
  optic?: HaloKind;
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
  night,
  optic = "mono",
}: Props) {
  const fid = useId().replace(/:/g, "");
  const total = sphere + astig;
  const q = qualityLabel(total);
  const sx = blurPxSafe(sphere + astig);
  const sy = blurPxSafe(sphere);
  const kind: HaloKind = optic === "mf" ? "mf" : optic === "edof" ? "edof" : "mono";

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-card">
      <div className="flex items-baseline justify-between gap-2 px-3 pt-2.5">
        <figcaption>
          <span className="block font-semibold text-navy">{title}</span>
          <span className="text-[0.72rem] text-muted">{sub}</span>
        </figcaption>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[0.72rem] font-semibold",
            q.tone === "ok" && "bg-navy text-paper",
            q.tone === "mid" && "bg-paper text-steel",
            q.tone === "bad" && "bg-danger-bg text-danger",
          )}
        >
          {q.text}
        </span>
      </div>
      <div className="relative mt-2 aspect-video overflow-hidden bg-navy">
        <svg width="0" height="0" className="absolute" aria-hidden>
          <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={`${sx} ${sy}`} />
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
        {night && halo > 0.05 ? (
          <div className="absolute inset-0" style={{ opacity: Math.min(1, 0.35 + halo) }} aria-hidden>
            <HaloOverlay kind={kind} />
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 bg-navy/70 px-3 py-2 text-center">
          <p
            className="font-semibold tracking-widest text-paper"
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
