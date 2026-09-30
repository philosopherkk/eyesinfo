/** Educational defocus model — schematic, not a personal prediction. */

export type Optic = "mono" | "emono" | "edof" | "mf";

export const OPTICS: { id: Optic }[] = [
  { id: "mono" },
  { id: "emono" },
  { id: "edof" },
  { id: "mf" },
];

export const DISTANCES = [
  { id: "far" as const, demand: 0, img: "/iol/far.jpg" },
  { id: "mid" as const, demand: 1.5, img: "/iol/mid.jpg" },
  { id: "near" as const, demand: 2.5, img: "/iol/near.jpg" },
];

export const RANGE_STOPS = [
  { labelKey: "iolStop6" as const, demand: 0 },
  { labelKey: "iolStop2" as const, demand: 0.5 },
  { labelKey: "iolStop1" as const, demand: 1 },
  { labelKey: "iolStop60" as const, demand: 1.67 },
  { labelKey: "iolStop40" as const, demand: 2.5 },
];

/**
 * Illustration knobs only. Not a defocus curve from a study, and not a
 * personal visual acuity.
 *
 * EDOF slopes through intermediate, then falls so 40 cm fine print stays
 * blurred at emmetropia. A mild myopic shift can ease intermediate, but
 * that same shift does not turn 40 cm into a second sharp focus.
 * Multifocal peaks are never a clean monofocal zero: a residual remains
 * so the picture stays softer than a monofocal at its target.
 */
export function sphereDefocus(optic: Optic, target: number, demand: number): number {
  if (optic === "mf") {
    const peaks = [-target, -target + 1.5, -target + 2.5];
    const nearest = Math.min(...peaks.map((p) => Math.abs(demand - p)));
    return nearest + 0.42;
  }
  if (optic === "edof") {
    const x = demand + target;
    if (x < 0) return -x;
    if (x <= 1.2) return x * 0.3;
    return 0.36 + (x - 1.2) * 0.65;
  }
  const dof = optic === "emono" ? 0.72 : 0.32;
  return Math.max(0, Math.abs(demand + target) - dof);
}

export function astigDefocus(cyl: number, toric: boolean): number {
  if (toric) return 0;
  return Math.max(0, cyl) * 0.55;
}

/** CSS contrast reduction (0 = unchanged). Illustration weight, not a CS score. */
export function contrastLoss(optic: Optic): number {
  if (optic === "mf") return 0.38;
  if (optic === "edof") return 0.1;
  if (optic === "emono") return 0.03;
  return 0;
}

/** Second, fainter image. Multifocal only — not a measured ghost diopter. */
export function ghostStrength(optic: Optic): number {
  if (optic === "mf") return 0.34;
  return 0;
}

export function haloStrength(optic: Optic, night: boolean): number {
  if (!night) return 0;
  if (optic === "mf") return 0.92;
  if (optic === "edof") return 0.4;
  if (optic === "emono") return 0.12;
  return 0.08;
}

/** Bar height input: blur plus contrast and ghost, so multifocal peaks are not full. */
export function usableDefocus(optic: Optic, sphere: number, astig: number): number {
  return sphere + astig + contrastLoss(optic) * 1.1 + ghostStrength(optic) * 0.85;
}

export type QualityKey = "clear" | "fair" | "blur" | "very";

export function qualityLabel(defocus: number): {
  key: QualityKey;
  tone: "ok" | "mid" | "bad";
} {
  if (defocus < 0.4) return { key: "clear", tone: "ok" };
  if (defocus < 0.85) return { key: "fair", tone: "mid" };
  if (defocus < 1.6) return { key: "blur", tone: "bad" };
  return { key: "very", tone: "bad" };
}

export function formatD(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(2)} D`;
}

export function formatDegrees(n: number): string {
  const d = Math.round(Math.abs(n) * 100);
  if (n > 0.01) return `遠視 ${d} 度`;
  if (n < -0.01) return `近視 ${d} 度`;
  return "正視 0 度";
}

export function blurPx(defocus: number): number {
  return Math.min(14, defocus * 3.1);
}
