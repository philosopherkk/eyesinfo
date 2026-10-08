/**
 * Glaucoma visual-field illustration model (education only, not a perimetry
 * simulator). Field coordinates are in degrees for a RIGHT eye: +x = temporal
 * (right on screen), +y = up. The street scene spans ±SCENE_HALF_W × ±SCENE_HALF_H.
 *
 * Staging labels follow Hodapp–Parrish–Anderson (mild / moderate / severe); the
 * fourth level is a teaching "end-stage" (only small islands remain). The loss
 * shapes are hand-built illustrations, not fitted to patient data.
 */

export type FieldPattern = "arcuate" | "nasal" | "peripheral";
export type FieldSeverity = 0 | 1 | 2 | 3;
export type RenderStyle = "soft" | "dark";

export const SCENE_HALF_W = 40;
export const SCENE_HALF_H = 22.5;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Smoothstep. Works for reversed edges (e0 > e1). */
export function sstep(e0: number, e1: number, x: number): number {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

const union = (a: number, b: number) => 1 - (1 - a) * (1 - b);

/**
 * Bjerrum-type arcuate band following the retinal nerve-fibre layout: it arches from
 * the blind-spot region over (or under) fixation and ends at the nasal horizontal
 * midline (nasal step). The temporal side is faded so it stays clearest.
 */
function arc(x: number, y: number, sign: 1 | -1, H: number, w: number, depth: number): number {
  const u = (x + 6) / 24;
  const h = H * Math.sqrt(Math.max(0, 1 - u * u));
  const nasal = sstep(6, -8, x);
  const ww = w * (1 + 0.6 * nasal);
  const band = 1 - sstep(0.5, 1, Math.abs(y - sign * h) / ww);
  const tF = sstep(0, 15, x);
  const half = sstep(-0.5 - 0.8 * tF, 0.5 + 0.8 * tF, sign * y);
  const temporalClear = sstep(26, 10, x);
  return depth * (0.75 + 0.25 * nasal) * band * half * temporalClear;
}

function nasalHalf(x: number, y: number, sign: 1 | -1, xin: number, depth: number): number {
  const ext = 1 - sstep(-xin - 3, -xin + 3, x);
  return depth * ext * sstep(-0.6, 0.6, sign * y);
}

function periph(x: number, y: number, rN: number, rT: number, depth: number, soft: number): number {
  const s = sstep(18, -18, x);
  const R = rT + (rN - rT) * s;
  return depth * sstep(R - soft, R + soft, Math.hypot(x, y));
}

const keepCentre = (r: number, rI: number, soft: number) => 1 - sstep(rI, rI + soft, r);

function temporalIsland(x: number, y: number, cx: number, ax: number, ay: number): number {
  const d = Math.hypot((x - cx) / ax, y / ay);
  return 1 - sstep(0.65, 1, d);
}

/** Relative loss at a field position: 0 = normal, 1 = nothing there. */
export function lossAt(
  pattern: FieldPattern,
  severity: FieldSeverity,
  x: number,
  y: number,
): number {
  const r = Math.hypot(x, y);

  if (severity === 3) {
    const base = 0.97;
    return base * (1 - keepCentre(r, 4, 3)) * (1 - 0.95 * temporalIsland(x, y, 36, 13, 15));
  }

  let L = 0;
  let keepR = 6;
  let keepK = 0.9;

  if (pattern === "arcuate") {
    if (severity === 0) {
      L = arc(x, y, 1, 12, 4.5, 0.5);
    } else if (severity === 1) {
      L = union(arc(x, y, 1, 12.5, 6, 0.85), arc(x, y, -1, 12.5, 5, 0.5));
    } else {
      L = union(arc(x, y, 1, 13, 8.5, 0.95), arc(x, y, -1, 13, 8, 0.9));
      L = union(L, periph(x, y, 20, 52, 0.75, 4) * sstep(10, -6, x));
      keepK = 0.85;
    }
  } else if (pattern === "nasal") {
    if (severity === 0) {
      L = union(nasalHalf(x, y, 1, 9, 0.45), nasalHalf(x, y, -1, 9, 0.12));
    } else if (severity === 1) {
      L = union(nasalHalf(x, y, 1, 8, 0.8), nasalHalf(x, y, -1, 10, 0.45));
      L = union(L, periph(x, y, 30, 42, 0.3, 5));
    } else {
      L = union(nasalHalf(x, y, 1, 3, 0.92), nasalHalf(x, y, -1, 3, 0.85));
      L = union(L, periph(x, y, 22, 34, 0.6, 4));
      L = union(L, arc(x, y, 1, 12, 6, 0.6));
      keepK = 0.85;
    }
  } else {
    if (severity === 0) {
      L = periph(x, y, 27, 36, 0.4, 7);
    } else if (severity === 1) {
      L = periph(x, y, 20, 28, 0.75, 6);
    } else {
      L = periph(x, y, 13, 18, 0.92, 5);
      keepR = 3;
    }
  }

  return clamp01(L * (1 - keepK * keepCentre(r, keepR, 3)));
}

export function buildLossGrid(
  pattern: FieldPattern,
  severity: FieldSeverity,
  gw: number,
  gh: number,
): Float32Array {
  const g = new Float32Array(gw * gh);
  for (let j = 0; j < gh; j++) {
    const y = SCENE_HALF_H - ((j + 0.5) / gh) * 2 * SCENE_HALF_H;
    for (let i = 0; i < gw; i++) {
      const x = -SCENE_HALF_W + ((i + 0.5) / gw) * 2 * SCENE_HALF_W;
      g[j * gw + i] = lossAt(pattern, severity, x, y);
    }
  }
  return g;
}

export function lerpGrid(out: Float32Array, a: Float32Array, b: Float32Array, t: number): void {
  for (let i = 0; i < out.length; i++) out[i] = a[i] + (b[i] - a[i]) * t;
}

/** Three-pass separable box blur (≈ Gaussian) on RGBA data; alpha untouched. */
export function boxBlurRGBA(
  src: Uint8ClampedArray,
  w: number,
  h: number,
  radius: number,
): Uint8ClampedArray {
  const a = new Uint8ClampedArray(src);
  const b = new Uint8ClampedArray(src.length);
  const pass = (from: Uint8ClampedArray, to: Uint8ClampedArray, horizontal: boolean) => {
    const lines = horizontal ? h : w;
    const len = horizontal ? w : h;
    const stride = horizontal ? 4 : w * 4;
    const lineStride = horizontal ? w * 4 : 4;
    const win = radius * 2 + 1;
    for (let l = 0; l < lines; l++) {
      const base = l * lineStride;
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let k = -radius; k <= radius; k++) {
          const kk = k < 0 ? 0 : k >= len ? len - 1 : k;
          sum += from[base + kk * stride + c];
        }
        for (let p = 0; p < len; p++) {
          to[base + p * stride + c] = sum / win;
          const out = p - radius;
          const inn = p + radius + 1;
          sum +=
            from[base + (inn >= len ? len - 1 : inn) * stride + c] -
            from[base + (out < 0 ? 0 : out) * stride + c];
        }
      }
      for (let p = 0; p < len; p++) to[base + p * stride + 3] = 255;
    }
  };
  for (let n = 0; n < 3; n++) {
    pass(a, b, true);
    pass(b, a, false);
  }
  return a;
}

export type SceneBuffers = {
  w: number;
  h: number;
  sharp: Uint8ClampedArray;
  mid: Uint8ClampedArray;
  far: Uint8ClampedArray;
};

export function prepareScene(sharp: Uint8ClampedArray, w: number, h: number): SceneBuffers {
  return {
    w,
    h,
    sharp,
    mid: boxBlurRGBA(sharp, w, h, Math.max(2, Math.round(w / 90))),
    far: boxBlurRGBA(sharp, w, h, Math.max(6, Math.round(w / 20))),
  };
}

/**
 * Composite the scene with a loss grid.
 * "soft": blur + desaturation + dimming + local fill-in (patients rarely describe black).
 * "dark": classic dark mask, for comparison only.
 */
export function composeScene(
  out: Uint8ClampedArray,
  s: SceneBuffers,
  grid: Float32Array,
  gw: number,
  gh: number,
  style: RenderStyle,
): void {
  const { w, h, sharp, mid, far } = s;
  for (let py = 0; py < h; py++) {
    const gy = Math.min(gh - 1, Math.max(0, ((py + 0.5) / h) * gh - 0.5));
    const j0 = Math.floor(gy);
    const j1 = Math.min(gh - 1, j0 + 1);
    const fy = gy - j0;
    for (let px = 0; px < w; px++) {
      const gx = Math.min(gw - 1, Math.max(0, ((px + 0.5) / w) * gw - 0.5));
      const i0 = Math.floor(gx);
      const i1 = Math.min(gw - 1, i0 + 1);
      const fx = gx - i0;
      const top = grid[j0 * gw + i0] * (1 - fx) + grid[j0 * gw + i1] * fx;
      const bot = grid[j1 * gw + i0] * (1 - fx) + grid[j1 * gw + i1] * fx;
      const a = top * (1 - fy) + bot * fy;
      const o = (py * w + px) * 4;
      out[o + 3] = 255;

      if (a < 0.01) {
        out[o] = sharp[o];
        out[o + 1] = sharp[o + 1];
        out[o + 2] = sharp[o + 2];
        continue;
      }

      if (style === "dark") {
        const k = 1 - 0.96 * sstep(0.1, 0.9, a);
        out[o] = sharp[o] * k + 8 * (1 - k);
        out[o + 1] = sharp[o + 1] * k + 11 * (1 - k);
        out[o + 2] = sharp[o + 2] * k + 16 * (1 - k);
        continue;
      }

      const w1 = sstep(0.04, 0.55, a);
      const w2 = sstep(0.42, 0.95, a);
      const lumMid = 0.299 * mid[o] + 0.587 * mid[o + 1] + 0.114 * mid[o + 2];
      const lumFar = 0.299 * far[o] + 0.587 * far[o + 1] + 0.114 * far[o + 2];
      for (let c = 0; c < 3; c++) {
        const sc = sharp[o + c];
        const mc = mid[o + c];
        const fc = far[o + c];
        const d1 = (fc + (mc - fc) * 0.6) * 0.6 + lumMid * 0.4;
        const d2 = (fc * 0.45 + lumFar * 0.55) * 0.8 + 6;
        const v1 = sc + (d1 * 0.93 - sc) * w1;
        out[o + c] = v1 + (d2 - v1) * w2;
      }
    }
  }
}

export const CHART_STEP = 6;
export const CHART_RADIUS = 30;

/** Tile levels for the grey-scale chart illustration (1 = normal, 0 = deep loss). */
export function chartTiles(
  pattern: FieldPattern,
  severity: FieldSeverity,
): { x: number; y: number; v: number }[] {
  const tiles: { x: number; y: number; v: number }[] = [];
  for (let y = -27; y <= 27; y += CHART_STEP) {
    for (let x = -27; x <= 27; x += CHART_STEP) {
      if (Math.hypot(x, y) > CHART_RADIUS) continue;
      let loss = lossAt(pattern, severity, x, y);
      if (x === 15 && y === -3) loss = Math.max(loss, 0.95);
      tiles.push({ x, y, v: 1 - loss });
    }
  }
  return tiles;
}
