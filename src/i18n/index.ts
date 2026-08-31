import { useCallback, useMemo } from "react";
import { usePrefs } from "@/lib/prefs";
import type { Topic } from "@/data/topics";
import { LEGAL } from "@/data/legal";
import { EDITORIAL } from "@/data/editorial";
import { RED_FLAGS_999, SAME_DAY_EYE } from "@/data/urgent";
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
  independent: EDITORIAL.independent,
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

export function localizedUrgent(locale: Locale): { flags: string[]; same: string[] } {
  const flags = locale === "zh-Hans" ? RED_FLAGS_999.map(toHans) : RED_FLAGS_999;
  const same = locale === "zh-Hans" ? SAME_DAY_EYE.map(toHans) : SAME_DAY_EYE;
  if (locale === "en") {
    return {
      flags: [
        "Sudden drop in vision or sudden blindness",
        "A curtain, a large field cut, or a cloth-like shadow",
        "Severe eye pain with headache and vomiting (rule out acute angle-closure glaucoma)",
        "Chemical splash (irrigate first, go to A&E while irrigating)",
        "Penetrating injury, suspected ruptured globe, or other severe trauma",
        "Stroke signs (face droop, limb weakness, slurred speech) plus vision change",
        "After an injection: worse pain, worse redness, or a sharp vision drop (rule out endophthalmitis)",
      ],
      same: [
        "New flashes or a clear increase in floaters, without a curtain, sudden blindness or severe pain — same-day dilated fundus exam. See an ophthalmologist as soon as possible.",
        "A red, painful eye without vomiting or sudden blindness — same-day ophthalmic assessment",
        "Contact-lens-related pain and light sensitivity — same-day assessment; do not delay if pain continues after lens removal",
      ],
    };
  }
  if (locale === "ja") {
    return {
      flags: [
        "突然の視力低下または突然の失明",
        "カーテン状の欠損、大きな視野欠損、布で覆われたような影",
        "頭痛・嘔吐を伴う強い眼痛（急性閉塞隅角緑内障の除外）",
        "薬品の飛入（まず洗浄し、洗いながら救急へ）",
        "穿孔外傷、眼球破裂の疑い、その他の重い外傷",
        "脳卒中の徴候（顔のゆがみ、手足の力低下、呂律不良）と視力変化",
        "注射後の痛み増悪・充血悪化・急な視力低下（眼内炎の除外）",
      ],
      same: [
        "カーテンや突然の失明・激痛はないが、新しい光視や飛蚊の明らかな増加 — 同日の散瞳眼底。できるだけ早く眼科専門医を受診してください。",
        "嘔吐や突然の失明のない片眼の充血疼痛 — 同日の眼科評価",
        "Contact-lens-related pain and light sensitivity — same-day assessment; do not delay if pain continues after lens removal",
      ],
    };
  }
  return { flags, same };
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
      ? "31 August 2026"
      : locale === "ja"
        ? "2026年8月30日"
        : EDITORIAL.reviewed;
  const quals =
    locale === "zh-Hans" ? EDITORIAL.quals.map(toHans) : EDITORIAL.quals;
  return { name, title, register, reviewed, quals };
}
