import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Mirrors public/js/surgery-kit.js advanceProgress (no three import). */
function advanceProgress(progress, stages, weights) {
  const total = weights.length;
  let p = progress;
  let remaining = stages;
  while (remaining > 1e-9 && p < total) {
    const s = Math.min(Math.floor(p + 1e-9), total - 1);
    const w = weights[s];
    const cost = (s + 1 - p) * w;
    if (remaining < cost) {
      p += remaining / w;
      remaining = 0;
    } else {
      p = s + 1;
      remaining -= cost;
    }
  }
  return Math.min(p, total);
}

describe("surgery playback speed options", () => {
  for (const file of ["public/cataract-phaco.html", "public/procedures-3d.html"]) {
    it(`${file} exposes 1×–4× (keeps slower options) and binds session speed`, () => {
      const html = readFileSync(join(root, file), "utf8");
      assert.match(html, /id="speed"/);
      assert.match(html, /value="0\.5"/);
      assert.match(html, /value="1"[^>]*>1×/);
      assert.match(html, /value="2"[^>]*>2×/);
      assert.match(html, /value="3"[^>]*>3×/);
      assert.match(html, /value="4"[^>]*>4×/);
      assert.match(html, /bindPlaybackSpeed\(\$\("speed"\)\)/);
    });
  }

  it("shared helper exports bindPlaybackSpeed", () => {
    const helper = readFileSync(join(root, "public/js/surgery-kit.js"), "utf8");
    assert.match(helper, /export function bindPlaybackSpeed/);
    assert.match(helper, /eyesinfo\.surgery\.playbackSpeed/);
  });

  it("weighted advance scales with speed multiplier", () => {
    const weights = [1, 1, 1];
    const base = 0.25;
    const at1 = advanceProgress(0, base * 1, weights);
    const at3 = advanceProgress(0, base * 3, weights);
    const at4 = advanceProgress(0, base * 4, weights);
    assert.ok(at3 > at1, `3× (${at3}) should advance further than 1× (${at1})`);
    assert.ok(at4 > at3, `4× (${at4}) should advance further than 3× (${at3})`);
    assert.ok(Math.abs(at3 / at1 - 3) < 1e-9, "uniform weights: 3× triples progress");
    assert.ok(Math.abs(at4 / at1 - 4) < 1e-9, "uniform weights: 4× quadruples progress");
  });
});
