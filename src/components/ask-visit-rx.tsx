import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

const SITS_TC = [
  {
    id: "cat",
    title: "白內障諮詢",
    qs: [
      "而家白內障有冇影響駕駛或閱讀？",
      "目標度數預留正視、近視定其他？",
      "角膜散光夠唔夠考慮散光矯正晶體？",
      "黃斑同視神經適唔適合多焦或延伸景深？",
      "術後 overnight 要唔要留院？邊間醫院？",
      "後囊混濁同「白內障復發」有咩分別？",
    ],
  },
  {
    id: "gl",
    title: "青光眼覆診",
    qs: [
      "我的目標眼壓是多少？",
      "今次視野／OCT 同上次比，有沒有惡化？",
      "點藥有無漏、有無副作用？",
      "激光或手術何時才要討論？",
      "散瞳或類固醇會唔會影響眼壓？",
    ],
  },
  {
    id: "mac",
    title: "黃斑病",
    qs: [
      "今次眼底／OCT 同上次比，黃斑有冇新滲漏、出血或萎縮？",
      "之後幾耐覆 OCT 或散瞳眼底？",
      "新出現視物變形、中央暗點或視力急降，要點處理？",
      "治療目標是維持定改善視力？有邊啲處理類別醫生或會討論？",
      "戒煙、血壓血脂同日常自查（例如阿姆斯勒方格）要點做？",
    ],
  },
  {
    id: "kid",
    title: "兒童近視",
    qs: [
      "眼軸同度數半年變了多少？",
      "有無需要散瞳驗光？",
      "戶外時間同近距離習慣點改善？",
      "若討論阿托品或其他光學控制，係咪處方、有咩副作用要監察？",
      "高度近視要幾耐散瞳眼底一次？",
    ],
  },
] as const;

const SITS_EN = [
  {
    id: "cat",
    title: "Cataract consultation",
    qs: [
      "Is cataract affecting driving or reading now?",
      "Is the target focus distance for distance, near, or something else?",
      "Is corneal astigmatism enough to discuss a toric lens?",
      "Are the macula and optic nerve suitable for multifocal or EDOF designs?",
      "Is overnight stay needed after surgery? Which hospital setting?",
      "How is posterior capsule opacification different from a “returning cataract”?",
    ],
  },
  {
    id: "gl",
    title: "Glaucoma follow-up",
    qs: [
      "What is my target eye pressure?",
      "Compared with last time, is the field / OCT worse?",
      "Any missed drops or side effects?",
      "When should laser or surgery be discussed?",
      "Could dilation or steroids affect my pressure?",
    ],
  },
  {
    id: "mac",
    title: "Macular disease",
    qs: [
      "Compared with last time, does the fundus / OCT show new leakage, bleeding or atrophy at the macula?",
      "How soon is the next OCT or dilated fundus exam?",
      "What should I do if new distortion, a central dark patch or a sudden vision drop appears?",
      "Is the treatment goal to maintain or improve vision? Which classes of options might be discussed?",
      "What about stopping smoking, blood pressure and lipids, and home checks (for example an Amsler grid)?",
    ],
  },
  {
    id: "kid",
    title: "Childhood myopia",
    qs: [
      "How much did axial length and refractive error change in six months?",
      "Is cycloplegic refraction needed?",
      "How can outdoor time and near-work habits improve?",
      "If atropine or optical myopia control is discussed, is it prescribed and what side effects need monitoring?",
      "How often should high myopia have a dilated fundus exam?",
    ],
  },
] as const;

const SITS_JA = [
  {
    id: "cat",
    title: "白内障の相談",
    qs: [
      "今の白内障は運転や読書に影響していますか？",
      "目標の焦点は遠方・近方・その他のどれですか？",
      "角膜乱視はトーリックレンズを検討する程度ですか？",
      "黄斑と視神経は多焦点やEDOFに適していますか？",
      "術後の一晩入院は必要ですか？どの病院設定ですか？",
      "後嚢混濁と「白内障の再発」はどう違いますか？",
    ],
  },
  {
    id: "gl",
    title: "緑内障の再診",
    qs: [
      "私の目標眼圧はどのくらいですか？",
      "前回と比べて視野／OCTは悪化していますか？",
      "点眼の飲み忘れや副作用はありますか？",
      "レーザーや手術はいつ議論すべきですか？",
      "散瞳やステロイドは眼圧に影響しますか？",
    ],
  },
  {
    id: "mac",
    title: "黄斑疾患",
    qs: [
      "前回と比べて眼底／OCTで黄斑に新しい滲出・出血・萎縮はありますか？",
      "次のOCTまたは散瞳眼底はいつですか？",
      "新たにゆがみ・中心暗点・急な視力低下が出たらどうすればよいですか？",
      "治療目標は維持ですか改善ですか？医師が話し合うことのある選択肢の種類は？",
      "禁煙、血圧・脂質、日常の自己観察（例：アムスラーチャート）はどうすればよいですか？",
    ],
  },
  {
    id: "kid",
    title: "子どもの近視",
    qs: [
      "半年で眼軸と度数はどれくらい変わりましたか？",
      "散瞳検眼は必要ですか？",
      "屋外時間と近見習慣はどう改善できますか？",
      "アトロピンや光学的近視抑制を話す場合、処方ですか、監視すべき副作用は？",
      "強度近視はどれくらいの間隔で散瞳眼底が必要ですか？",
    ],
  },
] as const;

export function AskDoctor() {
  const { locale, tx } = useI18n();
  const [on, setOn] = useState<string[]>(["cat"]);
  const sits = useMemo(() => {
    if (locale === "en") return SITS_EN;
    if (locale === "ja") return SITS_JA;
    return SITS_TC.map((s) => ({
      id: s.id,
      title: tx(s.title),
      qs: s.qs.map((q) => tx(q)),
    }));
  }, [locale, tx]);
  const list = useMemo(() => sits.filter((s) => on.includes(s.id)), [on, sits]);

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        {locale === "en"
          ? "Tick the situations that apply, then print or copy the list for your own doctor. This is not a booking form and this site does not refer."
          : locale === "ja"
            ? "当てはまる状況にチェックし、印刷するか控えてご自身の医師へ。予約表ではなく、紹介も行いません。"
            : tx("勾選情況，列印或抄低帶去你自己的醫生。這不是掛號表，本站亦不作轉介。")}
      </p>
      <div className="mt-3 grid gap-2">
        {sits.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() =>
              setOn((cur) =>
                cur.includes(s.id) ? cur.filter((x) => x !== s.id) : [...cur, s.id],
              )
            }
            className={cn(
              "min-h-12 rounded-xl border px-3 text-left text-[0.9rem] font-semibold",
              on.includes(s.id) ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
            )}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div id="ask-print" className="mt-5 space-y-4">
        {list.length === 0 ? (
          <p className="text-muted">
            {locale === "en"
              ? "Please choose at least one."
              : locale === "ja"
                ? "少なくとも1つ選んでください。"
                : tx("請至少選一項。")}
          </p>
        ) : (
          list.map((s) => (
            <section key={s.id}>
              <h2 className="text-[1rem] font-semibold text-navy">{s.title}</h2>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-[0.9rem] leading-relaxed">
                {s.qs.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-navy font-semibold text-paper"
      >
        {locale === "en" ? "Print list" : locale === "ja" ? "リストを印刷" : tx("列印清單")}
      </button>
    </div>
  );
}

const VISIT_BASE = [
  { t: "問症", d: "病歷、藥物、過敏、家族眼疾、糖尿病。" },
  { t: "視力", d: "看遠、看近；有時加針孔。" },
  { t: "眼壓", d: "氣動或滴麻醉後接觸式。一次高不一定是青光眼。" },
  { t: "裂隙燈", d: "看眼瞼、角膜、前房、晶體。" },
  { t: "散瞳等待", d: "藥水放大瞳孔，約 20–40 分鐘。近距離暫時矇、怕光。" },
] as const;

const OCT_TC =
  "OCT（光學相干斷層掃描）：用近紅外光做「光學切片」，睇視網膜／視神經層層結構——唔係 X 光，亦無電離輻射。醫生用嚟檢查同追蹤黃斑、青光眼視神經等變化，有助睇到早期結構改變。";
const OCT_EN =
  "OCT (Optical Coherence Tomography): near-infrared light makes “optical cross-sections” of the retina and optic-nerve layers — not an X-ray, and with no ionizing radiation. Doctors use it to check and monitor macular and glaucomatous optic-nerve structural changes, including early ones.";
const OCT_JA =
  "OCT（光干渉断層計）：近赤外光で網膜／視神経の層構造の「光学切片」を撮ります。X線ではなく、電離放射線も使いません。黄斑や緑内障の視神経などの構造変化の確認・経過観察に用い、早期の構造変化の把握に役立ちます。";

export function VisitWalk() {
  const { locale, tx } = useI18n();
  const [i, setI] = useState(0);
  const steps = useMemo(() => {
    if (locale === "en") {
      return [
        { t: "History", d: "Medical history, medicines, allergies, family eye disease, diabetes." },
        { t: "Vision", d: "Distance and near; sometimes a pinhole." },
        { t: "Eye pressure", d: "Air-puff or contact after anaesthetic drops. One high reading is not glaucoma." },
        { t: "Slit lamp", d: "Eyelids, cornea, anterior chamber, lens." },
        { t: "Dilation wait", d: "Drops enlarge the pupil, about 20–40 minutes. Near work is blurry; light feels harsh." },
        { t: "Fundus / OCT", d: OCT_EN },
      ];
    }
    if (locale === "ja") {
      return [
        { t: "問診", d: "病歴、薬、アレルギー、家族の目の病気、糖尿病。" },
        { t: "視力", d: "遠く・近く。ピンホールを使うことも。" },
        { t: "眼圧", d: "非接触または点眼麻酔後の接触式。1回高いだけでは緑内障ではありません。" },
        { t: "細隙灯", d: "眼瞼、角膜、前房、水晶体。" },
        { t: "散瞳の待ち時間", d: "点眼で瞳孔が開き、約20～40分。近くがぼやけ、まぶしく感じます。" },
        { t: "眼底／OCT", d: OCT_JA },
      ];
    }
    return [
      ...VISIT_BASE.map((s) => ({ t: tx(s.t), d: tx(s.d) })),
      { t: tx("眼底／OCT"), d: tx(OCT_TC) },
    ];
  }, [locale, tx]);

  const step = steps[i];
  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        {locale === "en"
          ? "To ease “I don’t know what will happen”. Each clinic’s flow can differ slightly."
          : locale === "ja"
            ? "「何をするか分からない」不安を少し減らすための流れです。クリニックごとに多少異なります。"
            : tx("減輕「唔知會做咩」的焦慮。每間診所流程可以略有不同。")}
      </p>
      <p className="mt-4 text-[0.75rem] font-semibold text-steel">
        {i + 1} / {steps.length}
      </p>
      <h2 className="text-[1.25rem] font-semibold text-navy">{step.t}</h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed">{step.d}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={i === 0}
          onClick={() => setI((n) => n - 1)}
          className="h-12 flex-1 rounded-xl border border-line bg-card font-semibold text-navy disabled:opacity-40"
        >
          {locale === "en" ? "Back" : locale === "ja" ? "前へ" : tx("上一步")}
        </button>
        <button
          type="button"
          disabled={i === steps.length - 1}
          onClick={() => setI((n) => n + 1)}
          className="h-12 flex-1 rounded-xl bg-navy font-semibold text-paper disabled:opacity-40"
        >
          {locale === "en" ? "Next" : locale === "ja" ? "次へ" : tx("下一步")}
        </button>
      </div>
      <p className="mt-5 rounded-xl bg-danger-bg px-3 py-3 text-[0.88rem] leading-relaxed text-danger">
        {locale === "en"
          ? "Do not drive yourself for several hours after dilation — arrange a lift or public transport."
          : locale === "ja"
            ? "散瞳後数時間は自分で運転しないでください。送迎または公共交通を手配してください。"
            : tx("散瞳後數小時唔好自己開車，預先安排接送或公共交通。")}
      </p>
    </div>
  );
}

export function RxDecoder() {
  const [sph, setSph] = useState("-2.00");
  const [cyl, setCyl] = useState("-1.00");
  const [axis, setAxis] = useState("180");
  const [add, setAdd] = useState("+2.00");

  const sphN = Number(sph);
  const cylN = Number(cyl);
  const sphDeg = Number.isFinite(sphN) ? Math.round(Math.abs(sphN) * 100) : null;

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        解釋處方上的英文字。可以填你張紙的數字，只在此畫面顯示，唔會上傳。本頁不售賣眼鏡。
      </p>
      <dl className="mt-4 space-y-3 text-[0.9rem] leading-relaxed">
        <div className="rounded-xl border border-line bg-card px-3 py-3">
          <dt className="font-semibold text-navy">Sph（球鏡）</dt>
          <dd className="mt-1 text-muted">近視用負號，遠視用正號。香港口語 100 度 = 1.00 D。</dd>
          <input value={sph} onChange={(e) => setSph(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-line px-3" />
          {sphDeg != null ? (
            <p className="mt-1 text-[0.82rem] text-steel">
              {sphN < 0 ? "近視" : sphN > 0 ? "遠視" : "正視"}約 {sphDeg} 度
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border border-line bg-card px-3 py-3">
          <dt className="font-semibold text-navy">Cyl（柱鏡）＋ Axis（軸）</dt>
          <dd className="mt-1 text-muted">散光的度數與方向（0–180°）。軸不是「斜視」。未矯正散光會令某一方向拉長模糊。</dd>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input value={cyl} onChange={(e) => setCyl(e.target.value)} className="h-11 rounded-lg border border-line px-3" />
            <input value={axis} onChange={(e) => setAxis(e.target.value)} className="h-11 rounded-lg border border-line px-3" />
          </div>
        </div>
        <div className="rounded-xl border border-line bg-card px-3 py-3">
          <dt className="font-semibold text-navy">Add（近用加度）</dt>
          <dd className="mt-1 text-muted">老花加在遠用處方之上，常見 +1.00 至 +2.75。兒童處方通常無 Add。</dd>
          <input value={add} onChange={(e) => setAdd(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-line px-3" />
        </div>
      </dl>
      <p className="mt-4 text-[0.88rem] leading-relaxed">
        兒童常需<strong>散瞳驗光</strong>（睫狀肌麻痺），因為調節力強，不散瞳會低估遠視或漏咗隱性度數。成人驗光多數唔使散瞳，但眼底檢查往往要散瞳。
      </p>
    </div>
  );
}
