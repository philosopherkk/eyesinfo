import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefs } from "@/lib/prefs";

const DROP_STEPS = [
  { t: "洗手", c: "洗好手", d: "用皂液洗淨，抹乾。唔好用未洗過的毛巾抹眼。" },
  { t: "拉低眼袋", c: "拉開下眼皮", d: "頭微仰，用食指拉低下瞼，形成小口袋。" },
  { t: "一滴入袋", c: "一滴就夠", d: "瓶口離眼約 1–2 厘米，唔好掂到睫毛或眼。一滴已超過結膜囊容量。" },
  { t: "按淚點", c: "按內眼角一分鐘", d: "輕閉眼，用指腹按內眼角淚點約 1 分鐘，減少藥水入鼻喉、減少全身吸收。" },
  { t: "隔五分鐘", c: "先等五分鐘", d: "若有第二種藥水，最少隔五分鐘。先稀後稠，眼膏放最後。" },
];

export function DropTrainer() {
  const [i, setI] = useState(0);
  const [sec, setSec] = useState(0);
  const [run, setRun] = useState(false);
  const step = DROP_STEPS[i];

  useEffect(() => {
    if (!run) return;
    const id = window.setInterval(() => {
      setSec((s) => {
        if (s >= 59) {
          setRun(false);
          return 60;
        }
        return s + 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [run]);

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        青光眼同乾眼最常「點錯」。呢度無品牌、無藥名。此步驟正常不能排除眼疾。
      </p>
      <p className="mt-4 text-[0.75rem] font-semibold text-steel">
        步驟 {i + 1} / {DROP_STEPS.length}
      </p>
      <h2 className="mt-1 text-[1.25rem] font-semibold text-navy">{step.t}</h2>
      <p className="mt-1 text-[0.95rem] font-semibold text-steel">{step.c}</p>
      <p className="mt-2 text-[0.9rem] leading-relaxed">{step.d}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={i === 0}
          onClick={() => setI((n) => Math.max(0, n - 1))}
          className="h-12 flex-1 rounded-xl border border-line bg-card font-semibold text-navy disabled:opacity-40"
        >
          上一步
        </button>
        <button
          type="button"
          disabled={i === DROP_STEPS.length - 1}
          onClick={() => setI((n) => Math.min(DROP_STEPS.length - 1, n + 1))}
          className="h-12 flex-1 rounded-xl bg-navy font-semibold text-paper disabled:opacity-40"
        >
          下一步
        </button>
      </div>
      {i === 3 ? (
        <div className="mt-4 rounded-xl border border-line bg-card p-4 text-center">
          <p className="text-[0.8rem] text-muted">按淚點計時（可選，約 60 秒）</p>
          <p className="mt-1 text-[2rem] font-semibold tabular-nums text-navy">{sec}</p>
          <button
            type="button"
            onClick={() => {
              setSec(0);
              setRun(true);
            }}
            className="mt-2 inline-flex h-11 items-center rounded-full bg-navy px-4 text-[0.85rem] font-semibold text-paper"
          >
            {run ? "計緊…" : "開始 60 秒"}
          </button>
        </div>
      ) : null}
      <Link
        to="/t/$topicId"
        params={{ topicId: "t-drops" }}
        className="mt-4 inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
      >
        點藥專題
      </Link>
    </div>
  );
}

export function WarmTimer() {
  const [left, setLeft] = useState(9 * 60);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!run) return;
    const id = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRun(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [run]);

  const m = Math.floor(left / 60);
  const s = left % 60;

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        瞼板腺熱敷一般 8–10 分鐘，暖唔好燙：接觸眼瞼不宜超過約 45°C，先試手腕，痛就停。計時只在呢部手機進行。兒童、長者或感覺較差者更要小心。唔好用未熟雞蛋或過熱毛巾。
      </p>
      <p className="mt-6 text-center text-[3rem] font-semibold tabular-nums leading-none text-navy">
        {m}:{s.toString().padStart(2, "0")}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[8, 9, 10].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => {
              setRun(false);
              setLeft(n * 60);
            }}
            className={cn(
              "h-11 rounded-xl border text-[0.8rem] font-semibold",
              left === n * 60 && !run ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
            )}
          >
            {n} 分鐘
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          if (left === 0) {
            setLeft(9 * 60);
            setRun(true);
          } else setRun((v) => !v);
        }}
        className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-xl bg-navy font-semibold text-paper"
      >
        {run ? "暫停" : left === 0 ? "重設" : "開始熱敷"}
      </button>
      {left === 0 ? (
        <p className="mt-3 text-center text-[0.9rem] font-semibold text-navy">
          時間到。跟住輕輕按摩眼瞼（唔好壓眼球），再清潔睫毛根。
        </p>
      ) : null}
      <Link
        to="/c/$catId"
        params={{ catId: "lid" }}
        className="mt-4 inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
      >
        眼瞼與淚膜
      </Link>
    </div>
  );
}

export function OutdoorCard() {
  const min = usePrefs((s) => s.outdoorMin);
  const add = usePrefs((s) => s.addOutdoor);
  const reset = usePrefs((s) => s.resetOutdoorIfNewDay);
  useEffect(() => {
    reset();
  }, [reset]);
  const enough = min >= 120;

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        唔係醫療器材，亦唔係近視進度報告。公共衞生上，學童每日戶外自然光約兩小時或以上，與減慢近視出現有關。室內燈光代替唔到日光。
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-navy p-4 text-paper">
          <p className="text-[0.75rem] text-paper/70">日光（戶外）</p>
          <p className="mt-2 text-[0.9rem] leading-relaxed">樹蔭、操場、行路返學都算。太陽眼鏡仍有日光。</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="text-[0.75rem] text-muted">室內燈</p>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-ink">課室、補習社、手機屏幕，都唔計入這兩小時。</p>
        </div>
      </div>
      <p className="mt-5 text-center text-[0.8rem] text-muted">今日已記錄（只存在此裝置）</p>
      <p className="text-center text-[2.4rem] font-semibold tabular-nums text-navy">{min} 分</p>
      <p className="text-center text-[0.9rem] font-semibold text-steel">
        {enough ? "今日戶外時間已達兩小時參考" : "今日戶外夠唔夠兩小時？"}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[15, 30, 60].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => add(n)}
            className="h-12 rounded-xl border border-line bg-card text-[0.8rem] font-semibold text-navy"
          >
            +{n} 分
          </button>
        ))}
      </div>
      <Link
        to="/t/$topicId"
        params={{ topicId: "t-myopia" }}
        className="mt-4 inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
      >
        兒童近視專題
      </Link>
    </div>
  );
}
