import type { AppleMemory, Gpu } from "./types";

type GpuSpec = {
  match: RegExp;
  bandwidthGBps: number;
  /** Smaller common size when a card was sold with two memory options. */
  vramGB: number;
  efficiency?: number;
};

/**
 * Rated memory bandwidth for cards people actually run local models on.
 * First match wins, so more specific names come before shorter ones.
 */
const GPU_SPECS: GpuSpec[] = [
  { match: /h200/, bandwidthGBps: 4800, vramGB: 141, efficiency: 0.4 },
  { match: /h100/, bandwidthGBps: 3350, vramGB: 80, efficiency: 0.4 },
  { match: /a100.*80|80gb.*a100/, bandwidthGBps: 2039, vramGB: 80, efficiency: 0.4 },
  { match: /a100/, bandwidthGBps: 1555, vramGB: 40, efficiency: 0.43 },
  { match: /rtx\s*pro\s*6000|pro\s*6000\s*blackwell/, bandwidthGBps: 1792, vramGB: 96 },
  { match: /l40s/, bandwidthGBps: 864, vramGB: 48 },
  { match: /6000\s*ada|rtx\s*6000\s*ada/, bandwidthGBps: 960, vramGB: 48 },
  { match: /a6000|rtx\s*a6000/, bandwidthGBps: 768, vramGB: 48 },
  { match: /5090/, bandwidthGBps: 1792, vramGB: 32 },
  { match: /5080/, bandwidthGBps: 960, vramGB: 16 },
  { match: /5070\s*ti/, bandwidthGBps: 896, vramGB: 16 },
  { match: /5070/, bandwidthGBps: 672, vramGB: 12 },
  { match: /5060\s*ti/, bandwidthGBps: 448, vramGB: 8 },
  { match: /5060/, bandwidthGBps: 448, vramGB: 8 },
  { match: /4090/, bandwidthGBps: 1008, vramGB: 24 },
  { match: /4080\s*super/, bandwidthGBps: 736, vramGB: 16 },
  { match: /4080/, bandwidthGBps: 717, vramGB: 16 },
  { match: /4070\s*ti\s*super/, bandwidthGBps: 672, vramGB: 16 },
  { match: /4070\s*ti/, bandwidthGBps: 504, vramGB: 12 },
  { match: /4070\s*super/, bandwidthGBps: 504, vramGB: 12 },
  { match: /4070/, bandwidthGBps: 504, vramGB: 12 },
  { match: /4060\s*ti/, bandwidthGBps: 288, vramGB: 8 },
  { match: /4060/, bandwidthGBps: 272, vramGB: 8 },
  { match: /4050/, bandwidthGBps: 192, vramGB: 6 },
  { match: /3090\s*ti/, bandwidthGBps: 1008, vramGB: 24 },
  { match: /3090/, bandwidthGBps: 936, vramGB: 24 },
  { match: /3080\s*ti/, bandwidthGBps: 912, vramGB: 12 },
  { match: /3080/, bandwidthGBps: 760, vramGB: 10 },
  { match: /3070\s*ti/, bandwidthGBps: 608, vramGB: 8 },
  { match: /3070/, bandwidthGBps: 448, vramGB: 8 },
  { match: /3060\s*ti/, bandwidthGBps: 448, vramGB: 8 },
  { match: /3060/, bandwidthGBps: 360, vramGB: 12 },
  { match: /3050/, bandwidthGBps: 224, vramGB: 8 },
  { match: /2080\s*ti/, bandwidthGBps: 616, vramGB: 11 },
  { match: /2080\s*super/, bandwidthGBps: 496, vramGB: 8 },
  { match: /2080/, bandwidthGBps: 448, vramGB: 8 },
  { match: /2070\s*super/, bandwidthGBps: 448, vramGB: 8 },
  { match: /2070/, bandwidthGBps: 448, vramGB: 8 },
  { match: /2060\s*super/, bandwidthGBps: 448, vramGB: 8 },
  { match: /2060/, bandwidthGBps: 336, vramGB: 6 },
  { match: /7900\s*xtx/, bandwidthGBps: 960, vramGB: 24, efficiency: 0.73 },
  { match: /7900\s*xt/, bandwidthGBps: 800, vramGB: 20, efficiency: 0.73 },
  { match: /7900\s*gre/, bandwidthGBps: 576, vramGB: 16, efficiency: 0.73 },
  { match: /7800\s*xt/, bandwidthGBps: 624, vramGB: 16, efficiency: 0.73 },
  { match: /7700\s*xt/, bandwidthGBps: 432, vramGB: 12, efficiency: 0.7 },
  { match: /7600/, bandwidthGBps: 288, vramGB: 8, efficiency: 0.7 },
  { match: /6950\s*xt/, bandwidthGBps: 576, vramGB: 16, efficiency: 0.65 },
  { match: /6900\s*xt/, bandwidthGBps: 512, vramGB: 16, efficiency: 0.65 },
  { match: /6800\s*xt/, bandwidthGBps: 512, vramGB: 16, efficiency: 0.65 },
  { match: /6800/, bandwidthGBps: 512, vramGB: 16, efficiency: 0.65 },
  { match: /arc\s*b580/, bandwidthGBps: 456, vramGB: 12, efficiency: 0.6 },
  { match: /arc\s*a770/, bandwidthGBps: 560, vramGB: 16, efficiency: 0.55 },
  { match: /arc\s*a750/, bandwidthGBps: 512, vramGB: 8, efficiency: 0.55 },
];

export function lookupGpu(name: string): {
  bandwidthGBps: number;
  efficiency: number;
  vramGB: number;
} | null {
  const key = name
    .toLowerCase()
    .replace(/nvidia|geforce|graphics|laptop gpu/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  for (const spec of GPU_SPECS) {
    if (spec.match.test(key)) {
      return {
        bandwidthGBps: spec.bandwidthGBps,
        efficiency: spec.efficiency ?? 0.82,
        vramGB: spec.vramGB,
      };
    }
  }
  return null;
}

const APPLE_BANDWIDTH: Record<
  string,
  { base: number; pro: number; max: number; ultra: number }
> = {
  "1": { base: 68, pro: 200, max: 400, ultra: 800 },
  "2": { base: 100, pro: 200, max: 400, ultra: 800 },
  "3": { base: 100, pro: 150, max: 400, ultra: 800 },
  "4": { base: 120, pro: 273, max: 546, ultra: 1092 },
  "5": { base: 153, pro: 307, max: 614, ultra: 1228 },
};

export function lookupApple(name: string): AppleMemory | null {
  const lower = name.toLowerCase();
  if (!lower.includes("apple")) return null;
  const table =
    APPLE_BANDWIDTH[/m\s*([1-9])/.exec(lower)?.[1] ?? "4"] ??
    APPLE_BANDWIDTH["4"];
  let bandwidthGBps = table.base;
  if (lower.includes("ultra")) bandwidthGBps = table.ultra;
  else if (lower.includes("max")) bandwidthGBps = table.max;
  else if (lower.includes("pro")) bandwidthGBps = table.pro;
  return {
    bandwidthGBps,
    efficiency: lower.includes("ultra") ? 0.66 : 0.82,
  };
}

export function makeGpu(
  name: string,
  vramGB: number,
  bandwidthGBps: number | null = null,
  efficiency?: number,
): Gpu {
  const looked = lookupGpu(name);
  const fromTable = looked
    ? { bandwidthGBps: looked.bandwidthGBps, efficiency: looked.efficiency }
    : null;
  return {
    name,
    vramGB,
    bandwidthGBps: bandwidthGBps ?? fromTable?.bandwidthGBps ?? null,
    efficiency: efficiency ?? fromTable?.efficiency ?? 0.82,
    kind: "discrete",
  };
}
