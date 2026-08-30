export type ToolId =
  | "map"
  | "tunnel"
  | "haze"
  | "floaters"
  | "halo"
  | "drops"
  | "warm"
  | "ask"
  | "visit"
  | "outdoor"
  | "rx"
  | "amsler"
  | "iol";

export type ToolDef = {
  id: ToolId;
  title: string;
  blurb: string;
  canto: string;
  href: string;
  home?: boolean;
};

export const TOOLS: ToolDef[] = [
  { id: "amsler", title: "阿姆斯勒方格", blurb: "自我監察中央視力", canto: "遮一眼，望正中間", href: "/amsler", home: true },
  { id: "iol", title: "晶體視力示意", blurb: "單焦目標度數與多焦光暈", canto: "睇遠睇近差幾多", href: "/iol", home: true },
  { id: "map", title: "眼圖", blurb: "撳部位打開相關專題", canto: "撳眼圖就明", href: "/tools/map", home: true },
  { id: "drops", title: "點藥步驟", blurb: "洗手、唔好掂睫毛、按淚點", canto: "跟住步驟點", href: "/tools/drops", home: true },
  { id: "ask", title: "問醫生清單", blurb: "面診前可帶去的問題", canto: "問清楚先好決定", href: "/tools/ask", home: true },
  { id: "tunnel", title: "隧道視野示意", blurb: "青光眼周邊視野收窄（不是檢查）", canto: "睇下隧道點樣", href: "/tools/tunnel" },
  { id: "haze", title: "白內障日夜示意", blurb: "顏色變淡、霧、車燈眩光", canto: "夜晚開車矇唔矇", href: "/tools/haze" },
  { id: "floaters", title: "飛蚊與簾幕", blurb: "會飄的飛蚊 vs 唔郁的簾幕", canto: "有簾幕去急症；新飛蚊同日散瞳", href: "/tools/floaters" },
  { id: "halo", title: "夜間光暈比較", blurb: "單焦、延伸景深、三焦點示意", canto: "唔係術後保證", href: "/tools/halo" },
  { id: "warm", title: "熱敷計時", blurb: "8–10 分鐘，暖唔好燙", canto: "熱敷跟時間", href: "/tools/warm" },
  { id: "visit", title: "一次眼科檢查", blurb: "散瞳後唔好自己開車", canto: "去診所會做咩", href: "/tools/visit" },
  { id: "outdoor", title: "兒童戶外時間", blurb: "今日夠唔夠兩小時日光", canto: "出街睇日光", href: "/tools/outdoor" },
  { id: "rx", title: "眼鏡度數解讀", blurb: "球鏡、柱鏡、軸、老花加度", canto: "張紙寫緊咩", href: "/tools/rx" },
];

export const TOPIC_TOOLS: Record<string, { href: string; label: string }[]> = {
  d2: [
    { href: "/tools/drops", label: "點藥步驟" },
    { href: "/tools/warm", label: "熱敷計時" },
    { href: "/t/t-lube", label: "眼表潤滑劑" },
  ],
  d3: [
    { href: "/tools/haze", label: "白內障日夜示意" },
    { href: "/iol", label: "晶體視力示意" },
    { href: "/t/t-cataract", label: "超聲波乳化與併發症" },
    { href: "/t/t-yag", label: "後囊混濁（不是白內障復發）" },
  ],
  d4: [{ href: "/tools/tunnel", label: "隧道視野示意" }],
  d5: [{ href: "/amsler", label: "阿姆斯勒方格" }],
  d6: [{ href: "/t/t-reports", label: "OCT／視野示意" }],
  d8: [{ href: "/tools/floaters", label: "飛蚊與簾幕" }, { href: "/t/t-rd", label: "脫離手術與風險" }],
  d9: [
    { href: "/tools/warm", label: "熱敷計時" },
    { href: "/t/t-chalazion", label: "霰粒腫切開刮除" },
  ],
  "t-cataract": [
    { href: "/tools/haze", label: "白內障日夜示意" },
    { href: "/iol", label: "晶體視力示意" },
    { href: "/t/t-yag", label: "後囊混濁（不是白內障復發）" },
  ],
  "t-iol": [{ href: "/iol", label: "晶體視力示意" }, { href: "/tools/halo", label: "夜間光暈比較" }],
  "t-mfiol": [{ href: "/tools/halo", label: "夜間光暈比較" }, { href: "/iol", label: "晶體視力示意" }],
  "t-dry": [{ href: "/tools/drops", label: "點藥步驟" }, { href: "/t/t-lube", label: "眼表潤滑劑" }, { href: "/tools/warm", label: "熱敷計時" }],
  "t-lube": [{ href: "/tools/drops", label: "點藥步驟" }, { href: "/t/t-dry", label: "乾眼處理梯階" }],
  "t-drops": [{ href: "/tools/drops", label: "點藥步驟" }, { href: "/t/t-lube", label: "眼表潤滑劑" }],
  "t-warm": [{ href: "/tools/warm", label: "熱敷計時" }],
  "t-myopia": [{ href: "/tools/outdoor", label: "兒童戶外時間" }],
  d1: [
    { href: "/tools/rx", label: "眼鏡度數解讀" },
    { href: "/tools/outdoor", label: "兒童戶外時間" },
    { href: "/t/t-presbyopia", label: "老花五類選擇" },
    { href: "/t/t-lasik", label: "LASIK 與 SMILE" },
    { href: "/t/t-cl", label: "隱形眼鏡併發症" },
  ],
  "t-yag": [{ href: "/t/t-yag", label: "後囊混濁（不是白內障復發）" }],
  "t-glaucoma": [{ href: "/tools/tunnel", label: "隧道視野示意" }],
  "t-rd": [{ href: "/tools/floaters", label: "飛蚊與簾幕" }],
  "t-vegf": [{ href: "/t/t-octm", label: "黃斑 OCT" }],
  "t-presbyopia": [
    { href: "/iol", label: "晶體視力示意" },
    { href: "/tools/rx", label: "眼鏡度數解讀" },
    { href: "/t/t-cl", label: "隱形眼鏡併發症" },
    { href: "/t/t-lasik", label: "LASIK 與 SMILE" },
    { href: "/t/t-cataract", label: "超聲波乳化與晶體" },
  ],
  "t-lasik": [
    { href: "/t/t-presbyopia", label: "老花五類選擇" },
    { href: "/t/t-cl", label: "隱形眼鏡併發症" },
    { href: "/iol", label: "晶體視力示意" },
  ],
  "t-cl": [{ href: "/t/t-lasik", label: "激光矯視" }, { href: "/t/t-lube", label: "眼表潤滑劑" }],
  "t-chalazion": [{ href: "/tools/warm", label: "熱敷計時" }],
  "t-strab": [
    { href: "/urgent", label: "急症與同日評估" },
    { href: "/t/t-child", label: "兒童視力里程碑" },
    { href: "/t/t-ted", label: "甲狀腺眼疾" },
    { href: "/t/t-ptosis", label: "上瞼下垂" },
  ],
  "t-child": [{ href: "/t/t-strab", label: "斜視類型與急症" }],
  "t-ted": [{ href: "/t/t-strab", label: "斜視與複視" }],
  "t-ptosis": [{ href: "/t/t-strab", label: "斜視與複視" }],
};

export const SIM_FOOTER =
  "示意／自我監察不能代替散瞳眼底、視野或光學相干斷層掃描（OCT）。此工具結果正常不能排除眼疾。新出現異常須盡快由醫生檢查；突然視力下降請到急症室。本站不提供預約或轉介。";
