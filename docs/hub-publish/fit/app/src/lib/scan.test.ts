import assert from "node:assert/strict";
import test from "node:test";
import { browserCommand, machineFromFacts, parseGraphicsName } from "./scan";

test("parses an ANGLE renderer down to the card name", () => {
  const name = parseGraphicsName(
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 (0x00002684) Direct3D11 vs_5_0 ps_5_0, D3D11)",
  );
  assert.equal(name, "NVIDIA GeForce RTX 4090");
});

test("parses an Apple silicon renderer", () => {
  const name = parseGraphicsName(
    "ANGLE (Apple, ANGLE Metal Renderer: Apple M4 Pro, Unspecified Version)",
  );
  assert.equal(name, "Apple M4 Pro");
});

test("a 4090 seen by the browser uses 24 GB and is not the hosting machine", () => {
  const machine = machineFromFacts({
    cpuName: "Windows processor",
    physicalCores: 16,
    logicalCores: 24,
    ramGB: 8,
    ramCapped: true,
    graphics: [
      "ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 (0x2684) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    ],
    measuredVramGB: null,
    diskFreeGB: 0,
    platform: "Windows",
    ollamaInstalled: null,
    source: "browser",
  });
  assert.equal(machine.scan, "browser");
  assert.equal(machine.gpus[0]?.vramGB, 24);
  assert.equal(machine.gpus[0]?.bandwidthGBps, 1008);
  assert.equal(machine.ramGB, 8);
  assert.equal(machine.ollamaInstalled, null);
  assert.ok(machine.notes.some((note) => note.includes("up to 8 GB")));
});

test("software renderers are not treated as a graphics card", () => {
  const machine = machineFromFacts({
    cpuName: "Linux processor",
    physicalCores: 8,
    logicalCores: 16,
    ramGB: 32,
    ramCapped: false,
    graphics: ["llvmpipe (LLVM 15.0.7, 256 bits)"],
    measuredVramGB: null,
    diskFreeGB: 100,
    platform: "linux",
    ollamaInstalled: false,
    source: "browser",
  });
  assert.equal(machine.gpus.length, 0);
  assert.ok(
    machine.notes.some((note) => note.toLowerCase().includes("software")),
  );
});

test("browserCommand builds a one-liner for Unix and Windows", () => {
  assert.match(
    browserCommand("https://fit-llm.vercel.app", false),
    /curl -fsSL https:\/\/fit-llm\.vercel\.app\/fit-scan\.mjs \| node/,
  );
  assert.match(
    browserCommand("https://fit-llm.vercel.app/", true),
    /curl\.exe -fsSL/,
  );
});
