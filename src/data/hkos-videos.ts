/**
 * HKOS「眼睛解碼」public-education YouTube cards (CONTENT_VERSION 1.61).
 * Linked thumbnail only — no embed. Soft callouts lead the card for Cap/Lex KEEP.
 */

export type HkosSoftCalloutKey = "hkosSoftMyopia" | "hkosSoftRvo";

export type HkosVideoEntry = {
  videoId: string;
  /** Exact YouTube title (TC authoritative). */
  title: string;
  soft?: boolean;
  softCalloutKey?: HkosSoftCalloutKey;
};

/** topicId → HKOS education video card. */
export const HKOS_VIDEOS: Record<string, HkosVideoEntry> = {
  d8: {
    videoId: "4WTPnVGTZEA",
    title: "「飛蚊」突然急增恐涉視網膜脫落　盡早發現把握治療黃金時間",
  },
  "t-cataract": {
    videoId: "p4xkxGxRh-E",
    title: "夜晚看路牌好像有層霧？ 你可能有早期白內障！",
  },
  "t-myopia": {
    videoId: "eOgJlel8DGw",
    title: "仔仔年年都要換眼鏡！醫生教你防控近視",
    soft: true,
    softCalloutKey: "hkosSoftMyopia",
  },
  d6: {
    videoId: "cPKAYEAgjuc",
    title: "糖友「糖尿上眼」 隨時失明？",
  },
  "t-ted": {
    videoId: "E1tk-bYGTgY",
    title: "甲狀腺指數正常，點解對眼都會凸？",
  },
  "t-rvo": {
    videoId: "T0lAQqReMIY",
    title: "眼中風是甚麼？全面認識「眼中風」類型、風險與治療",
    soft: true,
    softCalloutKey: "hkosSoftRvo",
  },
  "t-bluelight": {
    videoId: "VeQ5zOkYIss",
    title: "戴抗藍光眼鏡就可以任睇唔嬲？小心電子產品越睇越攰",
  },
  d5: {
    videoId: "ukB9jv7wHtQ",
    title: "長者視力下降切勿當正常 | 濕性、乾性黃斑病變治療大不同",
  },
};

export function getHkosVideo(topicId: string): HkosVideoEntry | undefined {
  return HKOS_VIDEOS[topicId];
}

export function hkosThumbUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function hkosWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
