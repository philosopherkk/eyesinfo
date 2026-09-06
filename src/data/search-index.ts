/**
 * Curated education search index: condition / topic names, symptoms, lay synonyms.
 * Links educational pages only. Do NOT add drug brands, device brands, doctor names,
 * or clinic names.
 */

export type SearchTargetKind = "topic" | "tool" | "page";

export type SearchEntry = {
  /** Stable id for dedupe (topic id, tool id, or page key). */
  id: string;
  kind: SearchTargetKind;
  /** Absolute path on this site. */
  href: string;
  /** Display title keys resolved at query time from live topic/tool data. */
  titleFallback: string;
  /**
   * Lay / clinical synonyms and symptoms (TC primary; EN / JA when useful).
   * Matched case-insensitively; CJK keeps original form.
   */
  keywords: string[];
};

/**
 * Synonym → education page map. Prefer topic / tool hubs over inventing new pages.
 * Keep keywords free of brands and proper clinic/doctor names.
 */
export const SEARCH_SYNONYMS: SearchEntry[] = [
  // —— Floaters / RD ——
  {
    id: "d8",
    kind: "topic",
    href: "/t/d8",
    titleFallback: "飛蚊症與視網膜脫離風險",
    keywords: [
      "飛蚊",
      "飛蚊症",
      "黑點",
      "閃光",
      "光視",
      "簾幕",
      "視網膜脫離",
      "視網膜裂孔",
      "floater",
      "floaters",
      "flash",
      "flashes",
      "retinal detachment",
      "飛蚊症",
      "網膜剥離",
    ],
  },
  {
    id: "floaters",
    kind: "tool",
    href: "/tools/floaters",
    titleFallback: "飛蚊與簾幕",
    keywords: ["飛蚊", "簾幕", "閃光", "floater", "floaters", "curtain"],
  },
  {
    id: "t-rd",
    kind: "topic",
    href: "/t/t-rd",
    titleFallback: "視網膜脫離手術與風險",
    keywords: ["視網膜脫離", "脫離手術", "retinal detachment", "網膜剥離"],
  },
  // —— Diabetes / DR ——
  {
    id: "d6",
    kind: "topic",
    href: "/t/d6",
    titleFallback: "糖尿病視網膜病變",
    keywords: [
      "糖尿上眼",
      "糖尿病視網膜",
      "糖尿病視網膜病變",
      "糖尿眼",
      "黄斑水腫",
      "黃斑水腫",
      "diabetic retinopathy",
      "diabetes eye",
      "糖尿病網膜症",
    ],
  },
  // —— Presbyopia ——
  {
    id: "t-presbyopia",
    kind: "topic",
    href: "/t/t-presbyopia",
    titleFallback: "老花（老視）是甚麼、怎樣處理",
    keywords: [
      "老花",
      "老視",
      "睇近矇",
      "看近模糊",
      "presbyopia",
      "reading glasses",
      "老眼",
    ],
  },
  {
    id: "d1",
    kind: "topic",
    href: "/t/d1",
    titleFallback: "屈光不正",
    keywords: [
      "近視",
      "遠視",
      "散光",
      "老花",
      "屈光",
      "myopia",
      "hyperopia",
      "astigmatism",
      "refractive",
      "度數",
    ],
  },
  // —— Glaucoma ——
  {
    id: "d4",
    kind: "topic",
    href: "/t/d4",
    titleFallback: "青光眼",
    keywords: [
      "青光眼",
      "眼壓",
      "視野收窄",
      "隧道視野",
      "glaucoma",
      "eye pressure",
      "緑内障",
      "綠內障",
    ],
  },
  {
    id: "t-glaucoma",
    kind: "topic",
    href: "/t/t-glaucoma",
    titleFallback: "青光眼目標眼壓與惡化監察",
    keywords: ["青光眼", "目標眼壓", "視野", "OCT", "glaucoma"],
  },
  {
    id: "tunnel",
    kind: "tool",
    href: "/tools/tunnel",
    titleFallback: "隧道視野示意",
    keywords: ["隧道視野", "青光眼", "視野收窄", "glaucoma tunnel"],
  },
  // —— AMD / macula ——
  {
    id: "d5",
    kind: "topic",
    href: "/t/d5",
    titleFallback: "年齡相關性黃斑病變",
    keywords: [
      "黃斑",
      "老年黃斑",
      "年齡相關性黃斑",
      "視物變形",
      "中央暗點",
      "amd",
      "macular degeneration",
      "macula",
      "黄斑変性",
    ],
  },
  {
    id: "amsler",
    kind: "tool",
    href: "/amsler",
    titleFallback: "阿姆斯勒方格",
    keywords: ["阿姆斯勒", "amsler", "方格", "黃斑自查", "中央視力"],
  },
  // —— Cataract / IOL ——
  {
    id: "d3",
    kind: "topic",
    href: "/t/d3",
    titleFallback: "白內障",
    keywords: ["白內障", "霧", "眩光", "cataract", "白内障"],
  },
  {
    id: "iol",
    kind: "tool",
    href: "/iol",
    titleFallback: "人工晶體視力示意",
    keywords: ["晶體", "人工晶體", "iol", "多焦", "單焦", "intraocular lens"],
  },
  {
    id: "haze",
    kind: "tool",
    href: "/tools/haze",
    titleFallback: "白內障日夜示意",
    keywords: ["白內障", "霧", "夜車", "眩光", "cataract haze"],
  },
  // —— Dry eye / lids ——
  {
    id: "d2",
    kind: "topic",
    href: "/t/d2",
    titleFallback: "乾眼症",
    keywords: ["乾眼", "眼乾", "澀", "dry eye", "涙液", "ドライアイ"],
  },
  {
    id: "d9",
    kind: "topic",
    href: "/t/d9",
    titleFallback: "瞼緣炎",
    keywords: ["瞼緣炎", "眼瞼炎", "眼屎", "blepharitis"],
  },
  // —— Red eye / urgent ——
  {
    id: "d7",
    kind: "topic",
    href: "/t/d7",
    titleFallback: "紅眼與結膜炎",
    keywords: ["紅眼", "結膜炎", "眼紅", "pink eye", "conjunctivitis"],
  },
  {
    id: "urgent",
    kind: "page",
    href: "/urgent",
    titleFallback: "急症與盡快求醫",
    keywords: [
      "急症",
      "急症室",
      "999",
      "化學濺入",
      "突然失明",
      "emergency",
      "a&e",
      "救急",
    ],
  },
  // —— Common tools ——
  {
    id: "ask",
    kind: "tool",
    href: "/tools/ask",
    titleFallback: "問醫生清單",
    keywords: ["問醫生", "問題清單", "面診問題", "ask doctor", "checklist"],
  },
  {
    id: "rx",
    kind: "tool",
    href: "/tools/rx",
    titleFallback: "眼鏡度數解讀",
    keywords: ["度數", "眼鏡處方", "球鏡", "柱鏡", "prescription", "sph", "cyl"],
  },
  {
    id: "map",
    kind: "tool",
    href: "/tools/map",
    titleFallback: "眼圖",
    keywords: ["眼圖", "解剖", "eye map", "anatomy"],
  },
  {
    id: "t-chem",
    kind: "topic",
    href: "/t/t-chem",
    titleFallback: "化學性眼損傷",
    keywords: ["化學", "濺入", "沖水", "chemical", "alkali", "acid burn"],
  },
  {
    id: "t-myopia",
    kind: "topic",
    href: "/t/t-myopia",
    titleFallback: "兒童近視控制",
    keywords: ["兒童近視", "近視控制", "戶外", "眼軸", "childhood myopia", "atropine class"],
  },
];
