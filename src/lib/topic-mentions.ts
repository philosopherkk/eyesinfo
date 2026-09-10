/**
 * First-mention internal links for topic body copy.
 * Phrases must already appear in education text — do not invent clinical wording.
 */

import { TOPICS } from "@/data/topics";
import { TOOLS } from "@/data/tools";
import {
  linkifyFirstMentions,
  type MentionLink,
  type TextPart,
} from "./topic-mentions-core";

export type { MentionLink, TextPart };
export { linkifyFirstMentions };

/**
 * Short / truncated aliases that appear in body copy but are not full page titles.
 * Keep this list conservative — only stable cross-refs already in TC source.
 */
const MENTION_ALIASES: MentionLink[] = [
  { phrase: "高度近視的長遠風險：病理近視…", href: "/t/t-high-myopia-pathology" },
  { phrase: "高度近視的長遠風險：病理近視", href: "/t/t-high-myopia-pathology" },
  { phrase: "青光眼監察：目標眼壓、OCT／視野與報告解讀", href: "/t/t-glaucoma-monitor" },
  { phrase: "青光眼眼藥水", href: "/t/t-gldrops" },
  { phrase: "青光眼總論", href: "/t/d4" },
  { phrase: "遠視／淺前房專題", href: "/t/t-early" },
  { phrase: "遠視／淺前房與閉角", href: "/t/t-early" },
  { phrase: "類固醇節約用藥", href: "/t/t-steroid-sparing" },
  { phrase: "類固醇節約專題", href: "/t/t-steroid-sparing" },
  { phrase: "類固醇眼藥水", href: "/t/t-steroid" },
  { phrase: "他克莫司用於眼瞼", href: "/t/t-protopic" },
  { phrase: "眼部過敏與香港環境", href: "/t/t-allergy-hk" },
  { phrase: "過敏性結膜炎原則", href: "/t/t-allergy" },
  { phrase: "過敏性結膜炎的處理原則", href: "/t/t-allergy" },
  { phrase: "過敏性結膜炎處理原則專題", href: "/t/t-allergy" },
  { phrase: "藥物原則專題", href: "/t/t-allergy" },
  { phrase: "眼表潤滑劑", href: "/t/t-lube" },
  { phrase: "潤眼液與眼表潤滑劑", href: "/t/t-lube" },
  { phrase: "潤眼液與潤滑劑", href: "/t/t-lube" },
  { phrase: "潤滑劑專題", href: "/t/t-lube" },
  { phrase: "乾眼處理梯階", href: "/t/t-dry" },
  { phrase: "超聲波乳化與人工晶體", href: "/t/t-cataract" },
  { phrase: "超聲波乳化專題", href: "/t/t-cataract" },
  { phrase: "YAG 後囊切開與視網膜屏障激光", href: "/t/t-yag" },
  { phrase: "正確使用眼藥水", href: "/t/t-drops" },
  { phrase: "兒童近視專題", href: "/t/t-myopia" },
  { phrase: "激光矯視專題", href: "/t/t-lasik" },
  { phrase: "隱形眼鏡專題", href: "/t/t-cl" },
  { phrase: "斜視專題", href: "/t/t-strab" },
  { phrase: "斜視與弱視", href: "/t/t-strab" },
  { phrase: "斜視手術", href: "/t/t-strabsx" },
  { phrase: "甲狀腺眼疾", href: "/t/t-ted" },
  { phrase: "葡萄膜炎", href: "/t/t-uveitis" },
  { phrase: "視網膜血管阻塞", href: "/t/t-rvo" },
  { phrase: "巨細胞動脈炎", href: "/t/t-gca" },
  { phrase: "偏頭痛與眼科", href: "/t/t-migraine" },
  { phrase: "阿姆斯勒方格", href: "/amsler" },
  { phrase: "晶體視力示意", href: "/iol" },
  { phrase: "急症頁", href: "/urgent" },
  { phrase: "結膜炎總論", href: "/t/d7" },
];

/** Very short disease names that would over-link if auto-matched from title alone. */
const SKIP_AUTO_TITLES = new Set([
  "青光眼",
  "白內障",
  "結膜炎",
  "乾眼症",
  "屈光不正",
]);

function pushUnique(out: MentionLink[], phrase: string, href: string) {
  const p = phrase.trim();
  if (p.length < 4) return;
  if (out.some((m) => m.phrase === p && m.href === href)) return;
  out.push({ phrase: p, href });
}

/**
 * Build mention catalogue for the current locale's titles.
 * `topicTitles` / `toolTitles` should already be localized when the UI locale is not zh-Hant.
 */
export function buildMentionCatalog(opts: {
  topicTitles?: { id: string; title: string }[];
  toolTitles?: { href: string; title: string }[];
  selfTopicId?: string;
}): MentionLink[] {
  const out: MentionLink[] = [];
  for (const a of MENTION_ALIASES) pushUnique(out, a.phrase, a.href);

  const topics = opts.topicTitles ?? TOPICS.map((t) => ({ id: t.id, title: t.title }));
  for (const t of topics) {
    if (opts.selfTopicId && t.id === opts.selfTopicId) continue;
    if (SKIP_AUTO_TITLES.has(t.title)) continue;
    pushUnique(out, t.title, `/t/${t.id}`);
  }

  const tools =
    opts.toolTitles ??
    TOOLS.map((t) => ({ href: t.href, title: t.title }));
  for (const t of tools) pushUnique(out, t.title, t.href);

  // Longest phrase first so「青光眼眼藥水」wins over shorter siblings.
  out.sort((a, b) => b.phrase.length - a.phrase.length);
  return out;
}
