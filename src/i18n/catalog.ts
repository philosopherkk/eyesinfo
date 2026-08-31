import type { Locale } from "./locale";
import type { CategoryId } from "@/data/topics";
import type { ToolId } from "@/data/tools";

type L<T> = Record<Locale, T>;

export const CAT_ORDER: CategoryId[] = ["lens", "lid", "glaucoma", "retina", "surface"];

export const TOOL_TEXT: L<Record<ToolId, { title: string; blurb: string; canto: string }>> = {
  "zh-Hant": {
    amsler: { title: "阿姆斯勒方格", blurb: "自我監察中央視力", canto: "遮一眼，望正中間" },
    iol: { title: "晶體視力示意", blurb: "單焦目標度數與多焦光暈", canto: "睇遠睇近差幾多" },
    map: { title: "眼圖", blurb: "撳部位打開相關專題", canto: "撳眼圖就明" },
    drops: { title: "點藥步驟", blurb: "洗手、唔好掂睫毛；跟說明書", canto: "跟住步驟點" },
    ask: { title: "問醫生清單", blurb: "面診前可帶去的問題", canto: "問清楚先好決定" },
    tunnel: { title: "隧道視野示意", blurb: "青光眼周邊視野收窄（不是檢查）", canto: "睇下隧道點樣" },
    haze: { title: "白內障日夜示意", blurb: "顏色變淡、霧、車燈眩光", canto: "夜晚開車矇唔矇" },
    floaters: { title: "飛蚊與簾幕", blurb: "會飄的飛蚊 vs 唔郁的簾幕", canto: "有簾幕去急症；新飛蚊同日散瞳" },
    halo: { title: "夜間光暈比較", blurb: "單焦、延伸景深、三焦點示意", canto: "唔係術後保證" },
    warm: { title: "熱敷計時", blurb: "示意計時，跟醫生指示", canto: "熱敷跟時間" },
    visit: { title: "一次眼科檢查", blurb: "散瞳後唔好自己開車", canto: "去診所會做咩" },
    outdoor: { title: "兒童戶外時間", blurb: "今日夠唔夠兩小時日光", canto: "出街睇日光" },
    rx: { title: "眼鏡度數解讀", blurb: "球鏡、柱鏡、軸、老花加度", canto: "張紙寫緊咩" },
  },
  "zh-Hans": {
    amsler: { title: "阿姆斯勒方格", blurb: "自我监察中央视力", canto: "遮一眼，望正中间" },
    iol: { title: "晶体视力示意", blurb: "单焦目标度数与多焦光晕", canto: "看远看近差多少" },
    map: { title: "眼图", blurb: "点部位打开相关专题", canto: "点眼图就明白" },
    drops: { title: "点药步骤", blurb: "洗手、不要碰到睫毛；跟说明书", canto: "跟着步骤点" },
    ask: { title: "问医生清单", blurb: "面诊前可带去的问题", canto: "问清楚再决定" },
    tunnel: { title: "隧道视野示意", blurb: "青光眼周边视野变窄（不是检查）", canto: "看看隧道怎样" },
    haze: { title: "白内障日夜示意", blurb: "颜色变淡、雾、车灯眩光", canto: "夜晚开车糊不糊" },
    floaters: { title: "飞蚊与帘幕", blurb: "会飘的飞蚊 vs 不动的帘幕", canto: "有帘幕去急诊；新飞蚊当日散瞳" },
    halo: { title: "夜间光晕比较", blurb: "单焦、延伸景深、三焦点示意", canto: "不是术后保证" },
    warm: { title: "热敷计时", blurb: "示意计时，跟医生指示", canto: "热敷跟时间" },
    visit: { title: "一次眼科检查", blurb: "散瞳后不要自己开车", canto: "去诊所会做什么" },
    outdoor: { title: "儿童户外时间", blurb: "今天够不够两小时日光", canto: "出门看日光" },
    rx: { title: "眼镜度数解读", blurb: "球镜、柱镜、轴、老花加光", canto: "那张纸写什么" },
  },
  en: {
    amsler: { title: "Amsler grid", blurb: "Self-monitor central vision", canto: "Cover one eye, look at the centre" },
    iol: { title: "Lens vision demo", blurb: "Monofocal target and multifocal halos", canto: "Far vs near" },
    map: { title: "Eye map", blurb: "Tap a part to open topics", canto: "Tap the diagram" },
    drops: { title: "Drop technique", blurb: "Wash hands, miss the lashes; follow the label", canto: "Follow the steps" },
    ask: { title: "Questions for your doctor", blurb: "A list you can take to the visit", canto: "Ask before you decide" },
    tunnel: { title: "Tunnel vision demo", blurb: "Glaucoma field loss (not a test)", canto: "See the tunnel" },
    haze: { title: "Cataract day and night", blurb: "Fade, haze, headlight glare", canto: "Night driving blur" },
    floaters: { title: "Floaters vs curtain", blurb: "Drifting specks vs a fixed shadow", canto: "Curtain → A&E; new floaters → same-day dilation" },
    halo: { title: "Night halo comparison", blurb: "Monofocal, EDOF, trifocal demo", canto: "Not a surgical promise" },
    warm: { title: "Warm compress timer", blurb: "A timer for illustration — follow your doctor", canto: "Time the compress" },
    visit: { title: "A clinic visit", blurb: "Do not drive yourself after dilation", canto: "What happens at the visit" },
    outdoor: { title: "Children’s outdoor time", blurb: "Two hours of daylight today?", canto: "Go out in daylight" },
    rx: { title: "Reading a glasses prescription", blurb: "Sph, Cyl, Axis, Add", canto: "What the slip means" },
  },
  ja: {
    amsler: { title: "アムスラーチャート", blurb: "中心視力の自己観察", canto: "片眼を隠し、中央を見る" },
    iol: { title: "眼内レンズの見え方", blurb: "単焦点の目標度数と多焦点ハロー", canto: "遠くと近く" },
    map: { title: "眼の図", blurb: "部位をタップして解説へ", canto: "図をタップ" },
    drops: { title: "点眼の手順", blurb: "手洗い、睫毛に触れない；添付文書に従う", canto: "手順どおりに" },
    ask: { title: "医師に聞くリスト", blurb: "受診前に持っていく質問", canto: "決める前に確認" },
    tunnel: { title: "トンネル視野の図示", blurb: "緑内障の周辺視野（検査ではない）", canto: "トンネルを見る" },
    haze: { title: "白内障の昼と夜", blurb: "色あせ、かすみ、対向車の眩しさ", canto: "夜の運転" },
    floaters: { title: "飛蚊とカーテン", blurb: "動く飛蚊と動かない影", canto: "カーテンは救急、新しい飛蚊は同日散瞳" },
    halo: { title: "夜間ハロー比較", blurb: "単焦点・EDOF・3焦点の図示", canto: "術後保証ではない" },
    warm: { title: "温罨法タイマー", blurb: "8～10分、温かく熱すぎない", canto: "時間を計る" },
    visit: { title: "眼科受診の流れ", blurb: "散瞳後は自分で運転しない", canto: "診察で何をするか" },
    outdoor: { title: "子どもの屋外時間", blurb: "今日、日光は2時間あるか", canto: "外の光を" },
    rx: { title: "眼鏡処方箋の読み方", blurb: "Sph・Cyl・Axis・Add", canto: "用紙の意味" },
  },
};

export const LEGAL_I18N: L<{ short: string; topicFooter: string; umao: string; ppo: string; mchk: string; privacy: string; notSubstitute: string; noServices: string; independent: string }> = {
  "zh-Hant": {
    short: "",
    topicFooter: "",
    umao: "",
    ppo: "",
    mchk: "",
    privacy: "",
    notSubstitute: "",
    noServices: "",
    independent: "",
  },
  "zh-Hans": {
    short: "",
    topicFooter: "",
    umao: "",
    ppo: "",
    mchk: "",
    privacy: "",
    notSubstitute: "",
    noServices: "",
    independent: "",
  },
  en: {
    short:
      "This page is public education and is not a medical advertisement under the Undesirable Medical Advertisements Ordinance (Cap. 231). It does not offer booking, sales or referral. It cannot replace an in-person consultation with a registered ophthalmologist and is not a diagnosis. Organic conditions affecting sight and endocrine disease (including diabetes) must be assessed by a registered doctor; an ophthalmologist when needed. Prescription medicines require a doctor’s prescription.",
    topicFooter:
      "This is general medical information, not a diagnosis, and cannot replace an in-person consultation with a registered ophthalmologist, refraction, or a dilated fundus exam. It is not advice to use any medicine or undergo any procedure. Medicines (including off-label use), laser or surgery must be decided by a registered doctor after examination, according to indications and Hong Kong registration. Figures from the literature are published averages, not any clinic’s results. This site does not book, prescribe or refer. Do not change treatment on your own.",
    umao:
      "Under section 3 of the Undesirable Medical Advertisements Ordinance (Cap. 231), a person must not publish or cause to be published an advertisement likely to lead to the use of any medicine, surgical appliance or treatment for treating or preventing a disease specified in the Schedule. The Schedule includes any organic condition affecting sight (advertising is permitted only for locally applied eye preparations to relieve symptoms) and endocrine disease (including diabetes). This app only covers recognising symptoms, when to seek care, and classes of options a doctor may discuss. It does not promote a named product and does not promise effect, cure or preservation of sight.",
    ppo:
      "Under the Pharmacy and Poisons Ordinance (Cap. 138) and related regulations, a pharmaceutical product generally must be registered with the Pharmacy and Poisons Board before it may be sold, offered for sale or distributed. Prescription medicines (including most eye drops, ointments and all intravitreal injections) must not be self-purchased. Import or use of an unregistered product by an individual patient may be governed by other legal arrangements. Promoting a treatment is also regulated by Cap. 231 and the Medical Council Code. Approval by an overseas regulator does not mean the product is registered or available in Hong Kong.",
    mchk:
      "This education site does not carry clinic addresses, phone numbers, fees or booking routes, and does not link to any practice website. Authors/reviewers are identified only by name, specialist register field and qualifications. There are no outcome promises, comparisons with other doctors, patient testimonials, or words such as “cure / most effective”.",
    privacy:
      "This app may store type size, saved topics, Amsler notes and outdoor time in localStorage on this device. Nothing is uploaded to a server. No name or ID is required. Clearing the site data in the browser deletes it. Adding to the Home Screen is an on-device prompt, not an account.",
    notSubstitute:
      "This content cannot replace an in-person consultation with a registered ophthalmologist and is not a diagnosis. This page is not diagnostic, prescribing or surgical advice. Only doctors listed on the Medical Council specialist register in ophthalmology may use the title “ophthalmologist” (眼科專科醫生).",
    noServices:
      "This site does not offer booking, prescriptions, sales or referrals, and has no link to any practice website.",
    independent:
      "This educational content is fully independent of any practitioner’s identity and clinic promotion, and is not a referral to or promotion of any particular doctor or clinic.",
  },
  ja: {
    short:
      "本ページは市民教育であり、《不良広告（医薬）条例》（第231章）の医療広告ではありません。予約・販売・紹介は行いません。登録眼科専門医の対面診察の代わりにはならず、診断でもありません。視力に影響する器質的疾患および内分泌疾患（糖尿病を含む）は登録医師が個別に評価し、必要に応じて眼科専門医が扱います。処方薬は医師の処方箋が必要です。",
    topicFooter:
      "一般的な医学情報であり診断ではありません。登録眼科専門医の対面診察、検眼、散瞳眼底検査の代わりにはなりません。薬の使用や処置を勧めるものでもありません。薬剤（適応外使用を含む）、レーザー、手術は、検査・適応・香港での登録状況に基づき登録医師が決めます。文献の数字は公開研究の概数であり、診療所の成績ではありません。予約・処方・紹介はしません。自己判断で治療を変えないでください。",
    umao:
      "《不良広告（医薬）条例》（第231章）第3条により、附表の疾患の治療または予防のために医薬品・外科用具・療法を使わせるおそれのある広告を出してはなりません。附表には視力に影響する器質的状態（症状緩和のための局所点眼の広告のみ例外）および内分泌疾患（糖尿病を含む）が含まれます。本アプリは症状の気づき、受診の目安、医師が話し合うことのある選択肢の種類のみを扱い、特定製品を勧めず、効果・治癒・視力温存を約束しません。",
    ppo:
      "《薬剤業及び毒物条例》（第138章）等により、医薬品は販売・販売申出・流通の前に原則として薬剤業及び毒物管理局の登録が必要です。処方薬（多くの点眼・眼軟膏およびすべての硝子体内注射）は自己購入できません。未登録品の個人使用・輸入は別の法定手続の対象になり得ます。療法の宣伝は第231章および医師委員会規範でも規制されます。海外規制当局の承認は香港登録や使用可能を意味しません。",
    mchk:
      "本教育サイトに診療所住所・電話・料金・予約経路はなく、診療所サイトへのリンクもありません。執筆／確認者は氏名・専門医名簿の分野・学歴のみで示します。効果の保証、他の医師との比較、患者の体験談、「根治／最も有効」などの表現は用いません。",
    privacy:
      "文字サイズ、保存した解説、アムスラー自己記録、屋外時間は、この端末のlocalStorageに保存されます。サーバーへは上げません。氏名や身分証は求めません。ブラウザのサイトデータを消すと削除されます。ホーム画面追加は端末上の案内であり、アカウントではありません。",
    notSubstitute:
      "内容は登録眼科専門医の対面診察の代わりにはならず、診断でもありません。診断・処方・手術の助言ではありません。医師委員会の眼科専門医名簿に載る者だけが「眼科専科医」を名乗れます。",
    noServices: "予約・処方・販売・紹介は行わず、診療所サイトへもリンクしません。",
    independent:
      "この教育内容は開業医の身元や診療所宣伝から完全に独立しており、特定の医師や診療所への紹介・宣伝ではありません。",
  },
};
