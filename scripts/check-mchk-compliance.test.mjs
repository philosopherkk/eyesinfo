#!/usr/bin/env node
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findViolationsInText,
  isNegatedAt,
} from "./check-mchk-compliance.mjs";

describe("check-mchk-compliance", () => {
  it("flags promotional English and TC phrases", () => {
    const hits = findViolationsInText(
      "x.ts",
      'const s = "best doctor guaranteed cure 最好醫生 保證痊癒";\n',
    );
    const phrases = hits.map((h) => h.phrase);
    assert.ok(phrases.some((p) => p.includes("best doctor")));
    assert.ok(phrases.some((p) => p.includes("guaranteed cure")));
    assert.ok(phrases.some((p) => p.includes("最好醫生")));
    assert.ok(phrases.some((p) => p.includes("保證痊癒")));
  });

  it("allows clearly negated educational wording", () => {
    const line = 'text: "潤滑劑減輕症狀，不是根治。不能保證視力。There are no patient testimonials.";';
    assert.equal(isNegatedAt(line, line.indexOf("保證")), true);
    assert.equal(isNegatedAt(line, line.toLowerCase().indexOf("testimonial")), true);
    const hits = findViolationsInText("x.ts", `${line}\n`);
    assert.equal(hits.length, 0);
  });

  it("honours compliance-allow comments", () => {
    const text = `// compliance-allow: 包靚\nconst s = "包靚";\n`;
    assert.equal(findViolationsInText("x.ts", text).length, 0);
  });

  it("flags WhatsApp and raw HK mobiles outside pmid fields", () => {
    const hits = findViolationsInText(
      "x.ts",
      'p("WhatsApp 預約");\np("致電 66102363");\n',
    );
    assert.ok(hits.some((h) => h.phrase === "WhatsApp"));
    assert.ok(hits.some((h) => h.phrase === "HK mobile number"));
  });
});
