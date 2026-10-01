/** Educational defocus model — schematic, not a personal prediction. */

export const XS = [1, 0.5, 0, -0.5, -1, -1.5, -2, -2.5, -3, -3.5, -4];

export type LensId = "mono" | "enh" | "edof" | "tri";
export type LightId = "day" | "dusk" | "night";
export type AgeId = "50" | "60" | "70";
export type AxisId = "h" | "v" | "o";
export type ViewId = "bin" | "dom" | "non";
export type RotBand = "aligned" | "little" | "more";

/** Internal residual-cylinder angles for each coarse band — never shown as °. */
export const ROT_BAND_DEG: Record<RotBand, number> = {
  aligned: 0,
  little: 10,
  more: 25,
};

export function rotBandFromDeg(rot: number): RotBand {
  if (!Number.isFinite(rot) || rot < 5) return "aligned";
  if (rot < 18) return "little";
  return "more";
}

export function snapRotDeg(rot: number): number {
  return ROT_BAND_DEG[rotBandFromDeg(rot)];
}
export type HaloType = "glow" | "soft" | "rings";
export type OpticsKind = "refractive" | "diffractive";

export type Lens = {
  id: LensId;
  optics: OpticsKind;
  color: string;
  curve: number[];
  pupilK: number;
  cylK: number;
  contrast: number;
  nearPupilPenalty: number;
  halo: { type: HaloType; size: number; energy: number };
};

export const LENSES: Record<LensId, Lens> = {
  mono: {
    id: "mono",
    optics: "refractive",
    color: "#6b7280",
    curve: [0.28, 0.08, -0.02, 0.06, 0.22, 0.36, 0.5, 0.61, 0.71, 0.79, 0.86],
    pupilK: 0.14,
    cylK: 0.22,
    contrast: 1,
    nearPupilPenalty: 0,
    halo: { type: "glow", size: 1.0, energy: 0.1 },
  },
  enh: {
    id: "enh",
    optics: "refractive",
    color: "#2563eb",
    curve: [0.27, 0.07, -0.03, 0.03, 0.12, 0.2, 0.33, 0.43, 0.53, 0.63, 0.72],
    pupilK: 0.14,
    cylK: 0.21,
    contrast: 0.99,
    nearPupilPenalty: 0,
    halo: { type: "glow", size: 1.1, energy: 0.12 },
  },
  edof: {
    id: "edof",
    optics: "refractive",
    color: "#0b8a6e",
    curve: [0.22, 0.05, -0.05, 0.0, 0.07, 0.13, 0.23, 0.33, 0.46, 0.58, 0.68],
    pupilK: 0.2,
    cylK: 0.2,
    contrast: 0.96,
    nearPupilPenalty: 0,
    halo: { type: "soft", size: 1.4, energy: 0.16 },
  },
  tri: {
    id: "tri",
    optics: "diffractive",
    color: "#9333ea",
    curve: [0.26, 0.08, 0.0, 0.07, 0.12, 0.09, 0.07, 0.06, 0.17, 0.33, 0.48],
    pupilK: 0.06,
    cylK: 0.27,
    contrast: 0.88,
    nearPupilPenalty: 0.08,
    halo: { type: "rings", size: 1.0, energy: 0.42 },
  },
};

export const ORDER: LensId[] = ["mono", "enh", "edof", "tri"];

export const LIGHT: Record<LightId, { pupil: number; vaAdd: number; mfAdd: number }> = {
  day: { pupil: 3.0, vaAdd: 0.0, mfAdd: 0.0 },
  dusk: { pupil: 4.5, vaAdd: 0.07, mfAdd: 0.04 },
  night: { pupil: 6.0, vaAdd: 0.14, mfAdd: 0.07 },
};

export const AGE: Record<AgeId, number> = { "50": 0, "60": -0.5, "70": -1.0 };

export const MID_OPTIONS = [1, 0.8, 0.66, 0.6] as const;
export const NEAR_OPTIONS = [0.5, 0.4, 0.33] as const;
export const FAR_M = 6;

export type SimState = {
  lens: LensId;
  light: LightId;
  pupil: number;
  pupilAuto: boolean;
  age: AgeId;
  t1: number;
  mv: boolean;
  t2: number;
  cyl: number;
  toric: boolean;
  rot: number;
  axis: AxisId;
  dry: boolean;
  view: ViewId;
  mid: number;
  near: number;
  cmp: LensId;
  sbs: boolean;
};

export const DEFAULTS: SimState = {
  lens: "edof",
  light: "day",
  pupil: 2.5,
  pupilAuto: true,
  age: "60",
  t1: 0,
  mv: false,
  t2: -0.75,
  cyl: 0,
  toric: false,
  rot: 0,
  axis: "h",
  dry: false,
  view: "bin",
  mid: 0.66,
  near: 0.4,
  cmp: "tri",
  sbs: false,
};

/** Settings object consumed by the optical functions (`s` in the source model). */
export type EyeState = {
  pupil: number;
  light: LightId;
  toric: boolean;
  cyl: number;
  rot: number;
  dry: boolean;
  t1: number;
  t2: number;
  mv: boolean;
};

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function curveAt(c: number[], x: number): number {
  const n = XS.length - 1;
  if (x >= XS[0]) return c[0] + (x - XS[0]) * 0.35;
  if (x <= XS[n]) return c[n] + (XS[n] - x) * 0.12;
  for (let i = 0; i < n; i++) {
    if (x <= XS[i] && x >= XS[i + 1]) {
      const t = (XS[i] - x) / (XS[i] - XS[i + 1]);
      return c[i] + (c[i + 1] - c[i]) * t;
    }
  }
  return c[n];
}

export function resCyl(s: EyeState): number {
  if (!s.toric || s.cyl < 0.01) return s.cyl;
  return Math.abs(2 * s.cyl * Math.sin((s.rot * Math.PI) / 180));
}

export function vaAtDefocus(L: Lens, x: number, s: EyeState): number {
  const p = s.pupil;
  const xe = L.optics === "diffractive" ? x : x * (1 + L.pupilK * (p - 3));
  let va = curveAt(L.curve, xe);
  if (L.optics === "diffractive") {
    const big = Math.max(0, p - 3) / 3;
    if (x < -0.75) va += L.nearPupilPenalty * big;
    if (x > 0) va += x * 0.1 * big;
  }
  const lt = LIGHT[s.light];
  va += lt.vaAdd + (L.optics === "diffractive" ? lt.mfAdd : 0);
  if (s.dry) va += 0.04;
  const C = resCyl(s);
  if (C > 0) {
    const damp = 1 - Math.min(0.6, Math.max(0, va));
    va += L.cylK * C * damp;
  }
  return clamp(va, -0.12, 1.3);
}

export function eyeVA(L: Lens, target: number, d: number, s: EyeState): number {
  return vaAtDefocus(L, -1 / d - target, s);
}

export function vaSet(L: Lens, d: number, s: EyeState): { bin: number; dom: number; non: number } {
  const a = eyeVA(L, s.t1, d, s);
  const b = eyeVA(L, s.mv ? s.t2 : s.t1, d, s);
  const diff = Math.abs(a - b);
  const sum = diff < 0.1 ? 0.05 : diff < 0.25 ? 0.03 : 0.01;
  return { bin: Math.max(-0.15, Math.min(a, b) - sum), dom: a, non: b };
}

export function contrastLoss(L: Lens, s: EyeState): number {
  let c = 1 - L.contrast;
  if (s.light !== "day") c += L.optics === "diffractive" ? 0.05 : 0.015;
  if (s.dry) c += 0.05;
  return Math.min(0.4, c);
}

/**
 * Photo veil. Raw contrast loss (0.04 for refractive EDOF, 0.12 for
 * diffractive) is nearly invisible on a photograph, so the overlay is scaled.
 * Ranking stays the same; the picture stays readable. Not a manufacturer figure.
 */
export function veilVisual(loss: number): { contrast: number; alpha: number } {
  // Losses at or below an enhanced monofocal (0.01) stay effectively clear.
  // Larger losses are scaled so a refractive extended-depth veil is visible
  // and a diffractive veil is clearly darker, without washing the photo out.
  if (loss <= 0.012) return { contrast: 1 - loss, alpha: 0 };
  const alpha = Math.min(0.4, 0.08 + (loss - 0.012) * 2.4);
  const contrast = Math.max(0.6, 1 - loss * 2.1);
  return { contrast, alpha };
}

export function haloParams(
  L: Lens,
  s: EyeState,
): { type: HaloType; size: number; energy: number; star: boolean } {
  const p = s.pupil;
  let size = L.halo.size;
  let energy = L.halo.energy;
  if (L.halo.type === "rings") size *= p / 3;
  else if (L.halo.type === "soft") {
    size *= Math.max(0.7, 1.15 - 0.08 * (p - 3));
    energy *= Math.max(0.6, 1 - 0.1 * (p - 3));
  } else size *= 0.8 + 0.1 * (p - 3);
  energy *= 1 + 0.25 * Math.min(2, Math.abs(s.t1));
  if (s.dry) energy *= 1.3;
  return { type: L.halo.type, size, energy, star: s.dry };
}

/** Illustration index from halo size × energy. Not a percent. */
export function haloIndex(L: Lens, s: EyeState): number {
  const h = haloParams(L, s);
  return Math.round(h.energy * h.size * 100) / 10;
}

export function vaInfo(va: number): {
  cls: "ok" | "ok2" | "warn" | "bad";
  txt: "清晰" | "尚可" | "吃力" | "模糊" | "很模糊";
} {
  if (va <= 0.1) return { cls: "ok", txt: "清晰" };
  if (va <= 0.2) return { cls: "ok2", txt: "尚可" };
  if (va <= 0.3) return { cls: "warn", txt: "吃力" };
  if (va <= 0.5) return { cls: "bad", txt: "模糊" };
  return { cls: "bad", txt: "很模糊" };
}

export const sigmaFor = (va: number) => Math.min(16, Math.max(0, (Math.pow(10, va) - 0.85) * 1.5));

/** Extra directional smear so residual cylinder is visible, not only isotropic blur. */
export function smearPx(cyl: number): number {
  return Math.min(14, Math.max(0, cyl) * 5);
}

export function smearAngle(axis: AxisId): number {
  if (axis === "v") return 90;
  if (axis === "o") return 45;
  return 0;
}

export function autoPupil(light: LightId, age: AgeId): number {
  return clamp(LIGHT[light].pupil + AGE[age], 2, 7);
}

export function effectivePupil(s: SimState): number {
  if (!s.pupilAuto) return clamp(s.pupil, 2, 7);
  return autoPupil(s.light, s.age);
}

export function toEye(s: SimState): EyeState {
  const toricOn = s.toric && s.cyl >= 0.01;
  return {
    pupil: effectivePupil(s),
    light: s.light,
    toric: toricOn,
    cyl: s.cyl,
    rot: toricOn ? s.rot : 0,
    dry: s.dry,
    t1: s.t1,
    t2: s.t2,
    mv: s.mv,
  };
}

export function viewVa(L: Lens, d: number, s: EyeState, view: ViewId): number {
  const set = vaSet(L, d, s);
  if (view === "dom") return set.dom;
  if (view === "non") return set.non;
  return set.bin;
}

export function formatD(n: number): string {
  const sign = n > 0.001 ? "+" : n < -0.001 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(2)} D`;
}

export function formatLogMAR(va: number): string {
  const rounded = Math.round(va * 100) / 100;
  const body = Math.abs(rounded).toFixed(2);
  if (rounded < -0.005) return `−${body}`;
  return body;
}

export function formatSnellen(va: number): string {
  const denom = Math.round(6 * Math.pow(10, va));
  return `6/${Math.max(3, denom)}`;
}

export function formatDistance(m: number): string {
  if (m >= 0.99) return "1 m";
  return `${Math.round(m * 100)} cm`;
}

export function sliderToTarget(i: number): number {
  return clamp(Math.round(i) / 4, -3, 3);
}

export function targetToSlider(t: number): number {
  return Math.round(clamp(t, -3, 3) * 4);
}

export type Warn =
  | { id: "cyl"; d: string }
  | { id: "rot"; band: Exclude<RotBand, "aligned"> }
  | { id: "diff" }
  | { id: "hyper" }
  | { id: "mf" }
  | { id: "mv"; d: string }
  | { id: "rings" }
  | { id: "edof" }
  | { id: "dry" };

export function warnings(s: SimState): Warn[] {
  const eye = toEye(s);
  const L = LENSES[s.lens];
  const C = resCyl(eye);
  const out: Warn[] = [];
  if (C >= 0.5) out.push({ id: "cyl", d: C.toFixed(2) });
  // Toric at ~0.00 D is not cylinder correction — do not emit rotation loss.
  if (s.toric && s.cyl >= 0.01) {
    const band = rotBandFromDeg(s.rot);
    if (band !== "aligned") out.push({ id: "rot", band });
  }
  if (L.optics === "diffractive" && C >= 0.5) out.push({ id: "diff" });
  if (s.t1 >= 0.25) out.push({ id: "hyper" });
  if (L.optics === "diffractive" && Math.abs(s.t1) >= 0.5) out.push({ id: "mf" });
  if (s.mv) out.push({ id: "mv", d: Math.abs(s.t1 - s.t2).toFixed(2) });
  const rings =
    s.light === "night" &&
    (L.halo.type === "rings" || (s.sbs && LENSES[s.cmp].halo.type === "rings"));
  if (rings) out.push({ id: "rings" });
  if (s.lens === "edof" && eye.pupil >= 4.5) out.push({ id: "edof" });
  if (s.dry) out.push({ id: "dry" });
  return out;
}

const LENSES_IDS = new Set<string>(ORDER);
const LIGHTS = new Set<string>(["day", "dusk", "night"]);
const AGES = new Set<string>(["50", "60", "70"]);
const AXES = new Set<string>(["h", "v", "o"]);
const VIEWS = new Set<string>(["bin", "dom", "non"]);

function snapQuarter(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return 0;
  return clamp(Math.round(n * 4) / 4, lo, hi);
}

function pickDistance(n: number, options: readonly number[], fallback: number): number {
  if (!Number.isFinite(n)) return fallback;
  let best = fallback;
  let err = Infinity;
  for (const o of options) {
    const d = Math.abs(o - n);
    if (d < err) {
      err = d;
      best = o;
    }
  }
  return err < 0.02 ? best : fallback;
}

export function encodeHash(s: SimState): string {
  const q = new URLSearchParams();
  q.set("l", s.lens);
  q.set("g", s.light);
  q.set("a", s.age);
  q.set("p", String(s.pupil));
  q.set("pa", s.pupilAuto ? "1" : "0");
  q.set("t1", String(s.t1));
  q.set("mv", s.mv ? "1" : "0");
  q.set("t2", String(s.t2));
  q.set("c", String(s.cyl));
  q.set("to", s.toric ? "1" : "0");
  q.set("r", String(snapRotDeg(s.rot)));
  q.set("ax", s.axis);
  q.set("dry", s.dry ? "1" : "0");
  q.set("v", s.view);
  q.set("m", String(s.mid));
  q.set("n", String(s.near));
  q.set("cmp", s.cmp);
  q.set("sbs", s.sbs ? "1" : "0");
  return q.toString();
}

export function parseHash(hash: string): SimState | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;
  const q = new URLSearchParams(raw);
  if (!q.has("l") && !q.has("g")) return null;
  const lens = q.get("l") ?? DEFAULTS.lens;
  const light = q.get("g") ?? DEFAULTS.light;
  const age = q.get("a") ?? DEFAULTS.age;
  const axis = q.get("ax") ?? DEFAULTS.axis;
  const view = q.get("v") ?? DEFAULTS.view;
  const cmp = q.get("cmp") ?? DEFAULTS.cmp;
  if (!LENSES_IDS.has(lens) || !LIGHTS.has(light) || !AGES.has(age)) return null;
  if (!AXES.has(axis) || !VIEWS.has(view) || !LENSES_IDS.has(cmp)) return null;
  const pupil = Number(q.get("p"));
  const rot = Number(q.get("r"));
  return {
    lens: lens as LensId,
    light: light as LightId,
    pupil: Number.isFinite(pupil) ? clamp(Math.round(pupil * 2) / 2, 2, 7) : DEFAULTS.pupil,
    pupilAuto: q.get("pa") !== "0",
    age: age as AgeId,
    t1: snapQuarter(Number(q.get("t1")), -3, 3),
    mv: q.get("mv") === "1",
    t2: snapQuarter(Number(q.get("t2")), -3, 3),
    cyl: snapQuarter(Number(q.get("c")), 0, 3),
    toric: q.get("to") === "1",
    rot: Number.isFinite(rot) ? snapRotDeg(clamp(rot, 0, 30)) : 0,
    axis: axis as AxisId,
    dry: q.get("dry") === "1",
    view: view as ViewId,
    mid: pickDistance(Number(q.get("m")), MID_OPTIONS, DEFAULTS.mid),
    near: pickDistance(Number(q.get("n")), NEAR_OPTIONS, DEFAULTS.near),
    cmp: cmp as LensId,
    sbs: q.get("sbs") === "1",
  };
}
