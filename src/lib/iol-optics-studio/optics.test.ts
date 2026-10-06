import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  angularDifference,
  applyScenario,
  calibratedDefaults,
  DEFAULT_STATE,
  distanceFit,
  fitSphere,
  fitToric,
  focusOffsetsMM,
  matrices,
  powerMatrix,
} from "./optics.ts";

describe("iol-optics-studio (educational-paraxial-v1)", () => {
  it("calibrated spherical monofocal focuses infinity at the retina", () => {
    const state = calibratedDefaults();
    const model = matrices(state, 0);
    const offsets = focusOffsetsMM(state, model);
    for (const o of offsets) {
      assert.ok(o !== null);
      assert.ok(Math.abs(o!) < 0.05, `focus offset ${o} mm`);
    }
    assert.ok(model.rmsMM * 1000 < 5, `rms µm ${model.rmsMM * 1000}`);
  });

  it("increasing AL with fixed power puts focus anterior to the new retina", () => {
    const base = calibratedDefaults();
    const longer = { ...base, axialLength: base.axialLength + 1.5 };
    const model = matrices(longer, 0);
    const offsets = focusOffsetsMM(longer, model);
    for (const o of offsets) {
      assert.ok(o !== null);
      assert.ok(o! < -0.2, `expected anterior focus, got ${o}`);
    }
  });

  it("matched toric power+orientation cancel regular corneal astigmatism", () => {
    let state = fitSphere({ ...DEFAULT_STATE, cornealCylinder: 2 });
    state = fitToric(state);
    const model = matrices(state, 0);
    const foci = model.fociMM.filter((v) => v !== null) as number[];
    assert.equal(foci.length, 2);
    assert.ok(Math.abs(foci[0]! - foci[1]!) < 0.05, "meridians should coincide");
    const offsets = focusOffsetsMM(state, model);
    for (const o of offsets) {
      assert.ok(o !== null);
      assert.ok(Math.abs(o!) < 0.08);
    }
  });

  it("rotating matched toric creates residual astigmatism", () => {
    let state = fitToric(fitSphere({ ...DEFAULT_STATE, cornealCylinder: 2 }));
    state = { ...state, toricAxis: (state.cornealAxis + 30) % 180 };
    const model = matrices(state, 0);
    const foci = model.fociMM.filter((v) => v !== null) as number[];
    assert.equal(foci.length, 2);
    assert.ok(Math.abs(foci[0]! - foci[1]!) > 0.15, "residual split expected");
  });

  it("axes 180° apart are equivalent", () => {
    const a = powerMatrix(20, 2, 30, -1);
    const b = powerMatrix(20, 2, 210, -1);
    for (let i = 0; i < 4; i++) {
      assert.ok(Math.abs(a[i]! - b[i]!) < 1e-9);
    }
    assert.equal(angularDifference(90, 270), 0);
    assert.ok(angularDifference(0, 180) < 1e-9);
  });

  it("near-object vergence changes focus without accommodation", () => {
    const far = calibratedDefaults();
    const near = { ...far, objectVergence: 2.5 };
    const farModel = matrices(far, 0);
    const nearModel = matrices(near, 0);
    const farOff = focusOffsetsMM(far, farModel)[0]!;
    const nearOff = focusOffsetsMM(near, nearModel)[0]!;
    assert.ok(Math.abs(farOff) < 0.05);
    // Infinity-calibrated eye: near object focuses behind the retina (no accommodation).
    assert.ok(nearOff > 0.5, `near focus should move behind retina, got ${nearOff}`);
  });

  it("presets are deterministic", () => {
    const a = applyScenario("corrected");
    const b = applyScenario("corrected");
    assert.deepEqual(a, b);
    assert.equal(a.design, "toric");
    assert.equal(a.toricEnabled, true);
    assert.ok(a.cornealCylinder >= 1.9);
    assert.equal(a.toricAxis, a.cornealAxis);

    const rotated = applyScenario("rotated");
    assert.ok(angularDifference(rotated.toricAxis, rotated.cornealAxis) >= 29);

    const long = applyScenario("long");
    assert.equal(long.axialLength, 27);
    assert.equal(long.sphere, calibratedDefaults().sphere);
  });

  it("distanceFit returns finite powers for standard AL", () => {
    const fit = distanceFit(DEFAULT_STATE);
    assert.ok(Number.isFinite(fit.mean));
    assert.ok(fit.mean > 10 && fit.mean < 30);
  });
});
