/**
 * HKOS「眼睛解碼」public-education YouTube cards (CONTENT_VERSION 1.69).
 * Linked thumbnail only — no embed. Soft callouts lead the card for Cap/Lex KEEP.
 * A topic may list multiple cards (rendered in array order).
 */

export type HkosSoftCalloutKey =
  | "hkosSoftMyopia"
  | "hkosSoftRvo"
  | "hkosSoftGlaucoma"
  | "hkosSoftOpticNeuritis"
  | "hkosSoftCornealTransplant"
  | "hkosSoftNystagmus"
  | "hkosSoftOcularTumours";

export type HkosVideoEntry = {
  videoId: string;
  /** Exact YouTube title (TC authoritative). */
  title: string;
  soft?: boolean;
  softCalloutKey?: HkosSoftCalloutKey;
};

/** topicId → HKOS education video card(s), in display order. */
export const HKOS_VIDEOS: Record<string, HkosVideoEntry[]> = {
  d8: [
    {
      videoId: "4WTPnVGTZEA",
      title: "「飛蚊」突然急增恐涉視網膜脫落　盡早發現把握治療黃金時間",
    },
  ],
  "t-cataract": [
    {
      videoId: "p4xkxGxRh-E",
      title: "夜晚看路牌好像有層霧？ 你可能有早期白內障！",
    },
    {
      videoId: "EllqSl5B78I",
      title: "白內障唔係得老人家先有！小朋友都會有白內障",
    },
  ],
  "t-myopia": [
    {
      videoId: "eOgJlel8DGw",
      title: "仔仔年年都要換眼鏡！醫生教你防控近視",
      soft: true,
      softCalloutKey: "hkosSoftMyopia",
    },
  ],
  d6: [
    {
      videoId: "cPKAYEAgjuc",
      title: "糖友「糖尿上眼」 隨時失明？",
    },
  ],
  "t-ted": [
    {
      videoId: "E1tk-bYGTgY",
      title: "甲狀腺指數正常，點解對眼都會凸？",
    },
  ],
  "t-rvo": [
    {
      videoId: "T0lAQqReMIY",
      title: "眼中風是甚麼？全面認識「眼中風」類型、風險與治療",
      soft: true,
      softCalloutKey: "hkosSoftRvo",
    },
  ],
  "t-bluelight": [
    {
      videoId: "VeQ5zOkYIss",
      title: "戴抗藍光眼鏡就可以任睇唔嬲？小心電子產品越睇越攰",
    },
  ],
  d5: [
    {
      videoId: "ukB9jv7wHtQ",
      title: "長者視力下降切勿當正常 | 濕性、乾性黃斑病變治療大不同",
    },
  ],
  "t-strab": [
    {
      videoId: "5aTivFEkGtg",
      title: "仔女成日捽眼以為眼訓？可能係弱視、斜視嘅早期警號",
    },
  ],
  d7: [
    {
      videoId: "-f1YcyPgNGc",
      title: "紅眼症一定會傳染？ 醫生教你分辨病毒性、過敏性定係細菌性紅眼症",
    },
  ],
  "t-cl": [
    {
      videoId: "p8d9GaMx7Mo",
      title: "戴Con戴到眼紅兼刺痛？可能係角膜炎嘅警號",
    },
  ],
  "t-lasik": [
    {
      videoId: "I469GiYU0Uk",
      title: "激光矯視係唔係個個都適合做？應該點揀好？",
    },
  ],
  "t-high-myopia-pathology": [
    {
      videoId: "uwi0FBL8m80",
      title: "近視過600度要警惕！黃斑病變唔只係長者專利",
    },
  ],
  "t-uveitis": [
    {
      videoId: "kquTYPHnQcw",
      title: "眼紅眼痛以為普通發炎？葡萄膜炎可致白內障、青光眼",
    },
  ],
  d4: [
    {
      videoId: "p04cr1epB2c",
      title: "青光眼偷走視力無法逆轉 | 定期檢查為關鍵",
      soft: true,
      softCalloutKey: "hkosSoftGlaucoma",
    },
    {
      videoId: "wgFExnBiddA",
      title: "青光眼患者必知！4個日常習慣助你維持健康",
    },
  ],
  d9: [
    {
      videoId: "NnvroE-Jn7A",
      title: "眼瘡生極唔斷尾？復發嘅元兇可能係你！",
    },
  ],
  "t-ptosis": [
    {
      videoId: "i0S-UpBAIfI",
      title: "眼瞼下垂及眼瞼腫塊：常見眼瞼疾病解析",
    },
  ],
  "t-rd": [
    {
      videoId: "7OvJHPnsTyE",
      title: "黃斑生纖維膜影響視力 懶理小心變成黃斑水腫",
    },
  ],
  d1: [
    {
      videoId: "yU9bhrNHnFk",
      title: "近視、散光、遠視、老花，到底你同邊個做緊「朋友」？",
    },
  ],
  "t-optic-neuritis": [
    {
      videoId: "eyWwLabN5sE",
      title: "睇嘢變灰變暗以為眼攰？隨時係視神經發炎",
      soft: true,
      softCalloutKey: "hkosSoftOpticNeuritis",
    },
  ],
  "t-corneal-transplant": [
    {
      videoId: "RtbwTyUjbYY",
      title: "角膜移植成功與否全靠術後護理！",
      soft: true,
      softCalloutKey: "hkosSoftCornealTransplant",
    },
  ],
  "t-nystagmus": [
    {
      videoId: "1GEbGcc4tH4",
      title: "對眼不受控咁震？可能同神經系統有關",
      soft: true,
      softCalloutKey: "hkosSoftNystagmus",
    },
  ],
  "t-ocular-tumours": [
    {
      videoId: "kmneDw1O4bo",
      title: "【健康】眼睛都可以生癌！症狀難察覺易延誤醫治",
      soft: true,
      softCalloutKey: "hkosSoftOcularTumours",
    },
  ],
};

export function getHkosVideos(topicId: string): HkosVideoEntry[] {
  return HKOS_VIDEOS[topicId] ?? [];
}

/** @deprecated Prefer getHkosVideos — kept for single-card call sites. */
export function getHkosVideo(topicId: string): HkosVideoEntry | undefined {
  return getHkosVideos(topicId)[0];
}

export function hkosThumbUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function hkosWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
