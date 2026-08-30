import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const SITS = [
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
    id: "inj",
    title: "玻璃體內注射",
    qs: [
      "今次注射係邊一類已註冊藥物？（不用在網上對商品名）",
      "之後幾耐覆 OCT？",
      "如果打針後眼痛加劇要去邊？",
      "治療目標是維持定改善視力？",
      "有無眼內炎的警號要記？",
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

export function AskDoctor() {
  const [on, setOn] = useState<string[]>(["cat"]);
  const list = useMemo(
    () => SITS.filter((s) => on.includes(s.id)),
    [on],
  );

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        勾選情況，列印或抄低帶去你自己的醫生。這不是掛號表，本站亦不作轉介。
      </p>
      <div className="mt-3 grid gap-2">
        {SITS.map((s) => (
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
          <p className="text-muted">請至少選一項。</p>
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
        列印清單
      </button>
    </div>
  );
}

const VISIT = [
  { t: "問症", d: "病歷、藥物、過敏、家族眼疾、糖尿病。" },
  { t: "視力", d: "看遠、看近；有時加針孔。" },
  { t: "眼壓", d: "氣動或滴麻醉後接觸式。一次高不一定是青光眼。" },
  { t: "裂隙燈", d: "看眼瞼、角膜、前房、晶體。" },
  { t: "散瞳等待", d: "藥水放大瞳孔，約 20–40 分鐘。近距離暫時矇、怕光。" },
  { t: "眼底／OCT", d: "看視神經、黃斑、周邊視網膜。OCT 係光學切片，唔係 X 光。" },
];

export function VisitWalk() {
  const [i, setI] = useState(0);
  const step = VISIT[i];
  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        減輕「唔知會做咩」的焦慮。每間診所流程可以略有不同。
      </p>
      <p className="mt-4 text-[0.75rem] font-semibold text-steel">
        {i + 1} / {VISIT.length}
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
          上一步
        </button>
        <button
          type="button"
          disabled={i === VISIT.length - 1}
          onClick={() => setI((n) => n + 1)}
          className="h-12 flex-1 rounded-xl bg-navy font-semibold text-paper disabled:opacity-40"
        >
          下一步
        </button>
      </div>
      <p className="mt-5 rounded-xl bg-danger-bg px-3 py-3 text-[0.88rem] leading-relaxed text-danger">
        散瞳後數小時唔好自己開車，預先安排接送或公共交通。
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
