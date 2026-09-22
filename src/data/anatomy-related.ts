import type { Locale } from "@/i18n/locale";

/** Related routes for EyeAnatomyViewer — keep in sync with CATEGORIES / TOPICS. */

export type AnatomyRegionId =
  | "cornea"
  | "anteriorChamber"
  | "lens"
  | "vitreous"
  | "retina"
  | "macula"
  | "opticNerve";

export type AnatomyCatId = "lens" | "lid" | "glaucoma" | "retina" | "surface";

export type AnatomyRelatedLink =
  | { kind: "cat"; catId: AnatomyCatId }
  | { kind: "topic"; topicId: string }
  | {
      kind: "topics";
      topicIds: string[];
      hub: { kind: "cat"; catId: AnatomyCatId };
    };

export const ANATOMY_REGION_ORDER: AnatomyRegionId[] = [
  "cornea",
  "anteriorChamber",
  "lens",
  "vitreous",
  "retina",
  "macula",
  "opticNerve",
];

export const ANATOMY_RELATED: Record<AnatomyRegionId, AnatomyRelatedLink> = {
  cornea: { kind: "cat", catId: "surface" },
  anteriorChamber: { kind: "cat", catId: "glaucoma" },
  lens: { kind: "cat", catId: "lens" },
  vitreous: { kind: "topic", topicId: "d8" },
  retina: { kind: "cat", catId: "retina" },
  macula: {
    kind: "topics",
    topicIds: ["d5", "t-macular-hole", "t-erm", "t-high-myopia-pathology"],
    hub: { kind: "cat", catId: "retina" },
  },
  opticNerve: { kind: "cat", catId: "glaucoma" },
};

/** Section titles for anatomy multi-topic chooser routes (`/c/macula`, …). */
export const ANATOMY_CHOOSER_TITLE: Record<
  Locale,
  Partial<Record<AnatomyRegionId, string>>
> = {
  "zh-Hant": { macula: "黃斑" },
  "zh-Hans": { macula: "黄斑" },
  en: { macula: "Macula" },
  ja: { macula: "黄斑" },
};

export const ANATOMY_CHOOSER_LEAD: Record<
  Locale,
  Partial<Record<AnatomyRegionId, string>>
> = {
  "zh-Hant": {
    macula:
      "視網膜中央專責精細視力與顏色辨識的區域。以下為相關教育專題（不能代替面診）。",
  },
  "zh-Hans": {
    macula:
      "视网膜中央专责精细视力与颜色辨识的区域。以下为相关教育专题（不能代替面诊）。",
  },
  en: {
    macula:
      "The central retina for fine vision and colour. Related education topics below (not a substitute for seeing a doctor).",
  },
  ja: {
    macula:
      "精細視力と色の識別を担う網膜の中心部。以下は関連する教育トピックです（受診の代替ではありません）。",
  },
};

/** Topic labels on the macula (and future) multi-topic chooser pages. */
export const ANATOMY_CHOOSER_TOPIC_LABELS: Record<
  Locale,
  Record<string, string>
> = {
  "zh-Hant": {
    d5: "年齡相關性黃斑病變",
    "t-macular-hole": "黃斑裂孔",
    "t-erm": "黃斑前膜（ERM）",
    "t-high-myopia-pathology": "高度近視：近視性黃斑病變等",
  },
  "zh-Hans": {
    d5: "年龄相关性黄斑病变",
    "t-macular-hole": "黄斑裂孔",
    "t-erm": "黄斑前膜（ERM）",
    "t-high-myopia-pathology": "高度近视：近视性黄斑病变等",
  },
  en: {
    d5: "Age-related macular degeneration",
    "t-macular-hole": "Macular hole",
    "t-erm": "Epiretinal membrane (macular pucker / ERM)",
    "t-high-myopia-pathology": "High myopia: myopic maculopathy & more",
  },
  ja: {
    d5: "加齢黄斑変性",
    "t-macular-hole": "黄斑円孔",
    "t-erm": "黄斑前膜（網膜前膜／ERM）",
    "t-high-myopia-pathology": "強度近視：近視性黄斑症など",
  },
};

export const ANATOMY_CHOOSER_HUB_LABEL: Record<Locale, string> = {
  "zh-Hant": "更多：視網膜與黃斑專題",
  "zh-Hans": "更多：视网膜与黄斑专题",
  en: "More: Retina & macula topics",
  ja: "もっと見る：網膜と黄斑",
};

export function isAnatomyTopicsChooser(id: string): id is AnatomyRegionId {
  const related = ANATOMY_RELATED[id as AnatomyRegionId];
  return Boolean(related && related.kind === "topics");
}
