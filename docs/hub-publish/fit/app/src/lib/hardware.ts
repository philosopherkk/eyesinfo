import si from "systeminformation";
import { lookupApple, makeGpu } from "./gpus";
import { machineFromFacts } from "./scan";
import type { Machine } from "./types";

async function ollamaInstalled(): Promise<boolean> {
  try {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const exec = promisify(execFile);
    await exec("ollama", ["--version"], { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

export async function scanHardware(): Promise<Machine> {
  const [cpu, mem, graphics, osInfo, fsSize, ollama] = await Promise.all([
    si.cpu(),
    si.mem(),
    si.graphics(),
    si.osInfo(),
    si.fsSize(),
    ollamaInstalled(),
  ]);

  const ramGB = mem.total / 1024 ** 3;
  const diskFreeGB = fsSize.reduce(
    (sum, fs) => sum + (fs.available ?? 0) / 1024 ** 3,
    0,
  );

  const controllers = graphics.controllers ?? [];
  const names = controllers
    .map((c) => c.model || c.name || "")
    .filter(Boolean);
  const vramCandidates = controllers
    .map((c) => {
      const vram =
        typeof c.vram === "number" && c.vram > 0
          ? c.vram > 256
            ? c.vram / 1024
            : c.vram
          : null;
      return vram;
    })
    .filter((v): v is number => v != null && v >= 2);
  const measuredVramGB =
    vramCandidates.length > 0 ? Math.max(...vramCandidates) : null;

  const cpuName = cpu.brand || cpu.manufacturer || "This computer";
  const apple = lookupApple(cpuName);
  if (apple) {
    return {
      cpuName,
      physicalCores: cpu.physicalCores || cpu.cores || 1,
      logicalCores: cpu.cores || cpu.physicalCores || 1,
      ramGB,
      dramBandwidthGBps: apple.bandwidthGBps,
      gpus: [],
      apple,
      diskFreeGB,
      platform: osInfo.platform || process.platform,
      ollamaInstalled: ollama,
      notes: [],
      detectedAt: new Date().toISOString(),
      scan: "server",
    };
  }

  // Prefer building from discrete controller VRAM when present.
  if (measuredVramGB != null && names.length > 0) {
    const primary =
      controllers.find(
        (c) =>
          typeof c.vram === "number" &&
          (c.vram > 256 ? c.vram / 1024 : c.vram) === measuredVramGB,
      ) ?? controllers[0];
    const name = primary.model || primary.name || names[0];
    return {
      cpuName,
      physicalCores: cpu.physicalCores || cpu.cores || 1,
      logicalCores: cpu.cores || cpu.physicalCores || 1,
      ramGB,
      dramBandwidthGBps: ramGB >= 64 ? 90 : ramGB >= 32 ? 70 : 45,
      gpus: [makeGpu(name, measuredVramGB)],
      apple: null,
      diskFreeGB,
      platform: osInfo.platform || process.platform,
      ollamaInstalled: ollama,
      notes: [],
      detectedAt: new Date().toISOString(),
      scan: "server",
    };
  }

  return machineFromFacts({
    cpuName,
    physicalCores: cpu.physicalCores || cpu.cores || 1,
    logicalCores: cpu.cores || cpu.physicalCores || 1,
    ramGB,
    ramCapped: false,
    graphics: names,
    measuredVramGB,
    diskFreeGB,
    platform: osInfo.platform || process.platform,
    ollamaInstalled: ollama,
    source: "server",
  });
}
