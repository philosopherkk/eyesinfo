import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefs } from "@/lib/prefs";
import { useI18n } from "@/i18n";

const DROP_STEPS = [
  { t: "洗手", c: "洗好手", d: "用皂液洗淨，抹乾。唔好用未洗過的毛巾抹眼。" },
  { t: "拉低眼袋", c: "拉開下眼皮", d: "頭微仰，用食指拉低下瞼，形成小口袋。" },
  { t: "一滴入袋", c: "瓶口唔好掂眼", d: "瓶口唔好掂到睫毛或眼。每次點幾多，跟該支藥說明書同醫生示範。" },
  { t: "按淚點", c: "若醫生有示範", d: "有啲藥水醫生會教你輕閉眼、用指腹按內眼角。做唔做、按幾耐，跟該支藥說明書同示範，本頁唔係你的用法。" },
  { t: "隔開第二種", c: "跟說明書", d: "若有第二種藥水，隔幾耐、邊支先，跟說明書同醫生示範。本頁唔規定分鐘。" },
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
        青光眼同乾眼最常「滴得唔好」。呢度無品牌、無藥名。步驟只係示意，實際跟該支藥說明書同醫生示範。此工具結果正常不能排除眼疾。
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
          <p className="text-[0.8rem] text-muted">若醫生有教按淚點，可用呢個示意計時（可選）</p>
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
        滴藥水專題
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
        計時只係示意，唔係治療方案。溫度同分鐘須按醫生指示；暖唔好燙，痛就停。兒童、長者或感覺較差者更要小心。唔好用未熟雞蛋或過熱毛巾。
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
      <p className="mt-2 text-center text-[0.75rem] text-muted">分鐘按鈕只係示意，唔係處方。</p>
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
          示意時間到。跟唔跟住按摩、點按，跟醫生指示。
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
  const { locale, tx } = useI18n();
  const min = usePrefs((s) => s.outdoorMin);
  const add = usePrefs((s) => s.addOutdoor);
  const reset = usePrefs((s) => s.resetOutdoorIfNewDay);
  useEffect(() => {
    reset();
  }, [reset]);

  const copy =
    locale === "en"
      ? {
          lead:
            "Not a medical device, and not a myopia-progress report. Mainly public-health evidence for primary-school-age children: about two hours or more of outdoor natural light a day is linked with lower myopia incidence / delayed onset (population-level evidence, not a personal guarantee). Indoor lighting does not replace daylight.",
          alreadyMyopic:
            "If a child already has myopia, outdoor daylight may help slow progression, but it cannot replace options an ophthalmologist may discuss after examination — and this tool is not a personal progress report.",
          evidence:
            "Based on school-based outdoor-activity randomised trials and recent meta-analyses (population level).",
          dayLabel: "Daylight (outdoors)",
          dayBody: "Shade, playgrounds and walking to school count. Sunglasses still admit daylight.",
          indoorLabel: "Indoor light",
          indoorBody: "Classrooms, tutorial centres and phone screens do not count toward these two hours.",
          recorded: "Outdoor daylight logged today (a public-health round number, not your child’s prescription)",
          unit: "min",
          add: (n: number) => `+${n} min`,
          topic: "Childhood myopia: options a doctor may discuss",
        }
      : locale === "ja"
        ? {
            lead:
              "医療機器ではなく、近視進行の報告でもありません。主に小学校年代の児童向けの公衆衛生エビデンス：屋外の自然光を一日およそ2時間以上とることが、近視発症率の低下／出現の遅延と関連します（人口レベルの証拠であり、個人への保証ではありません）。室内照明は日光の代わりになりません。",
            alreadyMyopic:
              "すでに近視がある場合、屋外の日光は進行を緩やかにする助けになり得ますが、眼科専門医が診察後に話し合う方向の代わりにはなりません。個人の減度進捗報告でもありません。",
            evidence:
              "学校を基盤とした屋外活動のランダム化試験および近年のメタ解析（人口レベル）に基づきます。",
            dayLabel: "日光（屋外）",
            dayBody: "木陰、校庭、徒歩通学も含まれます。サングラスでも日光は入ります。",
            indoorLabel: "室内灯",
            indoorBody: "教室、塾、スマホ画面は、この2時間には数えません。",
            recorded: "本日記録した屋外日光時間（公衆衛生の目安であり、お子さんの処方ではありません）",
            unit: "分",
            add: (n: number) => `+${n} 分`,
            topic: "小児近視：医師が話し合う方向",
          }
        : {
            lead: tx(
              "唔係醫療器材，亦唔係近視進度報告。主要針對小學階段學童的公共衞生證據：每日戶外自然光約兩小時或以上，與較低近視發病率／延遲出現有關（人口層面證據，不是個人保證）。室內燈光代替唔到日光。",
            ),
            alreadyMyopic: tx(
              "若孩子已有近視，戶外日光或有助減慢進度，但不能代替眼科專科醫生面診後或會討論的方向，亦不是個人減度進度報告。",
            ),
            evidence: tx("依據學校為本戶外活動隨機試驗及近期統合分析（人口層面）。"),
            dayLabel: tx("日光（戶外）"),
            dayBody: tx("樹蔭、操場、行路返學都算。太陽眼鏡仍有日光。"),
            indoorLabel: tx("室內燈"),
            indoorBody: tx("課室、補習社、手機屏幕，都唔計入這兩小時。"),
            recorded: tx("今日已記錄的戶外日光時間（公共衞生約數，不是你孩子的處方）"),
            unit: tx("分"),
            add: (n: number) => `+${n} ${tx("分")}`,
            topic: tx("兒童近視：醫生或會討論的方向"),
          };

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">{copy.lead}</p>
      <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{copy.alreadyMyopic}</p>
      <p className="mt-2 text-[0.78rem] leading-relaxed text-faint">{copy.evidence}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-navy p-4 text-paper">
          <p className="text-[0.75rem] text-paper/70">{copy.dayLabel}</p>
          <p className="mt-2 text-[0.9rem] leading-relaxed">{copy.dayBody}</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="text-[0.75rem] text-muted">{copy.indoorLabel}</p>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-ink">{copy.indoorBody}</p>
        </div>
      </div>
      <p className="mt-5 text-center text-[0.8rem] text-muted">{copy.recorded}</p>
      <p className="text-center text-[2.4rem] font-semibold tabular-nums text-navy">
        {min} {copy.unit}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[15, 30, 60].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => add(n)}
            className="h-12 rounded-xl border border-line bg-card text-[0.8rem] font-semibold text-navy"
          >
            {copy.add(n)}
          </button>
        ))}
      </div>
      <Link
        to="/t/$topicId"
        params={{ topicId: "t-myopia" }}
        className="mt-4 inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
      >
        {copy.topic}
      </Link>
    </div>
  );
}
