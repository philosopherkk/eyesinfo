import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  AGE,
  DEFAULTS,
  LENSES,
  LIGHT,
  XS,
  autoPupil,
  contrastLoss,
  curveAt,
  encodeHash,
  haloParams,
  parseHash,
  resCyl,
  sigmaFor,
  vaAtDefocus,
  veilVisual,
  warnings,
  type EyeState,
} from "./iol-optics.ts";

const day: EyeState = {
  pupil: 2.5,
  light: "day",
  toric: false,
  cyl: 0,
  rot: 0,
  dry: false,
  t1: 0,
  t2: -0.75,
  mv: false,
};

describe("iol model constants", () => {
  it("uses the drafted curve knots and defaults", () => {
    assert.deepEqual(XS, [1, 0.5, 0, -0.5, -1, -1.5, -2, -2.5, -3, -3.5, -4]);
    assert.deepEqual(
      LENSES.mono.curve,
      [0.28, 0.08, -0.02, 0.06, 0.22, 0.36, 0.5, 0.61, 0.71, 0.79, 0.86],
    );
    assert.deepEqual(
      LENSES.enh.curve,
      [0.27, 0.07, -0.03, 0.03, 0.12, 0.2, 0.33, 0.43, 0.53, 0.63, 0.72],
    );
    assert.deepEqual(
      LENSES.edof.curve,
      [0.22, 0.05, -0.05, 0, 0.07, 0.13, 0.23, 0.33, 0.46, 0.58, 0.68],
    );
    assert.deepEqual(
      LENSES.tri.curve,
      [0.26, 0.08, 0, 0.07, 0.12, 0.09, 0.07, 0.06, 0.17, 0.33, 0.48],
    );
    assert.equal(LENSES.edof.contrast, 0.96);
    assert.equal(LENSES.tri.contrast, 0.88);
    assert.equal(LENSES.tri.halo.type, "rings");
    assert.equal(LENSES.tri.halo.energy, 0.42);
    assert.equal(LENSES.edof.halo.type, "soft");
    assert.equal(LENSES.edof.halo.energy, 0.16);
    assert.equal(LIGHT.night.pupil, 6);
    assert.equal(AGE["60"], -0.5);
    assert.equal(AGE["70"], -1);
    assert.equal(DEFAULTS.lens, "edof");
    assert.equal(DEFAULTS.pupil, 2.5);
    assert.equal(DEFAULTS.t2, -0.75);
  });

  it("interpolates and extrapolates the drafted curve", () => {
    assert.ok(Math.abs(curveAt(LENSES.mono.curve, 0) - -0.02) < 1e-9);
    assert.ok(Math.abs(curveAt(LENSES.mono.curve, 1.5) - (0.28 + 0.5 * 0.35)) < 1e-9);
    assert.ok(Math.abs(curveAt(LENSES.mono.curve, -5) - (0.86 + 0.12)) < 1e-9);
  });

  it("keeps residual cylinder and toric rotation", () => {
    assert.equal(resCyl({ ...day, cyl: 1 }), 1);
    assert.equal(resCyl({ ...day, toric: true, cyl: 1, rot: 0 }), 0);
    const at30 = resCyl({ ...day, toric: true, cyl: 1, rot: 30 });
    assert.ok(Math.abs(at30 - Math.abs(2 * Math.sin((30 * Math.PI) / 180))) < 1e-12);
  });

  it("matches drafted defocus samples", () => {
    assert.equal(vaAtDefocus(LENSES.edof, 0, day), -0.05);
    assert.equal(vaAtDefocus(LENSES.tri, -2.5, day), 0.06);
    assert.equal(vaAtDefocus(LENSES.tri, -2.5, { ...day, pupil: 6 }), 0.14);
    const night = vaAtDefocus(LENSES.tri, 0, { ...day, pupil: 6, light: "night" });
    assert.ok(Math.abs(night - 0.21) < 1e-9);
  });

  it("scales the photo veil so trifocal is darker than EDOF and monofocal stays full", () => {
    const mono = veilVisual(contrastLoss(LENSES.mono, day));
    const enh = veilVisual(contrastLoss(LENSES.enh, day));
    const edof = veilVisual(contrastLoss(LENSES.edof, day));
    const tri = veilVisual(contrastLoss(LENSES.tri, day));
    const triNight = veilVisual(contrastLoss(LENSES.tri, { ...day, light: "night" }));
    assert.equal(mono.alpha, 0);
    assert.equal(mono.contrast, 1);
    assert.equal(enh.alpha, 0);
    assert.ok(enh.contrast > 0.97);
    assert.ok(edof.alpha > 0.12 && edof.alpha < tri.alpha);
    assert.ok(triNight.alpha > tri.alpha);
    assert.ok(triNight.contrast < edof.contrast);
    assert.ok(triNight.contrast >= 0.6);
    assert.ok(triNight.alpha <= 0.4);
  });

  it("gives trifocal night rings more energy than an EDOF soft glow", () => {
    const night = { ...day, pupil: 6, light: "night" as const };
    const tri = haloParams(LENSES.tri, night);
    const edof = haloParams(LENSES.edof, night);
    assert.equal(tri.type, "rings");
    assert.equal(edof.type, "soft");
    assert.ok(tri.energy > edof.energy * 2);
    assert.equal(tri.size, 2);
  });

  it("shifts auto pupil by age", () => {
    assert.equal(autoPupil("day", "60"), 2.5);
    assert.equal(autoPupil("night", "70"), 5);
    assert.equal(autoPupil("dusk", "50"), 4.5);
  });

  it("caps blur and round-trips the link hash", () => {
    assert.equal(sigmaFor(2), 16);
    assert.ok(sigmaFor(0) < 0.3);
    const hash = encodeHash({ ...DEFAULTS, lens: "tri", light: "night", dry: true, sbs: true });
    const back = parseHash(`#${hash}`);
    assert.equal(back?.lens, "tri");
    assert.equal(back?.light, "night");
    assert.equal(back?.dry, true);
    assert.equal(back?.sbs, true);
    assert.equal(back?.t2, -0.75);
  });

  it("emits the drafted caution notes", () => {
    const ids = warnings({
      ...DEFAULTS,
      lens: "tri",
      light: "night",
      pupilAuto: false,
      pupil: 6,
      cyl: 1,
      toric: true,
      rot: 15,
      t1: 0.5,
      mv: true,
      t2: -0.75,
      dry: true,
    }).map((w) => w.id);
    const want = ["cyl", "rot", "diff", "hyper", "mf", "mv", "rings", "dry"] as const;
    for (const id of want) {
      assert.ok(ids.includes(id), id);
    }
    const edof = warnings({ ...DEFAULTS, light: "night", age: "50" }).map((w) => w.id);
    assert.ok(edof.includes("edof"));
  });
});

describe("iol copy", () => {
  it("does not ship product names", () => {
    const files = [
      "src/lib/iol-optics.ts",
      "src/routes/iol.tsx",
      "src/components/iol-scene.tsx",
      "src/components/iol-chart.tsx",
      "src/i18n/ui.ts",
    ];
    const banned =
      /PanOptix|TECNIS|PureSee|Clareon|Alcon|EyHance|Eyhance|Symfony|Vivity|Johnson|ZEN00V|\bFDA\b/i;
    for (const f of files) {
      const text = readFileSync(new URL(`../../${f}`, import.meta.url), "utf8");
      assert.doesNotMatch(text, banned, f);
    }
  });
});
