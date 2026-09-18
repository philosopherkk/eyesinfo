/** Verified public literature. PMIDs checked on PubMed. Not a treatment advert. */

export type Citation = {
  id: string;
  authors: string;
  title: string;
  source: string;
  pmid?: string;
  /** Official public-education HTTPS outlink when there is no PMID. */
  url?: string;
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
  lamp22023: {
    id: "lamp22023",
    authors: "Yam JC, Zhang XJ, Chu WK, et al.",
    title:
      "Effect of Low-Concentration Atropine Eyedrops vs Placebo on Myopia Incidence in Children: The LAMP2 Randomized Clinical Trial",
    source: "JAMA. 2023;329(6):472-481. DOI 10.1001/jama.2022.24162",
    pmid: "36786791",
    note: "LAMP2：尚未近視兒童的發生終點。數字是試驗結果，不是個人處方或濃度「最好」比較。",
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
    source: "JAMA Netw Open. 2023;6(3):e234080. DOI 10.1001/jamanetworkopen.2023.4080",
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
    note: "國際乾眼定義與分類（蒸發／水液／混合）。教育架構；不是個人診斷標籤。",
  },
  dews2mgmt: {
    id: "dews2mgmt",
    authors: "Jones L, Downie LE, Korb D, et al.",
    title: "TFOS DEWS II Management and Therapy Report",
    source: "Ocul Surf. 2017;15(3):575-628",
    pmid: "28736343",
    note: "分階處理共識。潤滑減輕症狀，不是根治；階梯不是購物清單。",
  },
  dream2018: {
    id: "dream2018",
    authors:
      "Dry Eye Assessment and Management Study Research Group; Asbell PA, Maguire MG, et al.",
    title: "n-3 Fatty Acid Supplementation for the Treatment of Dry Eye Disease",
    source: "N Engl J Med. 2018;378(18):1681-1690. DOI 10.1056/NEJMoa1709691",
    pmid: "29652551",
    note: "DREAM：n-3 補充相對安慰劑未達主要徵狀優效。不是個人預後／不是品牌比較。",
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
  montesano2026light: {
    id: "montesano2026light",
    authors: "Montesano G, Crabb DP, Garway-Heath DF, et al.",
    title:
      "Six-Year Rate of Visual Field Progression in the Laser in Glaucoma and Ocular Hypertension Trial",
    source:
      "Ophthalmology. 2026;133(2):169-177. DOI 10.1016/j.ophtha.2025.09.023",
    pmid: "41043781",
    note: "LiGHT 六年視野進展公開分析（後設分析）。長期約數不是個人預後／不是品牌比較／不是人人必須；已失去的視野不能還原。",
  },
  wang2019liwan: {
    id: "wang2019liwan",
    authors: "Wang L, Huang W, Huang S, et al.",
    title: "Ten-year incidence of primary angle closure in elderly Chinese: the Liwan Eye Study",
    source:
      "Br J Ophthalmol. 2019;103(3):355-360. https://doi.org/10.1136/bjophthalmol-2017-311808",
    pmid: "29777045",
    note: "荔灣十年累積約數（基線開放角、≥50 歲城市華人）。族群教育約數；不是個人風險或診所保證。",
  },
  he2019zap: {
    id: "he2019zap",
    authors: "He M, Jiang Y, Huang S, et al.",
    title:
      "Laser peripheral iridotomy for the prevention of angle closure: a single-centre, randomised controlled trial",
    source:
      "Lancet. 2019;393(10181):1609-1618. https://doi.org/10.1016/S0140-6736(18)32607-2",
    pmid: "30878226",
    note: "ZAP：社區雙側 PACS 一眼 LPI。可降低進展風險，但整體進展及急性發作仍相對少見。是否預防性激光由醫生個別決定。",
  },
  yuan2023zap: {
    id: "yuan2023zap",
    authors: "Yuan Y, Wang W, Xiong R, et al.",
    title:
      "Fourteen-Year Outcome of Angle-Closure Prevention with Laser Peripheral Iridotomy in the Zhongshan Angle-Closure Prevention Study",
    source:
      "Ophthalmology. 2023. https://doi.org/10.1016/j.ophtha.2023.03.024",
    pmid: "37030454",
    note: "ZAP 十四年結局。長期約數屬公開研究；不是人人必須／人人不必的保證。",
  },
  lai2001apac: {
    id: "lai2001apac",
    authors: "Lai JSM, Liu DTL, Tham CCY, Li RT, Lam DSC",
    title:
      "Epidemiology of acute primary angle-closure glaucoma in the Hong Kong Chinese population: prospective study",
    source: "Hong Kong Med J. 2001;7(2):118-123",
    pmid: "11514744",
    note: "本港急性原發閉角發作流行病學前瞻數列。觀察結果；不是感冒必發病或品牌比較。",
  },
  lai2012medaac: {
    id: "lai2012medaac",
    authors: "Lai JSM, Gangwani RA",
    title: "Medication-induced acute angle closure attack",
    source: "Hong Kong Med J. 2012;18(2):139-145",
    pmid: "22477738",
    note: "藥物誘發急性閉角綜述（機制教育）。本頁不列商品名；有窄房角史須告知配藥者。",
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
    pmid: "21526923",
    note: "比較兩種抗血管內皮生長因子注射的大型試驗（bevacizumab 僅作試驗對照，不是本港選藥表）。本頁不列商品名、不保證視力。",
  },
  view2012: {
    id: "view2012",
    authors: "Heier JS, Brown DM, Chong V, et al.; VIEW 1 and VIEW 2 Study Groups",
    title:
      "Intravitreal aflibercept (VEGF trap-eye) in wet age-related macular degeneration",
    source: "Ophthalmology. 2012;119(12):2537-2548. DOI 10.1016/j.ophtha.2012.09.006",
    pmid: "23084240",
    note: "VIEW：aflibercept 與每月 ranibizumab 視力結果相若的給藥策略討論。不是商品比較或本港處方保證。",
  },
  hawkHarrier2020: {
    id: "hawkHarrier2020",
    authors: "Dugel PU, Koh A, Ogura Y, et al.; HAWK and HARRIER Study Investigators",
    title:
      "HAWK and HARRIER: Phase 3, Multicenter, Randomized, Double-Masked Trials of Brolucizumab for Neovascular Age-Related Macular Degeneration",
    source: "Ophthalmology. 2020;127(1):72-84. DOI 10.1016/j.ophtha.2019.04.017",
    pmid: "30986442",
    note: "HAWK/HARRIER：brolucizumab 相對 aflibercept 視力非劣；安全性（包括眼內炎症）須個別討論。不是商品比較。",
  },
  tenayaLucerne2022: {
    id: "tenayaLucerne2022",
    authors: "Heier JS, Khanani AM, Quezada Ruiz C, et al.; TENAYA and LUCERNE Investigators",
    title:
      "Efficacy, durability, and safety of intravitreal faricimab up to every 16 weeks for neovascular age-related macular degeneration (TENAYA and LUCERNE): two randomised, double-masked, phase 3, non-inferiority trials",
    source: "Lancet. 2022;399(10326):729-740. DOI 10.1016/S0140-6736(22)00010-1",
    pmid: "35085502",
    note: "TENAYA/LUCERNE：faricimab 延長注射間隔的試驗討論。不是商品比較或本港處方保證。",
  },
  everestII2020: {
    id: "everestII2020",
    authors: "Lim TH, Lai TYY, Takahashi K, et al.; EVEREST II Study Group",
    title:
      "Comparison of Ranibizumab With or Without Verteporfin Photodynamic Therapy for Polypoidal Choroidal Vasculopathy: The EVEREST II Randomized Clinical Trial",
    source:
      "JAMA Ophthalmol. 2020;138(9):935-942. DOI 10.1001/jamaophthalmol.2020.2443",
    pmid: "32672800",
    note: "亞洲多中心 EVEREST II：有症狀黃斑 PCV，ranibizumab ± 維替泊芬光動力。試驗約數；不是個人預後或商品比較。",
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
    source:
      "Ophthalmology. 2008;115(10):1655-1662. https://doi.org/10.1016/j.ophtha.2008.04.019",
    pmid: "18538404",
    note: "日戴軟鏡約 1.9/萬人年；過夜軟鏡約 19.5、過夜矽水凝膠約 25.4。不是個人風險或品牌比較。",
  },
  lam2002mk: {
    id: "lam2002mk",
    authors: "Lam DSC, Houang E, Fan DSP, et al.",
    title: "Incidence and risk factors for microbial keratitis in Hong Kong",
    source:
      "Eye (Lond). 2002;16(5):608-618. https://doi.org/10.1038/sj.eye.6700151",
    pmid: "12194077",
    note: "本港數列：日戴約 3/萬、延長配戴約 9/萬。教育約數；不是個人風險保證。",
  },
  carnt2016: {
    id: "carnt2016",
    authors: "Carnt N, Stapleton F",
    title: "Strategies for the prevention of contact lens-related Acanthamoeba keratitis: a review",
    source: "Ophthalmic Physiol Opt. 2016;36(2):77-92",
    pmid: "26691018",
    note: "隱形眼鏡相關棘阿米巴角膜炎預防策略綜述。強調避開水暴露與正確護理；不比較護理液品牌。",
  },
  arshad2019: {
    id: "arshad2019",
    authors: "Arshad M, et al.",
    title: "Water Exposure and the Risk of Contact Lens-Related Disease",
    source: "Cornea. 2019;38(6):791-797",
    pmid: "30789440",
    note: "水暴露與隱形眼鏡相關眼病風險。教育層次；不作個人零感染承諾。",
  },
  watt2005: {
    id: "watt2005",
    authors: "Watt K, Swarbrick HA",
    title:
      "Microbial keratitis in overnight orthokeratology: review of the first 50 cases",
    source: "Eye Contact Lens. 2005;31(5):201-208",
    pmid: "16163011",
    note: "過夜角膜塑型相關微生物性角膜炎早期病例綜述。用作過夜衛生警覺教育；不引述為療效或本地發生率保證。",
  },
  ranzcoOrthoK: {
    id: "ranzcoOrthoK",
    authors: "RANZCO",
    title: "Orthokeratology Patient Guideline",
    source: "Royal Australian and New Zealand College of Ophthalmologists patient guidance",
    url: "https://ranzco.edu/wp-content/uploads/2019/11/RANZCO-Orthokeratology-Patient-Guideline.pdf",
    note: "過夜感染可損視；禁止自來水；護理警示共識。療效不作保證。",
  },
  cdcAcanthamoebaCL: {
    id: "cdcAcanthamoebaCL",
    authors: "CDC",
    title: "Acanthamoeba keratitis — contact lens hygiene points",
    source: "U.S. Centers for Disease Control and Prevention public education",
    url: "https://www.cdc.gov/acanthamoeba/about/about-acanthamoeba-keratitis.html",
    note: "棘阿米巴角膜炎與隱形眼鏡衛生的公開要點。連結屬教育，非售賣。",
  },
  pedig2005: {
    id: "pedig2005",
    authors: "Scheiman MM, Hertle RW, Beck RW, et al. (Pediatric Eye Disease Investigator Group)",
    title: "Randomized trial of treatment of amblyopia in children aged 7 to 17 years",
    source: "Arch Ophthalmol. 2005;123(4):437-447",
    pmid: "15824215",
    note: "7–17 歲仍有部分人進步；曾遮眼者、年齡較大者平均幅度較小。不是自己斷某歲就沒用。",
  },
  repka2006: {
    id: "repka2006",
    authors: "Repka MX, et al. (Pediatric Eye Disease Investigator Group)",
    title: "A randomized trial of near versus distance activities while patching for amblyopia in children aged 3 to less than 7 years",
    source: "Ophthalmology. 2006;113(6):904-912",
    pmid: "16751033",
    note: "PEDIG 每日短時遮蓋相關試驗脈絡。遮蓋時數屬處方；本站只作家長依從教育，不給個人劑量。",
  },
  pedig2003: {
    id: "pedig2003",
    authors: "Pediatric Eye Disease Investigator Group",
    title: "A randomized trial of prescribed patching regimens for treatment of severe amblyopia in children",
    source: "Ophthalmology. 2003;110(11):2075-2087",
    pmid: "14597512",
    note: "嚴重弱視遮蓋方案試驗。時數由醫生按病情訂；不作「愈長愈好」保證。",
  },
  xu2020pseudo: {
    id: "xu2020pseudo",
    authors: "Xu TT, et al.",
    title:
      "Pseudostrabismus in the first year of life and subsequent diagnosis of strabismus",
    source: "Am J Ophthalmol. 2020;218:242-246",
    pmid: "32533950",
    note: "首年假性斜視其後仍可能診斷真性斜視。曾被說「只是假性」仍要警惕新徵狀或篩查異常。",
  },
  aaoAaposVision2022: {
    id: "aaoAaposVision2022",
    authors: "AAO / AAPOS",
    title: "Vision Screening for Infants and Children — 2022",
    source: "American Academy of Ophthalmology / American Association for Pediatric Ophthalmology and Strabismus consensus guidance",
    note: "嬰幼兒與兒童視力篩查定性共識。實際以本港兒科、母嬰健康或眼科指示為準；不寫死本地百分比。",
  },
  aaposPseudostrabismus: {
    id: "aaposPseudostrabismus",
    authors: "AAPOS / EyeWiki",
    title: "Pseudostrabismus (glossary / public education)",
    source: "American Association for Pediatric Ophthalmology and Strabismus educational materials",
    note: "假性斜視公眾教育層次。角膜光反射等屬診所檢查，不能用手機自拍代替。",
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
  schaumberg1998: {
    id: "schaumberg1998",
    authors: "Schaumberg DA, Dana MR, Christen WG, Glynn RJ",
    title: "A systematic overview of the incidence of posterior capsule opacification",
    source: "Ophthalmology. 1998;105(7):1213-1221. DOI 10.1016/S0161-6420(98)97023-3",
    pmid: "9663224",
    note: "後囊混濁系統回顧匯總（多為需 Nd:YAG／切開定義）。約數不是個人機率；因晶體、手術與定義而異。",
  },
  donachie2023nod9: {
    id: "donachie2023nod9",
    authors: "Donachie PHJ, Barnes BL, Olaitan M, Sparrow JM, Buchan JC",
    title:
      "The Royal College of Ophthalmologists' National Ophthalmology Database study of cataract surgery: Report 9, Risk factors for posterior capsule opacification",
    source: "Eye (Lond). 2023;37(8):1633-1639. DOI 10.1038/s41433-022-02204-1",
    pmid: "36002508",
    note: "英國 RCOphth NOD 大型登記：後囊混濁風險隨時間上升。公開教育；不作個人預後。",
  },
  fact2020: {
    id: "fact2020",
    authors: "Day AC, Burr JM, Bennett K, et al.",
    title:
      "Femtosecond Laser-Assisted Cataract Surgery Versus Phacoemulsification Cataract Surgery (FACT): A Randomized Noninferiority Trial",
    source: "Ophthalmology. 2020;127(8):1012-1019. DOI 10.1016/j.ophtha.2020.02.028",
    pmid: "32386810",
    note: "飛秒相對傳統超乳的隨機非劣效試驗；主要視力結局未支持「人人升級」。不是個人預後／不是品牌比較。",
  },
  femcat2020: {
    id: "femcat2020",
    authors: "Schweitzer C, Brezin A, Cochener B, et al.",
    title:
      "Femtosecond laser-assisted versus phacoemulsification cataract surgery (FEMCAT): a multicentre participant-masked randomised superiority and cost-effectiveness trial",
    source: "Lancet. 2020;395(10219):212-224. DOI 10.1016/S0140-6736(19)32481-X",
    pmid: "31954466",
    note: "飛秒優效／成本效益未達常規全面採用門檻。公開試驗；不是診所保證。",
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
    note: "較積極血糖控制與較低微血管併發症（含視網膜病變）風險有關；公開摘要常強調相對風險下降，絕對下降視基線。內科跟進血糖；眼科做眼底。數字不是你的個人預後。",
  },
  flitcroft2019: {
    id: "flitcroft2019",
    authors: "Flitcroft DI, He M, Jonas JB, et al.",
    title: "IMI – Defining and Classifying Myopia: A Proposed Set of Standards for Clinical and Epidemiologic Studies",
    source: "Invest Ophthalmol Vis Sci. 2019;60(3):M20-M30",
    pmid: "30817826",
    note: "國際近視研究所（IMI）對近視／高度近視／病理近視等定義與分類的公開標準。教育用；不作個人診斷。",
  },
  ohnoMatsui2015: {
    id: "ohnoMatsui2015",
    authors: "Ohno-Matsui K, Kawasaki R, Jonas JB, et al.",
    title:
      "International photographic classification and grading system for myopic maculopathy",
    source: "Am J Ophthalmol. 2015;159(5):877-883.e7",
    pmid: "25634530",
    note: "META-PM 近視性黃斑病變影像分級。概念進程教育；不可自行對號入座。",
  },
  cheung2017: {
    id: "cheung2017",
    authors: "Cheung CMG, Arnold JJ, Holz FG, et al.",
    title: "Myopic Choroidal Neovascularization: Review, Guidance, and Consensus Statement on Management",
    source: "Ophthalmology. 2017;124(11):1690-1711",
    pmid: "28655539",
    note: "近視性脈絡膜新生血管（myopic CNV）共識。抗 VEGF 等屬專科類別討論，本站不列商品名。",
  },
  haarman2020: {
    id: "haarman2020",
    authors: "Haarman AEG, Enthoven CA, Tideman JWL, et al.",
    title: "The Complications of Myopia: A Review and Meta-Analysis",
    source: "Invest Ophthalmol Vis Sci. 2020;61(4):49",
    pmid: "32347918",
    note: "近視併發症綜述與統合分析。本頁正文採定性表述，不羅列個人終生風險百分比。",
  },
  ueta2020: {
    id: "ueta2020",
    authors: "Ueta T",
    title: "Pathologic myopia: an overview of the current understanding and interventions",
    source: "Glob Health Med. 2020;2(3):151-155",
    pmid: "33330799",
    note: "病理近視概覽。公開教育層次。",
  },
  akduman2023: {
    id: "akduman2023",
    authors: "Akduman L",
    title: "Management of Myopic Maculopathy: Review of Evidence",
    source: "Turk J Ophthalmol. 2023;53(5):307-314",
    pmid: "37870043",
    note: "近視性黃斑病變處理綜述。治療屬專科個別評估；本頁不作療效保證。",
  },
  gomes2015: {
    id: "gomes2015",
    authors: "Gomes JAP, Tan D, Rapuano CJ, et al.",
    title:
      "Global Consensus on Keratoconus and Ectatic Diseases",
    source: "Cornea. 2015;34(4):359-369",
    pmid: "25738235",
    note: "圓錐角膜／擴張性疾病全球共識。定義、進展與管理原則屬教育層次；其後亦有第二輪共識材料（Gomes／Hafezi／Ambrósio 等），本站不另造條目。",
  },
  deshmukh2023: {
    id: "deshmukh2023",
    authors: "Deshmukh R, et al.",
    title: "Management of keratoconus: an updated review",
    source: "Front Med (Lausanne). 2023;10:1212314. DOI 10.3389/fmed.2023.1212314",
    note: "圓錐角膜處理更新綜述。光學矯正與交聯為類別討論；不比較品牌或報成功率。",
  },
  wollensak2003: {
    id: "wollensak2003",
    authors: "Wollensak G, Spoerl E, Seiler T",
    title:
      "Riboflavin/ultraviolet-a-induced collagen crosslinking for the treatment of keratoconus",
    source: "Am J Ophthalmol. 2003;135(5):620-627",
    pmid: "12719068",
    note: "核黃素＋UVA 角膜膠原交聯早期臨床報告。目標為強化生物力學、減慢進展；不保證視力回復。",
  },
  wittigSilva2014: {
    id: "wittigSilva2014",
    authors: "Wittig-Silva C, Chan E, Islam FM, et al.",
    title:
      "A randomized, controlled trial of corneal collagen cross-linking in progressive keratoconus: three-year results",
    source: "Ophthalmology. 2014;121(4):812-821",
    pmid: "24393351",
    note: "進展性圓錐角膜交聯隨機對照三年結果。epi-off 證據較多的公開依據之一；個別是否適合須醫生評估。",
  },
  thong2017: {
    id: "thong2017",
    authors: "Thong BYH",
    title: "Allergic conjunctivitis in Asia",
    source: "Asia Pac Allergy. 2017;7(2):57-64",
    pmid: "28487836",
    note: "亞洲過敏性結膜炎綜述。環境與誘因屬定性教育；不作個人診斷或全港盛行率推斷。",
  },
  yuen2007: {
    id: "yuen2007",
    authors: "Yuen APW, et al.",
    title:
      "Skin prick testing and serum specific IgE in chronic rhinitis in Hong Kong",
    source: "Hong Kong Med J. 2007;13(2):103-108",
    pmid: "17406040",
    note: "本港慢性鼻炎門診皮膚點刺試驗樣本結果；不能解讀為全港人口眼過敏率或花粉感敏人口百分比。",
  },
  leung1998: {
    id: "leung1998",
    authors: "Leung R, et al.",
    title: "Indoor environment and respiratory health in Hong Kong residences",
    source:
      "Clin Exp Allergy. 1998;28(8):1020-1026. DOI 10.1046/j.1365-2222.1998.00281.x",
    note: "本港住屋室內環境與呼吸道健康相關討論。誘因教育；非療效承諾。",
  },
  katelaris2011: {
    id: "katelaris2011",
    authors: "Katelaris CH, et al.",
    title: "Allergies in Asia-Pacific Survey",
    source: "Am J Rhinol Allergy. 2011;25(6):e185-e190",
    note: "亞太過敏調查。燃料燃燒污染物、環境煙草煙霧等可加劇過敏性鼻結膜炎的公開討論依據之一。",
  },
  aaoBlueGlasses: {
    id: "aaoBlueGlasses",
    authors: "American Academy of Ophthalmology (AAO)",
    title: "Are Blue Light-Blocking Glasses Worth It?",
    source:
      "AAO Eye Health. https://www.aao.org/eye-health/tips-prevention/are-computer-glasses-worth-it",
    note: "公開患者教育：目前沒有科學證據顯示電腦屏幕光損害眼睛；學會不建議為用電腦購買特別眼鏡；不適多與使用方式（眨眼減少等）有關。連結非售賣。",
  },
  aaoBlueWorry: {
    id: "aaoBlueWorry",
    authors: "American Academy of Ophthalmology (AAO)",
    title: "Should You Be Worried About Blue Light?",
    source:
      "AAO Eye Health. https://www.aao.org/eye-health/tips-prevention/should-you-be-worried-about-blue-light",
    note: "公開患者教育：沒有證據顯示數碼裝置藍光傷害眼睛；陽光是最大藍光源；屏幕遠低於日照。連結非售賣。",
  },
  aaoDigitalDevices: {
    id: "aaoDigitalDevices",
    authors: "American Academy of Ophthalmology (AAO)",
    title: "Digital Devices and Your Eyes",
    source:
      "AAO Eye Health. https://www.aao.org/eye-health/tips-prevention/digital-devices-your-eyes",
    note: "公開患者教育：細胞／動物藍光實驗並未模擬真人眼＋屏幕；與人類視網膜損害／AMD 沒有有意義關聯；數碼不適與藍光無必然關係。連結非售賣。",
  },
  singh2023cochrane: {
    id: "singh2023cochrane",
    authors: "Singh S, et al.",
    title:
      "Blue-light filtering spectacle lenses for visual performance, sleep, and macular health in adults",
    source:
      "Cochrane Database Syst Rev. 2023;(8):CD013244. DOI 10.1002/14651858.CD013244.pub2",
    note: "相對非過濾鏡片：短期內大概很少或不能減輕電腦相關視疲勞；對最佳矯正視力大概很少或無影響；睡眠證據不清；納入試驗沒有可據以下結論的黃斑健康結果。本站不自製 nm／lux 截止表。",
  },
  simunovic2016: {
    id: "simunovic2016",
    authors: "Simunovic MP",
    title: "Acquired color vision deficiency",
    source: "Surv Ophthalmol. 2016;61(2):132-155",
    pmid: "26656928",
    note: "後天色覺異常綜述。後天型可為視神經／黃斑等疾病訊號；不作個人診斷。",
  },
  hasrod2016: {
    id: "hasrod2016",
    authors: "Hasrod N, Rubin A",
    title: "Congenital and acquired colour vision deficiencies",
    source: "Afr Vis Eye Health. 2016;75(1):a365. DOI 10.4102/aveh.v75i1.365",
    note: "先天與後天色覺異常教育綜述。檢查方法屬類別名；不推介商品。",
  },
  austroadsColour: {
    id: "austroadsColour",
    authors: "Austroads",
    title: "Assessing Fitness to Drive — Colour vision",
    source: "Austroads assessing fitness to drive guidance (colour vision section)",
    note: "部分地區私家／商用車輛色覺標準未必統一；勸喻顯著異常者留意交通燈位置與適應。香港要求以運輸署及相關規管為準；本站不作資格裁決。",
  },
  ng2023asean: {
    id: "ng2023asean",
    authors: "Ng JY, et al.",
    title: "Colour vision restrictions for driving in ASEAN countries",
    source:
      "Lancet Reg Health Southeast Asia. 2023. DOI 10.1016/j.lansea.2023.100171",
    note: "東盟地區駕駛色覺限制比較。各地規管不一；本站不寫死本地分數線。",
  },
  leonardi2016sansika: {
    id: "leonardi2016sansika",
    authors: "Leonardi A, Van Setten G, Amrane M, et al.",
    title:
      "Efficacy and safety of 0.1% cyclosporine A cationic emulsion in the treatment of severe dry eye disease: a multicenter randomized trial (SANSIKA)",
    source: "Eur J Ophthalmol. 2016;26(4):287-296",
    pmid: "27055414",
    note: "SANSIKA 第三期試驗；環孢素眼用乳劑於嚴重乾眼角膜炎之公開試驗脈絡。數字屬試驗脈絡，不是個人療效保證，亦非本港購買推介。",
  },
  nivenius2007: {
    id: "nivenius2007",
    authors: "Nivenius E, van der Ploeg I, Jung K, et al.",
    title:
      "Tacrolimus ointment vs steroid ointment for eyelid dermatitis in patients with atopic keratoconjunctivitis",
    source: "Eye (Lond). 2007;21(7):968-975",
    pmid: "16680103",
    note: "小型交叉研究：眼瞼他克莫司軟膏 vs 類固醇軟膏於 AKC 相關眼瞼濕疹。不作個人保證；本頁不寫劑量。",
  },
  freeman2004: {
    id: "freeman2004",
    authors: "Freeman AK, Serle J, VanVeldhuisen P, et al.",
    title: "Tacrolimus ointment in the treatment of eyelid dermatitis",
    source: "Cutis. 2004;73(4):267-271",
    pmid: "15134327",
    note: "眼瞼皮炎外用他克莫司之小型開放研究。不作個人療效保證；本頁不寫濃度／次數。",
  },
  goldstein2022bak: {
    id: "goldstein2022bak",
    authors: "Goldstein MH, Silva FQ, Blender N, et al.",
    title: "Ocular benzalkonium chloride exposure: problems and solutions",
    source: "Eye (Lond). 2022;36(2):361-368. https://doi.org/10.1038/s41433-021-01668-x",
    pmid: "34262161",
    note: "BAK 防腐劑對眼表影響的綜述。教育用途；不作商品比較或自行換藥手冊。",
  },
  singh2022dicc: {
    id: "singh2022dicc",
    authors: "Singh S, Donthineni PR, Shanbhag SS, et al.",
    title:
      "Drug induced cicatrizing conjunctivitis: A case series with review of etiopathogenesis, diagnosis and management",
    source: "Ocul Surf. 2022;24:83-92",
    pmid: "35247582",
    note: "藥物誘發瘢痕性／擬類天疱瘡樣結膜炎教育文獻。須專科評估；不是自行停藥或換藥指引。",
  },
  dervenis2024namd: {
    id: "dervenis2024namd",
    authors: "Dervenis N, Dervenis P, Agorogiannis E",
    title:
      "Neovascular age-related macular degeneration: disease pathogenesis and current state of molecular biomarkers predicting treatment response—a scoping review",
    source: "BMJ Open Ophthalmol. 2024;9(1):e001516. https://doi.org/10.1136/bmjophth-2023-001516",
    pmid: "38341189",
    note: "濕性 AMD 發病機制與生物標誌綜述。多路徑訊號屬教育；不作雙路徑藥物優劣比較。",
  },
  faricimabFda2022: {
    id: "faricimabFda2022",
    authors: "U.S. Food and Drug Administration",
    title: "Faricimab-svoa injection — Prescribing Information (label)",
    source:
      "https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/761235s000lbl.pdf",
    note: "美國 FDA 公開標籤描述 VEGF-A 與 Ang-2 機制。不作商品比較、療效保證或本港適應症推介；本地註冊以香港為準。",
  },
  ontt1992: {
    id: "ontt1992",
    authors: "Beck RW, et al.; Optic Neuritis Study Group",
    title:
      "A randomized, controlled trial of corticosteroids in the treatment of acute optic neuritis",
    source: "N Engl J Med. 1992;326:581-588. DOI 10.1056/NEJM199202273260901",
    pmid: "1734247",
    note: "ONTT；加速恢復 vs 最終結果教育。不是個人預後／不是品牌比較。",
  },
  ontt1993: {
    id: "ontt1993",
    authors: "Optic Neuritis Study Group",
    title: "Optic neuritis treatment trial. One-year follow-up results",
    source: "Arch Ophthalmol. 1993;111:773-775. DOI 10.1001/archopht.1993.01090060061023",
    pmid: "8512477",
    note: "ONTT 一年隨訪教育。不是個人預後。",
  },
  ontt1994: {
    id: "ontt1994",
    authors: "Beck RW, Cleary PA, Backlund JC",
    title:
      "The course of visual recovery after optic neuritis. Experience of the Optic Neuritis Treatment Trial",
    source: "Ophthalmology. 1994;101:1771-1778. DOI 10.1016/s0161-6420(94)31103-1",
    pmid: "7800355",
    note: "ONTT 視力恢復時程教育。不是個人保證。",
  },
  ontt2003ms: {
    id: "ontt2003ms",
    authors: "Optic Neuritis Study Group",
    title:
      "High- and low-risk profiles for the development of multiple sclerosis within 10 years after optic neuritis",
    source: "Arch Ophthalmol. 2003;121:944-949. DOI 10.1001/archopht.121.7.944",
    pmid: "12860795",
    note: "ONTT MRI 等分層；不是個人風險保證。",
  },
  ontt2008ms: {
    id: "ontt2008ms",
    authors: "Optic Neuritis Study Group",
    title:
      "Multiple sclerosis risk after optic neuritis: final optic neuritis treatment trial follow-up",
    source: "Arch Neurol. 2008;65:727-732. DOI 10.1001/archneur.65.6.727",
    pmid: "18541792",
    note: "ONTT MS 最終隨訪教育。不是個人風險。",
  },
  ontt2008vision: {
    id: "ontt2008vision",
    authors: "Optic Neuritis Study Group",
    title:
      "Visual function 15 years after optic neuritis: a final follow-up report from the Optic Neuritis Treatment Trial",
    source: "Ophthalmology. 2008;115:1079-1082.e5. DOI 10.1016/j.ophtha.2007.08.004",
    pmid: "17976727",
    note: "ONTT 15 年視力功能教育。不是個人預後。",
  },
  acgr2008: {
    id: "acgr2008",
    authors: "Williams KA, et al.",
    title:
      "Risk factors for human corneal graft failure within the Australian corneal graft registry",
    source: "Transplantation. 2008;86:1720-1724. DOI 10.1097/TP.0b013e3181903b0a",
    pmid: "19104411",
    note: "澳洲角膜移植登記存活／失敗原因教育。不是個人風險／不是品牌比較。",
  },
  acgr1992: {
    id: "acgr1992",
    authors: "Williams KA, et al.",
    title: "Factors predictive of corneal graft survival. Report from the Australian Corneal Graft Registry",
    source: "Ophthalmology. 1992;99:403-414. DOI 10.1016/s0161-6420(92)31960-8",
    pmid: "1565452",
    note: "澳洲角膜移植登記預測因素教育。不是個人預後。",
  },
  ctfs1997: {
    id: "ctfs1997",
    authors: "Vail A, et al.; Collaborating Surgeons",
    title: "Conclusions of the corneal transplant follow up study",
    source: "Br J Ophthalmol. 1997;81:631-636. DOI 10.1136/bjo.81.8.631",
    pmid: "9349147",
    note: "英國 CTFS；受者因素與早期風險等教育。不是個人保證。",
  },
  ctfs1996: {
    id: "ctfs1996",
    authors: "Vail A, et al.; Corneal Transplant Follow-up Study Collaborators",
    title:
      "Clinical and surgical factors influencing corneal graft survival, visual acuity, and astigmatism",
    source: "Ophthalmology. 1996;103:1843-1852. DOI 10.1016/s0161-6420(96)30734-3",
    pmid: "8628559",
    note: "CTFS 臨床與手術因素教育。不是個人預後。",
  },
  ehrt2012: {
    id: "ehrt2012",
    authors: "Ehrt O",
    title: "Infantile and acquired nystagmus in childhood",
    source: "Eur J Paediatr Neurol. 2012;16:567-572. DOI 10.1016/j.ejpn.2012.02.010",
    pmid: "22459007",
    note: "嬰幼兒 vs 後天眼球震顫警示徵象教育。",
  },
  bertsch2017: {
    id: "bertsch2017",
    authors: "Bertsch M, et al.",
    title:
      "The clinical evaluation of infantile nystagmus: What to do first and why",
    source: "Ophthalmic Genet. 2017;38:22-33. DOI 10.1080/13816810.2016.1266667",
    pmid: "28177849",
    note: "嬰幼兒眼震評估次序／CEMAS 取向討論。不是自行診斷工具。",
  },
  chang2023aao: {
    id: "chang2023aao",
    authors: "Chang MY, et al.; American Academy of Ophthalmology",
    title:
      "Surgical Treatments to Improve Visual Acuity in Infantile Nystagmus Syndrome: A Report by the American Academy of Ophthalmology",
    source: "Ophthalmology. 2023;130:331-344. DOI 10.1016/j.ophtha.2022.10.006",
    pmid: "36435636",
    note: "AAO 嬰幼兒眼震手術評估；公開綜述結論，不是個人預後或品牌比較。",
  },
  hertle2010: {
    id: "hertle2010",
    authors: "Hertle RW",
    title:
      "Nystagmus in Infancy and Childhood: Characteristics and Evidence for Treatment",
    source: "Am Orthopt J. 2010;60:48-58. DOI 10.3368/aoj.60.1.48",
    pmid: "21061884",
    note: "嬰幼兒／兒童眼震特徵與治療證據綜述。不是個人療效保證。",
  },
  coms18: {
    id: "coms18",
    authors: "Collaborative Ocular Melanoma Study Group",
    title:
      "The COMS randomized trial of iodine 125 brachytherapy for choroidal melanoma, III: initial mortality findings. COMS report No. 18",
    source: "Arch Ophthalmol. 2001;119:969-982. DOI 10.1001/archopht.119.7.969",
    pmid: "11448319",
    note: "COMS 中等大小脈絡膜黑色素瘤；放射 vs 摘除。不是個人預後。",
  },
  coms28: {
    id: "coms28",
    authors: "Collaborative Ocular Melanoma Study Group",
    title:
      "The COMS randomized trial of iodine 125 brachytherapy for choroidal melanoma: V. Twelve-year mortality rates and prognostic factors: COMS report No. 28",
    source: "Arch Ophthalmol. 2006;124:1684-1693. DOI 10.1001/archopht.124.12.1684",
    pmid: "17159027",
    note: "COMS 12 年死亡率與預後因素教育。不是個人預後。",
  },
  dimaras2012: {
    id: "dimaras2012",
    authors: "Dimaras H, et al.",
    title: "Retinoblastoma",
    source: "Lancet. 2012;379:1436-1446. DOI 10.1016/S0140-6736(11)61137-9",
    pmid: "22414599",
    note: "視網膜母細胞瘤兒童教育綜述；基因／臨床概覽。不是個人風險保證。",
  },
  murphree2005: {
    id: "murphree2005",
    authors: "Linn Murphree A",
    title: "Intraocular retinoblastoma: the case for a new group classification",
    source: "Ophthalmol Clin North Am. 2005;18:41-53. DOI 10.1016/j.ohc.2004.11.003",
    pmid: "15763190",
    note: "眼內視網膜母細胞瘤分期分類討論；教育用，不是自行分期工具。",
  },

  gass1988: {
    id: "gass1988",
    authors: "Gass JD",
    title: "Idiopathic senile macular hole. Its early stages and pathogenesis",
    source: "Arch Ophthalmol. 1988;106:629-639. DOI 10.1001/archopht.1988.01060130683026",
    pmid: "3358729",
    note: "分期／機制概念奠基。不是自行分期工具。",
  },
  johnsonGass1988: {
    id: "johnsonGass1988",
    authors: "Johnson RN, Gass JD",
    title:
      "Idiopathic macular holes. Observations, stages of formation, and implications for surgical intervention",
    source: "Ophthalmology. 1988;95:917-924. DOI 10.1016/s0161-6420(88)33075-7",
    pmid: "3174041",
    note: "特發性黃斑裂孔形成階段觀察；教育用，不是個人手術適應保證。",
  },
  gass1995: {
    id: "gass1995",
    authors: "Gass JD",
    title: "Reappraisal of biomicroscopic classification of stages of development of a macular hole",
    source: "Am J Ophthalmol. 1995;119:752-759. DOI 10.1016/s0002-9394(14)72781-3",
    pmid: "7785690",
    note: "黃斑裂孔分期再評估。不是自行對號入座。",
  },
  duker2013: {
    id: "duker2013",
    authors: "Duker JS, et al.",
    title:
      "The International Vitreomacular Traction Study Group classification of vitreomacular adhesion, traction, and macular hole",
    source: "Ophthalmology. 2013;120:2611-2619. DOI 10.1016/j.ophtha.2013.07.042",
    pmid: "24053995",
    note: "IVTS 影像分類教育。不是自行分期工具。",
  },
  meuer2015: {
    id: "meuer2015",
    authors: "Meuer SM, et al.",
    title:
      "The epidemiology of vitreoretinal interface abnormalities as detected by spectral-domain optical coherence tomography: the Beaver Dam Eye Study",
    source: "Ophthalmology. 2015;122:787-795. DOI 10.1016/j.ophtha.2014.10.014",
    pmid: "25556116",
    note: "Beaver Dam SD-OCT：全層黃斑裂孔約 0.4% 等。不是個人風險／不是品牌比較。",
  },
  chew1999: {
    id: "chew1999",
    authors: "Chew EY, et al.",
    title: "Clinical course of macular holes: the Eye Disease Case-Control Study",
    source: "Arch Ophthalmol. 1999;117:242-246. DOI 10.1001/archopht.117.2.242",
    pmid: "10037571",
    note: "黃斑裂孔臨床病程隨訪教育。不是預測你個人會否惡化。",
  },
  kim1995: {
    id: "kim1995",
    authors: "Kim JW, et al.; Vitrectomy for Macular Hole Study Group",
    title:
      "Baseline characteristics, natural history, and risk factors to progression in eyes with stage 2 macular holes",
    source: "Ophthalmology. 1995;102:1818-1829. DOI 10.1016/s0161-6420(95)30788-9",
    pmid: "9098283",
    note: "第 2 期全層孔自然史教育。仍非個人時間表。",
  },
  kelly1991: {
    id: "kelly1991",
    authors: "Kelly NE, Wendel RT",
    title: "Vitreous surgery for idiopathic macular holes. Results of a pilot study",
    source: "Arch Ophthalmol. 1991;109:654-659. DOI 10.1001/archopht.1991.01080050068031",
    pmid: "2025167",
    note: "特發性黃斑裂孔玻璃體手術先導系列。不是現代單一成功率標竿，亦不是你的預後。",
  },
  wendel1993: {
    id: "wendel1993",
    authors: "Wendel RT, et al.",
    title: "Vitreous surgery for macular holes",
    source: "Ophthalmology. 1993;100:1671-1676. DOI 10.1016/s0161-6420(93)31419-3",
    pmid: "8233393",
    note: "黃斑裂孔玻璃體手術系列經驗。不是診所廣告。",
  },
  freeman1997: {
    id: "freeman1997",
    authors: "Freeman WR, et al.; Vitrectomy for Treatment of Macular Hole Study Group",
    title:
      "Vitrectomy for the treatment of full-thickness stage 3 or 4 macular holes. Results of a multicentered randomized clinical trial",
    source: "Arch Ophthalmol. 1997;115:11-21. DOI 10.1001/archopht.1997.01100150013002",
    pmid: "9006420",
    note: "多中心隨機試驗：手術相對觀察。試驗設定下的結果，不是個人預後／不是品牌比較。",
  },
  ezra2004: {
    id: "ezra2004",
    authors: "Ezra E, Gregor ZJ; Moorfields Macular Hole Study Group",
    title:
      "Surgery for idiopathic full-thickness macular hole: two-year results of a randomized clinical trial. Report no. 1",
    source: "Arch Ophthalmol. 2004;122:224-236. DOI 10.1001/archopht.122.2.224",
    pmid: "14769600",
    note: "Moorfields 隨機試驗教育。不是保證閉合或視力。",
  },
  michalewska2010: {
    id: "michalewska2010",
    authors: "Michalewska Z, et al.",
    title: "Inverted internal limiting membrane flap technique for large macular holes",
    source: "Ophthalmology. 2010;117:2018-2025. DOI 10.1016/j.ophtha.2010.02.011",
    pmid: "20541263",
    note: "較大裂孔內界膜翻瓣等術式變體教育，非診所技術比較。",
  },
  steel2013: {
    id: "steel2013",
    authors: "Steel DH, Lotery AJ",
    title:
      "Idiopathic vitreomacular traction and macular hole: a comprehensive review of pathophysiology, diagnosis, and treatment",
    source: "Eye (Lond). 2013;27 Suppl 1:S1-S21. DOI 10.1038/eye.2013.212",
    pmid: "24108069",
    note: "特發性玻璃體黃斑牽引與黃斑裂孔綜述教育。不是個人預後。",
  },
  mitchell1997: {
    id: "mitchell1997",
    authors: "Mitchell P, et al.",
    title: "Prevalence and associations of epiretinal membranes. The Blue Mountains Eye Study, Australia",
    source: "Ophthalmology. 1997;104:1033-1040. DOI 10.1016/s0161-6420(97)30190-0",
    pmid: "9186446",
    note: "Blue Mountains：任何前膜徵象約 7%。不是個人風險／不是品牌比較。",
  },
  fraserBell2003: {
    id: "fraserBell2003",
    authors: "Fraser-Bell S, et al.",
    title:
      "Five-year cumulative incidence and progression of epiretinal membranes: the Blue Mountains Eye Study",
    source: "Ophthalmology. 2003;110:34-40. DOI 10.1016/s0161-6420(02)01443-4",
    pmid: "12511343",
    note: "五年累積發生教育。不是「做白內障就一定有前膜」。",
  },
  mccarty2005: {
    id: "mccarty2005",
    authors: "McCarty DJ, et al.",
    title: "Prevalence and associations of epiretinal membranes in the visual impairment project",
    source: "Am J Ophthalmol. 2005;140:288-294. DOI 10.1016/j.ajo.2005.03.032",
    pmid: "16023066",
    note: "Melbourne VIP 前膜盛行率教育。不是個人風險。",
  },
  ng2011: {
    id: "ng2011",
    authors: "Ng CH, et al.",
    title: "Prevalence and risk factors for epiretinal membranes in a multi-ethnic United States population",
    source: "Ophthalmology. 2011;118:694-699. DOI 10.1016/j.ophtha.2010.08.009",
    pmid: "21035863",
    note: "MESA 多種族照相研究。種族比較屬該研究結果，不是香港個人風險保證。",
  },
  xiao2017: {
    id: "xiao2017",
    authors: "Xiao W, et al.",
    title:
      "Prevalence and risk factors of epiretinal membranes: a systematic review and meta-analysis of population-based studies",
    source: "BMJ Open. 2017;7:e014644. DOI 10.1136/bmjopen-2016-014644",
    pmid: "28951399",
    note: "系統性回顧／統合；方法差異可解釋研究間數字。統合數字仍不是你的預後。",
  },
  bu2014: {
    id: "bu2014",
    authors: "Bu SC, et al.",
    title: "Idiopathic epiretinal membrane",
    source: "Retina. 2014;34:2317-2335. DOI 10.1097/IAE.0000000000000349",
    pmid: "25360790",
    note: "特發性前膜綜述教育。不是個人手術適應保證。",
  },
  scheerlinck2015: {
    id: "scheerlinck2015",
    authors: "Scheerlinck LM, van der Valk R, van Leeuwen R",
    title:
      "Predictive factors for postoperative visual acuity in idiopathic epiretinal membrane: a systematic review",
    source: "Acta Ophthalmol. 2015;93:203-212. DOI 10.1111/aos.12537",
    pmid: "25160648",
    note: "術後視力相關因素系統回顧。不是個人預後公式。",
  },
};

export function citationsFor(ids: string[]): Citation[] {
  return ids.map((id) => CITE[id]).filter((c): c is Citation => Boolean(c));
}
