import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { makeGpu } from "./gpus";
import { recommend, tokensPerSecond } from "./recommend";
import { modelById } from "./models";
import type { Machine } from "./types";

function machine(overrides: Partial<Machine> & Pick<Machine, "ramGB">): Machine {
  return {
    cpuName: "Test CPU",
    physicalCores: 8,
    logicalCores: 16,
    dramBandwidthGBps: 70,
    gpus: [],
    apple: null,
    diskFreeGB: 200,
    platform: "linux",
    ollamaInstalled: false,
    notes: [],
    detectedAt: "2026-10-10T00:00:00.000Z",
    ...overrides,
  };
}

describe("recommend", () => {
  it("picks Qwen3.5 9B for chat on an 8 GB card", () => {
    const result = recommend(
      machine({ ramGB: 32, gpus: [makeGpu("RTX 4060", 8, 272)] }),
      "chat",
      "balanced",
    );
    assert.equal(result.best?.model.id, "qwen3.5-9b");
    assert.equal(result.best?.placement, "gpu");
    assert.ok((result.best?.contextTokens ?? 0) <= 32768);
    assert.ok((result.best?.contextTokens ?? 0) >= 8192);
  });

  it("steps up to Gemma 4 12B on a 12 GB card", () => {
    const result = recommend(
      machine({ ramGB: 32, gpus: [makeGpu("RTX 4070", 12, 504)] }),
      "chat",
      "balanced",
    );
    assert.equal(result.best?.model.id, "gemma4-12b");
  });

  it("picks gpt-oss 20B when quality matters on 16 GB", () => {
    const result = recommend(
      machine({ ramGB: 32, gpus: [makeGpu("RTX 4080", 16, 717)] }),
      "chat",
      "smart",
    );
    assert.equal(result.best?.model.id, "gpt-oss-20b");
  });

  it("picks Qwen3.8 27B on a 24 GB card for chat", () => {
    const result = recommend(
      machine({ ramGB: 64, gpus: [makeGpu("RTX 4090", 24, 1008)] }),
      "chat",
      "balanced",
    );
    assert.equal(result.best?.model.id, "qwen3.8-27b");
  });

  it("favours the coder on a 24 GB card for code", () => {
    const result = recommend(
      machine({ ramGB: 64, gpus: [makeGpu("RTX 4090", 24, 1008)] }),
      "code",
      "balanced",
    );
    assert.equal(result.best?.model.id, "qwen3-coder-30b");
  });

  it("uses shared memory on Apple silicon", () => {
    const result = recommend(
      machine({
        ramGB: 32,
        cpuName: "Apple M4 Pro",
        apple: { bandwidthGBps: 273, efficiency: 0.82 },
      }),
      "chat",
      "balanced",
    );
    assert.ok(result.best);
    assert.equal(result.best?.placement, "apple");
    assert.equal(result.deviceKind, "apple");
  });

  it("estimates tokens per second from bandwidth", () => {
    const model = modelById("qwen3.5-9b");
    assert.ok(model);
    const tps = tokensPerSecond(model, {
      bandwidthGBps: 272,
      efficiency: 0.82,
      overheadMs: 0.85,
    });
    assert.ok(tps > 10);
    assert.ok(tps < 200);
  });
});
