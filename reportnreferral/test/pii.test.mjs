import assert from "node:assert/strict";
import test from "node:test";
import { activeFindings, redact, screen } from "../src/pii.js";

const types = (t) => screen(t).map((f) => f.type);
const has = (t, type) => types(t).includes(type);

test("clean ophthalmic notes raise no findings", () => {
  const notes = [
    "65M. VA OD 6/12, OS 6/9. IOP 15/17 mmHg.",
    "Dx: Mild cataract OU, POAG OD. Anterior Segment: Clear. Fundus: CDR 0.7 OD.",
    "Plan: OCT and visual field. Review in 3 months. Past History: DM, HT.",
    "右眼白內障，左眼青光眼，眼壓 15/17，3個月後覆診。高度近視。黃斑 65歲 男",
    "Slit Lamp: no RD. Visual Acuity 20/40 OS. Dry Eye.",
  ].join("\n");
  assert.deepEqual(screen(notes), []);
});

test("HKID in several forms", () => {
  assert.ok(has("HKID A123456(7)", "id"));
  assert.ok(has("ID: AB 123456 (A)", "id"));
  assert.ok(has("Z683365A", "id"));
  assert.ok(has("Ａ１２３４５６（７）", "id"));
});

test("phone numbers and email", () => {
  assert.ok(has("Tel 9123 4567", "phone"));
  assert.ok(has("call +852 6123-4567 today", "phone"));
  assert.ok(has("93456789", "phone"));
  assert.ok(has("write to chan.tm@example.com", "email"));
  assert.ok(has("see https://example.org/x", "url"));
  assert.ok(!has("VA 6/12 IOP 18 2019 2020", "phone"));
});

test("dates are flagged but VA fractions are not", () => {
  assert.ok(has("seen on 12/03/2024", "date"));
  assert.ok(has("seen on 2024-03-12", "date"));
  assert.ok(has("seen 12 March 2024", "date"));
  assert.ok(has("2024年3月12日覆診", "date"));
  assert.ok(has("DOB: 05/06/1958", "dob"));
  assert.ok(!has("VA 6/12 and 6/9, 20/40", "date"));
  assert.ok(!has("IOP 15/17/20", "date"));
});

test("names: labels, honorifics, romanised and Chinese", () => {
  assert.ok(has("Name: Chan Tai Man", "name"));
  assert.ok(has("Patient: Wong Siu Ming, 70F", "name"));
  assert.ok(has("Mr Lee reports blurred vision", "name"));
  assert.ok(has("Dr. Cheung referred the patient", "name"));
  assert.ok(has("CHAN Tai Man 65M with cataract", "name"));
  assert.ok(has("Tai Man CHAN, 65M", "name"));
  assert.ok(has("姓名：陳大文", "name"));
  assert.ok(has("陳先生主訴視力模糊", "name"));
  assert.ok(has("病人：李小明", "name"));
  assert.ok(has("陳大文，65歲男，右眼白內障", "name"));
});

test("names: medical words are not mistaken for names", () => {
  assert.ok(!has("Visual Acuity: Past History: Dry Eye", "name"));
  assert.ok(!has("Patient: Cataract OD", "name"));
  assert.ok(!has("Mr Review", "name"));
});

test("addresses and record numbers", () => {
  assert.ok(has("Address: Flat 5, 12/F, Block B, Happy Court, Kwun Tong", "address"));
  assert.ok(has("Flat 5B", "address"));
  assert.ok(has("住址：九龍觀塘道100號", "address"));
  assert.ok(has("居於 彩虹邨 12 號", "address"));
  assert.ok(has("HN 12345678", "record"));
  assert.ok(has("Case no. AB123456(7)", "record"));
  assert.ok(!has("Flat anterior chamber, tear duct 淚道阻塞", "address"));
});

test("age 90 and over is flagged, younger is not", () => {
  assert.ok(has("92 y/o male", "age"));
  assert.ok(has("101歲", "age"));
  assert.ok(!has("89 y/o male", "age"));
});

test("redact removes every active finding and nothing else matters afterwards", () => {
  const raw =
    "Name: Chan Tai Man, HKID A123456(7), tel 9123 4567, DOB 05/06/1958. VA OD 6/12. Seen on 12/03/2024.";
  const found = activeFindings(raw);
  assert.ok(found.length >= 4);
  const clean = redact(raw, found);
  assert.deepEqual(screen(clean), []);
  assert.match(clean, /VA OD 6\/12/);
  assert.ok(!/Chan|A123456|9123|1958/.test(clean));
});

test("dismissed findings are ignored", () => {
  const f = screen("Mr Lee");
  assert.equal(f.length, 1);
  assert.deepEqual(activeFindings("Mr Lee", new Set([f[0].key])), []);
});

test("name label does not swallow neighbouring identifiers", () => {
  const found = screen("Name: CHAN Tai Man   HKID: A123456(7)   Tel: 9123 4567");
  const byType = Object.fromEntries(found.map((f) => [f.type, f.text.trim()]));
  assert.equal(byType.name, "Name: CHAN Tai Man");
  assert.equal(byType.id, "A123456(7)");
  assert.match(byType.phone, /9123 4567/);
  const tight = screen("Name: Chan Tai Man HKID: A123456(7)");
  assert.equal(tight.find((f) => f.type === "name").text.trim(), "Name: Chan Tai Man");
});

test("longer realistic clean notes stay clean", () => {
  const notes = `Chief Complaint: Gradual blurring of vision in the right eye for 6 months.
Past History: Type 2 diabetes for 10 years, hypertension. No known drug allergy.
Visual Acuity: OD 6/18 (PH 6/12), OS 6/6. IOP 16/15 mmHg by applanation.
Slit Lamp: Lids normal. Conjunctiva quiet. Cornea clear. AC deep and quiet. Iris normal.
Lens: OD NS 2+ PSC 1+, OS clear. Fundus (dilated): OD mild NPDR, no macular oedema. OS normal.
Optic Disc: CDR 0.4 OU, healthy rim. Macula: flat.
Assessment: Cataract OD, mild non-proliferative diabetic retinopathy OD.
Plan: Cataract surgery discussed. Biometry arranged. Repeat OCT macula in 6 months. Dilated review in 12 months.
Advice: Keep blood sugar controlled. Return urgently if flashes, floaters or a curtain appear.
右眼視力 6/18，針孔 6/12。眼壓 16/15。右眼白內障，輕度糖尿上眼，無黃斑水腫。建議白內障手術，6個月後覆診。`;
  assert.deepEqual(
    screen(notes).map((f) => f.text),
    [],
  );
});
