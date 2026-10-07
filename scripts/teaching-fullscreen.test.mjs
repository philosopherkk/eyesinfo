import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("surgery teaching fullscreen chrome", () => {
  it("ships a shared helper that targets a wrapper, not canvas-only", () => {
    const helper = readFileSync(join(root, "public/js/teaching-fullscreen.js"), "utf8");
    assert.match(helper, /bindTeachingFullscreen/);
    assert.match(helper, /requestFullscreen/);
    assert.match(helper, /viewer \+ stage text \+ timeline/);
  });

  for (const file of ["public/cataract-phaco.html", "public/procedures-3d.html"]) {
    it(`${file} wires enter/exit controls onto #teachingChrome`, () => {
      const html = readFileSync(join(root, file), "utf8");
      assert.match(html, /id="teachingChrome"/);
      assert.match(html, /id="enterFullscreen"/);
      assert.match(html, /id="exitFullscreen"/);
      assert.match(html, /全螢幕 \/ Fullscreen/);
      assert.match(html, /離開全螢幕 \/ Exit fullscreen/);
      assert.match(html, /teaching-fullscreen\.js/);
      assert.match(html, /bindTeachingFullscreen/);
      assert.doesNotMatch(html, /canvas\.requestFullscreen/);
    });
  }

  it("procedure React embed allows iframe fullscreen", () => {
    const page = readFileSync(join(root, "src/routes/tools.procedures.tsx"), "utf8");
    assert.match(page, /allow="fullscreen"/);
    assert.match(page, /allowFullScreen/);
  });
});
