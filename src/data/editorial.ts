/** Education-site authorship only: name, specialty, qualifications. No contact. */

export const EDITORIAL = {
  reviewed: "2026年9月12日",
  /** ISO date matching the site-wide stamp used when a topic omits lastReviewed. */
  reviewedIso: "2026-09-12",
  name: "潘家健醫生",
  title: "眼科專科醫生",
  registerNote: "香港醫務委員會註冊醫生；名列專科名冊（眼科）",
  quals: [
    "香港中文大學內外全科醫學士 MBChB (CUHK)",
    "英國愛丁堡皇家外科醫學院院員 MRCS(Ed)",
    "香港眼科醫學院院士 FCOphth HK",
    "香港醫學專科學院院士（眼科）FHKAM (Ophthalmology)",
  ],
  noServices:
    "本站不提供預約、處方、購買或轉介服務，亦沒有連至任何執業網站。",
  /**
   * Cap-verifiable publisher / reviewer disclosure (1.46).
   * Replaces the former「完全獨立」live string. Not a solicitor opinion.
   */
  disclosure:
    "出版／營運：護眼學堂（eyesinfo.org）。臨床覆核：潘家健醫生（香港醫務委員會註冊醫生；名列專科名冊（眼科））。本教育網站不提供診所聯絡、預約或轉介，亦不連至執業網站。本教育網站目前無商業贊助；若日後有資助或利益關係將於法律頁披露。教育內容與任何診所推廣分開展示；覆核者亦可能從事臨床執業，本站不作轉介。",
  /** Honest education-site funding / COI one-liner — no invented sponsors. */
  funding:
    "本教育網站目前無商業贊助；若日後有資助或利益關係將於法律頁披露。",
  notSubstitute:
    "內容不能代替與註冊眼科專科醫生的面診，亦不能作為診斷。本頁不是診斷、處方或手術建議。只有列於醫務委員會眼科專科名冊者可稱「眼科專科醫生」。",
  /**
   * Corrections policy only — no operator email in-repo.
   * Do not invent a mailto; KK may supply one later.
   */
  correction:
    "若發現內容錯誤，請透過法律頁所列更正聯絡方式通知營運者。本站不經此途徑接收病歷、預約或個別診治查詢。",
};

/** Structured reviewer stamp — same person as EDITORIAL; do not invent new reviewers. */
export const DEFAULT_TOPIC_REVIEWER = {
  name: EDITORIAL.name,
  role: EDITORIAL.title,
} as const;

export const DEFAULT_LAST_REVIEWED = EDITORIAL.reviewedIso;

export const KEY_REFS = [
  "Yam JC et al. Low-Concentration Atropine for Myopia Progression (LAMP). Ophthalmology. 2019.（第一年）",
  "AREDS2 Research Group. JAMA. 2013.",
  "Azuara-Blanco A et al. EAGLE. Lancet. 2016.",
  "TFOS DEWS II. Ocul Surf. 2017.",
  "香港醫務委員會《專業守則》；《不良廣告（醫藥）條例》（第231章）；《藥劑業及毒藥條例》（第138章）。",
];
