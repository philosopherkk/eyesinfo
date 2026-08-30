/** Bright sources measured on /iol/night.jpg (percent of width / height). */
export const NIGHT_LIGHTS: { x: number; y: number; r: number; warm: number }[] = [
  // oncoming headlights — strongest glare
  { x: 39.0, y: 84.5, r: 1.15, warm: 0.08 },
  { x: 44.0, y: 83.0, r: 1.1, warm: 0.1 },
  // lights further down the wet road
  { x: 43.1, y: 69.2, r: 0.75, warm: 0.18 },
  { x: 48.8, y: 65.8, r: 0.7, warm: 0.22 },
  { x: 53.0, y: 58.3, r: 0.58, warm: 0.35 },
  { x: 57.7, y: 60.0, r: 0.52, warm: 0.38 },
  { x: 54.8, y: 44.2, r: 0.42, warm: 0.45 },
  // left street lamps / shop signs
  { x: 25.8, y: 51.7, r: 0.9, warm: 0.82 },
  { x: 24.8, y: 36.7, r: 0.72, warm: 0.78 },
  { x: 21.1, y: 80.0, r: 0.55, warm: 0.7 },
  { x: 14.5, y: 85.0, r: 0.48, warm: 0.65 },
  // right street lamps
  { x: 77.3, y: 31.7, r: 0.8, warm: 0.75 },
  { x: 81.6, y: 45.8, r: 0.72, warm: 0.7 },
  { x: 75.9, y: 54.2, r: 0.62, warm: 0.68 },
  { x: 68.9, y: 56.7, r: 0.5, warm: 0.58 },
  { x: 66.6, y: 46.7, r: 0.42, warm: 0.55 },
];

export type HaloKind = "mono" | "edof" | "mf";

export function haloScale(kind: HaloKind) {
  if (kind === "mono") return { size: 0.72, ring: 0.18, burst: 0, opacity: 0.55 };
  if (kind === "edof") return { size: 1.05, ring: 0.5, burst: 0.15, opacity: 0.78 };
  return { size: 1.35, ring: 0.82, burst: 1, opacity: 0.92 };
}
