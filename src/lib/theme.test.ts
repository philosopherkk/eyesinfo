import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isThemePref,
  resolveTheme,
  themeColorFor,
  THEME_COLOR_DARK,
  THEME_COLOR_LIGHT,
  THEME_STORAGE_KEY,
} from "./theme.ts";

describe("theme", () => {
  it("storage key is eyesinfo.theme", () => {
    assert.equal(THEME_STORAGE_KEY, "eyesinfo.theme");
  });

  it("accepts light/dark/system only", () => {
    assert.equal(isThemePref("light"), true);
    assert.equal(isThemePref("dark"), true);
    assert.equal(isThemePref("system"), true);
    assert.equal(isThemePref("auto"), false);
    assert.equal(isThemePref(null), false);
  });

  it("resolveTheme: light and dark are absolute", () => {
    assert.equal(resolveTheme("light"), "light");
    assert.equal(resolveTheme("dark"), "dark");
  });

  it("theme-color meta values match plan", () => {
    assert.equal(themeColorFor("light"), THEME_COLOR_LIGHT);
    assert.equal(themeColorFor("dark"), THEME_COLOR_DARK);
    assert.equal(THEME_COLOR_LIGHT, "#003153");
    assert.equal(THEME_COLOR_DARK, "#0c1a28");
  });
});
