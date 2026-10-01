import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { NIGHT_LIGHTS } from "@/lib/night-lights";
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
        {halo ? <IolHalo halo={halo} /> : null}
      </div>
    </figure>
  );
}

/** Night photic phenomena over measured lamp positions. Drawn above the contrast veil. */
function IolHalo({ halo }: { halo: Halo }) {
  const uid = `iolh-${halo.type}`;
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 100 56"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        {NIGHT_LIGHTS.map((L, i) => {
          const warm = L.warm > 0.5;
          const col = warm ? "255,196,110" : "255,248,230";
          const cy = (L.y / 100) * 56;
          const radius =
            halo.type === "rings"
              ? Math.max(2.4, L.r * halo.size * 4.4)
              : halo.type === "soft"
                ? Math.max(3.2, L.r * halo.size * 6.2)
                : Math.max(2.2, L.r * halo.size * 3.6);
          return (
            <radialGradient
              key={i}
              id={`${uid}-g-${i}`}
              gradientUnits="userSpaceOnUse"
              cx={L.x}
              cy={cy}
              r={radius}
            >
              <stop offset="0%" stopColor={`rgb(${col})`} stopOpacity="0" />
              <stop
                offset="18%"
                stopColor={`rgb(${col})`}
                stopOpacity={halo.type === "glow" ? 0.55 : 0.2}
              />
              <stop
                offset="55%"
                stopColor={`rgb(${col})`}
                stopOpacity={halo.type === "soft" ? 0.45 : 0.12}
              />
              <stop offset="100%" stopColor={`rgb(${col})`} stopOpacity="0" />
            </radialGradient>
          );
        })}
      </defs>
      {halo.type !== "rings"
        ? NIGHT_LIGHTS.map((L, i) => {
            const cy = (L.y / 100) * 56;
            const radius =
              halo.type === "soft"
                ? Math.max(3.2, L.r * halo.size * 6.2)
                : Math.max(2.2, L.r * halo.size * 3.6);
            const opacity = Math.min(0.55, halo.energy * (halo.type === "soft" ? 2.5 : 1.6));
            return (
              <circle
                key={i}
                cx={L.x}
                cy={cy}
                r={radius}
                fill={`url(#${uid}-g-${i})`}
                opacity={opacity}
              />
            );
          })
        : null}
      {halo.type === "rings"
        ? NIGHT_LIGHTS.map((L, i) => {
            const cy = (L.y / 100) * 56;
            const maxR = Math.max(2.6, L.r * halo.size * 4.6);
            const col = L.warm > 0.5 ? "rgb(255, 210, 140)" : "rgb(255, 248, 230)";
            const opacity = Math.min(0.92, 0.28 + halo.energy * 1.25);
            return (
              <g key={i} fill="none" stroke={col} opacity={opacity}>
                {[0.46, 0.72, 1].map((k) => (
                  <circle
                    key={k}
                    cx={L.x}
                    cy={cy}
                    r={maxR * k}
                    strokeWidth={k === 1 ? 0.42 : 0.32}
                  />
                ))}
              </g>
            );
          })
        : null}
      {halo.star
        ? NIGHT_LIGHTS.filter((L) => L.r >= 0.7).map((L, i) => {
            const cx = L.x;
            const cy = (L.y / 100) * 56;
            const len = Math.max(4.5, L.r * halo.size * 5.5);
            const spikes = 8;
            const col = L.warm > 0.5 ? "rgb(255, 220, 160)" : "rgb(255, 250, 236)";
            return (
              <g key={`s-${i}`} opacity={Math.min(0.45, 0.12 + halo.energy * 0.35)}>
                {Array.from({ length: spikes }, (_, k) => {
                  const a = (k * Math.PI * 2) / spikes + i * 0.05;
                  return (
                    <line
                      key={k}
                      x1={cx}
                      y1={cy}
                      x2={cx + Math.cos(a) * len}
                      y2={cy + Math.sin(a) * len}
                      stroke={col}
                      strokeWidth={0.18}
                    />
                  );
                })}
              </g>
            );
          })
        : null}
    </svg>
  );
}
