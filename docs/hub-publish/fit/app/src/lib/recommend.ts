import { formatGB, formatTokens } from "./format";
import { MODELS, type Model } from "./models";
import type { Machine, Preference, Task } from "./types";

const CONTEXT_STEPS = [
  4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576,
];

const WEIGHTS: Record<
  Preference,
  { quality: number; speed: number; context: number }
> = {
  fast: { quality: 0.3, speed: 0.6, context: 0.1 },
  balanced: { quality: 0.58, speed: 0.28, context: 0.14 },
  smart: { quality: 0.78, speed: 0.1, context: 0.12 },
};

const TARGET_CONTEXT: Record<Task, number> = {
  chat: 32768,
  code: 65536,
  reason: 16384,
  vision: 8192,
  docs: 131072,
};

export type Placement = "gpu" | "apple" | "cpu" | "offload";

export type Device = {
  kind: "gpu" | "apple" | "cpu";
  label: string;
  memoryGB: number;
  bandwidthGBps: number;
  efficiency: number;
  overheadMs: number;
  bandwidthEstimated: boolean;
  note: string;
};

export type ScoredModel = {
  model: Model;
  contextTokens: number;
  tokensPerSec: number;
  memoryGB: number;
  headroomGB: number;
  placement: Placement;
  score: number;
  command: string;
  ollamaDefaultContext: number;
  needsContextOverride: boolean;
  diskOk: boolean;
  pace: string;
  fitLine: string;
};

export type RecommendResult = {
  deviceLabel: string;
  deviceKind: Device["kind"];
  deviceNote: string;
  usableGB: number;
  bandwidthEstimated: boolean;
  best: ScoredModel | null;
  alternatives: ScoredModel[];
  slower: ScoredModel[];
  tooBig: { model: Model; neededGB: number }[];
  emptyReason: string | null;
};

export function memoryNeededGB(model: Model, contextTokens: number): number {
  const kv = (model.kvKiB * contextTokens) / 1024 / 1024;
  return model.weightsGB + kv + model.stateGB + 0.6;
}

export function longestFittingContext(
  model: Model,
  memoryGB: number,
): number | null {
  let best: number | null = null;
  for (const step of CONTEXT_STEPS) {
    if (step > model.maxContext) break;
    if (memoryNeededGB(model, step) + 0.45 <= memoryGB) best = step;
  }
  return best;
}

export function usableSystemMemoryGB(ramGB: number): number {
  return Math.max(1, ramGB - (ramGB <= 8 ? 2 : ramGB <= 16 ? 3.5 : 6));
}

export function tokensPerSecond(
  model: Model,
  device: Pick<Device, "bandwidthGBps" | "efficiency" | "overheadMs">,
): number {
  const bandwidth =
    Math.max(device.bandwidthGBps, 1) * Math.max(device.efficiency, 0.05);
  const weightGB = model.moe
    ? model.weightsGB * (model.activeB / model.totalB) * 1.63
    : model.weightsGB;
  return 1000 / ((weightGB / bandwidth) * 1000 + device.overheadMs);
}

function scoreModel(
  model: Model,
  task: Task,
  preference: Preference,
  tps: number,
  contextTokens: number,
  placement: Placement,
): number {
  const weights = { ...WEIGHTS[preference] };
  if (task === "docs") {
    weights.context += 0.16;
    weights.quality -= 0.08;
    weights.speed -= 0.08;
  }
  const quality = model.quality[task];
  let score =
    weights.quality * quality +
    weights.speed *
      (100 / (1 + Math.exp(-1.1 * Math.log2(Math.max(0.5, tps) / 12)))) +
    weights.context *
      Math.min(100, (contextTokens / TARGET_CONTEXT[task]) * 100);
  if (placement === "offload") score -= 18;
  if (tps < 5) score -= 8;
  return score;
}

function paceFor(tps: number): string {
  if (tps >= 50) return "Replies should feel instant";
  if (tps >= 25) return "Fast enough that a chat feels natural";
  if (tps >= 12) return "Comfortable, if not snappy";
  if (tps >= 6) return "Usable, but longer answers make you wait";
  return "Slow — fine for one question, frustrating for a conversation";
}

function fitLine(
  contextTokens: number,
  memoryGB: number,
  placement: Placement,
  device: Device,
): string {
  const mem = formatGB(memoryGB);
  const ctx = formatTokens(contextTokens);
  if (placement === "offload") {
    return `A ${ctx} window does not fit on ${device.label}. It would spill into system memory and slow down sharply.`;
  }
  if (placement === "apple") {
    return `About ${mem} GB of shared memory, with a ${ctx} context.`;
  }
  if (placement === "gpu") {
    const label = device.label
      .replace(/nvidia|geforce/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    return `About ${mem} GB on ${label}, with a ${ctx} context.`;
  }
  return `About ${mem} GB of system memory, with a ${ctx} context.`;
}

function scoreCandidate(
  model: Model,
  contextTokens: number,
  placement: Placement,
  device: Device,
  machine: Machine,
  task: Task,
  preference: Preference,
  system: Device,
): ScoredModel {
  const active = placement === "offload" ? system : device;
  const tps = tokensPerSecond(model, active);
  const memoryGB = memoryNeededGB(model, contextTokens);
  const pool =
    placement === "offload" ? system.memoryGB : device.memoryGB;
  const gpuMem =
    device.kind === "gpu"
      ? device.memoryGB
      : device.kind === "apple"
        ? device.memoryGB
        : null;
  const ollamaDefaultContext =
    gpuMem == null || gpuMem < 24 ? 4096 : gpuMem < 48 ? 32768 : 262144;
  return {
    model,
    contextTokens,
    tokensPerSec: tps,
    memoryGB,
    headroomGB: Math.max(0, pool - memoryGB),
    placement,
    score: scoreModel(model, task, preference, tps, contextTokens, placement),
    command: `ollama run ${model.tag}`,
    ollamaDefaultContext,
    needsContextOverride: contextTokens > ollamaDefaultContext,
    diskOk: machine.diskFreeGB >= model.weightsGB + 2,
    pace: paceFor(tps),
    fitLine: fitLine(contextTokens, memoryGB, placement, device),
  };
}

export function pickDevice(machine: Machine): Device {
  const discrete = machine.gpus.filter(
    (g) => g.kind === "discrete" && g.vramGB >= 2,
  );
  if (discrete.length > 0) {
    const primary = discrete.reduce((best, g) => {
      const bestBw = best.bandwidthGBps ?? 0;
      return (g.bandwidthGBps ?? 0) > bestBw ? g : best;
    });
    const estimated = primary.bandwidthGBps == null;
    const vram = primary.vramGB;
    const bandwidthGBps =
      primary.bandwidthGBps ??
      (vram >= 80
        ? 2000
        : vram >= 48
          ? 900
          : vram >= 32
            ? 1500
            : vram >= 24
              ? 936
              : vram >= 16
                ? 640
                : vram >= 12
                  ? 450
                  : vram >= 8
                    ? 280
                    : 180);
    const label =
      discrete.length > 1
        ? discrete.map((g) => g.name).join(" + ")
        : primary.name;
    return {
      kind: "gpu",
      label,
      memoryGB: discrete.reduce((sum, g) => sum + g.vramGB, 0),
      bandwidthGBps,
      efficiency: primary.efficiency,
      overheadMs: 0.85,
      bandwidthEstimated: estimated,
      note:
        discrete.length > 1
          ? "Graphics memory adds up across cards. Speed does not — each token still passes through the cards one after another."
          : "",
    };
  }
  if (machine.apple) {
    const share =
      machine.ramGB >= 64 ? 0.75 : machine.ramGB >= 32 ? 0.72 : 0.65;
    return {
      kind: "apple",
      label: machine.cpuName,
      memoryGB: machine.ramGB * share,
      bandwidthGBps: machine.apple.bandwidthGBps,
      efficiency: machine.apple.efficiency,
      overheadMs: 0.85,
      bandwidthEstimated: false,
      note: "Memory is shared with the system, so the model can use only part of it.",
    };
  }
  return {
    kind: "cpu",
    label: "Processor and system memory",
    memoryGB: usableSystemMemoryGB(machine.ramGB),
    bandwidthGBps: machine.dramBandwidthGBps,
    efficiency: 0.5,
    overheadMs: 2.2,
    bandwidthEstimated: true,
    note: "No dedicated GPU found. The model can run, using system memory, which is slower than graphics memory.",
  };
}

export function recommend(
  machine: Machine,
  task: Task,
  preference: Preference,
): RecommendResult {
  const device = pickDevice(machine);
  const system: Device = {
    kind: "cpu",
    label: "system memory",
    memoryGB: usableSystemMemoryGB(machine.ramGB),
    bandwidthGBps: machine.dramBandwidthGBps,
    efficiency: 0.5,
    overheadMs: 2.2,
    note: "",
    bandwidthEstimated: true,
  };

  const fits: ScoredModel[] = [];
  const tooBig: { model: Model; neededGB: number }[] = [];

  for (const model of MODELS) {
    if (model.quality[task] <= 0) continue;
    const context = longestFittingContext(model, device.memoryGB);
    if (context != null) {
      const placement: Placement =
        device.kind === "gpu"
          ? "gpu"
          : device.kind === "apple"
            ? "apple"
            : "cpu";
      fits.push(
        scoreCandidate(
          model,
          context,
          placement,
          device,
          machine,
          task,
          preference,
          system,
        ),
      );
      continue;
    }
    if (device.kind === "gpu") {
      const offloadContext = longestFittingContext(model, system.memoryGB);
      if (offloadContext != null) {
        fits.push(
          scoreCandidate(
            model,
            offloadContext,
            "offload",
            device,
            machine,
            task,
            preference,
            system,
          ),
        );
        continue;
      }
    }
    const neededContext = Math.min(8192, model.maxContext);
    tooBig.push({
      model,
      neededGB: memoryNeededGB(model, neededContext) + 0.45,
    });
  }

  fits.sort(
    (a, b) =>
      b.score - a.score || b.model.quality[task] - a.model.quality[task],
  );
  tooBig.sort(
    (a, b) => b.model.quality[task] - a.model.quality[task],
  );

  const best = fits[0] ?? null;
  const alternatives = best
    ? fits.slice(1).filter((f) => f.score >= best.score - 18).slice(0, 4)
    : [];
  const shown = new Set(
    [best, ...alternatives].filter(Boolean).map((f) => f!.model.id),
  );
  const slower = fits.filter((f) => !shown.has(f.model.id)).slice(0, 3);

  return {
    deviceLabel: device.label,
    deviceKind: device.kind,
    deviceNote: device.note,
    usableGB: device.memoryGB,
    bandwidthEstimated: device.bandwidthEstimated,
    best,
    alternatives,
    slower,
    tooBig: tooBig.slice(0, 3),
    emptyReason: best
      ? null
      : "Nothing in the catalog fits in the memory available. More system memory, or a graphics card, is what would change that.",
  };
}

export function contextOverrideCommand(contextTokens: number): string {
  return `OLLAMA_CONTEXT_LENGTH=${contextTokens} ollama serve`;
}
