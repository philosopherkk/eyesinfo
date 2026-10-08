import assert from "node:assert/strict";
import test from "node:test";
import { extract } from "../src/extract.js";
import { buildPatientReport } from "../src/report.js";
import {
  buildReferral,
  completeness,
  sampleOpening,
  suggestUrgency,
  TONES,
} from "../src/referral.js";
import { docToHtml, docToText } from "../src/render.js";

const NOTES = `65M. VA OD 6/12, OS 6/9. IOP OD 14 OS 22 mmHg.
Dx: Cataract OD. POAG OS. No retinal detachment. DM, HT. NKDA.
Plan: latanoprost nocte OS, OCT and visual field, review in 3 months.`;

test("patient report in Traditional Chinese", () => {
  const model = extract(NOTES);
  const text = docToText(buildPatientReport(model, { lang: "zh" }));
  assert.match(text, /你的眼睛檢查摘要/);
  assert.match(text, /右眼：6\/12/);
  assert.match(text, /稍低於正常/);
  assert.match(text, /左眼：22 毫米汞柱/);
  assert.match(text, /高於一般範圍/);
  assert.match(text, /白內障/);
  assert.match(text, /青光眼/);
  assert.match(text, /降眼壓眼藥水/);
  assert.match(text, /約 3 個月/);
  assert.match(text, /致電 999/);
  assert.match(text, /不能代替與註冊醫生的面談/);
  assert.ok(!/latanoprost/i.test(text));
  assert.ok(!/視網膜裂孔／脫落[^]*醫生的檢查發現/.test(text));
});

test("patient report in English, negatives separated and no brand names", () => {
  const model = extract(NOTES);
  const text = docToText(buildPatientReport(model, { lang: "en" }));
  assert.match(text, /Right eye: 6\/12/);
  assert.match(text, /Left eye: 22 mmHg/);
  assert.match(text, /higher than the usual range/);
  assert.match(text, /Things that were checked and not found/);
  assert.match(text, /call 999/);
  assert.ok(!/latanoprost|xalatan/i.test(text));
});

test("warnings can be switched off and explainers trimmed", () => {
  const model = extract(NOTES);
  const text = docToText(
    buildPatientReport(model, { lang: "en", includeWarnings: false, includeExplainers: false }),
  );
  assert.ok(!/999/.test(text));
  assert.ok(!/clouding of the natural lens/.test(text));
});

test("referral keeps clinical facts identical across tones", () => {
  const model = extract(NOTES);
  const base = { urgency: "routine", request: "assess", notes: NOTES, includeNotes: true };
  const letters = [1, 2, 3, 4, 5].map((tone) => docToText(buildReferral(model, { ...base, tone })));
  for (const letter of letters) {
    assert.match(letter, /Right eye: Cataract/);
    assert.match(letter, /Left eye: Glaucoma/);
    assert.match(letter, /Visual acuity: Right 6\/12; Left 6\/9/);
    assert.match(letter, /Intraocular pressure: Right 14 mmHg; Left 22 mmHg/);
    assert.match(letter, /Dear Colleague,/);
    assert.match(letter, /Yours sincerely,/);
  }
  assert.equal(new Set(letters).size, 5);
  assert.ok(letters[4].length > letters[0].length);
  assert.ok(sampleOpening(5).includes("humbly"));
  assert.equal(TONES.length, 5);
});

test("referral urgency subject and suggestion", () => {
  const rd = extract("RD OS with flashes");
  assert.equal(suggestUrgency(rd).level, "emergency");
  assert.equal(suggestUrgency(extract("Cataract OD")).level, "routine");
  assert.equal(suggestUrgency(extract("No RD. Cataract OD")).level, "routine");
  const text = docToText(buildReferral(rd, { urgency: "emergency", tone: 2 }));
  assert.match(text, /EMERGENCY: same-day assessment requested/);
  assert.match(text, /same-day assessment/);
});

test("referral contains placeholders instead of identifiers and optional sections", () => {
  const model = extract(NOTES);
  const text = docToText(
    buildReferral(model, {
      tone: 4,
      urgency: "urgent",
      cluster: "Kowloon East Cluster",
      question: "Is laser appropriate?",
      concerns: "Lives alone and is anxious about driving.",
      informed: true,
      notes: NOTES,
      includeNotes: false,
    }),
  );
  assert.match(text, /Kowloon East Cluster/);
  assert.match(text, /\[name \/ HKID/);
  assert.match(text, /Urgent \(Priority 1\)/);
  assert.match(text, /Specific question: Is laser appropriate\?/);
  assert.match(text, /Lives alone/);
  assert.match(text, /has been informed/);
  assert.ok(!/Clinical notes as recorded/.test(text));
});

test("completeness checklist", () => {
  const items = completeness(extract(NOTES), NOTES, "");
  const byId = Object.fromEntries(items.map((i) => [i.id, i.ok]));
  assert.equal(byId.dx, true);
  assert.equal(byId.va, true);
  assert.equal(byId.iop, true);
  assert.equal(byId.allergy, true);
  assert.equal(byId.systemic, true);
  const empty = Object.fromEntries(
    completeness(extract("hello"), "hello", "").map((i) => [i.id, i.ok]),
  );
  assert.equal(empty.dx, false);
  assert.equal(empty.va, false);
});

test("HTML output escapes content", () => {
  const html = docToHtml({ blocks: [{ t: "p", text: "<script>alert(1)</script>" }] });
  assert.ok(!html.includes("<script>"));
});
