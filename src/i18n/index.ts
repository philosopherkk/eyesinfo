import { useCallback, useMemo } from "react";
import { usePrefs } from "@/lib/prefs";
import type { Topic } from "@/data/topics";
import { LEGAL } from "@/data/legal";
import { EDITORIAL } from "@/data/editorial";
import { GLOBE_PROTECT, RED_FLAGS_999, SAME_DAY_EYE } from "@/data/urgent";
import type { Locale } from "./locale";
import { toHans } from "./hans";
import { walkStrings } from "./walk";
import { UI, type UiKey } from "./ui";
import { LEGAL_I18N, TOOL_TEXT } from "./catalog";
import { EN_PACKS } from "./topics-en";
import { JA_PACKS } from "./topics-ja";

export type { Locale } from "./locale";
export { LOCALES } from "./locale";
export { TOOL_TEXT };

function fill<T extends Record<string, string>>(hant: T): T {
  return walkStrings(hant, toHans);
}

const LEGAL_HANT = {
  short: LEGAL.short,
  topicFooter: LEGAL.topicFooter,
  umao: LEGAL.umao,
  ppo: LEGAL.ppo,
  mchk: LEGAL.mchk,
  privacy: LEGAL.privacy,
  notSubstitute: EDITORIAL.notSubstitute,
  noServices: EDITORIAL.noServices,
  disclosure: EDITORIAL.disclosure,
  funding: EDITORIAL.funding,
  correction: EDITORIAL.correction,
};

LEGAL_I18N["zh-Hant"] = LEGAL_HANT;
LEGAL_I18N["zh-Hans"] = fill(LEGAL_HANT);

export function useI18n() {
  const locale = usePrefs((s) => s.locale);
  const setLocale = usePrefs((s) => s.setLocale);

  const t = useCallback(
    (key: UiKey, vars?: Record<string, string | number>) => {
      let s = UI[locale][key] ?? UI["zh-Hant"][key];
      if (locale === "zh-Hans") s = toHans(s);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replaceAll(`{${k}}`, String(v));
        }
      }
      return s;
    },
    [locale],
  );

  const tx = useCallback(
    (s: string) => {
      if (locale === "zh-Hant") return s;
      if (locale === "zh-Hans") return toHans(s);
      return s;
    },
    [locale],
  );

  const legal = LEGAL_I18N[locale];

  return { locale, setLocale, t, tx, legal };
}

export function localizeTopic(topic: Topic, locale: Locale): Topic {
  if (locale === "zh-Hant") return topic;
  if (locale === "zh-Hans") return walkStrings(topic, toHans);
  const pack = locale === "en" ? EN_PACKS[topic.id] : JA_PACKS[topic.id];
  if (!pack) return topic;
  return { ...topic, title: pack.title, tag: pack.tag, meta: pack.meta, blocks: pack.blocks };
}

export function useLocalizedTopic(topic: Topic): Topic {
  const locale = usePrefs((s) => s.locale);
  return useMemo(() => localizeTopic(topic, locale), [topic, locale]);
}

export function useLocalizedList(topics: Topic[]): Topic[] {
  const locale = usePrefs((s) => s.locale);
  return useMemo(() => topics.map((t) => localizeTopic(t, locale)), [topics, locale]);
}

export function localizedUrgent(locale: Locale): {
  flags: string[];
  same: string[];
  globe: string;
} {
  const flags = locale === "zh-Hans" ? RED_FLAGS_999.map(toHans) : RED_FLAGS_999;
  const same = locale === "zh-Hans" ? SAME_DAY_EYE.map(toHans) : SAME_DAY_EYE;
  const globe =
    locale === "zh-Hans"
      ? toHans(GLOBE_PROTECT)
      : locale === "en"
        ? "Suspected penetrating injury or ruptured globe: do not press on the eye, do not remove a foreign body yourself, and do not irrigate forcefully or apply ointment you have at home. Protect with a clean shield or paper cup (do not press). Go to A&E now. If you cannot get there: call 999."
        : locale === "ja"
          ? "穿孔外傷または眼球破裂の疑い：眼球を圧迫しない、異物を自分で抜かない、強く洗い流したり手元の軟膏を塗らない。清潔なシールド／紙コップで覆って保護（圧をかけない）。直ちに救急外来へ。行けない場合は999番に電話。"
          : GLOBE_PROTECT;
  if (locale === "en") {
    return {
      flags: [
        "Sudden drop in vision or sudden blindness",
        "A curtain, a large field cut, or a cloth-like shadow",
        "Brief monocular blackout (one eye goes dark or blank, then recovers)",
        "New double vision",
        "Severe eye pain with headache and vomiting (rule out acute angle-closure glaucoma)",
        "Chemical splash (irrigate first, go to A&E while irrigating)",
        "Penetrating injury, suspected ruptured globe, or other severe trauma",
        "Stroke signs (face droop, limb weakness, slurred speech) plus vision change",
        "After an intravitreal (into-the-eye) injection: worse pain, worse redness, or a sharp vision drop (rule out endophthalmitis)",
      ],
      same: [
        "New or suddenly increased flashes or floaters: urgent ophthalmic assessment is needed (dilated fundus exam is a common step, but what is done is decided by the duty doctor — dilation alone is not enough). If there is also vision loss or a curtain, go to A&E now; if you cannot get there: call 999. Without a curtain and without sudden blindness: same-day assessment as soon as possible by an ophthalmologist who can dilate, or by A&E eye care.",
        "A red, painful eye without severe pain with vomiting or sudden blindness — same-day ophthalmic assessment",
        "Contact-lens-related pain and light sensitivity — same-day assessment; do not delay if pain continues after lens removal",
      ],
      globe,
    };
  }
  if (locale === "ja") {
    return {
      flags: [
        "突然の視力低下または突然の失明",
        "カーテン状の欠損、大きな視野欠損、布で覆われたような影",
        "一過性の片眼暗黒（片眼の視力が短く黒く／消えて、その後戻る）",
        "新たに出た複視",
        "頭痛・嘔吐を伴う強い眼痛（急性閉塞隅角緑内障の除外）",
        "薬品の飛入（まず洗浄し、洗いながら救急へ）",
        "穿孔外傷、眼球破裂の疑い、その他の重い外傷",
        "脳卒中の徴候（顔のゆがみ、手足の力低下、呂律不良）と視力変化",
        "硝子体内注射後の痛み増悪・充血悪化・急な視力低下（眼内炎の除外）",
      ],
      same: [
        "新しい／急に増えた光視または飛蚊：緊急の眼科評価が必要（散瞳眼底はよく行う一歩だが、内容は当直医が決め、「散瞳だけ」では足りない）。視力低下やカーテンを伴う場合は直ちに救急へ；行けない場合は999番。カーテンも突然の失明もない場合：散瞳眼底ができる眼科専門医または救急眼科で当日できるだけ早く評価。",
        "激しい眼痛と嘔吐や突然の失明のない片眼の充血疼痛 — 同日の眼科評価",
        "コンタクトレンズ関連の充血疼痛・羞明 — はずしたあとも痛ければ同日の評価；遅らせない",
      ],
      globe,
    };
  }
  return { flags, same, globe };
}

export function editorialBits(locale: Locale) {
  const name = EDITORIAL.name;
  const title =
    locale === "en"
      ? "Ophthalmologist"
      : locale === "ja"
        ? "眼科専門医"
        : locale === "zh-Hans"
          ? toHans(EDITORIAL.title)
          : EDITORIAL.title;
  const register =
    locale === "en"
      ? "Registered doctor, Medical Council of Hong Kong; Specialist Register (Ophthalmology)"
      : locale === "ja"
        ? "香港医師委員会登録医師；専門医名簿（眼科）"
        : locale === "zh-Hans"
          ? toHans(EDITORIAL.registerNote)
          : EDITORIAL.registerNote;
  const reviewed =
    locale === "en"
      ? "11 September 2026"
      : locale === "ja"
        ? "2026年9月11日"
        : EDITORIAL.reviewed;
  const quals =
    locale === "zh-Hans" ? EDITORIAL.quals.map(toHans) : EDITORIAL.quals;
  const disclosure =
    locale === "zh-Hans"
      ? toHans(EDITORIAL.disclosure)
      : locale === "en"
        ? "Publisher / operator: 護眼學堂 (eyesinfo.org). Clinical review: Dr Poon Ka Kin (registered doctor, Medical Council of Hong Kong; Specialist Register (Ophthalmology)). This education site does not provide clinic contact, booking or referral, and does not link to a practice website. This education site currently has no commercial sponsorship; if funding or conflicts of interest arise later, they will be disclosed on the legal page. Education content is shown separately from any clinic promotion; the reviewer may also practise clinically — this site does not refer."
        : locale === "ja"
          ? "発行／運営：護眼學堂（eyesinfo.org）。臨床確認：潘家健医師（香港医師委員会登録医師；専門医名簿（眼科））。本教育サイトは診療所の連絡・予約・紹介を行わず、診療所サイトにもリンクしません。現時点で商業スポンサーはありません；今後の資金提供や利益関係があれば法令頁で開示します。教育内容は診療所宣伝と分けて示します；確認者は臨床も行うことがあり、紹介はしません。"
          : EDITORIAL.disclosure;
  const correction =
    locale === "zh-Hans"
      ? toHans(EDITORIAL.correction)
      : locale === "en"
        ? "If you find an error in the content, notify the operator using the corrections contact listed on the legal page. This site does not receive medical records, bookings or individual care queries through that channel."
        : locale === "ja"
          ? "内容の誤りを見つけた場合は、法令頁に記載の訂正連絡の方法で運営者に知らせてください。この経路では病歴・予約・個別の診療照会は受け付けません。"
          : EDITORIAL.correction;
  return { name, title, register, reviewed, quals, disclosure, correction };
}
