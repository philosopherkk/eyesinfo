import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ghostStrength,
  haloStrength,
  qualityLabel,
  sphereDefocus,
  usableDefocus,
} from "./iol-optics.ts";
import { haloScale } from "./night-lights.ts";

const FAR = 0;
const MID = 1.5;
const NEAR = 2.5;

describe("iol symptom illustration", () => {
  it("keeps enhanced intermediate between monofocal and EDOF at emmetropia", () => {
    const mono = sphereDefocus("mono", 0, MID);
    const emono = sphereDefocus("emono", 0, MID);
    const edof = sphereDefocus("edof", 0, MID);
    assert.ok(emono < mono);
    assert.ok(edof < emono);
    assert.equal(qualityLabel(sphereDefocus("mono", 0, FAR)).key, "clear");
    assert.equal(qualityLabel(sphereDefocus("emono", 0, FAR)).key, "clear");
    assert.equal(qualityLabel(sphereDefocus("edof", 0, FAR)).key, "clear");
  });

  it("keeps EDOF near fine print blurred, including a mild myopic shift", () => {
    const near = sphereDefocus("edof", 0, NEAR);
    assert.equal(qualityLabel(near).key, "blur");
    assert.notEqual(qualityLabel(sphereDefocus("edof", -0.5, NEAR)).key, "clear");
    assert.notEqual(qualityLabel(sphereDefocus("edof", -1, NEAR)).key, "clear");
    assert.ok(sphereDefocus("mf", 0, NEAR) < near);
  });

  it("does not draw multifocal as three clean foci", () => {
    for (const demand of [FAR, MID, NEAR]) {
      assert.ok(sphereDefocus("mf", 0, demand) >= 0.4);
    }
    assert.ok(ghostStrength("mf") > 0);
    assert.equal(ghostStrength("mono"), 0);
    assert.equal(ghostStrength("emono"), 0);
    assert.equal(ghostStrength("edof"), 0);
    assert.ok(usableDefocus("edof", sphereDefocus("edof", 0, NEAR), 0) >
      usableDefocus("edof", sphereDefocus("edof", 0, MID), 0));
  });

  it("keeps night halos monofocal ≈ enhanced < EDOF < multifocal", () => {
    const mono = haloStrength("mono", true);
    const emono = haloStrength("emono", true);
    const edof = haloStrength("edof", true);
    const mf = haloStrength("mf", true);
    assert.ok(Math.abs(emono - mono) < 0.15);
    assert.ok(emono < edof);
    assert.ok(edof < mf);
    assert.equal(haloStrength("mf", false), 0);

    const drawMono = haloScale("mono");
    const drawEmono = haloScale("emono");
    const drawEdof = haloScale("edof");
    const drawMf = haloScale("mf");
    assert.ok(drawEmono.burst < drawEdof.burst);
    assert.ok(drawEdof.burst < drawMf.burst);
    assert.ok(drawEmono.ring < drawEdof.ring);
    assert.equal(drawMf.rings, 2);
    assert.equal(drawEdof.rings, 1);
    assert.ok(drawMf.ghost > 0);
    assert.equal(drawEmono.ghost, 0);
    assert.ok(Math.abs(drawEmono.size - drawMono.size) < 0.2);
  });
});
