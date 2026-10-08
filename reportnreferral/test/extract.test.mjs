import assert from "node:assert/strict";
import test from "node:test";
import { extract } from "../src/extract.js";

const dxMap = (m) => Object.fromEntries(m.dx.map((d) => [d.id, `${d.status}:${d.eye}`]));

test("VA and IOP per eye, English", () => {
  const m = extract("65M. VA OD 6/12, OS 6/9 (PH 6/7.5). IOP OD 14 OS 22 mmHg.");
  assert.equal(m.va.R, "6/12");
  assert.equal(m.va.L, "6/9, PH 6/7.5");
  assert.deepEqual(m.iop, { R: "14", L: "22" });
  assert.equal(m.age, 65);
  assert.equal(m.sex, "M");
});

test("IOP slash shorthand is right then left; VA keeps line separate", () => {
  const m = extract("IOP 15/17 mmHg, VA RE 6/6 LE 6/12");
  assert.deepEqual(m.iop, { R: "15", L: "17" });
  assert.equal(m.va.R, "6/6");
  assert.equal(m.va.L, "6/12");
});

test("VA with brackets and unaided / corrected tags", () => {
  const m = extract("VA 6/60 (RE) unaided, BCVA 6/9 RE; VA CF (LE)");
  assert.match(m.va.R, /6\/60/);
  assert.match(m.va.R, /6\/9/);
  assert.equal(m.va.L, "CF");
});

test("IOP letters in brackets", () => {
  const m = extract("IOP: 15 (R), 17 (L)");
  assert.deepEqual(m.iop, { R: "15", L: "17" });
});

test("diagnoses with laterality, negation and suspicion", () => {
  const m = extract(
    "Dx: Cataract OD, POAG OS. No RD. R/O wet AMD OS. Early DR OU. Nil glaucoma in the fellow eye.",
  );
  const d = dxMap(m);
  assert.equal(d.cataract, "present:R");
  assert.equal(d.glaucoma, "present:L");
  assert.equal(d.rd, "negated:U");
  assert.equal(d.wamd, "suspected:L");
  assert.equal(d.npdr, "present:B");
});

test("longest match wins: wet AMD is not also AMD, ocular hypertension is not systemic HT", () => {
  const m = extract("Wet AMD OD. Ocular hypertension OS. Known HTN.");
  const d = dxMap(m);
  assert.equal(d.wamd, "present:R");
  assert.equal(d.amd, undefined);
  assert.equal(d.oht, "present:L");
  assert.ok(m.systemic.includes("htn"));
  const only = extract("Ocular hypertension OU");
  assert.ok(!only.systemic.includes("htn"));
});

test("post-surgery wording maps to pseudophakia, not cataract", () => {
  const m = extract("s/p phaco OD. Post cataract surgery OS.");
  assert.equal(dxMap(m).pseudophakia, "present:B");
  assert.equal(dxMap(m).cataract, undefined);
});

test("Chinese notes", () => {
  const m = extract(
    "右眼白內障，左眼青光眼。沒有視網膜脫落。眼壓 右眼 14 左眼 22。計劃：OCT、視野檢查，3個月後覆診。",
  );
  const d = dxMap(m);
  assert.equal(d.cataract, "present:R");
  assert.equal(d.glaucoma, "present:L");
  assert.equal(d.rd, "negated:U");
  assert.deepEqual(m.iop, { R: "14", L: "22" });
  assert.deepEqual(m.followUp, { n: 3, m: null, unit: "month" });
  assert.ok(m.tests.some((t) => t.id === "oct"));
  assert.ok(m.tests.some((t) => t.id === "vf"));
});

test("follow-up shorthand and ranges", () => {
  assert.deepEqual(extract("RV 2/52").followUp, { n: 2, m: null, unit: "week" });
  assert.deepEqual(extract("Review in 3-4 months").followUp, { n: 3, m: 4, unit: "month" });
  assert.deepEqual(extract("f/u 1/12").followUp, { n: 1, m: null, unit: "month" });
  assert.equal(extract("IOP 18 mmHg").followUp, null);
});

test("drug names map to classes only; brands are never matched", () => {
  const m = extract("Start latanoprost nocte OU and timolol. Continue Xalatan.");
  const ids = m.drops.map((d) => d.id);
  assert.deepEqual(ids, ["iop"]);
});

test("treatments and tests", () => {
  const m = extract("Plan: SLT OD, intravitreal injection, phaco IOL OS, DFE, OCT macula, FFA");
  const ids = m.treatments.map((t) => t.id);
  assert.ok(ids.includes("slt"));
  assert.ok(ids.includes("antivegf"));
  assert.ok(ids.includes("cataractsurgery"));
  const tests = m.tests.map((t) => t.id);
  assert.ok(tests.includes("dfe") && tests.includes("oct") && tests.includes("ffa"));
});

test("empty input is safe", () => {
  const m = extract("");
  assert.deepEqual(m.dx, []);
  assert.equal(m.va.R, "");
});

test("IOP is not stolen by an unrelated preceding eye marker", () => {
  const m = extract("VA OD 6/12, OS 6/9. IOP 14/22. Cataract OD.");
  assert.deepEqual(m.iop, { R: "14", L: "22" });
  const lead = extract("OS IOP 19 mmHg");
  assert.deepEqual(lead.iop, { R: "", L: "19" });
});
