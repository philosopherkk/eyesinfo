#!/usr/bin/env node
/**
 * Regression: known /c hubs vs unknown → beforeLoad notFound.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("category hub routes", () => {
  it("c.$catId beforeLoad 404s unknown slugs; keeps CATEGORIES + macula chooser", () => {
    const cat = readFileSync(join(root, "src/routes/c.$catId.tsx"), "utf8");
    const home = readFileSync(join(root, "src/components/home-page.tsx"), "utf8");
    const sitemap = readFileSync(join(root, "public/sitemap.xml"), "utf8");
    assert.match(cat, /beforeLoad:\s*\(\{\s*params\s*\}\)\s*=>/);
    assert.match(cat, /isKnownCategoryHub/);
    assert.match(cat, /isAnatomyTopicsChooser/);
    assert.match(cat, /throw notFound\(\)/);
    assert.match(home, /HOME_CATEGORY_HUBS/);
    assert.match(home, /id:\s*"macula"/);
    assert.match(sitemap, /\/c\/macula/);
  });
});
