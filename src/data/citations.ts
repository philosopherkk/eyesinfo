/** Verified public literature. PMIDs checked on PubMed. Not a treatment advert. */

export type Citation = {
  id: string;
  authors: string;
  title: string;
  source: string;
  pmid?: string;
  note: string;
};

export const CITE: Record<string, Citation> = {
  lamp2019: {
    id: "lamp2019",
    authors: "Yam JC, Jiang Y, Tang SM, et al.",
    title:
      "Low-Concentration Atropine for Myopia Progression (LAMP) Study: a randomized, double-blinded, placebo-controlled trial of 0.05%, 0.025%, and 0.01% atropine eye drops in myopia control",
    source: "Ophthalmology. 2019;126(1):113-124",
    pmid: "30514630",
    note: "本港主導隨機試驗；第一年等效球鏡及眼軸數字出處。不是個人處方。",
  },
  lamp2020: {
    id: "lamp2020",
    authors: "Yam JC, Li FF, Zhang X, et al.",
    title: "Two-year clinical trial of the Low-Concentration Atropine for Myopia Progression (LAMP) Study: phase 2 report",
    source: "Ophthalmology. 2020;127(7):910-919",
    pmid: "32019700",
    note: "LAMP 第二年。濃度、是否繼續須由醫生決定。",
  },
  lam2004: {
    id: "lam2004",
    authors: "Lam CS, Goldschmidt E, Edwards MH",
    title: "Prevalence of myopia in local and international schools in Hong Kong",
    source: "Optom Vis Sci. 2004;81(5):317-322",
    pmid: "15181356",
    note: "本地中學篩查近視約 85–88%；國際學校約 60–66%。用來對應「中學階段可超過八成」。",
  },
  eddatax2021: {
    id: "eddatax2021",
    authors: "CUHK EdDataX Research Centre",
    title: "Pupils' eyesight survey (questionnaire)",
    source: "The Chinese University of Hong Kong, June 2021 (press briefing 20 Dec 2022)",
    note: "中三問卷約 66%。問卷不是散瞳驗光，與學校篩查八成不可直接比較。無 PubMed 條目。",
  },
  fan2004: {
    id: "fan2004",
    authors: "Fan DSP, Lam DSC, Lam RF, et al.",
    title: "Prevalence, incidence, and progression of myopia of school children in Hong Kong",
    source: "Invest Ophthalmol Vis Sci. 2004;45(4):1071-1075",
    pmid: "15037570",
    note: "較早本港學童近視盛行率及進展，高於當時西方報告。",
  },
  zhang2023: {
    id: "zhang2023",
    authors: "Zhang XJ, Zhang Y, Kam KW, et al.",
    title: "Prevalence of myopia in children before, during, and after COVID-19 restrictions in Hong Kong",
    source: "JAMA Netw Open. 2023;6(3):e234080",
    pmid: "36947037",
    note: "本港 6–8 歲散瞳調查：疫情前約 23–25%，2021 年約 36%。與中學篩查數字不可直接比較。",
  },
  he2015: {
    id: "he2015",
    authors: "He M, Xiang F, Zeng Y, et al.",
    title:
      "Effect of time spent outdoors at school on the development of myopia among children in China: a randomized clinical trial",
    source: "JAMA. 2015;314(11):1142-1148",
    pmid: "26372583",
    note: "廣州學校增加戶外時間的隨機試驗，與減慢近視出現有關。不是光度處方。",
  },
  rose2008: {
    id: "rose2008",
    authors: "Rose KA, Morgan IG, Ip J, et al.",
    title: "Outdoor activity reduces the prevalence of myopia in children",
    source: "Ophthalmology. 2008;115(8):1279-1285",
    pmid: "18294691",
    note: "雪梨兒童隊列：戶外時間與近視較少相關。",
  },
  dews2: {
    id: "dews2",
    authors: "Craig JP, Nichols KK, Akpek EK, et al.",
    title: "TFOS DEWS II definition and classification report",
    source: "Ocul Surf. 2017;15(3):276-283",
    pmid: "28736335",
    note: "國際乾眼定義與分類。潤滑劑減輕症狀，不是根治。",
  },
  ohts2002: {
    id: "ohts2002",
    authors: "Kass MA, Heuer DK, Higginbotham EJ, et al.",
    title:
      "The Ocular Hypertension Treatment Study: a randomized trial determines that topical ocular hypotensive medication delays or prevents the onset of primary open-angle glaucoma",
    source: "Arch Ophthalmol. 2002;120(6):701-713",
    pmid: "12049574",
    note: "五年累積轉成開角型青光眼：用藥組 4.4%，觀察組 9.5%。不是人人必須即時用藥。",
  },
  cntgs1998: {
    id: "cntgs1998",
    authors: "Collaborative Normal-Tension Glaucoma Study Group",
    title: "The effectiveness of intraocular pressure reduction in the treatment of normal-tension glaucoma",
    source: "Am J Ophthalmol. 1998;126(4):498-505",
    pmid: "9780094",
    note: "正常眼壓性青光眼：把眼壓再降約 30% 可減慢部分人惡化。",
  },
  emgt2002: {
    id: "emgt2002",
    authors: "Heijl A, Leske MC, Bengtsson B, et al.",
    title: "Reduction of intraocular pressure and glaucoma progression: results from the Early Manifest Glaucoma Trial",
    source: "Arch Ophthalmol. 2002;120(10):1268-1279",
    pmid: "12365904",
    note: "早期開角型青光眼：降眼壓減慢惡化。已失視野不能還原。",
  },
  eagle2016: {
    id: "eagle2016",
    authors: "Azuara-Blanco A, Burr J, Ramsay C, et al.",
    title:
      "Effectiveness of early lens extraction for the treatment of primary angle-closure glaucoma (EAGLE): a randomised controlled trial",
    source: "Lancet. 2016;388(10052):1389-1397",
    pmid: "27707497",
    note: "入組有嚴格條件（≥50 歲等），不能套用到所有窄房角或遠視。",
  },
  light2019: {
    id: "light2019",
    authors: "Gazzard G, Konstantakopoulou E, Garway-Heath D, et al.",
    title:
      "Selective laser trabeculoplasty versus eye drops for first-line treatment of ocular hypertension and glaucoma (LiGHT): a multicentre randomised controlled trial",
    source: "Lancet. 2019;393(10180):1505-1516",
    pmid: "30862377",
    note: "選擇性激光小梁成形術作為一線選擇之一的隨機試驗。是否適合由醫生決定。",
  },
  areds2: {
    id: "areds2",
    authors: "Age-Related Eye Disease Study 2 Research Group",
    title:
      "Lutein + zeaxanthin and omega-3 fatty acids for age-related macular degeneration: the AREDS2 randomized clinical trial",
    source: "JAMA. 2013;309(19):2005-2015",
    pmid: "23644932",
    note: "主要討論已有中等度年齡相關性黃斑改變的人。不是人人預防配方，本頁不列商品名。",
  },
  catt2011: {
    id: "catt2011",
    authors: "CATT Research Group, Martin DF, Maguire MG, et al.",
    title: "Ranibizumab and bevacizumab for neovascular age-related macular degeneration",
    source: "N Engl J Med. 2011;364(20):1897-1908",
    pmid: "21506142",
    note: "比較兩種抗血管內皮生長因子注射的大型試驗。本頁不列商品名、不保證視力。",
  },
  hollands2009: {
    id: "hollands2009",
    authors: "Hollands H, Johnson D, Brox AC, et al.",
    title: "Acute-onset floaters and flashes: is this patient at risk for retinal detachment?",
    source: "JAMA. 2009;302(20):2243-2249",
    pmid: "19934426",
    note: "急性閃光／飛蚊須散瞳排除裂孔。有簾幕或突然失明按急症處理。",
  },
  stapleton2008: {
    id: "stapleton2008",
    authors: "Stapleton F, Keay L, Edwards K, et al.",
    title: "The incidence of contact lens-related microbial keratitis in Australia",
    source: "Ophthalmology. 2008;115(10):1655-1662",
    pmid: "18538404",
    note: "日戴軟鏡微生物性角膜炎約每萬名戴者每年 2 例量級；過夜明顯較高。",
  },
  pedig2005: {
    id: "pedig2005",
    authors: "Scheiman MM, Hertle RW, Beck RW, et al. (Pediatric Eye Disease Investigator Group)",
    title: "Randomized trial of treatment of amblyopia in children aged 7 to 17 years",
    source: "Arch Ophthalmol. 2005;123(4):437-447",
    pmid: "15824215",
    note: "7–17 歲仍有部分人進步；曾遮眼者、年齡較大者平均幅度較小。不是自己斷某歲就沒用。",
  },
  escrs2007: {
    id: "escrs2007",
    authors: "ESCRS Endophthalmitis Study Group",
    title:
      "Prophylaxis of postoperative endophthalmitis following cataract surgery: results of the ESCRS multicenter study and identification of risk factors",
    source: "J Cataract Refract Surg. 2007;33(6):978-988",
    pmid: "17531690",
    note: "白內障術後眼內炎屬少見但嚴重。數字是多中心試驗，不是任何診所成功率。",
  },
  hayreh2005: {
    id: "hayreh2005",
    authors: "Hayreh SS, Zimmerman MB",
    title: "Central retinal artery occlusion: visual outcome",
    source: "Am J Ophthalmol. 2005;140(3):376-391",
    pmid: "16138997",
    note: "中央動脈阻塞視力預後差。突然失明先當急症，本頁不教自行溶栓。",
  },
  ukpds33: {
    id: "ukpds33",
    authors: "UK Prospective Diabetes Study (UKPDS) Group",
    title:
      "Intensive blood-glucose control with sulphonylureas or insulin compared with conventional treatment and risk of complications in patients with type 2 diabetes (UKPDS 33)",
    source: "Lancet. 1998;352(9131):837-853",
    pmid: "9742976",
    note: "血糖控制與微血管併發症（包括視網膜病變）有關。內科跟進血糖；眼科做眼底。",
  },
};

export function citationsFor(ids: string[]): Citation[] {
  return ids.map((id) => CITE[id]).filter((c): c is Citation => Boolean(c));
}
