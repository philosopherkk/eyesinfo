import { makeGpu } from "./gpus";
import type { Machine } from "./types";

export type PreviewId =
  | "gpu8"
  | "gpu12"
  | "gpu16"
  | "gpu24"
  | "gpu32"
  | "mac32"
  | "mac64"
  | "ram16";

export const PREVIEWS: { id: PreviewId; label: string; detail: string }[] = [
  { id: "gpu8", label: "8 GB GPU", detail: "32 GB memory, RTX 4060 class" },
  { id: "gpu12", label: "12 GB GPU", detail: "32 GB memory, RTX 4070 class" },
  { id: "gpu16", label: "16 GB GPU", detail: "32 GB memory, RTX 4080 class" },
  { id: "gpu24", label: "24 GB GPU", detail: "64 GB memory, RTX 4090 class" },
  { id: "gpu32", label: "32 GB GPU", detail: "64 GB memory, RTX 5090 class" },
  { id: "mac32", label: "Mac 32 GB", detail: "M4 Pro, shared memory" },
  { id: "mac64", label: "Mac 64 GB", detail: "M4 Max, shared memory" },
  { id: "ram16", label: "No GPU", detail: "16 GB memory only" },
];

function shell(): Machine {
  return {
    cpuName: "Preview machine",
    physicalCores: 8,
    logicalCores: 16,
    ramGB: 32,
    dramBandwidthGBps: 70,
    gpus: [],
    apple: null,
    diskFreeGB: 500,
    platform: "preview",
    ollamaInstalled: null,
    notes: [],
    detectedAt: "",
  };
}

export function previewMachine(id: PreviewId): Machine {
  const machine = shell();
  switch (id) {
    case "gpu8":
      return { ...machine, gpus: [makeGpu("RTX 4060", 8, 272)] };
    case "gpu12":
      return { ...machine, gpus: [makeGpu("RTX 4070", 12, 504)] };
    case "gpu16":
      return { ...machine, gpus: [makeGpu("RTX 4080", 16, 717)] };
    case "gpu24":
      return {
        ...machine,
        ramGB: 64,
        dramBandwidthGBps: 90,
        gpus: [makeGpu("RTX 4090", 24, 1008)],
      };
    case "gpu32":
      return {
        ...machine,
        ramGB: 64,
        dramBandwidthGBps: 90,
        gpus: [makeGpu("RTX 5090", 32, 1792)],
      };
    case "mac32":
      return {
        ...machine,
        cpuName: "Apple M4 Pro",
        ramGB: 32,
        apple: { bandwidthGBps: 273, efficiency: 0.82 },
      };
    case "mac64":
      return {
        ...machine,
        cpuName: "Apple M4 Max",
        physicalCores: 16,
        logicalCores: 16,
        ramGB: 64,
        apple: { bandwidthGBps: 546, efficiency: 0.82 },
      };
    case "ram16":
      return { ...machine, ramGB: 16, dramBandwidthGBps: 45 };
  }
}

function clamp(n: number, lo: number, hi: number) {
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;
}

export function customMachine(input: {
  ramGB: number;
  vramGB: number;
  bandwidthGBps: number;
  apple: boolean;
}): Machine {
  const ramGB = clamp(input.ramGB, 2, 1024);
  const machine = shell();
  machine.ramGB = ramGB;
  machine.dramBandwidthGBps = ramGB >= 64 ? 90 : ramGB >= 32 ? 70 : 45;
  if (input.apple) {
    machine.cpuName = "Apple silicon";
    machine.apple = {
      bandwidthGBps: clamp(input.bandwidthGBps, 50, 2000),
      efficiency: input.bandwidthGBps >= 1000 ? 0.66 : 0.82,
    };
  } else if (input.vramGB >= 2) {
    machine.gpus = [
      makeGpu(
        "Custom GPU",
        clamp(input.vramGB, 2, 256),
        clamp(input.bandwidthGBps, 50, 8000),
        0.82,
      ),
    ];
  }
  return machine;
}
