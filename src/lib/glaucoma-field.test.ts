import assert from "node:assert/strict";
import { test } from "node:test";
import {
  boxBlurRGBA,
  buildLossGrid,
  chartTiles,
  composeScene,
  lossAt,
  prepareScene,
  type FieldPattern,
  type FieldSeverity,
} from "./glaucoma-field.ts";

const PATTERNS: FieldPattern[] = ["arcuate", "nasal", "peripheral"];
const SEVS: FieldSeverity[] = [0, 1, 2, 3];

const mean = (g: Float32Array) => g.reduce((s, v) => s + v, 0) / g.length;

test("mean loss rises with severity for every pattern", () => {
  for (const p of PATTERNS) {
    const m = SEVS.map((s) => mean(buildLossGrid(p, s, 64, 36)));
    for (let i = 1; i < m.length; i++) assert.ok(m[i] > m[i - 1], `${p}: ${m.join(",")}`);
  }
});

test("loss is always within 0..1", () => {
  for (const p of PATTERNS) {
    for (const s of SEVS) {
      for (const v of buildLossGrid(p, s, 64, 36)) assert.ok(v >= 0 && v <= 1);
    }
  }
});

test("centre is preserved in mild and moderate; fixation stays usable at every stage", () => {
  for (const p of PATTERNS) {
    for (const s of [0, 1] as FieldSeverity[]) {
      assert.ok(lossAt(p, s, 0, 0) < 0.1, `${p} sev ${s}`);
      assert.ok(lossAt(p, s, 3, 3) < 0.15, `${p} sev ${s}`);
    }
    assert.ok(lossAt(p, 2, 0, 0) < 0.2);
    assert.ok(lossAt(p, 3, 0, 0) < 0.05);
  }
});

test("nasal step: sharp edge at the nasal horizontal meridian, not at the temporal side", () => {
  const above = lossAt("nasal", 0, -20, 1.5);
  const below = lossAt("nasal", 0, -20, -1.5);
  assert.ok(above - below > 0.25, `${above} vs ${below}`);
  assert.ok(Math.abs(lossAt("nasal", 0, 20, 1.5) - lossAt("nasal", 0, 20, -1.5)) < 0.05);
});

test("arcuate mild: superior arc band, spared centre and spared lower field", () => {
  assert.ok(lossAt("arcuate", 0, -10, 8) > 0.25);
  assert.ok(lossAt("arcuate", 0, -10, -8) < 0.05);
});

test("arcuate: arcs stop at the horizontal midline (mild is superior only)", () => {
  for (const x of [-30, -20, -10, 0, 10]) {
    assert.ok(lossAt("arcuate", 0, x, -2) < 0.05, `x=${x}`);
  }
  assert.ok(lossAt("arcuate", 0, -10, 10) > 0.3);
  assert.ok(Math.abs(lossAt("arcuate", 1, -30, 0.9) - lossAt("arcuate", 1, -30, -0.9)) > 0.15);
  assert.ok(lossAt("arcuate", 1, -20, -8) > 0.2);
  for (const sev of [1, 2] as const) {
    assert.ok(lossAt("arcuate", sev, 8, 0) < lossAt("arcuate", sev, -20, 6));
  }
});

test("arcuate moderate/severe: nasal step (upper deeper than lower) and temporal side clearest", () => {
  assert.ok(lossAt("arcuate", 1, -22, 3) > lossAt("arcuate", 1, -22, -3) + 0.15);
  for (const sev of [1, 2] as const) {
    const nasal = lossAt("arcuate", sev, -22, 6) + lossAt("arcuate", sev, -22, -6);
    const temporal = lossAt("arcuate", sev, 30, 6) + lossAt("arcuate", sev, 30, -6);
    assert.ok(temporal < nasal * 0.5, `sev ${sev}`);
  }
});

test("arcuate severe is not a round ring: horizontal corridor beside fixation stays clearer than the arcs", () => {
  const corridor = lossAt("arcuate", 2, 12, 0);
  const arcAbove = lossAt("arcuate", 2, -4, 13);
  assert.ok(corridor < arcAbove - 0.2);
  const ringE = lossAt("arcuate", 2, 13, 0);
  const ringN = lossAt("arcuate", 2, 0, 13);
  assert.ok(ringN > ringE + 0.2);
});

test("end stage: central island plus temporal island, nasal field gone, all patterns converge", () => {
  for (const p of PATTERNS) {
    assert.ok(lossAt(p, 3, -30, 0) > 0.9);
    assert.ok(lossAt(p, 3, 0, 15) > 0.9);
    assert.ok(lossAt(p, 3, 36, 0) < 0.2);
    assert.equal(lossAt(p, 3, -30, 5), lossAt("arcuate", 3, -30, 5));
  }
});

test("nasal field is lost before temporal field in peripheral constriction", () => {
  assert.ok(lossAt("peripheral", 1, -25, 0) > lossAt("peripheral", 1, 25, 0));
});

test("box blur keeps a flat colour flat", () => {
  const w = 20;
  const h = 12;
  const src = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    src[i * 4] = 100;
    src[i * 4 + 1] = 150;
    src[i * 4 + 2] = 200;
    src[i * 4 + 3] = 255;
  }
  const out = boxBlurRGBA(src, w, h, 3);
  for (let i = 0; i < w * h; i++) {
    assert.ok(Math.abs(out[i * 4] - 100) <= 1);
    assert.ok(Math.abs(out[i * 4 + 1] - 150) <= 1);
    assert.ok(Math.abs(out[i * 4 + 2] - 200) <= 1);
  }
});

test("compose: zero loss returns the sharp image; soft end-stage is not black", () => {
  const w = 32;
  const h = 18;
  const src = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const v = i % 2 ? 220 : 90;
    src[i * 4] = v;
    src[i * 4 + 1] = v;
    src[i * 4 + 2] = v;
    src[i * 4 + 3] = 255;
  }
  const scene = prepareScene(src, w, h);
  const out = new Uint8ClampedArray(src.length);
  composeScene(out, scene, new Float32Array(16 * 9), 16, 9, "soft");
  assert.deepEqual(Array.from(out), Array.from(src));
  composeScene(out, scene, buildLossGrid("arcuate", 3, 16, 9), 16, 9, "soft");
  assert.ok(out[0] > 40, "far-corner soft fill-in should not be black");
  composeScene(out, scene, buildLossGrid("arcuate", 3, 16, 9), 16, 9, "dark");
  assert.ok(out[0] < 30, "dark style is near-black");
});

test("chart tiles sit inside the plotted circle and include the physiological blind spot", () => {
  const t = chartTiles("arcuate", 0);
  assert.ok(t.length > 60 && t.length < 100);
  const bs = t.find((k) => k.x === 15 && k.y === -3);
  assert.ok(bs && bs.v < 0.1);
});
