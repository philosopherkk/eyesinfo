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

  it("CONTENT_VERSION is 1.73", () => {
    const site = read("src/lib/site.ts");
    assert.match(site, /CONTENT_VERSION\s*=\s*"1\.73"/);
    assert.match(site, /CONTENT_UPDATED\s*=\s*"2026-09-24"/);
  });

  it("ui keys include TOC and related group labels in all locales", () => {
    const ui = read("src/i18n/ui.ts");
    for (const key of ["pageToc", "relatedTopics", "relatedTools", "relatedMore", "relatedNav"]) {
      const hits = [...ui.matchAll(new RegExp(`${key}:`, "g"))];
      assert.equal(hits.length, 3, `${key} should appear in zh/en/ja`);
    }
  });

  it("HKOS video cards map A–U plus LEAD Exact soft pages; soft C/F/O + four LEAD; multi-card cataract/d4; Exact chrome keys", () => {
    const data = read("src/data/hkos-videos.ts");
    const card = read("src/components/hkos-video-card.tsx");
    const page = read("src/routes/t.$topicId.tsx");
    const ui = read("src/i18n/ui.ts");
    for (const id of [
      "4WTPnVGTZEA",
      "p4xkxGxRh-E",
      "eOgJlel8DGw",
      "cPKAYEAgjuc",
      "E1tk-bYGTgY",
      "T0lAQqReMIY",
      "VeQ5zOkYIss",
      "ukB9jv7wHtQ",
      "5aTivFEkGtg",
      "-f1YcyPgNGc",
      "p8d9GaMx7Mo",
      "I469GiYU0Uk",
      "uwi0FBL8m80",
      "kquTYPHnQcw",
      "p04cr1epB2c",
      "NnvroE-Jn7A",
      "i0S-UpBAIfI",
      "7OvJHPnsTyE",
      "EllqSl5B78I",
      "wgFExnBiddA",
      "yU9bhrNHnFk",
      "eyWwLabN5sE",
      "RtbwTyUjbYY",
      "1GEbGcc4tH4",
      "kmneDw1O4bo",
    ]) {
      assert.match(data, new RegExp(id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
    assert.doesNotMatch(data, /68oE2IZ-Hf8/);
    assert.match(data, /"t-myopia"[\s\S]*soft:\s*true[\s\S]*hkosSoftMyopia/);
    assert.match(data, /"t-rvo"[\s\S]*soft:\s*true[\s\S]*hkosSoftRvo/);
    assert.match(data, /d4:[\s\S]*soft:\s*true[\s\S]*hkosSoftGlaucoma/);
    assert.match(
      data,
      /"t-optic-neuritis"[\s\S]*soft:\s*true[\s\S]*hkosSoftOpticNeuritis/,
    );
    assert.match(
      data,
      /"t-corneal-transplant"[\s\S]*soft:\s*true[\s\S]*hkosSoftCornealTransplant/,
    );
    assert.match(data, /"t-nystagmus"[\s\S]*soft:\s*true[\s\S]*hkosSoftNystagmus/);
    assert.match(
      data,
      /"t-ocular-tumours"[\s\S]*soft:\s*true[\s\S]*hkosSoftOcularTumours/,
    );
    assert.match(data, /"t-cataract":\s*\[[\s\S]*p4xkxGxRh-E[\s\S]*EllqSl5B78I/);
    assert.match(data, /d4:\s*\[[\s\S]*p04cr1epB2c[\s\S]*wgFExnBiddA/);
    assert.match(data, /Record<string,\s*HkosVideoEntry\[\]>/);
    assert.match(card, /getHkosVideos/);
    assert.match(card, /hkosDisclaimer/);
    assert.match(card, /target="_blank"/);
    assert.match(card, /noopener noreferrer/);
    assert.match(card, /hkosThumbUrl|hkosWatchUrl/);
    assert.match(data, /i\.ytimg\.com\/vi\/\$\{videoId\}\/hqdefault\.jpg/);
    assert.match(data, /youtube\.com\/watch\?v=\$\{videoId\}/);
    assert.match(page, /HkosVideoCard/);
    for (const key of [
      "hkosSectionHeading",
      "hkosCredit",
      "hkosDisclaimer",
      "hkosSoftMyopia",
      "hkosSoftRvo",
      "hkosSoftGlaucoma",
      "hkosSoftOpticNeuritis",
      "hkosSoftCornealTransplant",
      "hkosSoftNystagmus",
      "hkosSoftOcularTumours",
    ]) {
      const hits = [...ui.matchAll(new RegExp(`${key}:`, "g"))];
      assert.equal(hits.length, 3, `${key} should appear in zh/en/ja`);
    }
    assert.doesNotMatch(ui, /90\s*[–-]\s*95\s*%|好有效/);
    assert.match(ui, /不能保證視力回到阻塞前/);
    assert.match(ui, /本站不以該影片為準/);
    assert.match(ui, /已損失的視野及視神經纖維不能還原/);
    assert.match(ui, /亦不採納該說法/);
    assert.match(ui, /不是治癒、不是保證恢復/);
    assert.match(ui, /亦不要自行用藥/);
    assert.match(ui, /立即急症室／999/);
    assert.match(ui, /不是你的個人預後/);
    assert.match(ui, /亦不做恐嚇式廣告/);
    assert.match(ui, /不保證療效時程/);
    const lasikBlock = data.match(/"t-lasik":\s*\[[\s\S]*?\],\s*\n\s*"t-/);
    assert.ok(lasikBlock, "t-lasik block present");
    assert.match(lasikBlock[0], /I469GiYU0Uk/);
    assert.doesNotMatch(lasikBlock[0], /soft:\s*true/);
  });

  it("CONTENT 1.71 macular hole + ERM Exact land in TC/EN/JA retina hub", () => {
    const extra = read("src/data/extra-topics.ts");
    const en = read("src/i18n/topics-en.ts");
    const ja = read("src/i18n/topics-ja.ts");
    const site = read("src/lib/site.ts");
    const tools = read("src/data/tools.ts");
    const route = read("src/routes/t.$topicId.tsx");
    const hkos = read("src/data/hkos-videos.ts");
    assert.match(site, /CONTENT_VERSION\s*=\s*"1\.73"/);
    for (const id of ["t-macular-hole", "t-erm"]) {
      assert.match(extra, new RegExp(`id:\\s*"${id}"`));
      assert.match(en, new RegExp(`"${id}"\\s*:`));
      assert.match(ja, new RegExp(`"${id}"\\s*:`));
    }
    assert.match(extra, /"t-macular-hole"[\s\S]*category:\s*"retina"/);
    assert.match(extra, /"t-erm"[\s\S]*category:\s*"retina"/);
    assert.match(extra, /仍非保證/);
    assert.match(extra, /不是一發現就必須手術/);
    assert.match(extra, /不是個人風險/);
    assert.match(extra, /不是品牌比較/);
    assert.match(tools, /"t-macular-hole"/);
    assert.match(tools, /"t-erm"/);
    assert.match(route, /"t-mh"\s*:\s*"t-macular-hole"/);
    assert.doesNotMatch(hkos, /"t-macular-hole"|"t-erm"/);
    assert.doesNotMatch(extra, /dr-poon\.html/);
    assert.doesNotMatch(en, /dr-poon\.html/);
    assert.doesNotMatch(ja, /dr-poon\.html/);
  });

  it("CONTENT 1.72 macula anatomy picker: multi-topic chooser, no tools row", () => {
    const related = read("src/data/anatomy-related.ts");
    const viewer = read("src/components/eye-anatomy-viewer.tsx");
    const cat = read("src/routes/c.$catId.tsx");
    const site = read("src/lib/site.ts");
    assert.match(site, /CONTENT_VERSION\s*=\s*"1\.73"/);
    assert.match(related, /macula:\s*\{[\s\S]*?kind:\s*"topics"/);
    for (const id of ["d5", "t-macular-hole", "t-erm", "t-high-myopia-pathology"]) {
      assert.match(related, new RegExp(`"${id}"`));
    }
    assert.match(related, /hub:\s*\{\s*kind:\s*"cat",\s*catId:\s*"retina"/);
    assert.match(related, /ANATOMY_CHOOSER_TITLE/);
    assert.match(related, /macula:\s*"黃斑"/);
    assert.match(related, /macula:\s*"Macula"/);
    assert.match(related, /更多：視網膜與黃斑專題/);
    assert.match(viewer, /黃斑相關主題/);
    assert.match(viewer, /Macula-related topics/);
    assert.match(viewer, /黄斑に関連するテーマ/);
    assert.match(viewer, /RelatedTopicsChooser/);
    assert.match(cat, /isAnatomyTopicsChooser|AnatomyChooserPage/);
    assert.doesNotMatch(viewer, /t-octm|t-vegf|\/amsler/);
    assert.doesNotMatch(viewer, /立即預約|booking|WhatsApp/i);
  });

  it("LEAD Exact topics 1.64 exist in TC/EN/JA with categories and refs", () => {
    const extra = read("src/data/extra-topics.ts");
    const en = read("src/i18n/topics-en.ts");
    const ja = read("src/i18n/topics-ja.ts");
    const cites = read("src/data/citations.ts");
    for (const id of [
      "t-optic-neuritis",
      "t-corneal-transplant",
      "t-nystagmus",
      "t-ocular-tumours",
    ]) {
      assert.match(extra, new RegExp(`id:\\s*"${id}"`));
      assert.match(en, new RegExp(`"${id}"\\s*:`));
      assert.match(ja, new RegExp(`"${id}"\\s*:`));
    }
    assert.match(extra, /"t-optic-neuritis"[\s\S]*category:\s*"glaucoma"/);
    assert.match(extra, /"t-corneal-transplant"[\s\S]*category:\s*"surface"/);
    assert.match(extra, /"t-nystagmus"[\s\S]*category:\s*"lens"/);
    assert.match(extra, /"t-ocular-tumours"[\s\S]*category:\s*"retina"/);
    for (const id of [
      "ontt1992",
      "acgr2008",
      "ehrt2012",
      "coms18",
      "dimaras2012",
    ]) {
      assert.match(cites, new RegExp(`${id}:`));
    }
    assert.match(extra, /不是個人預後/);
    assert.match(extra, /不是治癒保證|不保證治癒/);
  });

  it("PREM Exact 1.65 body deltas on t-cataract / t-dry / d4; no premiere HKOS cards", () => {
    const topics = read("src/data/topics.ts");
    const en = read("src/i18n/topics-en.ts");
    const ja = read("src/i18n/topics-ja.ts");
    const cites = read("src/data/citations.ts");
    const hkos = read("src/data/hkos-videos.ts");

    assert.match(topics, /要不要等「熟」了才做？/);
    assert.match(topics, /FACT（Day 等，Ophthalmology 2020）/);
    assert.match(topics, /FEMCAT（Schweitzer 等，Lancet 2020）/);
    assert.match(topics, /為什麼「點了又點」仍不舒服？/);
    assert.match(topics, /DREAM 隨機試驗/);
    assert.match(topics, /醫生或會討論的三大處理方向/);
    assert.match(topics, /不能還原已失去的視野/);
    assert.match(topics, /LiGHT 試驗支持作為適合個案的一線選擇之一/);

    assert.match(en, /Do you have to wait until it is “ripe”\?/);
    assert.match(en, /FACT \(Day et al\., Ophthalmology 2020\)/);
    assert.match(en, /Why drops again and again still feel inadequate/);
    assert.match(en, /DREAM randomised trial/);
    assert.match(en, /Three care directions a doctor may discuss/);

    assert.match(ja, /「熟してから」手術？/);
    assert.match(ja, /FACT（Dayら、Ophthalmology 2020）/);
    assert.match(ja, /なぜ「点しても点しても」楽にならないのか/);
    assert.match(ja, /DREAM無作為試験/);
    assert.match(ja, /医師が話し合う三大の対処方向/);

    for (const id of ["fact2020", "femcat2020", "dream2018"]) {
      assert.match(cites, new RegExp(`${id}:`));
    }
    assert.match(cites, /pmid:\s*"32386810"/);
    assert.match(cites, /pmid:\s*"31954466"/);
    assert.match(cites, /pmid:\s*"29652551"/);

    assert.match(
      topics,
      /id:\s*"t-cataract"[\s\S]*?refs:\s*\[[^\]]*fact2020[^\]]*femcat2020/,
    );
    assert.match(
      topics,
      /id:\s*"t-dry"[\s\S]*?refs:\s*\[[^\]]*dews2[^\]]*dews2mgmt[^\]]*dream2018/,
    );

    for (const id of ["1Fv0tt5RIrY", "WRreYLmCkXI", "2660xOJZ3as", "_zFsVEKbbBI"]) {
      assert.doesNotMatch(hkos, new RegExp(id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
    assert.doesNotMatch(topics, /t-three-symptoms|三大症狀專題/);
  });

  it("Exact 1.68: nystagmus Chang+Hertle cites; keep 1.67 CME/corneal Exact", () => {
    const topics = read("src/data/topics.ts");
    const en = read("src/i18n/topics-en.ts");
    const ja = read("src/i18n/topics-ja.ts");
    const cites = read("src/data/citations.ts");
    const extra = read("src/data/extra-topics.ts");
    const editorial = read("src/data/editorial.ts");
    const legalPage = read("src/routes/legal.tsx");
    const banner = read("src/components/legal-banner.tsx");
    const shell = read("src/components/app-shell.tsx");
    const home = read("src/components/home-page.tsx");
    const hkos = read("src/data/hkos-videos.ts");

    assert.match(topics, /較需審慎或不宜多焦的情況/);
    assert.doesNotMatch(topics, /較需審慎或通常避免多焦/);
    assert.match(topics, /不宜多焦及多數延伸景深設計/);
    assert.doesNotMatch(topics, /通常避免多焦及多數延伸景深/);
    assert.match(topics, /\["多焦／三焦"[^\]]*"不宜"\]/);
    assert.match(topics, /術後黃斑水腫可發生；糖尿病、後囊破裂者較高/);
    assert.doesNotMatch(topics, /文獻上並不少見；糖尿病、後囊破裂者較高/);
    assert.doesNotMatch(topics, /高峰多在術後 4–6 週/);
    assert.match(topics, /負向光視（顳側陰影感）：早期文獻可見/);
    assert.doesNotMatch(topics, /可至約數個百分點/);
    assert.doesNotMatch(topics, /可達一成以上/);
    assert.match(topics, /後續六年視野進展分析（Montesano 等）/);
    assert.match(topics, /不是品牌比較、不是人人必須/);
    assert.match(topics, /montesano2026light/);
    assert.match(cites, /montesano2026light:/);
    assert.match(cites, /pmid:\s*"41043781"/);
    assert.match(cites, /pmid:\s*"30862377"/);

    assert.match(en, /where multifocals are not suitable/);
    assert.match(en, /Not suitable/);
    assert.match(en, /Post-op macular oedema can occur; higher with diabetes or posterior capsule rupture/);
    assert.doesNotMatch(en, /Not uncommon in the literature; higher with diabetes/);
    assert.doesNotMatch(en, /often peaks at 4–6 weeks/);
    assert.match(en, /seen in early literature/);
    assert.match(en, /Montesano et al\./);
    assert.match(en, /not a brand comparison/);
    assert.match(en, /rejection risk varies by person and disease state — but is never zero/);
    assert.doesNotMatch(en, /lower than for some solid organs/);
    assert.match(en, /not a guarantee of “curing” nystagmus/);
    assert.match(en, /not your personal prognosis and not a brand comparison/);

    assert.match(ja, /多焦点が不適な状況/);
    assert.match(ja, /術後黄斑浮腫は起こり得る；糖尿病・後嚢破損では高め/);
    assert.doesNotMatch(ja, /文献上まれではない；糖尿病・後嚢破損で高め/);
    assert.doesNotMatch(ja, /術後4–6週にピークが多い/);
    assert.match(ja, /早期文献にみられ/);
    assert.match(ja, /Montesanoら/);
    assert.match(ja, /拒絶リスクは人・病状により異なりますが、ゼロではありません/);
    assert.doesNotMatch(ja, /実質臓器移植より拒絶/);
    assert.match(ja, /眼振の治癒」や視力正常化の保証ではありません/);
    assert.match(ja, /個人予後でも、ブランド比較でもありません/);

    assert.match(extra, /排斥風險因人／病情而異，但絕非零風險/);
    assert.doesNotMatch(extra, /低於部分實質器官移植/);
    assert.match(extra, /不是保證「治癒震顫」或視力升至正常/);
    assert.match(extra, /不是你的個人預後，亦不是品牌比較/);
    assert.match(
      extra,
      /refs:\s*\["ehrt2012",\s*"bertsch2017",\s*"chang2023aao",\s*"hertle2010"\]/,
    );
    assert.match(cites, /chang2023aao:/);
    assert.match(cites, /hertle2010:/);
    assert.match(cites, /pmid:\s*"36435636"/);
    assert.match(cites, /pmid:\s*"21061884"/);
    assert.match(cites, /pmid:\s*"22459007"/);
    assert.match(cites, /pmid:\s*"28177849"/);
    assert.doesNotMatch(cites, /pmid:\s*"33598911"/);

    assert.doesNotMatch(extra, /鏈接結構 only/);
    assert.match(editorial, /drkkpoon@gmail\.com/);
    assert.match(editorial, /只供內容糾錯／建議，不處理預約、診症或轉介/);
    assert.doesNotMatch(editorial, /暫未公開營運者電郵/);
    assert.doesNotMatch(editorial, /法律頁所列更正聯絡方式/);
    assert.match(editorial, /ownership:\s*"本站由潘家健醫生創辦、出資及營運"/);
    assert.match(editorial, /funding:\s*"本站由潘家健醫生自資"/);
    assert.match(editorial, /reviewedIso:\s*"2026-09-24"/);
    assert.doesNotMatch(banner, /legal\.funding/);
    assert.match(legalPage, /ed\.ownership/);
    assert.match(legalPage, /ed\.funding/);
    assert.doesNotMatch(legalPage, /本站目前未公開營運者電郵。更正政策見上/);

    assert.match(shell, /ariaCurrentPage/);
    assert.match(home, /newSheets/);
    assert.match(home, /t-optic-neuritis/);
    assert.match(home, /t-corneal-transplant/);
    assert.match(home, /t-nystagmus/);
    assert.match(home, /t-ocular-tumours/);
    assert.match(hkos, /CONTENT_VERSION 1\.69/);
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
