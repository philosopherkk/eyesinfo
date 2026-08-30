import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

const PARTS = [
  { id: "lid", to: "/c/$catId" as const, params: { catId: "lid" } },
  { id: "tear", to: "/t/$topicId" as const, params: { topicId: "d2" } },
  { id: "cornea", to: "/c/$catId" as const, params: { catId: "surface" } },
  { id: "lens", to: "/c/$catId" as const, params: { catId: "lens" } },
  { id: "angle", to: "/t/$topicId" as const, params: { topicId: "d4" } },
  { id: "nerve", to: "/c/$catId" as const, params: { catId: "glaucoma" } },
  { id: "macula", to: "/t/$topicId" as const, params: { topicId: "d5" } },
  { id: "retina", to: "/t/$topicId" as const, params: { topicId: "d8" } },
] as const;

const PART_COPY: Record<string, Record<string, { title: string; hint: string }>> = {
  "zh-Hant": {
    lid: { title: "眼瞼", hint: "開合、睫毛、油脂腺" },
    tear: { title: "淚膜", hint: "油水黏三層" },
    cornea: { title: "角膜", hint: "最前面透明窗" },
    lens: { title: "晶體", hint: "對焦、白內障" },
    angle: { title: "房角", hint: "房水出路、眼壓" },
    nerve: { title: "視神經", hint: "把影像傳去腦" },
    macula: { title: "黃斑", hint: "中央精細視力" },
    retina: { title: "周邊視網膜", hint: "飛蚊、裂孔、脫離" },
  },
  "zh-Hans": {
    lid: { title: "眼睑", hint: "开合、睫毛、油脂腺" },
    tear: { title: "泪膜", hint: "油水黏三层" },
    cornea: { title: "角膜", hint: "最前面透明窗" },
    lens: { title: "晶体", hint: "对焦、白内障" },
    angle: { title: "房角", hint: "房水出路、眼压" },
    nerve: { title: "视神经", hint: "把影像传到脑" },
    macula: { title: "黄斑", hint: "中央精细视力" },
    retina: { title: "周边视网膜", hint: "飞蚊、裂孔、脱离" },
  },
  en: {
    lid: { title: "Eyelid", hint: "Blinking, lashes, oil glands" },
    tear: { title: "Tear film", hint: "Oil, water, mucus" },
    cornea: { title: "Cornea", hint: "The clear front window" },
    lens: { title: "Lens", hint: "Focus and cataract" },
    angle: { title: "Angle", hint: "Aqueous outflow, pressure" },
    nerve: { title: "Optic nerve", hint: "Carries the image to the brain" },
    macula: { title: "Macula", hint: "Fine central vision" },
    retina: { title: "Peripheral retina", hint: "Floaters, tears, detachment" },
  },
  ja: {
    lid: { title: "眼瞼", hint: "開閉、睫毛、脂腺" },
    tear: { title: "涙液", hint: "油・水・ムチン" },
    cornea: { title: "角膜", hint: "一番前の透明な窓" },
    lens: { title: "水晶体", hint: "ピントと白内障" },
    angle: { title: "隅角", hint: "房水の出口、眼圧" },
    nerve: { title: "視神経", hint: "像を脳へ" },
    macula: { title: "黄斑", hint: "中心の細かい視力" },
    retina: { title: "周辺網膜", hint: "飛蚊、裂孔、剥離" },
  },
};

export function EyeMap() {
  const [sel, setSel] = useState<string>("cornea");
  const { locale, tx } = useI18n();
  const copy = PART_COPY[locale] ?? PART_COPY["zh-Hant"];
  const part = PARTS.find((p) => p.id === sel) ?? PARTS[2];

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        {tx("撳下面部位，或撳圖上的字。認識結構之後再開專題。")}
      </p>

      <div className="mt-4 rounded-xl border border-line bg-card p-3">
        <p className="mb-2 text-center text-[0.75rem] font-semibold text-steel">
          {tx("正面")}
        </p>
        <svg viewBox="0 0 280 160" className="w-full" role="img" aria-label={tx("眼睛正面示意")}>
          <ellipse cx="140" cy="80" rx="118" ry="70" fill="var(--color-paper)" stroke="var(--color-navy)" strokeWidth="2" />
          <path d="M30,80 Q140,18 250,80" fill="none" stroke="var(--color-navy)" strokeWidth="6" strokeLinecap="round" />
          <path d="M30,80 Q140,142 250,80" fill="none" stroke="var(--color-navy)" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="140" cy="80" rx="52" ry="52" fill="#dce8ef" stroke="var(--color-navy)" strokeWidth="1.5" />
          <circle cx="140" cy="80" r="22" fill="var(--color-navy)" />
          <circle cx="148" cy="72" r="6" fill="var(--color-paper)" />
          {sel === "lid" ? <path d="M30,80 Q140,18 250,80" fill="none" stroke="var(--color-danger)" strokeWidth="8" opacity="0.45" /> : null}
          {sel === "cornea" ? <ellipse cx="140" cy="80" rx="52" ry="52" fill="none" stroke="var(--color-danger)" strokeWidth="3" /> : null}
          {sel === "tear" ? <path d="M40,92 Q140,150 240,92" fill="none" stroke="var(--color-steel)" strokeWidth="4" /> : null}
          <text x="140" y="28" textAnchor="middle" fontSize="11" fill="var(--color-navy)" fontWeight="700">{copy.lid.title}</text>
          <text x="140" y="152" textAnchor="middle" fontSize="11" fill="var(--color-navy)" fontWeight="700">{copy.tear.title}</text>
        </svg>
      </div>

      <div className="mt-3 rounded-xl border border-line bg-card p-3">
        <p className="mb-2 text-center text-[0.75rem] font-semibold text-steel">
          {tx("側面")}
        </p>
        <svg viewBox="0 0 280 150" className="w-full" role="img" aria-label={tx("眼睛側面示意")}>
          <ellipse cx="120" cy="75" rx="70" ry="55" fill="var(--color-paper)" stroke="var(--color-navy)" strokeWidth="2" />
          <path d="M50,75 Q55,40 85,38 Q70,75 85,112 Q55,110 50,75" fill="#dce8ef" stroke="var(--color-navy)" />
          <ellipse cx="78" cy="75" rx="10" ry="18" fill="var(--color-navy)" opacity="0.35" />
          <circle cx="95" cy="75" r="16" fill="none" stroke="var(--color-navy)" strokeWidth="2" />
          <path d="M175,62 L230,52 L230,98 L175,88 Z" fill="#dce8ef" stroke="var(--color-navy)" />
          {sel === "lens" ? <circle cx="95" cy="75" r="16" fill="none" stroke="var(--color-danger)" strokeWidth="3" /> : null}
          {sel === "angle" ? <circle cx="58" cy="52" r="8" fill="none" stroke="var(--color-danger)" strokeWidth="2" /> : null}
          {sel === "macula" ? <circle cx="150" cy="80" r="7" fill="var(--color-danger)" opacity="0.55" /> : null}
          {sel === "nerve" ? <path d="M175,62 L230,52 L230,98 L175,88 Z" fill="var(--color-danger)" opacity="0.35" /> : null}
          {sel === "retina" ? <ellipse cx="120" cy="75" rx="62" ry="48" fill="none" stroke="var(--color-danger)" strokeWidth="3" /> : null}
          <text x="95" y="28" textAnchor="middle" fontSize="10" fill="var(--color-navy)" fontWeight="700">{copy.lens.title}</text>
          <text x="230" y="40" textAnchor="middle" fontSize="10" fill="var(--color-navy)" fontWeight="700">{copy.nerve.title}</text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {PARTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSel(p.id)}
            className={cn(
              "min-h-12 rounded-xl border px-3 py-2 text-left text-[0.82rem] font-semibold",
              sel === p.id ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
            )}
          >
            {copy[p.id].title}
            <span className={cn("mt-0.5 block text-[0.7rem] font-normal", sel === p.id ? "text-paper/80" : "text-muted")}>
              {copy[p.id].hint}
            </span>
          </button>
        ))}
      </div>
      <PartLink part={part} label={copy[part.id].title} />
    </div>
  );
}

function PartLink({
  part,
  label,
}: {
  part: (typeof PARTS)[number];
  label: string;
}) {
  const cls =
    "mt-4 inline-flex h-11 items-center rounded-full bg-navy px-4 text-[0.85rem] font-semibold text-paper no-underline";
  if (part.to === "/c/$catId") {
    return (
      <Link to="/c/$catId" params={{ catId: part.params.catId }} className={cls}>
        {label}
      </Link>
    );
  }
  return (
    <Link to="/t/$topicId" params={{ topicId: part.params.topicId }} className={cls}>
      {label}
    </Link>
  );
}
