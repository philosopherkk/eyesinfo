import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isLayoutMode,
  LAYOUT_STORAGE_KEY,
} from "./layout-mode.ts";

describe("layout-mode", () => {
  it("storage key is eyesinfo.layoutMode", () => {
    assert.equal(LAYOUT_STORAGE_KEY, "eyesinfo.layoutMode");
  });

  it("accepts auto/mobile/desktop only", () => {
    assert.equal(isLayoutMode("auto"), true);
    assert.equal(isLayoutMode("mobile"), true);
    assert.equal(isLayoutMode("desktop"), true);
    assert.equal(isLayoutMode("system"), false);
    assert.equal(isLayoutMode(null), false);
  });
});
