#!/usr/bin/env node
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findViolationsInText,
  isExactAllowlisted,
  isNegatedAt,
  normalizeForMatch,
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
    const line =
      'text: "潤滑劑減輕症狀，不是根治。不能保證視力。There are no patient testimonials.";';
    assert.equal(isNegatedAt(normalizeForMatch(line), normalizeForMatch(line).indexOf("保證")), true);
    assert.equal(
      isNegatedAt(
        normalizeForMatch(line),
        normalizeForMatch(line).toLowerCase().indexOf("testimonial"),
      ),
      true,
    );
    const hits = findViolationsInText("x.ts", `${line}\n`);
    assert.equal(hits.length, 0);
  });

  it("allows 不能保證痊癒 (negated multi-word guarantee)", () => {
    const hits = findViolationsInText("x.ts", 'p("不能保證痊癒");\n');
    assert.equal(hits.length, 0);
  });

  it("allows 本站沒有 WhatsApp", () => {
    const hits = findViolationsInText("x.ts", 'p("本站沒有 WhatsApp");\n');
    assert.equal(hits.length, 0);
  });

  it("fails when negation does not cover later publicity", () => {
    const hits = findViolationsInText(
      "x.ts",
      'p("不能保證，但本院最好醫生");\n',
    );
    assert.ok(hits.some((h) => h.phrase === "最好醫生"));
  });

  it("honours exact compliance-allow comments", () => {
    const text = `// compliance-allow: 包靚\nconst s = "包靚";\n`;
    assert.equal(findViolationsInText("x.ts", text).length, 0);
  });

  it("compliance-allow: 保證 does not exempt 保證痊癒", () => {
    assert.equal(isExactAllowlisted("保證痊癒", ["保證"]), false);
    assert.equal(isExactAllowlisted("保證", ["保證"]), true);
    const text = `// compliance-allow: 保證\nconst s = "保證痊癒";\n`;
    const hits = findViolationsInText("x.ts", text);
    assert.ok(hits.some((h) => h.phrase === "保證痊癒"));
  });

  it("flags WhatsApp, wa.me, tel:, and raw HK mobiles", () => {
    const hits = findViolationsInText(
      "x.ts",
      [
        'p("WhatsApp 預約");',
        'a.href = "https://wa.me/85266102363";',
        'a.href = "tel:+85266102363";',
        'p("致電 66102363");',
        "",
      ].join("\n"),
    );
    assert.ok(hits.some((h) => h.phrase === "WhatsApp"));
    assert.ok(hits.some((h) => h.phrase.includes("wa.me")));
    assert.ok(hits.some((h) => h.phrase === "tel: href"));
    assert.ok(hits.some((h) => h.phrase === "HK mobile number"));
  });

  it("normalises zero-width and NFKC before match", () => {
    const hits = findViolationsInText(
      "x.ts",
      'const s = "最\u200B好醫\u200B生";\n',
    );
    assert.ok(hits.some((h) => h.phrase === "最好醫生"));
  });
});
