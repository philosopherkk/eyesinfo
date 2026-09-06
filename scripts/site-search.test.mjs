import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexSrc = readFileSync(join(root, "src/data/search-index.ts"), "utf8");

describe("search-index Phase 2 synonyms", () => {
  it("maps 飛蚊 to educational floaters / RD targets", () => {
    assert.match(indexSrc, /飛蚊/);
    assert.match(indexSrc, /href:\s*"\/t\/d8"/);
    assert.match(indexSrc, /href:\s*"\/tools\/floaters"/);
  });

  it("maps 青光眼", () => {
    assert.match(indexSrc, /青光眼/);
    assert.match(indexSrc, /href:\s*"\/t\/d4"/);
  });

  it("maps 糖尿上眼 → diabetic retinopathy topic", () => {
    assert.match(indexSrc, /糖尿上眼/);
    assert.match(indexSrc, /href:\s*"\/t\/d6"/);
  });

  it("maps 老花 → presbyopia", () => {
    assert.match(indexSrc, /老花/);
    assert.match(indexSrc, /href:\s*"\/t\/t-presbyopia"/);
  });

  it("documents exclusion of brands / doctor / clinic names", () => {
    assert.match(indexSrc, /Do NOT add drug brands/);
    assert.doesNotMatch(indexSrc, /潘家健/);
    assert.doesNotMatch(indexSrc, /whatsapp/i);
    assert.doesNotMatch(indexSrc, /AcrySof|Restasis|Lucentis|Eylea/i);
  });
});
