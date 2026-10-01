import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OPTICS,
  DISTANCES,
  astigDefocus,
  contrastLoss,
  formatD,
  haloStrength,
  qualityLabel,
  sphereDefocus,
} from "./iol-optics.ts";

describe("iol-optics (simpler /iol)", () => {
  it("lists four optic designs", () => {
    assert.equal(OPTICS.length, 4);
    assert.deepEqual(
      OPTICS.map((o) => o.id),
      ["mono", "emono", "edof", "mf"],
    );
  });

  it("uses agreed EDOF distance / halo wording (no product / 60 cm / ranking)", () => {
    const edof = OPTICS.find((o) => o.id === "edof");
    assert.ok(edof);
    assert.match(edof.note, /遠到中距離，因設計而異/);
    assert.match(edof.note, /光暈因設計而異，不是哪一種較好/);
    assert.doesNotMatch(edof.note, /因產品而異/);
    assert.doesNotMatch(edof.note, /遠至約 60/);
    assert.doesNotMatch(edof.note, /少於多焦/);
    assert.doesNotMatch(edof.note, /接近單焦/);
  });

  it("uses design wording on enhanced monofocal note", () => {
    const emono = OPTICS.find((o) => o.id === "emono");
    assert.ok(emono);
    assert.match(emono.note, /因設計及瞳孔而異/);
    assert.doesNotMatch(emono.note, /因產品/);
  });

  it("marks far distance as not a night-driving assessment", () => {
    const far = DISTANCES.find((d) => d.id === "far");
    assert.ok(far);
    assert.match(far.sub, /不是夜間駕駛能力評估/);
  });

  it("models monofocal emmetropia clearest at distance", () => {
    assert.ok(sphereDefocus("mono", 0, 0) < sphereDefocus("mono", 0, 2.5));
  });

  it("keeps −3.00 near and −2.00 mid focal behaviour for monofocal", () => {
    // −3.00 ≈ 33 cm (demand ~3); −2.00 ≈ 50 cm (demand ~2)
    assert.ok(sphereDefocus("mono", -3, 3) < 0.5);
    assert.ok(sphereDefocus("mono", -2, 2) < 0.5);
  });

  it("zeros residual cylinder when toric is on", () => {
    assert.equal(astigDefocus(1.5, true), 0);
    assert.ok(astigDefocus(1.5, false) > 0);
  });

  it("raises contrast loss and night halo for multifocal vs monofocal", () => {
    assert.ok(contrastLoss("mf") > contrastLoss("mono"));
    assert.ok(haloStrength("mf", true) > haloStrength("mono", true));
    assert.equal(haloStrength("mf", false), 0);
  });

  it("keeps qualitative blur labels", () => {
    assert.equal(qualityLabel(0).text, "清晰");
    assert.equal(qualityLabel(1).text, "模糊");
    assert.equal(qualityLabel(2).text, "很模糊");
  });

  it("formats dioptres with sign", () => {
    assert.equal(formatD(0), "0.00 D");
    assert.equal(formatD(1.25), "+1.25 D");
    assert.equal(formatD(-2), "−2.00 D");
  });
});
