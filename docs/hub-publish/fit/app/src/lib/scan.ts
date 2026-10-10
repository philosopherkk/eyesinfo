import { lookupApple, lookupGpu, makeGpu } from "./gpus";
import type { Gpu, Machine } from "./types";

const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|microsoft basic|virtualbox|vmware svga|virtio|aspeed|matrox/;
const INTEGRATED =
  /uhd graphics|iris|radeon\(tm\) graphics|radeon graphics|vega \d|intel hd|intel\(r\) hd/;

export type ScanFacts = {
  cpuName: string;
  physicalCores: number;
  logicalCores: number;
  ramGB: number | null;
  ramCapped: boolean;
  graphics: string[];
  measuredVramGB: number | null;
  diskFreeGB: number;
  platform: string;
  ollamaInstalled: boolean | null;
  source: "browser" | "bridge" | "server";
};

export function parseGraphicsName(raw: string): string {
  const angle = /ANGLE \((?:[^,]*),\s*([^)]*)\)/i.exec(raw);
  let name = (angle?.[1] ?? raw).trim();
  name = name
    .replace(/^ANGLE Metal Renderer:\s*/i, "")
    .replace(/,?\s*Unspecified Version$/i, "")
    .replace(/\s*\(0x[0-9a-f]+\)?/gi, "")
    .replace(/\s+Direct3D.*$/i, "")
    .replace(/\s+vs_\d.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  return name;
}

export function isSoftwareRenderer(name: string): boolean {
  return SOFTWARE_RENDERER.test(name.toLowerCase());
}

export function isIntegratedGraphics(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    !/nvidia|geforce|rtx|gtx|radeon rx|radeon pro|arc a|arc b|intel arc/.test(
      lower,
    ) && INTEGRATED.test(lower)
  );
}

function resolveGpu(
  name: string,
  measuredVramGB: number | null,
): { gpu: Gpu; inferred: boolean } | null {
  if (isSoftwareRenderer(name) || isIntegratedGraphics(name)) return null;
  const looked = lookupGpu(name);
  if (!looked && (measuredVramGB == null || measuredVramGB < 2)) return null;
  const inferred = measuredVramGB == null || measuredVramGB <= 0;
  let vramGB: number;
  if (inferred) {
    const usual = looked?.vramGB ?? 0;
    const lower = name.toLowerCase();
    if (lower.includes("laptop")) {
      if (/4090/.test(lower)) vramGB = 16;
      else if (/4080/.test(lower)) vramGB = 12;
      else if (/4070|3080|3070 ti/.test(lower)) vramGB = 8;
      else vramGB = Math.min(usual, 8);
    } else {
      vramGB = usual;
    }
  } else {
    vramGB = measuredVramGB!;
  }
  if (vramGB < 2) return null;
  return { gpu: makeGpu(name, vramGB), inferred };
}

export function machineFromFacts(facts: ScanFacts): Machine {
  const notes: string[] = [];
  const graphics = facts.graphics.map(parseGraphicsName).filter(Boolean);
  const appleHint =
    [facts.cpuName, ...graphics].find((n) => lookupApple(n)) ?? "";

  let gpus: Gpu[] = [];
  let inferred = false;
  for (const name of graphics) {
    const resolved = resolveGpu(name, facts.measuredVramGB);
    if (resolved) {
      gpus = [resolved.gpu];
      inferred = resolved.inferred;
      break;
    }
  }

  const apple =
    gpus.length === 0 ? lookupApple(appleHint || facts.cpuName) : null;
  const integratedOnly =
    gpus.length === 0 && !apple && graphics.some(isIntegratedGraphics);
  const allSoftware =
    gpus.length === 0 &&
    graphics.length > 0 &&
    graphics.every(isSoftwareRenderer);

  let ramGB = facts.ramGB ?? 0;
  if (facts.ramCapped && ramGB > 0) {
    notes.push(
      `The browser only reports memory up to ${ramGB} GB. If this computer has more, the full scan below will see it.`,
    );
  } else if (ramGB <= 0 && gpus.length > 0) {
    ramGB = Math.max(16, Math.ceil(gpus[0].vramGB + 8));
    notes.push(
      `System memory was hidden by the browser. The pick uses the graphics card, and assumes ${ramGB} GB of system memory.`,
    );
  } else if (ramGB <= 0 && apple) {
    notes.push(
      "This browser hid the unified memory size. Run the full scan to size an Apple silicon Mac.",
    );
  } else if (ramGB <= 0) {
    notes.push(
      "This browser hid the memory size. Run the full scan, or enter the memory yourself.",
    );
  }

  if (inferred && gpus[0]) {
    notes.push(
      `${gpus[0].name} is using its usual memory size, not a reading from the card. A few models of this card shipped with a different amount.`,
    );
  }
  if (integratedOnly) {
    notes.push(
      "Integrated graphics share system memory, so speed follows RAM rather than a graphics card.",
    );
  }
  if (allSoftware) {
    notes.push(
      "The browser is drawing with a software driver, so no dedicated graphics card was found.",
    );
  }
  if (facts.source === "browser") {
    notes.push(
      "Memory speed was estimated, so the tokens-per-second figure is rougher until a full scan.",
    );
  } else {
    notes.push("Memory speed was estimated from the amount of RAM.");
  }

  const dramBandwidthGBps = ramGB >= 64 ? 90 : ramGB >= 32 ? 70 : 45;
  const cpuName =
    (apple && !facts.cpuName.toLowerCase().includes("apple")
      ? appleHint
      : facts.cpuName) || "This computer";

  return {
    cpuName,
    physicalCores: Math.max(1, facts.physicalCores || facts.logicalCores || 1),
    logicalCores: Math.max(1, facts.logicalCores || facts.physicalCores || 1),
    ramGB,
    dramBandwidthGBps,
    gpus,
    apple,
    diskFreeGB: facts.diskFreeGB,
    platform: facts.platform,
    ollamaInstalled: facts.ollamaInstalled,
    notes,
    detectedAt: new Date().toISOString(),
    scan: facts.source,
  };
}

export function browserCommand(origin: string, windows: boolean): string {
  const url = `${origin.replace(/\/$/, "")}/fit-scan.mjs`;
  if (windows) {
    return `curl.exe -fsSL ${url} -o $env:TEMP\\fit-scan.mjs; node $env:TEMP\\fit-scan.mjs`;
  }
  return `curl -fsSL ${url} | node`;
}
