/** Educational defocus model — schematic, not a personal prediction. */

export type Optic = "mono" | "emono" | "edof" | "mf";

export const OPTICS: {
  id: Optic;
  title: string;
  short: string;
  note: string;
}[] = [
  {
    id: "mono",
    title: "單焦點",
    short: "一個焦點",
    note: "只在預留的那個距離最清晰。預留正視則看遠清楚、看近多數要老花眼鏡；預留近視則相反。夜間光暈一般少於繞射多焦，仍因瞳孔及眼表而異。",
  },
  {
    id: "emono",
    title: "增強型單焦點",
    short: "輕微延伸景深",
    note: "以單焦為底，輕微拉長清晰範圍，中距離（電腦／賽程）通常較普通單焦好，細字閱讀多數仍需眼鏡。夜間光學干擾因產品及瞳孔而異，一般少於繞射多焦，不是保證「少光暈」。",
  },
  {
    id: "edof",
    title: "延伸景深（EDOF）",
    short: "遠至中距離",
    note: "遠至約 60 厘米較連貫。報紙細字多數仍需近用鏡。光暈通常少於多焦、多於單焦，實際因產品及病人而異。",
  },
  {
    id: "mf",
    title: "多焦／三焦點",
    short: "遠中近幾個焦點",
    note: "嘗試同時照顧遠、中、近。對比度可略降，夜間光暈／眩光較明顯。黃斑病變或明顯視野缺損者通常不宜。不能保證脫鏡。",
  },
];

export const DISTANCES = [
  { id: "far" as const, title: "遠距離", sub: "約 6 米 · 駕駛／街景", demand: 0, img: "/iol/far.jpg" },
  { id: "mid" as const, title: "中距離", sub: "約 60–70 厘米 · 賽事新聞", demand: 1.5, img: "/iol/mid.jpg" },
  { id: "near" as const, title: "近距離", sub: "約 40 厘米 · 賽程表", demand: 2.5, img: "/iol/near.jpg" },
];

export const RANGE_STOPS = [
  { label: "6米", demand: 0 },
  { label: "2米", demand: 0.5 },
  { label: "1米", demand: 1 },
  { label: "60厘米", demand: 1.67 },
  { label: "40厘米", demand: 2.5 },
];

export function sphereDefocus(optic: Optic, target: number, demand: number): number {
  if (optic === "mf") {
    const peaks = [-target, -target + 1.5, -target + 2.5];
    return Math.min(...peaks.map((p) => Math.abs(demand - p)));
  }
  if (optic === "edof") {
    const x = demand + target;
    if (x < 0) return -x;
    if (x <= 1.65) return Math.max(0, (x - 0.25) * 0.12);
    return (x - 1.65) * 0.95;
  }
  const dof = optic === "emono" ? 0.72 : 0.32;
  return Math.max(0, Math.abs(demand + target) - dof);
}

export function astigDefocus(cyl: number, toric: boolean): number {
  if (toric) return 0;
  return Math.max(0, cyl) * 0.55;
}

export function contrastLoss(optic: Optic): number {
  if (optic === "mf") return 0.2;
  if (optic === "edof") return 0.08;
  if (optic === "emono") return 0.03;
  return 0;
}

export function haloStrength(optic: Optic, night: boolean): number {
  if (!night) return 0;
  if (optic === "mf") return 0.9;
  if (optic === "edof") return 0.42;
  if (optic === "emono") return 0.1;
  return 0.06;
}

export function qualityLabel(defocus: number): {
  text: string;
  tone: "ok" | "mid" | "bad";
} {
  if (defocus < 0.4) return { text: "清晰", tone: "ok" };
  if (defocus < 0.85) return { text: "尚可", tone: "mid" };
  if (defocus < 1.6) return { text: "模糊", tone: "bad" };
  return { text: "很模糊", tone: "bad" };
}

export function formatD(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(2)} D`;
}

export function formatDegrees(n: number): string {
  const d = Math.round(Math.abs(n) * 100);
  if (n > 0.01) return `遠視 ${d} 度`;
  if (n < -0.01) return `近視 ${d} 度`;
  return "正視 0 度";
}

export function blurPx(defocus: number): number {
  return Math.min(14, defocus * 3.1);
}
