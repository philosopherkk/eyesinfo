export type Task = "chat" | "code" | "reason" | "vision" | "docs";

export type Preference = "fast" | "balanced" | "smart";

export type GpuKind = "discrete" | "integrated";

export type Gpu = {
  name: string;
  vramGB: number;
  /** Null when the card is recognized but its bandwidth is not in the table. */
  bandwidthGBps: number | null;
  efficiency: number;
  kind: GpuKind;
};

export type AppleMemory = {
  bandwidthGBps: number;
  efficiency: number;
};

/** Specs for the computer the app is running on, or a preview of another machine. */
export type Machine = {
  cpuName: string;
  physicalCores: number;
  logicalCores: number;
  ramGB: number;
  dramBandwidthGBps: number;
  gpus: Gpu[];
  apple: AppleMemory | null;
  diskFreeGB: number;
  platform: string;
  ollamaInstalled: boolean | null;
  notes: string[];
  detectedAt: string;
  /**
   * server: the app is running on this computer.
   * browser: the public site read what the browser is allowed to share.
   * bridge: a local helper on this computer reported exact specs.
   */
  scan?: "server" | "browser" | "bridge";
};
