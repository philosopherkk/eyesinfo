#!/usr/bin/env node
/**
 * Unit check: every EyeAnatomyViewer RELATED target exists in category / topic data.
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

describe("anatomy RELATED targets", () => {
  it("every catId / topicId in ANATOMY_RELATED exists", () => {
    const relatedSrc = readFileSync(join(root, "src/data/anatomy-related.ts"), "utf8");
    const cats = [...relatedSrc.matchAll(/catId:\s*"([^"]+)"/g)].map((m) => m[1]);
    const topics = [...relatedSrc.matchAll(/topicId:\s*"([^"]+)"/g)].map((m) => m[1]);

    const categoryIds = new Set(
      [...readFileSync(join(root, "src/data/topics.ts"), "utf8").matchAll(/id:\s*"(lens|lid|glaucoma|retina|surface)"/g)].map(
        (m) => m[1],
      ),
    );
    // CATEGORIES always defines these five
    for (const id of ["lens", "lid", "glaucoma", "retina", "surface"]) {
      categoryIds.add(id);
    }

    const allTopicIds = new Set([
      ...topicIdsFrom("src/data/topics.ts"),
      ...topicIdsFrom("src/data/extra-topics.ts"),
    ]);

    for (const c of cats) {
      assert.ok(categoryIds.has(c), `missing category ${c}`);
    }
    for (const t of topics) {
      assert.ok(allTopicIds.has(t), `missing topic ${t}`);
    }
  });
});
