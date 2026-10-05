#!/usr/bin/env node
/**
 * Cataract-day schematic: related topic ids exist, and the incision
 * stays on the cornea, anterior to the scleral wall.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function topicIdsFrom(file) {
  const text = readFileSync(join(root, file), "utf8");
  return [...text.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);
}

describe("cataract simulation related topics", () => {
  it("every listed topic exists and is not the simulation page itself", () => {
    const src = readFileSync(join(root, "src/data/cataract-sim-related.ts"), "utf8");
    const ids = [...src.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    assert.ok(ids.length >= 4, "expected several existing topic ids");
    const all = new Set([
      ...topicIdsFrom("src/data/topics.ts"),
      ...topicIdsFrom("src/data/extra-topics.ts"),
      ...topicIdsFrom("src/data/procedure-day-topics.ts"),
    ]);
    for (const id of ids) {
      assert.ok(all.has(id), `missing topic ${id}`);
      assert.notEqual(id, "t-cataract-day");
    }
    assert.ok(ids.includes("d3"));
    assert.ok(ids.includes("t-cataract"));
    assert.ok(ids.includes("t-iol"));
  });

  it("clear-corneal incision is anterior to the scleral wall", () => {
    const src = readFileSync(join(root, "src/components/procedure-frames.tsx"), "utf8");
    const at = src.indexOf('data-incision="clear-corneal"');
    assert.ok(at > 0, "clear-corneal incision missing");
    const draw = src.slice(at).match(/d="(M[\d. ]+L[\d. ]+)"/);
    assert.ok(draw, "incision path missing");
    const nums = draw[1].match(/[\d.]+/g).map(Number);
    assert.equal(nums.length, 4);
    const [x1, , x2] = nums;
    // Limbus / scleral wall of the side globe is x=62. Both ends stay anterior.
    assert.ok(x1 < 62 && x2 < 62, `incision x ${x1},${x2} is not on the cornea`);
    assert.ok(Math.min(x1, x2) < 50, "external opening should sit outside the corneal dome");
  });
});
