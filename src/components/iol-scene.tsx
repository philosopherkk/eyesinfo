import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { HaloOverlay } from "@/components/halo-overlay";
import type { HaloKind } from "@/lib/night-lights";
import type { HaloType } from "@/lib/iol-optics";

type Halo = {
  type: HaloType;
  size: number;
  energy: number;
  star: boolean;
};

type Props = {
  src: string;
  title: string;
  sub: string;
  badge: string;
  badgeClass: string;
  sigma: number;
  smear: number;
  angle: number;
  contrast: number;
  veil: number;
  halo: Halo | null;
};

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = imageCache.get(src);
  if (hit?.complete && hit.naturalWidth > 0) return Promise.resolve(hit);
  return new Promise((resolve, reject) => {
    const img = hit ?? new Image();
    imageCache.set(src, img);
    const ok = () => resolve(img);
    const bad = () => reject(new Error("image"));
    img.addEventListener("load", ok, { once: true });
    img.addEventListener("error", bad, { once: true });
    if (!img.getAttribute("src")) img.src = src;
    if (img.complete && img.naturalWidth > 0) ok();
  });
}

function cover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  w: number,
  h: number,
  iw: number,
  ih: number,
) {
  const ir = iw / ih;
  const cr = w / h;
  let dw = w;
  let dh = h;
  let dx = 0;
  let dy = 0;
  if (ir > cr) {
    dh = h;
    dw = h * ir;
    dx = (w - dw) / 2;
  } else {
    dw = w;
    dh = w / ir;
    dy = (h - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

function paint(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  sigma: number,
  smear: number,
  angle: number,
) {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const octx = off.getContext("2d");
  if (!octx) return;
  octx.filter = sigma > 0.12 ? `blur(${sigma}px)` : "none";
  cover(octx, img, w, h, img.naturalWidth, img.naturalHeight);
  octx.filter = "none";
  ctx.clearRect(0, 0, w, h);
  ctx.globalAlpha = 1;
  ctx.drawImage(off, 0, 0);
  if (smear > 0.4) {
    const ang = (angle * Math.PI) / 180;
    const n = Math.min(8, Math.max(2, Math.round(smear / 1.6)));
    for (let i = 1; i <= n; i++) {
      const dx = Math.cos(ang) * i * (smear / n);
      const dy = Math.sin(ang) * i * (smear / n);
      ctx.globalAlpha = 0.22 * (1 - i / (n + 1));
      ctx.drawImage(off, dx, dy);
      ctx.drawImage(off, -dx, -dy);
    }
    ctx.globalAlpha = 1;
  }
}

function haloKind(type: HaloType): HaloKind {
  if (type === "rings") return "mf";
  if (type === "soft") return "edof";
  return "mono";
}

function haloStrength(halo: Halo): number {
  const raw = halo.energy * (halo.type === "rings" ? 1.15 : 1);
  return Math.min(1.35, Math.max(0.75, 0.82 + raw * 0.55));
}

export function IolScene({
  src,
  title,
  sub,
  badge,
  badgeClass,
  sigma,
  smear,
  angle,
  contrast,
  veil,
  halo,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let cancel = false;
    loadImage(src)
      .then((img) => {
        if (!cancel && ref.current) paint(ref.current, img, sigma, smear, angle);
      })
      .catch(() => {
        /* photo missing: navy frame remains */
      });
    return () => {
      cancel = true;
    };
  }, [src, sigma, smear, angle]);

  const kind = halo ? haloKind(halo.type) : null;

  return (
    <figure
      className="min-w-0 overflow-hidden rounded-xl border border-line bg-card"
      data-veil={veil.toFixed(3)}
      data-contrast={contrast.toFixed(3)}
      data-halo={halo?.type ?? "none"}
      data-sigma={sigma.toFixed(2)}
    >
      <div className="flex items-start justify-between gap-2 px-3 pt-2.5">
        <figcaption className="min-w-0">
          <span className="block font-semibold text-navy">{title}</span>
          <span className="text-[0.72rem] text-muted">{sub}</span>
        </figcaption>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-1 text-right text-[0.68rem] font-semibold leading-snug",
            badgeClass,
          )}
        >
          {badge}
        </span>
      </div>
      <div className="relative mt-2 aspect-video overflow-hidden bg-navy">
        <canvas
          ref={ref}
          width={640}
          height={360}
          className="size-full"
          style={{ filter: contrast < 0.995 ? `contrast(${contrast})` : undefined }}
          aria-hidden
        />
        {veil >= 0.012 ? (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `rgba(28, 30, 34, ${veil})` }}
            aria-hidden
          />
        ) : null}
        {halo && kind ? (
          <HaloOverlay
            kind={kind}
            strength={haloStrength(halo)}
            showStarburst={halo.star || halo.type === "rings"}
            ghostRings={halo.type === "rings"}
          />
        ) : null}
      </div>
    </figure>
  );
}
