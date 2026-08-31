import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { HaloOverlay } from "@/components/halo-overlay";

export function TunnelDemo() {
  const [stage, setStage] = useState(0);
  const { tx, locale } = useI18n();
  const labels =
    locale === "en"
      ? ["Early (often no warning)", "Arcuate loss", "Late central island"]
      : locale === "ja"
        ? ["早期（気づきにくい）", "弓状欠損", "後期の中心島"]
        : [tx("早期（常無感覺）"), tx("中期弓形缺損"), tx("晚期中央島")];
  const intro =
    locale === "en"
      ? "Glaucomatous damage removes field: the missing part is not blur, it is simply not there. Remaining central vision can still be sharp early on. Lost field does not return. This is not your field report and is not a score."
      : locale === "ja"
        ? "緑内障の視神経損傷は視野欠損です。欠けた部分は「ぼけ」ではなく、そこに像がありません。早期は残った中心視力が良いこともあります。失った視野は戻りません。これはあなたの視野検査ではなく、点数でもありません。"
        : tx("青光眼視神經損傷造成的是視野缺損：缺了的部分不是「矇」，而是那裡沒有影像；中央剩餘視力早期可以仍然清楚。已損失的視野不能還原。這不是你的視野報告，也不能打分。");
  const caption =
    locale === "en"
      ? [
          "Early loss is often superior and inferior arcuate dimming that people do not notice.",
          "Later, nasal and arcuate defects enlarge. Pedestrians at the side can “disappear”. The centre can still be relatively clear.",
          "Late disease may leave a central island. A pipe-like tunnel is a late, simplified picture — not how every glaucoma patient starts.",
        ][stage]
      : locale === "ja"
        ? [
            "早期は上下の弓状の相対的な暗みで、自分では気づきにくいことが多いです。",
            "中期は鼻側と上下の弓状欠損が広がり、端の歩行者が「消える」ことがあります。中心は比較的はっきり残ることがあります。",
            "後期は中心の島が残ります。管状視野は後期の単純化した説明で、最初から水道管のぞきのような人ばかりではありません。",
          ][stage]
        : [
            tx("早期常是上下弓形相對暗區，病人自己很難發現。"),
            tx("中期鼻側及上下弓形缺損擴大，路邊行人可以「消失」。剩餘中央仍可相對清楚。"),
            tx("晚期剩下中央島。管狀視野是晚期簡化描述，不是每一個青光眼病人一開始就像從水管看出去。"),
          ][stage];

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">{intro}</p>
      <div className="relative mt-4 overflow-hidden rounded-xl bg-navy">
        <img src="/iol/street.jpg" alt="" className="aspect-video w-full object-cover" />
        {stage === 0 ? (
          <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden>
            <path d="M12,18 Q50,8 88,18 Q70,22 50,20 Q30,22 12,18" fill="rgba(12,16,22,0.42)" />
            <path d="M14,40 Q50,50 86,40 Q68,36 50,38 Q32,36 14,40" fill="rgba(12,16,22,0.38)" />
          </svg>
        ) : null}
        {stage === 1 ? (
          <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden>
            <path d="M0,0 H38 V56 H0 Z" fill="rgba(10,14,20,0.72)" />
            <path d="M8,6 Q50,0 92,8 Q78,18 50,16 Q22,18 8,6" fill="rgba(10,14,20,0.82)" />
            <path d="M10,50 Q50,58 90,48 Q74,40 50,42 Q26,40 10,50" fill="rgba(10,14,20,0.82)" />
          </svg>
        ) : null}
        {stage === 2 ? (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 46%, transparent 16%, rgba(8,12,18,0.15) 18%, rgba(8,12,18,0.96) 28%)",
            }}
          />
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {labels.map((l, i) => (
          <button
            key={l}
            type="button"
            onClick={() => setStage(i)}
            className={cn(
              "min-h-11 rounded-xl border px-2 text-[0.72rem] font-semibold",
              stage === i ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[0.82rem] leading-relaxed text-muted">{caption}</p>
      <Link
        to="/t/$topicId"
        params={{ topicId: "d4" }}
        className="mt-4 inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
      >
        {tx("青光眼專題")}
      </Link>
    </div>
  );
}

export function HazeDemo() {
  const [stage, setStage] = useState(0);
  const { tx, locale } = useI18n();
  const labels =
    locale === "en"
      ? ["Early", "Affecting driving"]
      : locale === "ja"
        ? ["早期", "運転に影響"]
        : [tx("早期"), tx("影響駕駛")];
  const blur = [0.4, 2.2][stage];
  const sat = [0.75, 0.35][stage];
  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        {tx("同一張相示範顏色變淡、霧感與車燈眩光。不能為你的白內障分級，亦不是叫你接受手術。")}
      </p>
      <div className="relative mt-4 overflow-hidden rounded-xl">
        <img
          src={stage === 1 ? "/iol/night.jpg" : "/iol/far.jpg"}
          alt=""
          className="aspect-video w-full object-cover"
          style={{ filter: `blur(${blur}px) saturate(${sat}) contrast(${1 - stage * 0.12})` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {labels.map((l, i) => (
          <button
            key={l}
            type="button"
            onClick={() => setStage(i)}
            className={cn(
              "min-h-11 rounded-xl border px-2 text-[0.8rem] font-semibold",
              stage === i ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
            )}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FloaterDemo() {
  const [mode, setMode] = useState<"drift" | "curtain">("drift");
  const { tx, locale } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const t0 = useRef<number | null>(null);

  useEffect(() => {
    if (mode !== "drift") return;
    let id = 0;
    const loop = (now: number) => {
      if (t0.current == null) t0.current = now;
      const t = (now - t0.current) / 1000;
      cur.current.x += (target.current.x - cur.current.x) * 0.07;
      cur.current.y += (target.current.y - cur.current.y) * 0.07;
      const idleX = Math.sin(t * 0.65) * 22 + Math.sin(t * 0.19) * 10;
      const idleY = Math.cos(t * 0.48) * 16 + Math.sin(t * 0.27) * 9;
      setPos({ x: cur.current.x + idleX, y: cur.current.y + idleY });
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [mode]);

  const onPointer = (e: { clientX: number; clientY: number }) => {
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    target.current = {
      x: ((e.clientX - box.left) / box.width - 0.5) * 90,
      y: ((e.clientY - box.top) / box.height - 0.5) * 56,
    };
  };

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        {tx("普通飛蚊會隨眼球飄（可在圖上拖動，飛蚊會慢一步跟上）。簾幕／固定黑影不會跟住飄。")}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("drift")}
          className={cn(
            "h-11 rounded-xl border text-[0.82rem] font-semibold",
            mode === "drift" ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
          )}
        >
          {tx("會飄的飛蚊")}
        </button>
        <button
          type="button"
          onClick={() => setMode("curtain")}
          className={cn(
            "h-11 rounded-xl border text-[0.82rem] font-semibold",
            mode === "curtain" ? "border-danger bg-danger text-paper" : "border-line bg-card text-navy",
          )}
        >
          {tx("固定簾幕")}
        </button>
      </div>
      <div
        ref={wrapRef}
        className="relative mt-4 touch-none overflow-hidden rounded-xl"
        onPointerMove={(e) => onPointer(e)}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          onPointer(e);
        }}
      >
        <img src="/iol/far.jpg" alt="" className="aspect-video w-full object-cover" draggable={false} />
        {mode === "drift" ? (
          <svg
            className="floater-layer pointer-events-none absolute inset-0 size-full"
            viewBox="0 0 320 180"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
          >
            <g className="floater-idle" opacity="0.88" fill="#0b1320">
              <ellipse cx="118" cy="62" rx="10" ry="6" />
              <path d="M188 88 c 22 8 26 26 10 32 c -20 5 -32 -12 -26 -26 c 3 -10 10 -12 16 -6" />
              <ellipse cx="96" cy="118" rx="5" ry="3.2" />
              <path d="M210 48 q 20 12 10 34 q -12 10 -22 -4 q -6 -14 12 -30" fill="none" stroke="#0b1320" strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="152" cy="132" r="4" />
              <ellipse cx="248" cy="96" rx="8" ry="4.4" />
            </g>
          </svg>
        ) : (
          <div className="absolute inset-y-0 left-0 w-2/5 bg-navy/80" />
        )}
      </div>
      {mode === "curtain" ? (
        <Link
          to="/urgent"
          className="mt-4 flex min-h-14 items-center justify-center rounded-xl bg-danger px-4 text-center text-[0.95rem] font-semibold text-paper no-underline"
        >
          {locale === "en"
            ? "New flashes + many new floaters + a curtain → A&E"
            : locale === "ja"
              ? "新しい光視 + 大量の新しい飛蚊 + カーテン → 救急へ"
              : "新閃光 + 大量新飛蚊 + 簾幕 → 去急症室"}
        </Link>
      ) : (
        <>
          <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">
            {locale === "en"
              ? "A few long-standing floaters should still have been checked with dilation. A sudden increase or new flashes without a curtain: same-day dilated exam — see an ophthalmologist as soon as possible."
              : locale === "ja"
                ? "長年変わらない少量の飛蚊でも、散瞳で確認されたことが望ましいです。カーテンがなくても急増や新しい光視は同日散瞳。できるだけ早く眼科専門医を受診してください。"
                : tx("少量多年不變的飛蚊仍應曾由眼科專科醫生散瞳確認。突然增多或新閃光、但沒有簾幕：須同日散瞳眼科評估，儘快睇眼科醫生。")}
          </p>
          <Link
            to="/urgent"
            className="mt-3 flex min-h-12 items-center justify-center rounded-xl border border-navy bg-card px-4 text-center text-[0.88rem] font-semibold text-navy no-underline"
          >
            {locale === "en"
              ? "New floaters / flashes without a curtain → same-day dilation"
              : locale === "ja"
                ? "カーテンのない新しい飛蚊／光視 → 同日散瞳"
                : "無簾幕的新飛蚊／閃光 → 同日散瞳"}
          </Link>
        </>
      )}
      <Link
        to="/t/$topicId"
        params={{ topicId: "d8" }}
        className="mt-3 inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
      >
        {tx("飛蚊與脫離專題")}
      </Link>
    </div>
  );
}

export function HaloDemo() {
  const { tx, locale } = useI18n();
  const kinds = [
    { id: "mono" as const, title: locale === "en" ? "Monofocal" : locale === "ja" ? "単焦点" : tx("單焦點") },
    { id: "edof" as const, title: locale === "en" ? "EDOF" : locale === "ja" ? "焦点深度延長" : tx("延伸景深") },
    { id: "mf" as const, title: locale === "en" ? "Trifocal / MF" : locale === "ja" ? "3焦点／多焦点" : tx("三焦點／多焦") },
  ];
  const [k, setK] = useState<(typeof kinds)[number]["id"]>("mono");
  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">
        {tx("光暈畫在照片裡真正的車燈與街燈上。因晶體種類及瞳孔而異，不是術後保證。")}
      </p>
      <div className="relative mt-4 overflow-hidden rounded-xl">
        <img src="/iol/night.jpg" alt="" className="aspect-video w-full object-cover" />
        <HaloOverlay kind={k} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {kinds.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setK(item.id)}
            className={cn(
              "min-h-11 rounded-xl border px-2 text-[0.75rem] font-semibold",
              k === item.id ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
            )}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}

