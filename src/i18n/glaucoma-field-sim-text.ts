/**
 * Copy for the glaucoma visual-field illustration (/tools/tunnel).
 * 繁體 is canonical; 简體 is generated from it (OpenCC); EN / JA are translations.
 * All numbers are study results (group level), not a personal prognosis.
 */

export type GfsText = {
  title: string;
  intro: string;
  simBoxTitle: string;
  simBox: string[];
  urgent: string;
  eye: string;
  simBadge: string;
  bothEyes: string;
  sevGroup: string;
  sevs: { name: string; look: string; stage: string; note: string }[];
  patternGroup: string;
  patterns: { name: string; desc: string }[];
  patternConverge: string;
  patternSimplified: string;
  styleGroup: string;
  styleSoft: string;
  styleDark: string;
  styleWhy: string;
  compareOff: string;
  compareOn: string;
  compareBadge: string;
  lookLabel: string;
  stageLabel: string;
  chartTitle: string;
  chartCaption: string;
  perceptionTitle: string;
  perception: string;
  iopTitle: string;
  iopBig: string;
  iopSlider: string;
  iopSliderHint: string;
  iopUnit: string;
  iopNoLink: string;
  iopZoneTitle: string;
  iopZones: { range: string; lines: string[] }[];
  iopAlways: string;
  axisTitle: string;
  axisRows: { label: string; hint: string }[];
  axisThreshold: string;
  barsTitle: string;
  bars: { label: string; a: string; av: number; b: string; bv: number }[];
  barsNote: string;
  iopLimits: string;
  refsTitle: string;
  topicLink: string;
};

const zhHant: GfsText = {
  title: "青光眼視野示意",
  intro:
    "用街景示意青光眼視野缺損由輕度到末期大概的樣子。青光眼多數進展緩慢，很多人早期完全沒有感覺；已失去的視野不能還原，處理目標是減慢惡化。",
  simBoxTitle: "只是模擬示意 · 不是檢查",
  simBox: [
    "本頁只是模擬／圖像示意，只作教育用途。",
    "不能代替視野檢查（視野計）或眼科專科醫生；不是診斷，也不是測試，不能用來判斷你有沒有青光眼或屬於哪一期。",
    "真實視野缺損因人及病期而異；圖中形狀、深淺和範圍都是簡化的示意。",
    "本站不能代替註冊醫生。",
  ],
  urgent: "突然視力下降、劇烈眼痛或頭痛噁心 → 急症頁",
  eye: "右眼",
  simBadge: "模擬示意",
  bothEyes: "兩眼一齊睇時，另一隻眼常會補返缺口，所以好多人完全唔覺——要靠檢查先發現。",
  sevGroup: "選擇程度",
  sevs: [
    {
      name: "輕度",
      look: "只有局部、較淺的模糊或暗淡區（常在鼻側，或上方、下方呈弓形），中央視力通常仍然清楚。大腦會把缺口「補」起來，所以多數人察覺不到。",
      stage: "HPA 早期——視野報告的平均偏差（MD）約好過 −6 dB，中央約 5° 內測試點仍正常。",
      note: "常常沒有任何徵狀，要靠眼科檢查（眼壓、視神經 OCT、視野）才發現。小型組織學研究（17 隻捐贈眼）指出，視野檢查出現統計異常時，通常已有約 25–35% 視網膜神經節細胞流失（Kerrigan-Baumrind 2000）。",
    },
    {
      name: "中度",
      look: "缺損範圍擴大、更深，鼻側及上下弓形缺損較明顯；一邊旁邊的人或物件可能變得模糊或「消失」。視力表視力仍可以很好。",
      stage: "HPA 中度——MD 約 −6 至 −12 dB；中央約 5° 內未出現完全失去敏感度的測試點。",
      note: "開始可能覺得要更多光線、易碰到旁邊的物件，但不少人仍未察覺。",
    },
    {
      name: "重度",
      look: "大部分周邊視野缺失或非常模糊，只剩較窄的中央範圍加小部分周邊。行路易碰到側邊的人或物件，需要更多光線，讀字或看清環境較吃力。",
      stage:
        "HPA 重度——符合其中一項即屬重度：MD 差過約 −12 dB、超過一半測試點明顯下降、或中央約 5° 內已有嚴重缺損。",
      note: "此階段視野缺損已明顯影響日常活動，醫生會按個別情況討論監察與處理。",
    },
    {
      name: "末期",
      look: "只剩下很小的中央島（有時加上一塊顳側小島），其餘大部分視野接近沒有影像。若中央島仍在，可能還看到字或面孔的一小部分，但範圍很窄，行動及生活受很大影響。",
      stage:
        "「末期」沒有單一國際通用的 MD 界線；本站指比 HPA 重度更差、只剩小島的教學階段（有外科文獻以 MD 差過約 −20 dB 作「晚期」）。",
      note: "已失去的視野不能還原；處理目標是減慢進一步惡化、保住仍有的視野。",
    },
  ],
  patternGroup: "缺損形態（簡化三種）",
  patterns: [
    {
      name: "弓形",
      desc: "沿著視神經纖維走向，由盲點附近向鼻側彎出，像一條弧形暗帶，常在水平中線突然截止。",
    },
    {
      name: "鼻側階梯",
      desc: "鼻側視野上半與下半的缺損深淺不同，在水平中線形成「一級階梯」。",
    },
    {
      name: "周邊收窄",
      desc: "由外圍向中央逐步縮小，鼻側通常較先縮；邊緣是模糊的，不是黑色硬邊。",
    },
  ],
  patternConverge: "末期各型會逐漸趨同：中央一小島，有時加顳側小島。",
  patternSimplified: "真實視野可以混合出現，亦有旁中央型等其他形態；這裏只是簡化。",
  styleGroup: "顯示方式",
  styleSoft: "貼近病人描述",
  styleDark: "深色遮罩（傳統示意）",
  styleWhy:
    "研究訪問 50 位青光眼患者：沒有人選擇「黑色隧道」或「黑色斑塊」代表自己的視覺；54% 選「模糊斑塊」、16% 選「缺失斑塊」，26% 完全不知道自己有視野缺損（Crabb 2013）。所以預設以模糊、褪色、被周圍「補上」表示，而不是全黑。",
  compareOff: "顯示正常視野對照",
  compareOn: "已顯示正常視野（再按返回示意）",
  compareBadge: "正常視野（對照）",
  lookLabel: "看起來像",
  stageLabel: "分級參考",
  chartTitle: "視野報告灰階圖（示意）",
  chartCaption:
    "越深＝這一區敏感度越低。視野報告也有類似灰階圖，但真正的報告由儀器測出，並非這個畫面；右側小暗方塊是人人都有的正常盲點。",
  perceptionTitle: "病人真的見到黑色嗎？",
  perception:
    "多數人形容為模糊、朦朧、需要更多光線，或某些部分「不見了」；亦有人完全察覺不到。雙眼同時使用時，大腦常會互相補償，單眼缺損更不易察覺（常見現象，非本站所創）。",
  iopTitle: "研究怎樣講眼壓（群體數字）",
  iopBig:
    "這不是你的預後，也不是預測。拖動滑桿只會顯示公開研究在這個眼壓範圍講過甚麼；不會計算你的風險，也不能代替眼科醫生為你訂目標眼壓。",
  iopSlider: "示意眼壓",
  iopSliderHint: "10–35 mmHg；只用來翻查研究範圍，不會改變上面的視野圖。",
  iopUnit: "mmHg",
  iopNoLink:
    "眼壓高低並不等於「第幾期」：有人眼壓一直在統計正常範圍仍有青光眼（正常眼壓性），也有人眼壓偏高多年而視神經仍健康（高眼壓症）。",
  iopZoneTitle: "這個眼壓範圍的研究數字",
  iopZones: [
    {
      range: "約 17 mmHg 或以下",
      lines: [
        "AGIS 第 7 報（已做過手術的開角型青光眼，追蹤 6 年或以上）：每次覆診眼壓都低於 18 mmHg 的眼，視野缺損分數（0–20 分）平均變化接近 0；不足一半覆診低於 18 mmHg 的眼，估計平均惡化 0.63 分（統計上未達顯著，p＝0.083），7 年時約 1.93 分。",
        "CNTGS（正常眼壓性青光眼）：意向治療分析未見顯著分別；剔除白內障影響後，降眼壓約 30% 組惡化較少。手術引致白內障較多，故是否積極降壓須個別評估。",
        "這些是群體結果：較低眼壓與較少惡化相關，但不代表壓到某個數字便保證不惡化。",
      ],
    },
    {
      range: "約 18–21 mmHg",
      lines: [
        "約 18–21 mmHg 是常用「統計正常」範圍的上段（常用上限約 21 mmHg，不是人人同一條線）。",
        "EMGT（早期開角型青光眼，基線眼壓中位數 20 mmHg）：隨訪期間平均眼壓每高 1 mmHg，進展風險約增加 13%（HR 1.13，95% CI 1.07–1.19）。降眼壓治療平均降低 5.1 mmHg（25%）；中位約 6 年時有進展者：治療組 45%，對照組 62%。",
        "UKGTS（新診斷開角型青光眼，基線平均眼壓約 20 mmHg）：24 個月內視野惡化風險，降眼壓滴眼藥（前列腺素類似物）對安慰劑的 HR 為 0.44（95% CI 0.28–0.69）；眼壓平均降低 3.8 mmHg 對 0.9 mmHg。",
      ],
    },
    {
      range: "約 22–30 mmHg",
      lines: [
        "OHTS（高眼壓症：入組眼壓約 24–32 mmHg，視神經及視野仍正常）：60 個月累積發展成開角型青光眼，觀察組 9.5%，用藥組 4.4%（HR 0.40，95% CI 0.27–0.59）。這是「發病」，不是「已有青光眼後的惡化」，亦不是人人必須用藥。",
        "EMGT 不收眼壓高於 30 mmHg 的人；在該研究中，基線眼壓愈高，進展風險愈高。",
      ],
    },
    {
      range: "約 31–35 mmHg",
      lines: [
        "OHTS 入組眼壓上限約 32 mmHg，EMGT 不收高於 30 mmHg，所以這些試驗不能告訴我們更高眼壓的風險；這個範圍不能由上面的數字推算。",
        "眼壓突然升得很高（例如急性閉角型發作）可在數小時內傷害視神經：眼紅劇痛、頭痛、噁心嘔吐、燈周圍彩虹圈、視力急降 → 立即到急症室；無法自行前往：致電 999。",
      ],
    },
  ],
  iopAlways:
    "進展速度因人而異：一項臨床常規照顧研究（583 位開角型或假性剝脫型青光眼，平均追蹤 7.8 年）視野 MD 平均每年變化 −0.80 dB（個別差異很大，5.6% 快過每年 −2.5 dB）；平均眼壓較高、年紀較大與較快惡化相關（Heijl 2013）。",
  axisTitle: "各研究的眼壓範圍在哪裏",
  axisRows: [
    { label: "EMGT", hint: "入組眼壓 ≤ 30；中位數 20" },
    { label: "OHTS", hint: "入組眼壓約 24–32" },
    { label: "UKGTS", hint: "基線平均約 20" },
  ],
  axisThreshold: "18：AGIS 第 7 報分組界線",
  barsTitle: "公開研究報告的事件比例（對照組 vs 治療組）",
  bars: [
    { label: "EMGT：中位約 6 年有進展", a: "對照", av: 62, b: "治療", bv: 45 },
    { label: "OHTS：5 年發展成開角型青光眼", a: "觀察", av: 9.5, b: "用藥", bv: 4.4 },
  ],
  barsNote:
    "各研究的對象、結果定義、治療與追蹤時間都不同，不可直接比較不同研究的柱；數字是群體結果，不是個人預後，亦不是治療效果保證。",
  iopLimits:
    "本工具沒有個人眼壓或病歷資料，不連接任何即時病人數據，不會為滑桿數值計算風險，也沒有把研究的每 mmHg 風險外推到其他範圍；因為這樣做會給出研究並沒有支持的精確數字。",
  refsTitle: "參考研究",
  topicLink: "青光眼專題",
};

const en: GfsText = {
  title: "Glaucoma visual-field illustration",
  intro:
    "A street scene to show roughly how glaucomatous field loss can look from mild to end-stage. Most glaucoma progresses slowly and many people notice nothing early on. Lost field does not come back; treatment aims to slow further loss.",
  simBoxTitle: "Simulation only · not a test",
  simBox: [
    "This page is a simulation / illustration for education only.",
    "It cannot replace perimetry (a visual-field test) or an ophthalmologist. It is not a diagnosis and not a test, and cannot tell you whether you have glaucoma or which stage you are in.",
    "Real field loss varies from person to person and by stage; the shapes, depth and extent shown here are simplified illustrations.",
    "This site cannot replace a registered doctor.",
  ],
  urgent: "Sudden vision loss, severe eye pain, or headache with nausea → urgent page",
  eye: "Right eye",
  simBadge: "Simulation",
  bothEyes:
    "When both eyes are open, the other eye often fills in the gap, so many people notice nothing at all — it takes an eye examination to find it.",
  sevGroup: "Choose a stage",
  sevs: [
    {
      name: "Mild",
      look: "Small, shallow patches of blur or dimming (often nasal, or arch-shaped above or below fixation). Central vision is usually still sharp. The brain fills the gaps in, so most people do not notice.",
      stage:
        "HPA early — mean deviation (MD) on a field report better than about −6 dB, with central 5° test points still normal.",
      note: "Often no symptoms at all; found by an eye examination (pressure, optic-nerve OCT, visual field). A small histology study (17 donor eyes) found that by the time automated field testing is statistically abnormal, roughly 25–35% of retinal ganglion cells are typically already lost (Kerrigan-Baumrind 2000).",
    },
    {
      name: "Moderate",
      look: "Larger and deeper defects; nasal and upper/lower arch-shaped loss is more obvious. A person at the side may look blurred or “disappear”. Chart acuity can still be good.",
      stage:
        "HPA moderate — MD about −6 to −12 dB; no completely insensitive test point within the central 5°.",
      note: "People may start to need more light or bump into things at the side, but many still do not notice.",
    },
    {
      name: "Severe",
      look: "Most of the peripheral field is missing or very blurred, leaving a narrower central area and a small part of the periphery. Easy to bump into people or objects at the side; more light is needed; reading and taking in a scene is harder.",
      stage:
        "HPA severe — any one of: MD worse than about −12 dB, more than half of test points clearly depressed, or serious loss within the central 5°.",
      note: "Field loss now clearly affects daily activities; the doctor discusses monitoring and management case by case.",
    },
    {
      name: "End-stage",
      look: "Only a very small central island remains (sometimes with a small temporal island); most of the field has almost no image. If the central island is still there, part of a word or face may still be seen, but the span is very narrow and daily life is greatly affected.",
      stage:
        "There is no single international MD cut-off for “end-stage”. Here it means a teaching stage beyond HPA severe with only small islands left (some surgical papers use MD worse than about −20 dB for “advanced”).",
      note: "Lost field cannot be restored; the aim is to slow further loss and protect the field that remains.",
    },
  ],
  patternGroup: "Pattern (three simplified types)",
  patterns: [
    {
      name: "Arcuate",
      desc: "Follows nerve-fibre bundles, curving from near the blind spot toward the nasal side as an arch-shaped dim band, often stopping abruptly at the horizontal midline.",
    },
    {
      name: "Nasal step",
      desc: "Loss in the nasal upper and lower halves differs in depth, forming a “step” at the horizontal midline.",
    },
    {
      name: "Peripheral narrowing",
      desc: "The field shrinks from the outside in, usually nasal side first. The edge is soft, not a hard black rim.",
    },
  ],
  patternConverge:
    "At end-stage the patterns converge: one small central island, sometimes plus a temporal island.",
  patternSimplified:
    "Real fields can mix patterns, and other types such as paracentral loss exist; this is simplified.",
  styleGroup: "Display style",
  styleSoft: "Closer to what patients describe",
  styleDark: "Dark mask (old-style picture)",
  styleWhy:
    "In a study of 50 people with glaucoma, none picked a “black tunnel” or “black patches” to represent their vision; 54% picked “blurred patches”, 16% “missing patches”, and 26% were completely unaware of their field loss (Crabb 2013). So the default uses blur, fading and “fill-in” from surroundings rather than black.",
  compareOff: "Show normal field for comparison",
  compareOn: "Normal field shown (press again to go back)",
  compareBadge: "Normal field (comparison)",
  lookLabel: "What it can look like",
  stageLabel: "Staging reference",
  chartTitle: "Grey-scale field chart (illustration)",
  chartCaption:
    "Darker = lower sensitivity in that area. Field reports have a similar grey-scale chart, but a real report is measured by an instrument and is not this picture. The small dark square on the right is the normal blind spot everyone has.",
  perceptionTitle: "Do patients really see black?",
  perception:
    "Most describe blur, haze, needing more light, or parts “missing”; some notice nothing. With both eyes open the brain often compensates, so a one-eye defect is even harder to notice (a common observation, not specific to this site).",
  iopTitle: "What studies say about eye pressure (group-level figures)",
  iopBig:
    "This is not your prognosis and not a prediction. The slider only shows what published studies reported around that pressure; it does not calculate your risk and cannot replace an ophthalmologist setting your target pressure.",
  iopSlider: "Illustrative eye pressure",
  iopSliderHint:
    "10–35 mmHg; used only to look up study ranges. It does not change the field picture above.",
  iopUnit: "mmHg",
  iopNoLink:
    "Pressure level is not the same as “stage”: some people have glaucoma with pressure always in the statistically normal range (normal-tension), and some have raised pressure for years with a healthy optic nerve (ocular hypertension).",
  iopZoneTitle: "Study figures for this pressure range",
  iopZones: [
    {
      range: "About 17 mmHg or below",
      lines: [
        "AGIS report 7 (open-angle glaucoma after surgery, 6+ years): eyes with pressure below 18 mmHg at every visit had a mean change in field-defect score (0–20) close to zero; eyes below 18 mmHg at fewer than half of visits had an estimated mean worsening of 0.63 units (not statistically significant, p = 0.083), about 1.93 units at 7 years.",
        "CNTGS (normal-tension glaucoma): the intention-to-treat analysis showed no significant difference; after censoring cataract effects, the group with pressure lowered by about 30% worsened less. Surgery caused more cataract, so whether to lower pressure aggressively needs individual assessment.",
        "These are group results: lower pressure is associated with less worsening, but this does not mean reaching a given number guarantees no progression.",
      ],
    },
    {
      range: "About 18–21 mmHg",
      lines: [
        "About 18–21 mmHg is the upper part of the commonly used “statistically normal” range (usual upper limit about 21 mmHg; it is not one line for everyone).",
        "EMGT (early open-angle glaucoma, median baseline pressure 20 mmHg): each 1 mmHg higher mean pressure during follow-up was associated with about 13% higher progression risk (HR 1.13, 95% CI 1.07–1.19). Treatment lowered pressure by 5.1 mmHg (25%) on average; progression at a median of about 6 years: 45% treated vs 62% control.",
        "UKGTS (newly diagnosed open-angle glaucoma, baseline mean pressure about 20 mmHg): risk of field deterioration within 24 months, pressure-lowering drops (a prostaglandin analogue) vs placebo, HR 0.44 (95% CI 0.28–0.69); mean pressure fall 3.8 vs 0.9 mmHg.",
      ],
    },
    {
      range: "About 22–30 mmHg",
      lines: [
        "OHTS (ocular hypertension: entry pressure about 24–32 mmHg, optic nerve and field still normal): cumulative development of open-angle glaucoma at 60 months — 9.5% observation vs 4.4% medication (HR 0.40, 95% CI 0.27–0.59). This is onset, not worsening of existing glaucoma, and does not mean everyone needs treatment.",
        "EMGT excluded pressure above 30 mmHg; in that study, the higher the baseline pressure, the higher the progression risk.",
      ],
    },
    {
      range: "About 31–35 mmHg",
      lines: [
        "OHTS entry pressure topped out at about 32 mmHg and EMGT excluded pressure above 30 mmHg, so these trials cannot tell us the risk at higher pressures; this range cannot be worked out from the numbers above.",
        "A sudden very high pressure (for example acute angle-closure) can damage the optic nerve within hours: red painful eye, headache, nausea and vomiting, rainbow rings around lights, sudden loss of vision → go to A&E now; if you cannot get there yourself, call 999.",
      ],
    },
  ],
  iopAlways:
    "Speed of progression varies between people: in a routine clinical-care study (583 people with open-angle or pseudoexfoliation glaucoma, mean follow-up 7.8 years) the mean field MD slope was −0.80 dB per year (very variable; 5.6% progressed faster than −2.5 dB per year); higher mean pressure and older age were associated with faster progression (Heijl 2013).",
  axisTitle: "Where each study's pressures sit",
  axisRows: [
    { label: "EMGT", hint: "entry pressure ≤ 30; median 20" },
    { label: "OHTS", hint: "entry pressure about 24–32" },
    { label: "UKGTS", hint: "baseline mean about 20" },
  ],
  axisThreshold: "18: AGIS report 7 grouping cut-off",
  barsTitle: "Event rates reported by the studies (control vs treated)",
  bars: [
    { label: "EMGT: progression at median about 6 y", a: "Control", av: 62, b: "Treated", bv: 45 },
    { label: "OHTS: open-angle glaucoma by 5 y", a: "Observed", av: 9.5, b: "Medication", bv: 4.4 },
  ],
  barsNote:
    "Populations, outcome definitions, treatments and follow-up differ between studies, so bars from different studies must not be compared. Figures are group results, not a personal prognosis and not a promise of treatment effect.",
  iopLimits:
    "This tool has no personal pressure or medical-record data, is not connected to live patient data, does not calculate a risk for the slider value, and does not extrapolate the studies' per-mmHg risk to other ranges, because that would give a precise-looking number the studies do not support.",
  refsTitle: "Studies cited",
  topicLink: "Glaucoma topic",
};

const ja: GfsText = {
  title: "緑内障の視野の図示",
  intro:
    "街の景色で、緑内障の視野欠損が軽度から末期までおおよそどう見えうるかを示します。緑内障の多くはゆっくり進み、早期は自覚がない人が多いです。失った視野は戻らず、治療の目的は悪化を遅らせることです。",
  simBoxTitle: "シミュレーションのみ · 検査ではありません",
  simBox: [
    "このページは教育目的のシミュレーション／図示です。",
    "視野検査（視野計）や眼科専門医の代わりにはなりません。診断でも検査でもなく、緑内障かどうか、どの段階かを判断することはできません。",
    "実際の視野欠損は人や病期によって異なります。ここに示す形・濃さ・範囲は単純化した図示です。",
    "本サイトは登録医師の代わりにはなりません。",
  ],
  urgent: "突然の視力低下・強い眼痛・頭痛と吐き気 → 緊急ページ",
  eye: "右眼",
  simBadge: "シミュレーション",
  bothEyes:
    "両眼で見ているときは、もう片方の眼が欠けを補うことが多く、多くの人はまったく気づきません。見つけるには眼科検査が必要です。",
  sevGroup: "段階を選ぶ",
  sevs: [
    {
      name: "軽度",
      look: "小さく浅いぼやけや暗がり（鼻側、または注視点の上下に弓状）が出ます。中心視力は通常まだ鮮明です。脳が欠けを「補う」ため、ほとんどの人は気づきません。",
      stage:
        "HPA 早期——視野検査報告の平均偏差（MD）が約 −6 dB より良好で、中心約 5° 内の測定点は正常。",
      note: "自覚症状がないことが多く、眼科検査（眼圧・視神経OCT・視野）で見つかります。小規模な組織学研究（提供眼17眼）では、自動視野検査で統計的な異常が出る時点で、すでに網膜神経節細胞の約 25〜35% が失われていることが示されています（Kerrigan-Baumrind 2000）。",
    },
    {
      name: "中等度",
      look: "欠損が広がり深くなり、鼻側や上下の弓状欠損がはっきりします。横にいる人がぼやけたり「消えたり」することがあります。視力表の視力は良好なこともあります。",
      stage: "HPA 中等度——MD 約 −6〜−12 dB。中心約 5° 内に感度が完全に失われた測定点はない。",
      note: "もっと明るさが必要になったり、横の物にぶつかりやすくなる人もいますが、気づかない人も多いです。",
    },
    {
      name: "重度",
      look: "周辺視野の大部分が欠けるか非常にぼやけ、狭い中心部と周辺の一部だけが残ります。横の人や物にぶつかりやすく、明るさが必要で、読書や周囲の把握が難しくなります。",
      stage:
        "HPA 重度——次のいずれかで重度：MD が約 −12 dB より悪い、半数を超える測定点が明らかに低下、または中心約 5° 内に重い欠損。",
      note: "視野欠損が日常生活に明らかに影響する段階で、医師が個別に経過観察と対応を相談します。",
    },
    {
      name: "末期",
      look: "ごく小さな中心の島（ときに耳側の小さな島）だけが残り、ほとんどの視野に像がほぼありません。中心の島が残っていれば文字や顔の一部が見えることもありますが、範囲は非常に狭く、生活への影響は大きいです。",
      stage:
        "「末期」に国際的に統一された MD の基準はありません。ここでは HPA 重度よりさらに進み、小さな島だけが残る教育上の段階を指します（外科系の文献には MD が約 −20 dB より悪いものを「進行期」とするものがあります）。",
      note: "失った視野は戻りません。目的は、さらなる悪化を遅らせ、残っている視野を守ることです。",
    },
  ],
  patternGroup: "欠損の形（単純化した3種）",
  patterns: [
    {
      name: "弓状",
      desc: "神経線維の走行に沿い、盲点付近から鼻側へ弧を描く暗い帯。水平の中線で急に止まることが多いです。",
    },
    {
      name: "鼻側階段",
      desc: "鼻側の上半分と下半分で欠損の深さが違い、水平の中線で「段差」になります。",
    },
    {
      name: "周辺の狭窄",
      desc: "外側から中心へ少しずつ狭くなり、通常は鼻側が先です。縁はぼんやりしていて、黒い硬い縁ではありません。",
    },
  ],
  patternConverge: "末期では型が似てきます：小さな中心の島、ときに耳側の島が加わります。",
  patternSimplified: "実際の視野は型が混ざり、中心傍型など他の型もあります。ここは単純化です。",
  styleGroup: "表示方法",
  styleSoft: "患者さんの表現に近い",
  styleDark: "黒いマスク（従来の図示）",
  styleWhy:
    "緑内障の50人への調査では、自分の見え方として「黒いトンネル」や「黒い斑点」を選んだ人はなく、54%が「ぼやけた斑点」、16%が「欠けた斑点」を選び、26%は視野欠損にまったく気づいていませんでした（Crabb 2013）。そのため既定では黒ではなく、ぼかし・色あせ・周囲による「補い」で表します。",
  compareOff: "正常な視野を比較表示",
  compareOn: "正常な視野を表示中（もう一度押すと戻ります）",
  compareBadge: "正常な視野（比較）",
  lookLabel: "見え方の例",
  stageLabel: "分類の目安",
  chartTitle: "視野のグレースケール図（図示）",
  chartCaption:
    "濃いほどその部分の感度が低いことを示します。実際の視野検査報告にも似た図がありますが、報告は機器で測定したものでこの画面ではありません。右側の小さな濃い四角は、誰にでもある正常な盲点です。",
  perceptionTitle: "患者さんは本当に黒く見えているのか？",
  perception:
    "多くの人は、ぼやけ、かすみ、明るさが必要、一部が「ない」と表現し、まったく気づかない人もいます。両眼で見ると脳が補うことが多く、片眼の欠損はさらに気づきにくくなります（一般的な現象で、本サイト独自の主張ではありません）。",
  iopTitle: "研究は眼圧について何と言っているか（集団の数字）",
  iopBig:
    "これはあなたの予後でも予測でもありません。スライダーは、その眼圧付近で公表研究が報告した内容を表示するだけで、あなたのリスクは計算せず、眼科医が決める目標眼圧の代わりにもなりません。",
  iopSlider: "図示用の眼圧",
  iopSliderHint: "10〜35 mmHg。研究の範囲を調べるためだけで、上の視野の図は変わりません。",
  iopUnit: "mmHg",
  iopNoLink:
    "眼圧の高さは「何期か」とは一致しません。眼圧が常に統計的な正常範囲でも緑内障になる人（正常眼圧緑内障）、眼圧が高めでも長年視神経が健康な人（高眼圧症）がいます。",
  iopZoneTitle: "この眼圧範囲の研究数値",
  iopZones: [
    {
      range: "約 17 mmHg 以下",
      lines: [
        "AGIS 第7報（手術後の開放隅角緑内障、6年以上追跡）：毎回の受診で眼圧が 18 mmHg 未満だった眼は、視野欠損スコア（0〜20）の平均変化がほぼ 0。18 mmHg 未満が受診の半分未満だった眼は、平均で 0.63 の悪化と推定（統計的に有意でない、p＝0.083）、7年時点で約 1.93。",
        "CNTGS（正常眼圧緑内障）：intention-to-treat 解析では有意差はありませんでした。白内障の影響を除いて解析すると、眼圧を約 30% 下げた群で悪化が少ない結果でした。手術では白内障が多く生じたため、積極的に眼圧を下げるかどうかは個別の評価が必要です。",
        "これらは集団の結果です。眼圧が低いほど悪化が少ない傾向はありますが、ある数値にすれば悪化しないという保証ではありません。",
      ],
    },
    {
      range: "約 18〜21 mmHg",
      lines: [
        "約 18〜21 mmHg は、よく使われる「統計的正常」範囲の上のほうです（上限は約 21 mmHg が一般的ですが、全員に同じ線ではありません）。",
        "EMGT（早期開放隅角緑内障、ベースライン眼圧の中央値 20 mmHg）：追跡中の平均眼圧が 1 mmHg 高いごとに進行リスクが約 13% 高い（HR 1.13、95% CI 1.07〜1.19）。治療は平均 5.1 mmHg（25%）下げ、追跡中央値約6年で進行したのは治療群 45%、対照群 62%。",
        "UKGTS（新規診断の開放隅角緑内障、ベースライン平均眼圧約 20 mmHg）：24か月以内の視野悪化リスクは、眼圧下降点眼薬（プロスタグランジン類似薬）とプラセボで HR 0.44（95% CI 0.28〜0.69）。平均眼圧低下は 3.8 対 0.9 mmHg。",
      ],
    },
    {
      range: "約 22〜30 mmHg",
      lines: [
        "OHTS（高眼圧症：登録時の眼圧は約 24〜32 mmHg、視神経と視野は正常）：60か月の開放隅角緑内障の累積発症は観察群 9.5%、薬物治療群 4.4%（HR 0.40、95% CI 0.27〜0.59）。これは「発症」であり、すでにある緑内障の悪化ではなく、全員が治療を要するという意味でもありません。",
        "EMGT は 30 mmHg を超える眼圧を除外しました。この研究では、ベースライン眼圧が高いほど進行リスクが高くなりました。",
      ],
    },
    {
      range: "約 31〜35 mmHg",
      lines: [
        "OHTS の登録眼圧は上限が約 32 mmHg、EMGT は 30 mmHg 超を除外したため、これらの試験ではさらに高い眼圧でのリスクは分かりません。この範囲は上の数値から計算できません。",
        "眼圧が急に非常に高くなる場合（急性閉塞隅角発作など）は数時間で視神経を傷めることがあります：充血と強い眼痛、頭痛、吐き気・嘔吐、光の周りの虹のような輪、急な視力低下 → すぐ救急外来へ。自力で行けない場合は 999 に電話してください。",
      ],
    },
  ],
  iopAlways:
    "進行の速さは人によって異なります。通常診療での研究（開放隅角または落屑緑内障 583 人、平均追跡 7.8 年）では、視野 MD の平均変化は年 −0.80 dB（ばらつきが大きく、5.6% は年 −2.5 dB より速い）。平均眼圧が高いことと高齢は、より速い進行と関連しました（Heijl 2013）。",
  axisTitle: "各研究の眼圧がどこにあるか",
  axisRows: [
    { label: "EMGT", hint: "登録眼圧 30 以下、中央値 20" },
    { label: "OHTS", hint: "登録眼圧 約 24〜32" },
    { label: "UKGTS", hint: "ベースライン平均 約 20" },
  ],
  axisThreshold: "18：AGIS 第7報の群分けの境界",
  barsTitle: "研究が報告したイベント割合（対照 対 治療）",
  bars: [
    { label: "EMGT：追跡中央値 約6年で進行", a: "対照", av: 62, b: "治療", bv: 45 },
    { label: "OHTS：5年で開放隅角緑内障を発症", a: "観察", av: 9.5, b: "薬物", bv: 4.4 },
  ],
  barsNote:
    "対象・結果の定義・治療・追跡期間は研究ごとに異なるため、別々の研究の棒を比べてはいけません。数値は集団の結果であり、個人の予後でも治療効果の保証でもありません。",
  iopLimits:
    "このツールは個人の眼圧や診療記録を持たず、リアルタイムの患者データにも接続しません。スライダーの値からリスクは計算せず、研究の 1 mmHg あたりのリスクを他の範囲へ外挿もしません。研究が裏付けていない精密に見える数字を出してしまうためです。",
  refsTitle: "引用した研究",
  topicLink: "緑内障の専題",
};

export const GFS_TEXT = { "zh-Hant": zhHant, en, ja } as const;
