import { machineFromFacts, type ScanFacts } from "./scan";
import type { Machine } from "./types";

async function readGraphicsNames(): Promise<string[]> {
  const names: string[] = [];
  const nav = navigator as Navigator & {
    gpu?: {
      requestAdapter: () => Promise<{
        info?: { description?: string; vendor?: string; device?: string; architecture?: string };
        requestAdapterInfo?: () => Promise<{
          description?: string;
          vendor?: string;
          device?: string;
          architecture?: string;
        }>;
      } | null>;
    };
  };
  try {
    const adapter = await nav.gpu?.requestAdapter();
    if (adapter) {
      const info =
        adapter.info ?? (await adapter.requestAdapterInfo?.()) ?? {};
      const description = info.description?.trim();
      if (description) names.push(description);
      const joined = [info.vendor, info.device || info.architecture]
        .filter(Boolean)
        .join(" ");
      if (joined) names.push(joined);
    }
  } catch {
    // ignore
  }
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    if (gl && "getExtension" in gl) {
      const ext = (gl as WebGLRenderingContext).getExtension(
        "WEBGL_debug_renderer_info",
      );
      if (ext) {
        const renderer = (gl as WebGLRenderingContext).getParameter(
          ext.UNMASKED_RENDERER_WEBGL,
        );
        if (typeof renderer === "string" && renderer.trim()) {
          names.push(renderer);
        }
      }
    }
  } catch {
    // ignore
  }
  return names;
}

async function readCpuName(graphics: string[]): Promise<{
  name: string;
  platform: string;
  windows: boolean;
}> {
  const nav = navigator as Navigator & {
    userAgentData?: {
      platform?: string;
      getHighEntropyValues?: (
        hints: string[],
      ) => Promise<{ model?: string; platform?: string; architecture?: string }>;
    };
  };
  let platform =
    nav.userAgentData?.platform || navigator.platform || "this computer";
  let model = "";
  try {
    const entropy = await nav.userAgentData?.getHighEntropyValues?.([
      "model",
      "platform",
      "architecture",
    ]);
    if (entropy?.platform) platform = entropy.platform;
    if (entropy?.model) model = entropy.model;
  } catch {
    // ignore
  }
  const windows = /win/i.test(platform);
  const appleGpu = graphics.find((g) => /apple\s*m\d/i.test(g));
  if (appleGpu) {
    return { name: appleGpu, platform: "darwin", windows: false };
  }
  if (model && !/^\s*$/.test(model) && model.toLowerCase() !== "unknown") {
    return { name: model, platform, windows };
  }
  return {
    name: /mac/i.test(platform)
      ? "Mac processor"
      : windows
        ? "Windows processor"
        : /linux|cros/i.test(platform)
          ? "Linux processor"
          : "This computer's processor",
    platform,
    windows,
  };
}

export async function scanBrowser(): Promise<Machine> {
  const graphics = await readGraphicsNames();
  const cpu = await readCpuName(graphics);
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const facts: ScanFacts = {
    cpuName: cpu.name,
    physicalCores: navigator.hardwareConcurrency || 1,
    logicalCores: navigator.hardwareConcurrency || 1,
    ramGB:
      typeof deviceMemory === "number" && deviceMemory > 0
        ? deviceMemory
        : null,
    ramCapped: deviceMemory === 8,
    graphics,
    measuredVramGB: null,
    diskFreeGB: 0,
    platform: cpu.platform,
    ollamaInstalled: null,
    source: "browser",
  };
  return machineFromFacts(facts);
}

export async function readBridge(timeoutMs = 700): Promise<Machine | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch("http://127.0.0.1:41732/hardware", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || typeof data.ramGB !== "number" || data.ramGB <= 0) return null;
    const gpus = Array.isArray(data.gpus) ? data.gpus : [];
    const withVram = gpus.find(
      (g: { vramGB?: number }) =>
        typeof g.vramGB === "number" && g.vramGB > 0,
    );
    return machineFromFacts({
      cpuName: data.cpuName?.trim() || "This computer",
      physicalCores: data.physicalCores || data.logicalCores || 1,
      logicalCores: data.logicalCores || data.physicalCores || 1,
      ramGB: data.ramGB,
      ramCapped: false,
      graphics: gpus.map((g: { name?: string }) => g.name ?? "").filter(Boolean),
      measuredVramGB: withVram?.vramGB ?? null,
      diskFreeGB: typeof data.diskFreeGB === "number" ? data.diskFreeGB : 0,
      platform: data.platform || "linux",
      ollamaInstalled:
        typeof data.ollamaInstalled === "boolean" ? data.ollamaInstalled : null,
      source: "bridge",
    });
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

export function scanModeFromLocation(): "browser" | "server" {
  const params = new URLSearchParams(window.location.search);
  const scan = params.get("scan");
  if (scan === "browser") return "browser";
  if (scan === "server") return "server";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") {
    return "server";
  }
  return "browser";
}
