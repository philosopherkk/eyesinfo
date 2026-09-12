#!/usr/bin/env node
/**
 * UX/IA helpers for topic pages: heading anchors, TOC threshold,
 * first-mention linkify, related chip grouping.
 *
 * Pure logic is inlined here (npm test runs scripts without
 * --experimental-strip-types, so we cannot import TypeScript sources).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

/** Mirrors src/lib/topic-anchors.ts */
function slugifyHeading(text) {
  const raw = text
    .normalize("NFKC")
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .toLowerCase();
  return raw || "section";
}

function resolveHeadingId(text, explicit, used) {
  const base = (explicit?.trim() || slugifyHeading(text)).replace(/^#+/, "");
  let id = base || "section";
  if (!used.has(id)) {
    used.add(id);
    return id;
  }
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;
  id = `${base}-${n}`;
  used.add(id);
  return id;
}

function collectTocEntries(blocks) {
  const used = new Set();
  const entries = [];
  for (const block of blocks) {
    if (block.type !== "h" || !block.text) continue;
    entries.push({
      id: resolveHeadingId(block.text, block.id, used),
      text: block.text,
    });
  }
  return entries;
}

/** Mirrors src/lib/topic-mentions-core.ts */
function linkifyFirstMentions(text, mentions, usedHrefs, selfHref) {
  if (!text) return [{ type: "text", text: "" }];
  const hits = [];
  for (const { phrase, href } of mentions) {
    if (selfHref && href === selfHref) continue;
    if (usedHrefs.has(href)) continue;
    const idx = text.indexOf(phrase);
    if (idx < 0) continue;
    const end = idx + phrase.length;
    if (hits.some((h) => !(end <= h.start || idx >= h.end))) continue;
    hits.push({ start: idx, end, href, phrase });
    usedHrefs.add(href);
  }
  if (hits.length === 0) return [{ type: "text", text }];
  hits.sort((a, b) => a.start - b.start);
  const parts = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start > cursor) parts.push({ type: "text", text: text.slice(cursor, hit.start) });
    parts.push({ type: "link", text: hit.phrase, href: hit.href });
    cursor = hit.end;
  }
  if (cursor < text.length) parts.push({ type: "text", text: text.slice(cursor) });
  return parts;
}

/** Mirrors src/lib/topic-related.ts */
function groupRelatedItems(items) {
  const topics = [];
  const tools = [];
  const other = [];
  for (const item of items) {
    if (item.href.startsWith("/tools/") || item.href === "/amsler" || item.href === "/iol") {
      tools.push(item);
    } else if (
      item.href.startsWith("/t/") ||
      item.href.startsWith("/c/") ||
      item.href === "/urgent"
    ) {
      topics.push(item);
    } else {
      other.push(item);
    }
  }
  return { topics, tools, other };
}

describe("topic structure polish", () => {
  it("topic body sections render as h2 (not h3)", () => {
    const src = read("src/components/topic-body.tsx");
    assert.match(src, /<h2\b/);
    assert.doesNotMatch(src, /<h3\b/);
  });

  it("topic page places related chips before TopicRefs", () => {
    const src = read("src/routes/t.$topicId.tsx");
    const related = src.indexOf("<TopicRelated");
    const refs = src.indexOf("<TopicRefs");
    assert.ok(related > 0 && refs > 0, "missing TopicRelated or TopicRefs");
    assert.ok(related < refs, "TopicRelated must appear before TopicRefs");
  });

  it("TOC + related grouping + mention helpers exist", () => {
    assert.match(read("src/components/topic-toc.tsx"), /pageToc/);
    assert.match(read("src/components/topic-related.tsx"), /relatedTopics/);
    assert.match(read("src/components/topic-related.tsx"), /relatedTools/);
    assert.match(read("src/lib/topic-mentions-core.ts"), /linkifyFirstMentions/);
    assert.match(read("src/lib/topic-anchors.ts"), /TOC_MIN_SECTIONS\s*=\s*6/);
    assert.match(read("src/lib/topic-related.ts"), /PRIMARY_TOPIC_CAP\s*=\s*5/);
  });

  it("CONTENT_VERSION is 1.52", () => {
    const site = read("src/lib/site.ts");
    assert.match(site, /CONTENT_VERSION\s*=\s*"1\.52"/);
    assert.match(site, /CONTENT_UPDATED\s*=\s*"2026-09-12"/);
  });

  it("ui keys include TOC and related group labels in all locales", () => {
    const ui = read("src/i18n/ui.ts");
    for (const key of ["pageToc", "relatedTopics", "relatedTools", "relatedMore", "relatedNav"]) {
      const hits = [...ui.matchAll(new RegExp(`${key}:`, "g"))];
      assert.equal(hits.length, 3, `${key} should appear in zh/en/ja`);
    }
  });
});

describe("topic-anchors + mentions (logic)", () => {
  it("slugify and resolveHeadingId are deterministic and unique", () => {
    const used = new Set();
    const a = resolveHeadingId("是甚麼", undefined, used);
    const b = resolveHeadingId("是甚麼", undefined, used);
    assert.equal(a, "是甚麼");
    assert.equal(b, "是甚麼-2");
    assert.equal(resolveHeadingId("x", "parent-gaps", used), "parent-gaps");
    const toc = collectTocEntries([
      { type: "h", text: "是甚麼" },
      { type: "p", text: "…" },
      { type: "h", text: "求醫" },
    ]);
    assert.deepEqual(
      toc.map((e) => e.text),
      ["是甚麼", "求醫"],
    );
  });

  it("linkifyFirstMentions links each href once, longest phrase first", () => {
    const mentions = [
      { phrase: "青光眼眼藥水", href: "/t/t-gldrops" },
      { phrase: "青光眼總論", href: "/t/d4" },
    ].sort((a, b) => b.phrase.length - a.phrase.length);
    const used = new Set();
    const text =
      "病型見青光眼總論；五類降眼壓藥水見專題「青光眼眼藥水」。再提青光眼眼藥水不應再鏈。";
    const parts = linkifyFirstMentions(text, mentions, used);
    const links = parts.filter((p) => p.type === "link");
    assert.equal(links.length, 2);
    assert.equal(links[0].href, "/t/d4");
    assert.equal(links[1].href, "/t/t-gldrops");
    const again = linkifyFirstMentions("青光眼眼藥水", mentions, used);
    assert.equal(again.filter((p) => p.type === "link").length, 0);
  });

  it("groupRelatedItems splits topics vs tools and leaves urgent with topics", () => {
    const grouped = groupRelatedItems([
      { href: "/tools/rx", label: "眼鏡度數解讀" },
      { href: "/t/t-cl", label: "隱形眼鏡" },
      { href: "/amsler", label: "阿姆斯勒方格" },
      { href: "/urgent", label: "急症" },
      { href: "/iol", label: "晶體視力示意" },
    ]);
    assert.equal(grouped.tools.length, 3);
    assert.equal(grouped.topics.length, 2);
    assert.ok(grouped.topics.some((t) => t.href === "/urgent"));
  });
});
