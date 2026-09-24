/** Head-only SEO descriptions for release 1.77.
 * Visible on-page meta/tag lines are unchanged. zh-Hans via toHans() at read time.
 * Wording is derived from already-published page text only.
 */

export type SeoDescription = {
  zh: string;
  en: string;
  ja: string;
  /** Optional MedicalCondition names for JSON-LD about (when clearly applicable). */
  about?: { zh: string[]; en: string[]; ja: string[] };
};

export const SEO_DESCRIPTIONS: Record<string, SeoDescription> = {
  "/c/glaucoma": {
    zh: "青光眼與視神經分類頁：整理眼壓、視神經掃描與視野檢查等相關公眾教育專題（公眾教育，不能代替面診。）詳見內文。",
    en: "Category hub for glaucoma and optic-nerve education: eye pressure, nerve scans and visual-field leaflets by theme. Public education only—not a substitute f",
    ja: "緑内障と視神経のハブ：眼圧・OCT・視野など関連する教育トピックをまとめています。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/c/lens": {
    zh: "晶體與屈光分類頁：整理近視遠視、白內障與斜視等相關公眾教育專題，方便按主題閱讀（公眾教育，不能代替面診。）",
    en: "Category hub for lens and refraction education: myopia, hyperopia, cataract and squint leaflets gathered for reading by theme.",
    ja: "水晶体と屈折のハブ：近視遠視・白内障・斜視など関連する市民教育トピックをまとめて読むための案内です。必要に応じて受診してください。"
  },
  "/c/lid": {
    zh: "眼瞼與淚膜分類頁：整理乾眼、瞼緣炎、內翻與溢淚等相關公眾教育專題（公眾教育，不能代替面診。）詳見內文。",
    en: "Category hub for eyelid and tear-film education: dry eye, blepharitis, entropion and watering leaflets by theme. Public education only—not a substitute for",
    ja: "眼瞼と涙膜のハブ：ドライアイ・眼瞼炎・内反・流涙など関連トピックをまとめています。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/c/macula": {
    zh: "黃斑相關專題選擇頁：介紹中央精細視力區域，並連結黃斑病變、裂孔與前膜等教育專題（公眾教育，不能代替面診。）",
    en: "Chooser page for macula-related education leaflets on central fine vision, with links to macular disease, hole and epiretinal membrane topics.",
    ja: "黄斑関連トピックの選択頁：中心の精細視力と、黄斑変性・円孔・前膜など教育ページへの案内です。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["黃斑病變"],
      en: ["Macular disease"],
      ja: ["黄斑疾患"],
    }
  },
  "/c/retina": {
    zh: "視網膜與黃斑分類頁：整理黃斑病變、糖尿上眼與視網膜脫離等相關公眾教育專題（公眾教育，不能代替面診。）",
    en: "Category hub for retina and macula education: macular disease, diabetic eye disease and detachment leaflets by theme. Public education only—not a substitut",
    ja: "網膜と黄斑のハブ：黄斑疾患・糖尿病の目・剥離など関連トピックをまとめています。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/c/surface": {
    zh: "角膜與眼表分類頁：整理結膜炎、過敏與角膜表面激光等相關公眾教育專題（公眾教育，不能代替面診。）詳見內文。",
    en: "Category hub for cornea and ocular-surface education: conjunctivitis, allergy and surface-laser leaflets by theme. Public education only—not a substitute f",
    ja: "角膜と眼表面のハブ：結膜炎・アレルギー・表面レーザーなど関連トピックをまとめています。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/search": {
    zh: "搜尋本站眼科教育專題與工具：可輸入眼疾名稱、徵狀、檢查或工具關鍵字（公眾教育，不能代替面診。）詳見內文。",
    en: "Search this site’s ophthalmology education topics and tools by condition name, symptom, test or tool keyword. Public education only—not a substitute for an",
    ja: "眼の教育トピックやツールを、病名・症状・検査・ツール名のキーワードで検索します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/d1": {
    zh: "介紹近視、遠視、散光與老花的成因概念、常見視力影響，以及何時應找眼科專科醫生評估（公眾教育，不能代替面診。）",
    en: "Explains myopia, hyperopia, astigmatism and presbyopia: how focusing can miss the retina, everyday vision effects, and when to see an ophthalmologist.",
    ja: "近視・遠視・乱視・老視の仕組み、日常への影響、眼科専門医に相談する目安を紹介する教育ページです。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["近視", "遠視", "散光", "老花"],
      en: ["Myopia", "Hyperopia", "Astigmatism", "Presbyopia"],
      ja: ["近視", "遠視", "乱視", "老視"],
    }
  },
  "/t/d10": {
    zh: "介紹翼狀胬肉這種眼白三角形組織增生，以及紫外線防護與何時需要專科評估（公眾教育，不能代替面診。）詳見內文。",
    en: "Describes pterygium as a triangular growth on the white of the eye, UV protection, and when specialist review is needed.",
    ja: "翼状片（目の白い部分の三角形の組織）と紫外線対策、専門医評価の目安を紹介します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["翼狀胬肉"],
      en: ["Pterygium"],
      ja: ["翼状片"],
    }
  },
  "/t/d2": {
    zh: "介紹乾眼症的淚膜不穩、瞼板腺問題與常見誘因，以及重者不宜自行當作普通乾眼忽略（公眾教育，不能代替面診。）",
    en: "Covers dry eye from an unstable tear film and meibomian gland problems, common triggers, and why severe cases need proper assessment.",
    ja: "涙液不安定やマイボーム腺の問題などドライアイの要点と、重い症状を自己判断で放置しない理由を説明します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["乾眼症"],
      en: ["Dry eye disease"],
      ja: ["ドライアイ"],
    }
  },
  "/t/d3": {
    zh: "介紹白內障如何令晶體混濁、常見視力與眩光影響，以及何時與眼科專科醫生討論手術（公眾教育，不能代替面診。）",
    en: "Explains cataract as clouding of the lens, gradual blur and glare, and when to discuss surgery with an ophthalmologist. Public education only—not a substit",
    ja: "白内障による水晶体の濁り、視力や眩しさへの影響、手術を眼科専門医と相談する目安を紹介します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["白內障"],
      en: ["Cataract"],
      ja: ["白内障"],
    }
  },
  "/t/d4": {
    zh: "介紹青光眼與視神經損害的類型概念、視野不能還原的要點，以及閉角發作的求醫警號（公眾教育，不能代替面診。）",
    en: "Outlines glaucoma types, irreversible optic-nerve damage, and warning signs of angle-closure that need urgent care. Public education only—not a substitute ",
    ja: "緑内障の病型、視神経障害が戻らないこと、急性発作時の受診の目安を教育的に説明します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["青光眼"],
      en: ["Glaucoma"],
      ja: ["緑内障"],
    }
  },
  "/t/d5": {
    zh: "介紹年齡相關性黃斑病變的中央視力變化，以及直線變彎或中央暗點須即日眼科評估的警號（公眾教育，不能代替面診。）",
    en: "Describes age-related macular degeneration and why bent lines or a central dark patch need same-day ophthalmic review. Public education only—not a substitu",
    ja: "加齢黄斑変性による中心視力の変化と、線の歪みや中心暗点ですぐ眼科を受診する目安を示します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["年齡相關性黃斑病變"],
      en: ["Age-related macular degeneration"],
      ja: ["加齢黄斑変性"],
    }
  },
  "/t/d6": {
    zh: "介紹糖尿病視網膜病變可在早期無徵狀，以及為何需要定期散瞳眼底檢查而不能等到看不清才求醫（公眾教育，不能代替面診。）",
    en: "Explains diabetic retinopathy can be silent early on, and why regular dilated fundus exams matter before vision is lost.",
    ja: "糖尿病網膜症は初期に自覚がないことがあり、見えにくくなる前の定期的な散瞳眼底の意味を説明します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["糖尿病視網膜病變"],
      en: ["Diabetic retinopathy"],
      ja: ["糖尿病網膜症"],
    }
  },
  "/t/d7": {
    zh: "介紹結膜炎的常見類型與紅眼痕癢表現，並說明較重過敏不宜自行購買類固醇、須醫生評估（公眾教育，不能代替面診。）",
    en: "Covers common conjunctivitis types and red itchy eyes, and why stronger allergy needs a doctor—not self-bought steroids.",
    ja: "結膜炎の主なタイプと充血・かゆみ、重いアレルギーでステロイドを自己購入しない理由を説明します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["結膜炎"],
      en: ["Conjunctivitis"],
      ja: ["結膜炎"],
    }
  },
  "/t/d8": {
    zh: "介紹飛蚊症與玻璃體變化，以及新閃光或飛蚊增多時須即日散瞳評估以排除裂孔或脫離的風險（公眾教育，不能代替面診。）",
    en: "Explains floaters and vitreous change, and why new flashes or a sudden increase need same-day dilated assessment. Public education only—not a substitute fo",
    ja: "飛蚊症と硝子体の変化、新しい光視や飛蚊の急増ですぐ散瞳評価が必要な理由を紹介します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["飛蚊症", "視網膜脫離"],
      en: ["Floaters", "Retinal detachment"],
      ja: ["飛蚊症", "網膜剥離"],
    }
  },
  "/t/d9": {
    zh: "介紹瞼緣炎、麥粒腫與霰粒腫的分別概念，以及眼瞼紅腫硬粒時為何不應自行擠壓（公眾教育，不能代替面診。）",
    en: "Distinguishes blepharitis, stye and chalazion, and explains why a red lid lump should not be squeezed at home. Public education only—not a substitute for a",
    ja: "眼瞼炎・ものもらい・霰粒腫の違いと、赤く硬い腫れを自分で潰さない理由を説明します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["瞼緣炎", "麥粒腫", "霰粒腫"],
      en: ["Blepharitis", "Stye", "Chalazion"],
      ja: ["眼瞼炎", "麦粒腫", "霰粒腫"],
    }
  },
  "/t/ok-hygiene": {
    zh: "介紹角膜塑型（OK 鏡）護理衛生的教育要點，整理減少感染風險討論中常見的清潔與保存疏漏（公眾教育，不能代替面診。）",
    en: "Hygiene education for orthokeratology (OK) lenses, covering common cleaning and storage gaps in infection-risk discussions.",
    ja: "オルソケラトロジー（OKレンズ）の衛生管理教育。感染リスクを減らす話し合いでよく出る洗浄・保存の抜けを整理します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/parent-gaps": {
    zh: "介紹家長常問的視力發展與求醫空隙課題，屬示意教育而非發育測驗分數，並提醒有疑問應接受正式檢查（公眾教育，不能代替面診。）",
    en: "Educational notes on common parent questions about vision development and care gaps—illustrative only, not a developmental score.",
    ja: "保護者がよく抱く視力発達や受診のすき間についての教育メモ。発達検査の点数ではなく、疑問があれば正式な検査を受けるよう促します。"
  },
  "/t/t-allergy": {
    zh: "介紹過敏性結膜炎的類型概念、藥物類別討論方向，以及較重過敏須醫生評估而非自行用藥（公眾教育，不能代替面診。）",
    en: "Covers allergic conjunctivitis types, drug classes doctors may discuss, and why heavier allergy needs medical review. Public education only—not a substitut",
    ja: "アレルギー性結膜炎のタイプ、医師が話しうる薬の種類、重い症状は自己判断で薬を使わない理由を説明します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["過敏性結膜炎"],
      en: ["Allergic conjunctivitis"],
      ja: ["アレルギー性結膜炎"],
    }
  },
  "/t/t-allergy-hk": {
    zh: "介紹香港環境下眼部過敏誘因、與感染的分辨，以及為何不要自行購買類固醇（公眾教育，不能代替面診。）詳見內文。",
    en: "Hong Kong–context education on ocular allergy triggers, separating infection, and why not to self-buy steroid drops. Public education only—not a substitute",
    ja: "アレルギー性結膜炎について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["過敏性結膜炎"],
      en: ["Allergic conjunctivitis"],
      ja: ["アレルギー性結膜炎"],
    }
  },
  "/t/t-bluelight": {
    zh: "介紹藍光與屏幕相關的數碼視疲勞常見誤解，屬文獻取向教育而非產品推介（公眾教育，不能代替面診。）詳見內文。",
    en: "Evidence-oriented education on blue light and digital eye strain myths—not product promotion or device marketing. Public education only—not a substitute fo",
    ja: "このテーマについて、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-cataract": {
    zh: "介紹白內障超聲波乳化與人工晶體的手術類別教育，以及何時與專科醫生討論手術時機（公眾教育，不能代替面診。）",
    en: "Educational overview of phacoemulsification and intraocular lenses, and when surgery timing is discussed with a specialist.",
    ja: "白内障の超音波乳化吸引と眼内レンズの種類、手術時期を専門医と相談する目安を紹介します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["白內障"],
      en: ["Cataract"],
      ja: ["白内障"],
    }
  },
  "/t/t-chalazion": {
    zh: "介紹霰粒腫切開刮除術的知情同意教育要點、結膜面切口概念，以及許多個案可先觀察與熱敷（公眾教育，不能代替面診。）",
    en: "Education on chalazion incision and curettage consent points, the conjunctival approach, and why observation or warm compresses often come first.",
    ja: "霰粒腫の切開掻爬について、同意説明の要点と、まず経過観察や温罨法が選ばれる理由を紹介します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["霰粒腫"],
      en: ["Chalazion"],
      ja: ["霰粒腫"],
    }
  },
  "/t/t-chem": {
    zh: "介紹化學濺入須即時沖洗並前往急症室，以及其後專科分期討論的教育步驟（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on chemical eye injury: irrigate immediately, go to A&E, then specialist staging discussions afterwards. Public education only—not a substitute f",
    ja: "化学眼外傷について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["化學性眼損傷"],
      en: ["Chemical eye injury"],
      ja: ["化学眼外傷"],
    }
  },
  "/t/t-child": {
    zh: "介紹兒童視力里程碑的粗略參考，強調整體差異大，不能代替正式檢查（公眾教育，不能代替面診。）詳見內文。",
    en: "Rough childhood vision-milestone references for public education; individual differences are large and this is not a formal test.",
    ja: "このテーマについて、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-cl": {
    zh: "介紹隱形眼鏡類型、衛生與嚴重或較輕併發症，以及何時應除鏡求醫的教育（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on contact-lens types, hygiene, serious and milder complications, and when to remove lenses and seek care. Public education only—not a substitute",
    ja: "コンタクトレンズ関連角膜炎について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["隱形眼鏡相關角膜炎"],
      en: ["Contact-lens keratitis"],
      ja: ["コンタクトレンズ関連角膜炎"],
    }
  },
  "/t/t-colour-vision": {
    zh: "介紹先天與後天色覺異常的分別、檢查概念，以及不作職業裁決的教育界限（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on congenital versus acquired colour-vision change, testing ideas, and limits—this page makes no job rulings. Public education only—not a substit",
    ja: "色覚異常について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["色覺異常"],
      en: ["Colour vision deficiency"],
      ja: ["色覚異常"],
    }
  },
  "/t/t-corneal-transplant": {
    zh: "介紹角膜移植全層與層狀概念、術後護理與排斥警示，幫助理解專科醫生可能討論的方向（公眾教育），詳見專題正文。",
    en: "Education on full-thickness and lamellar corneal transplant ideas, aftercare and rejection warning signs from the published leaflet.",
    ja: "角膜移植の全層と層状の考え方、術後ケアと拒絶の注意点を公開文に沿って紹介します。受診や診断の代替ではありません。教育目的の説明です。",
    about: {
      zh: ["角膜移植"],
      en: ["Corneal transplant"],
      ja: ["角膜移植"],
    }
  },
  "/t/t-demodex": {
    zh: "介紹蠕形蟎相關瞼緣炎的袖套狀碎屑體徵概念，以及診斷與處理須由醫生檢查後決定（公眾教育，不能代替面診。）",
    en: "Covers Demodex-related blepharitis and collarettes, and why diagnosis and treatment are decided after clinical review. Public education only—not a substitu",
    ja: "デモデックス関連眼瞼炎と睫毛根元の汚れ（カラーレット）の概念、診断は医師の診察後である点を説明します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["蠕形蟎瞼緣炎"],
      en: ["Demodex blepharitis"],
      ja: ["デモデックス眼瞼炎"],
    }
  },
  "/t/t-dilate": {
    zh: "介紹散瞳檢查後常見數小時畏光與近距離模糊，以及回家安排上的注意事項（公眾教育，不能代替面診。）詳見內文。",
    en: "What to expect after dilating drops: hours of light sensitivity and near blur, and practical arrangements for going home.",
    ja: "このテーマについて、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-drops": {
    zh: "介紹正確使用眼藥水的步驟教育，強調應跟從說明書與醫生示範，以減少漏滴等可改善因素（公眾教育，不能代替面診。）",
    en: "Step-by-step education on using eye drops as labelled and demonstrated, including reducing missed doses where possible. Public education only—not a substit",
    ja: "点眼の正しい手順、説明書と医師の実演に従うこと、打ち忘れを減らす要点を教育的に説明します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-dry": {
    zh: "介紹乾眼症的蒸發型、水液不足與混合型分類，以及國際共識中的處理梯階教育概念（公眾教育，不能代替面診。）",
    en: "Outlines evaporative, aqueous-deficient and mixed dry eye, and the stepped care ideas used in consensus education. Public education only—not a substitute f",
    ja: "蒸発亢進型・涙液減少型・混合型のドライアイ分類と、国際合意に沿った段階的対応の考え方を紹介します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["乾眼症"],
      en: ["Dry eye disease"],
      ja: ["ドライアイ"],
    }
  },
  "/t/t-early": {
    zh: "介紹遠視、淺前房與晶體增厚如何影響房角，以及閉角風險與急症識別的公眾教育要點（公眾教育，不能代替面診。）",
    en: "Explains hyperopia, shallow anterior chamber and lens thickening in angle-closure risk education and emergency cues. Public education only—not a substitute",
    ja: "遠視・浅い前房・水晶体の厚みが房角に与える影響と、閉塞隅角リスク・救急サインの市民教育です。必要に応じて受診してください。",
    about: {
      zh: ["閉角型青光眼"],
      en: ["Angle-closure glaucoma"],
      ja: ["閉塞隅角緑内障"],
    }
  },
  "/t/t-entropion": {
    zh: "介紹真性眼瞼內翻（尤其長者退化性）如何令睫毛摩擦角膜，以及與假性內翻的分別教育（公眾教育，不能代替面診。）",
    en: "Educational page on true eyelid entropion—especially involutional change in older adults—and how lashes rub the cornea. Public education only—not a substit",
    ja: "眼瞼内反について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["眼瞼內翻"],
      en: ["Entropion"],
      ja: ["眼瞼内反"],
    }
  },
  "/t/t-epiblepharon": {
    zh: "介紹假性內翻（下瞼贅皮）瞼緣位置正常但皮褶推睫毛的特點，以及與真性內翻的鑑別教育（公眾教育，不能代替面診。）",
    en: "Educational page on epiblepharon, where the lid margin sits normally but a skin fold pushes lashes toward the eye. Public education only—not a substitute f",
    ja: "眼瞼贅皮について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["假性內翻"],
      en: ["Epiblepharon"],
      ja: ["眼瞼贅皮"],
    }
  },
  "/t/t-erm": {
    zh: "介紹黃斑前膜如何引起視物變形，以及並非一經發現就必須手術的教育要點（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on epiretinal membrane causing distortion, and why finding a membrane does not always mean immediate surgery. Public education only—not a substit",
    ja: "黄斑前膜について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["黃斑前膜"],
      en: ["Epiretinal membrane"],
      ja: ["黄斑前膜"],
    }
  },
  "/t/t-gca": {
    zh: "介紹巨細胞動脈炎相關新頭痛、顎跛行與突然失明等警號，強調須立即急症室評估（公眾教育，不能代替面診。）",
    en: "Warning education on giant cell arteritis—new headache, jaw claudication, sudden vision loss—and going to A&E now. Public education only—not a substitute f",
    ja: "巨細胞性動脈炎について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["巨細胞動脈炎"],
      en: ["Giant cell arteritis"],
      ja: ["巨細胞性動脈炎"],
    }
  },
  "/t/t-glaucoma-monitor": {
    zh: "介紹青光眼長期監察中目標眼壓、OCT 與視野報告的解讀教育，報告顏色不是判詞（公眾教育，不能代替面診。）",
    en: "Education on long-term glaucoma monitoring: target pressure, OCT and visual-field reports; colours on a printout are not a verdict.",
    ja: "緑内障について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["青光眼"],
      en: ["Glaucoma"],
      ja: ["緑内障"],
    }
  },
  "/t/t-gldrops": {
    zh: "介紹青光眼眼藥水的主要作用類別、依從性與點藥技巧教育；本頁不列商品名（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on glaucoma drop classes, adherence and instillation technique; this page lists no product brand names. Public education only—not a substitute fo",
    ja: "このテーマについて、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-high-myopia-pathology": {
    zh: "介紹高度近視長遠的病理近視、近視性黃斑與裂孔脫離等結構風險教育（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on long-term structural risks of high myopia: pathologic myopia, myopic maculopathy and tear or detachment risk.",
    ja: "病的近視について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["病理近視"],
      en: ["Pathologic myopia"],
      ja: ["病的近視"],
    }
  },
  "/t/t-iol": {
    zh: "介紹人工晶體單焦、散光矯正、延伸景深與多焦等選擇細節的教育比較，強調沒有一款適合所有人（公眾教育，不能代替面診。）",
    en: "Compares monofocal, toric, extended-depth and multifocal lens ideas in education—no single option suits everyone. Public education only—not a substitute fo",
    ja: "単焦点・乱視矯正・焦点深度拡張・多焦点など眼内レンズ選択の教育的比較です。万人向けの一択はありません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-keratoconus": {
    zh: "介紹圓錐角膜的進展監測、急性水腫與光學或交聯等類別討論的公眾教育（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on keratoconus monitoring, acute hydrops, and optical or crosslinking class discussions from the leaflet. Public education only—not a substitute ",
    ja: "円錐角膜について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["圓錐角膜"],
      en: ["Keratoconus"],
      ja: ["円錐角膜"],
    }
  },
  "/t/t-lasik": {
    zh: "介紹 LASIK 與 SMILE 等激光矯視如何改變角膜度數，並說明不能消除高度近視的眼底風險（公眾教育，不能代替面診。）",
    en: "Education on LASIK and SMILE changing corneal power, and why they do not remove fundus risks of high myopia. Public education only—not a substitute for an ",
    ja: "このテーマについて、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-lube": {
    zh: "介紹潤眼液與眼表潤滑劑的淚膜與成分類別教育，以及何時應連同乾眼專題一併理解（公眾教育，不能代替面診。）",
    en: "Education on lubricating drops and gels by tear-film layer and ingredient class, and when to read the dry-eye topic too.",
    ja: "このテーマについて、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-macular-hole": {
    zh: "介紹黃斑裂孔的全層／板層／假性裂孔概念與 OCT 角色，並說明閉合與否因人而異（公眾教育，不能代替面診。）",
    en: "Education on full-thickness, lamellar and pseudo macular holes, the role of OCT, and that hole closure is not guaranteed.",
    ja: "黄斑円孔について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["黃斑裂孔"],
      en: ["Macular hole"],
      ja: ["黄斑円孔"],
    }
  },
  "/t/t-mfiol": {
    zh: "介紹多焦晶體術前篩選中像差、瞳孔與眼底評估的病人可讀摘要，方便理解為何有時不建議多焦（公眾教育，不能代替面診。）",
    en: "Patient-readable summary of multifocal lens screening: aberrations, pupil and fundus factors that may advise against multifocal IOLs.",
    ja: "多焦点レンズ術前の収差・瞳孔・眼底評価について、なぜ勧めたくない場合があるかを読みやすくまとめます。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-migraine": {
    zh: "介紹偏頭痛視覺先兆與需排除的眼科／血管急症分別，屬教育而非神經科診斷（公眾教育，不能代替面診。）詳見內文。",
    en: "Education separating migraine visual aura from ophthalmic or vascular emergencies that must not be missed. Public education only—not a substitute for an in",
    ja: "片頭痛について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["偏頭痛"],
      en: ["Migraine"],
      ja: ["片頭痛"],
    }
  },
  "/t/t-myopia": {
    zh: "介紹兒童近視控制常討論的戶外時間、低濃度阿托品與光學離焦等方向，強調不能代替個別處方評估（公眾教育，不能代替面診。）",
    en: "Summarises childhood myopia discussions—outdoor time, low-dose atropine, optical defocus—without replacing individual prescribing.",
    ja: "小児近視でよく話される屋外時間・低濃度アトロピン・光学的デフォーカスなどの方向性を教育的にまとめます。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["近視"],
      en: ["Myopia"],
      ja: ["近視"],
    }
  },
  "/t/t-nldo": {
    zh: "介紹先天或後天鼻淚管阻塞如何引起溢淚，以及相關評估方向的公眾教育（公眾教育，不能代替面診。）詳見內文。",
    en: "Educational page on congenital or acquired nasolacrimal duct obstruction as a cause of watering, and evaluation themes. Public education only—not a substit",
    ja: "鼻涙管閉塞について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["鼻淚管阻塞"],
      en: ["Nasolacrimal duct obstruction"],
      ja: ["鼻涙管閉塞"],
    }
  },
  "/t/t-nystagmus": {
    zh: "介紹嬰幼兒型與後天型眼球震顫的分別概念，以及何時需要求醫評估，方便家長理解教育要點（非診斷），詳見專題正文。",
    en: "Education on infantile versus acquired nystagmus themes and when medical assessment is needed, based on the published leaflet.",
    ja: "乳幼児型と後天性の眼振の違いと、評価が必要になる目安を公開教育文に沿って紹介します。診断の代わりにはなりません。教育目的の説明です。",
    about: {
      zh: ["眼球震顫"],
      en: ["Nystagmus"],
      ja: ["眼振"],
    }
  },
  "/t/t-octm": {
    zh: "介紹黃斑 OCT 如何用於濕性黃斑病變、糖尿黃斑水腫與靜脈阻塞等的厚度與積液比較教育（公眾教育，不能代替面診。）",
    en: "Explains macular OCT for comparing thickness and fluid in wet AMD, diabetic macular oedema and vein occlusion education.",
    ja: "滲出型黄斑変性・糖尿病黄斑浮腫・静脈閉塞などで黄斑OCTの厚みや液体を比べる教育的説明です。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-ocular-tumours": {
    zh: "介紹眼瞼、眼眶與眼內腫瘤位置的公眾教育框架，以及常見警號的求醫方向（公眾教育，不能代替面診。）詳見內文。",
    en: "Public-education framework for eyelid, orbital and intraocular tumours, with common warning signs for seeking care. Public education only—not a substitute ",
    ja: "眼腫瘍について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["眼部腫瘤"],
      en: ["Ocular tumour"],
      ja: ["眼腫瘍"],
    }
  },
  "/t/t-optic-neuritis": {
    zh: "介紹視神經炎常見的單眼視力下降與轉動痛，以及何時求醫與醫生或會討論的方向（公眾教育，不能代替面診。）",
    en: "Education on optic neuritis themes—monocular vision drop and pain on eye movement—and when to seek care. Public education only—not a substitute for an in-p",
    ja: "視神経炎について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["視神經炎"],
      en: ["Optic neuritis"],
      ja: ["視神経炎"],
    }
  },
  "/t/t-presbyopia": {
    zh: "介紹老花（老視）的調節力下降、眼鏡隱形眼鏡縮瞳藥水角膜激光與晶體等處理方向的利弊教育（公眾教育，不能代替面診。）",
    en: "Covers presbyopia as loss of near focusing power and trade-offs of glasses, contacts, drops, corneal laser and lens options.",
    ja: "老視（調節力低下）と、眼鏡・コンタクト・点眼・角膜レーザー・水晶体など対応の得失を教育的に紹介します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["老花"],
      en: ["Presbyopia"],
      ja: ["老視"],
    }
  },
  "/t/t-pterygium": {
    zh: "介紹翼狀胬肉與紫外線等相關因素，以及生活上遮陽防護的建議，並說明何時宜找專科評估（公眾教育），詳見專題正文。",
    en: "Educational notes on pterygium and UV-related factors, plus everyday sun-protection ideas from the published leaflet for readers.",
    ja: "翼状片と紫外線などの関連要因、日常の遮光の考え方を公開教育文に沿って紹介します。対面診療の代わりにはなりません。教育目的の説明です。",
    about: {
      zh: ["翼狀胬肉"],
      en: ["Pterygium"],
      ja: ["翼状片"],
    }
  },
  "/t/t-ptk": {
    zh: "介紹復發性角膜侵蝕與治療性角膜切削（PTK）的教育概念，包括上皮基底膜變性相關討論（公眾教育，不能代替面診。）",
    en: "Explains recurrent corneal erosion and therapeutic PTK ideas, including epithelial basement-membrane degeneration themes.",
    ja: "再発性角膜びらんと治療的PTK、上皮基底膜変性に関連する教育的説明です。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["復發性角膜侵蝕"],
      en: ["Recurrent corneal erosion"],
      ja: ["再発性角膜びらん"],
    }
  },
  "/t/t-ptosis": {
    zh: "介紹上瞼下垂與提上瞼肌或腱膜問題的教育概念，以及需要排除的神經或肌源警號（公眾教育，不能代替面診。）",
    en: "Educational page on ptosis and levator or aponeurosis problems, including red-flag neurological or muscle causes to exclude.",
    ja: "眼瞼下垂について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["上瞼下垂"],
      en: ["Ptosis"],
      ja: ["眼瞼下垂"],
    }
  },
  "/t/t-rd": {
    zh: "介紹視網膜脫離、裂孔與玻璃體切除的急症教育，並說明黃斑是否仍附著如何影響處理緩急與預後討論（公眾教育，不能代替面診。）",
    en: "Urgent education on retinal detachment, tears and vitrectomy, including why macula-on versus macula-off changes timing talks.",
    ja: "網膜剥離・裂孔・硝子体手術の救急教育と、黄斑が残っているかどうかで急ぐ度合いの話し合いが変わる理由です。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["視網膜脫離"],
      en: ["Retinal detachment"],
      ja: ["網膜剥離"],
    }
  },
  "/t/t-roles": {
    zh: "介紹眼科專科醫生、視光師與配鏡分工的公眾教育，方便理解各自角色而非比較廣告（公眾教育，不能代替面診。）",
    en: "Public education on roles of ophthalmologists, optometrists and dispensing—not a comparative advertisement. Public education only—not a substitute for an i",
    ja: "このテーマについて、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-rvo": {
    zh: "介紹視網膜靜脈或動脈阻塞的突然視力影響，以及何時須作急症處理的教育（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on retinal vein or artery occlusion with sudden vision change, and when emergency care is discussed. Public education only—not a substitute for a",
    ja: "網膜血管閉塞について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["視網膜血管阻塞"],
      en: ["Retinal vessel occlusion"],
      ja: ["網膜血管閉塞"],
    }
  },
  "/t/t-scleritis": {
    zh: "介紹表層鞏膜炎與鞏膜炎的痛楚與風險分別，以及感染未排除前不做免疫抑制的教育（公眾教育，不能代替面診。）",
    en: "Education distinguishing episcleritis from scleritis pain and risk, and avoiding immunosuppression until infection is excluded.",
    ja: "強膜炎について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["鞏膜炎"],
      en: ["Scleritis"],
      ja: ["強膜炎"],
    }
  },
  "/t/t-steroid": {
    zh: "介紹類固醇眼藥水與眼壓、白內障及感染擴散風險，強調須按醫生指示使用（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on steroid eye drops versus eye-pressure rise, cataract risk and infection spread; use only as a clinician directs.",
    ja: "ステロイド緑内障について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["類固醇性青光眼"],
      en: ["Steroid-induced glaucoma"],
      ja: ["ステロイド緑内障"],
    }
  },
  "/t/t-steroid-sparing": {
    zh: "介紹眼表類固醇節約用藥中環孢素與他克莫司等處方藥類別教育，非購買推介（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on steroid-sparing ocular-surface options such as ciclosporin and tacrolimus classes—not a shopping guide. Public education only—not a substitute",
    ja: "このテーマについて、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-strab": {
    zh: "介紹斜視與弱視的視軸對不齊概念、內斜外斜複視，以及何時屬急症評估（公眾教育，不能代替面診。）詳見內文。",
    en: "Educational page on strabismus and amblyopia, misaligned visual axes, and when double vision needs urgent assessment. Public education only—not a substitut",
    ja: "斜視について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["斜視"],
      en: ["Strabismus"],
      ja: ["斜視"],
    }
  },
  "/t/t-strabsx": {
    zh: "介紹斜視手術的術前評估與術後急症紅旗教育，方便理解適應與風險討論方向（公眾教育，不能代替面診。）詳見內文。",
    en: "Education on strabismus surgery assessment and postoperative red flags—adaptation and risk discussion themes only. Public education only—not a substitute f",
    ja: "斜視について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["斜視"],
      en: ["Strabismus"],
      ja: ["斜視"],
    }
  },
  "/t/t-tacrolimus-eyelid": {
    zh: "介紹他克莫司用於眼瞼的標籤外教育概念，常見於異位性角結膜炎討論，並指向類固醇節約專題（公眾教育，不能代替面診。）",
    en: "Education on off-label eyelid tacrolimus often discussed in atopic keratoconjunctivitis, linking to steroid-sparing topics.",
    ja: "眼瞼へのタクロリムス（適応外）の教育的位置づけと、アトピー性角結膜炎での議論、ステロイド節約の話題へ案内します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/t-ted": {
    zh: "介紹甲狀腺眼疾的凸眼、複視與視神經受壓等教育要點，以及何時需要急症評估（公眾教育，不能代替面診。）詳見內文。",
    en: "Educational points on thyroid eye disease—bulging, double vision and optic-nerve pressure—and when urgent review is needed.",
    ja: "甲状腺眼症について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["甲狀腺眼疾"],
      en: ["Thyroid eye disease"],
      ja: ["甲状腺眼症"],
    }
  },
  "/t/t-uveitis": {
    zh: "介紹葡萄膜炎的解剖分類與感染性／非感染性概念，以及專科處理梯階的公眾教育（公眾教育，不能代替面診。）",
    en: "Education on uveitis anatomic classes and infectious versus non-infectious ideas, plus specialist stepped-care themes. Public education only—not a substitu",
    ja: "ぶどう膜炎について、公開中の教育文に沿った要点と受診の目安を紹介します。診断の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["葡萄膜炎"],
      en: ["Uveitis"],
      ja: ["ぶどう膜炎"],
    }
  },
  "/t/t-vegf": {
    zh: "介紹玻璃體內注射抗血管內皮生長因子的教育概念、常見適應討論方向，以及須由眼科專科醫生決定是否適合（公眾教育，不能代替面診。）",
    en: "Explains intravitreal anti-VEGF injections as education only: why they are discussed and that suitability is decided by an ophthalmologist.",
    ja: "抗VEGFの硝子体内注射について、教育上の位置づけと適応は眼科専門医が判断することを説明します。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["黃斑病變", "黃斑水腫"],
      en: ["Macular degeneration", "Macular oedema"],
      ja: ["黄斑変性", "黄斑浮腫"],
    }
  },
  "/t/t-warm": {
    zh: "介紹眼瞼熱敷及按摩如何協助瞼板腺油脂流動，適用於瞼板腺功能障礙、瞼緣炎與霰粒腫的家居護理教育（公眾教育，不能代替面診。）",
    en: "Explains lid warming and massage to help meibomian oil flow in MGD, blepharitis and chalazion home-care education. Public education only—not a substitute f",
    ja: "マイボーム腺機能不全や眼瞼炎・霰粒腫向けの、眼瞼温罨法とマッサージの家事ケア教育です。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。",
    about: {
      zh: ["瞼板腺功能障礙"],
      en: ["Meibomian gland dysfunction"],
      ja: ["マイボーム腺機能不全"],
    }
  },
  "/t/t-yag": {
    zh: "介紹 YAG 後囊切開與視網膜裂孔屏障激光的教育概念，包括後囊混濁與裂孔封邊的分別（公眾教育，不能代替面診。）",
    en: "Educational notes on YAG capsulotomy and retinal barrier laser for posterior capsule opacity or tear sealing. Public education only—not a substitute for an",
    ja: "後嚢混濁に対するYAG切開と、網膜裂孔のバリアレーザーについての教育的説明です。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/t/water-acanthamoeba": {
    zh: "介紹隱形眼鏡與水源相關的棘阿米巴角膜炎風險教育，以及出現疼痛畏光時須盡快接受眼科專科評估（公眾教育，不能代替面診。）",
    en: "Education on Acanthamoeba keratitis risk linked to contact lenses and water, and why pain with photophobia needs prompt review.",
    ja: "コンタクトレンズと水源に関連するアカントアメーバ角膜炎のリスク教育。痛みや羞明があるときは早めの眼科専門評価が必要です。",
    about: {
      zh: ["棘阿米巴角膜炎"],
      en: ["Acanthamoeba keratitis"],
      ja: ["アカントアメーバ角膜炎"],
    }
  },
  "/tools/ask": {
    zh: "面診前可思考的問題清單示意，幫助整理病情描述；不能代替面診或診斷（公眾教育，不能代替面診。）詳見內文。",
    en: "Suggested questions to organise your story before a clinic visit. Education only—not booking, advice or a diagnosis. Public education only—not a substitute",
    ja: "受診前に整理したい質問例。診断の代わりにはならない教育ツールです。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/tools/drops": {
    zh: "點眼步驟練習工具：示範常見點藥動作要點，須同時跟從醫生指示與說明書（公眾教育，不能代替面診。）詳見內文。",
    en: "Practice steps for using eye drops. Follow your clinician’s instructions and the product label; this is not a prescription.",
    ja: "点眼手順の練習ツール。医師の指示と説明書に従うための教育であり、処方ではありません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/tools/floaters": {
    zh: "會飄的飛蚊與不移動簾幕感的對比示意，提醒新出現的症狀須盡快接受散瞳評估；此為教育工具而非檢查，詳見專題正文。",
    en: "Contrasts drifting floaters with a fixed curtain-like shadow; new symptoms need prompt dilated ophthalmic review. Education tool only.",
    ja: "動く飛蚊と動かないカーテン状の影の対比図示。新しい症状は早めの散瞳評価を。検査や診断の代わりではありません。教育目的の説明です。"
  },
  "/tools/halo": {
    zh: "單焦、延伸景深與多焦人工晶體光暈差異的示意，屬光學教育而非產品推介（公眾教育，不能代替面診。）詳見內文。",
    en: "Halo illustrations comparing monofocal, extended-depth and multifocal intraocular-lens ideas. Optics education—not product promotion.",
    ja: "単焦点・EDOF・多焦点のハロー差の図示。光学の教育であり製品の勧誘ではありません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/tools/haze": {
    zh: "顏色變淡、霧感與車燈眩光的示意，幫助描述症狀；不能代替視力或眼底檢查（公眾教育，不能代替面診。）詳見內文。",
    en: "Illustration of washed-out colour, haze and headlight glare to help describe symptoms—not a vision or fundus test. Public education only—not a substitute f",
    ja: "色あせ・霧・ライトの眩しさの図示。視力や眼底の検査の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/tools/map": {
    zh: "眼睛結構示意地圖：幫助理解解剖部位名稱與相對位置，屬教育工具而非檢查或診斷（公眾教育，不能代替面診。）",
    en: "Illustrated eye-structure map for learning anatomy names and relative positions. Education tool only—not an examination or diagnosis.",
    ja: "眼の構造マップの図示。部位の名前と位置を学ぶ教育ツールであり、検査や診断ではありません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/tools/outdoor": {
    zh: "兒童戶外日光時間記錄示意，呼應近視公共衞生教育中的戶外活動討論；這不是個人治療或處方計劃，詳見專題正文。",
    en: "Simple outdoor daylight-time log for childhood myopia public-health education. Not a personal treatment plan or prescription.",
    ja: "小児近視の公衆衛生で話題になる屋外時間の記録図示です。個人の治療計画や処方の代わりにはなりません。教育目的の説明です。詳細は本文を参照してください。"
  },
  "/tools/rx": {
    zh: "眼鏡處方上球鏡、柱鏡、軸與老花加度等欄位的解讀教育；不能代替驗光（公眾教育，不能代替面診。）詳見內文。",
    en: "Explains sphere, cylinder, axis and near-add fields on a glasses prescription. Education only—not a refraction. Public education only—not a substitute for ",
    ja: "眼鏡処方せんの球面・円柱・軸・加入などの読み方教育。検眼の代わりにはなりません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/tools/tunnel": {
    zh: "青光眼周邊視野收窄的示意動畫，幫助理解「隧道視野」概念；不是視野檢查（公眾教育，不能代替面診。）詳見內文。",
    en: "Animation suggesting tunnel-like peripheral field loss for glaucoma education. Not a visual-field test or diagnosis. Public education only—not a substitute",
    ja: "緑内障で周辺視野が狭く感じる様子の図示。視野検査そのものではありません。市民教育であり、登録眼科専門医の対面診療の代わりにはなりません。"
  },
  "/tools/visit": {
    zh: "散瞳診症流程示意：說明檢查後為何不宜自行開車，方便預先安排接載；此為教育說明而非診症服務，詳見專題正文。",
    en: "Walkthrough of a dilated clinic visit: why you should not drive yourself afterwards and how to plan transport. Education only.",
    ja: "散瞳後の受診の流れ図示。自分で運転しない理由と送迎の手配を説明します。診断の代わりではありません。教育目的の説明です。"
  },
  "/tools/warm": {
    zh: "眼瞼熱敷計時示意，提醒跟從醫生建議的溫度與時間；這不是治療效果承諾，亦不能代替面診指導，詳見專題正文。",
    en: "Warm-compress timer for eyelid-care education. Use the temperature and duration your clinician advised—not a treatment guarantee.",
    ja: "眼瞼温罨法のタイマー図示。温度と時間は医師の指示に従ってください。効果を保証するものではなく、診療の代わりでもありません。教育目的の説明です。"
  },
};

