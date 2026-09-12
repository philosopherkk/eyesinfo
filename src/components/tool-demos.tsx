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
  const [time, setTime] = useState<"day" | "night">("day");
  const { tx, locale } = useI18n();
  const src = time === "night" ? "/iol/night.jpg" : "/iol/far.jpg";
  const cataractFilter = "blur(2.2px) saturate(0.35) contrast(0.88)";
  const intro =
    locale === "en"
      ? "Side-by-side day and night illustration: normal view versus a cataract-like haze. Educational only — not a cataract grade and not a push for surgery."
      : locale === "ja"
        ? "昼と夜の並置示意：正常と白内障様のかすみ。教育用であり、白内障の分級でも手術の勧誘でもありません。"
        : tx("日間與夜間並排示意：正常對比白內障樣霧感。只是教育示意／非診斷，不能為白內障分級，亦不是叫你接受手術。");
  const timeLabels =
    locale === "en"
      ? { day: "Day", night: "Night" }
      : locale === "ja"
        ? { day: "昼", night: "夜" }
        : { day: tx("日間"), night: tx("夜間") };
  const pairLabels =
    locale === "en"
      ? { normal: "Normal", cataract: "Cataract (illustration)" }
      : locale === "ja"
        ? { normal: "正常", cataract: "白内障（示意）" }
        : { normal: tx("正常"), cataract: tx("白內障（示意）") };

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">{intro}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(["day", "night"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTime(key)}
            className={cn(
              "min-h-11 rounded-xl border px-2 text-[0.8rem] font-semibold",
              time === key ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
            )}
          >
            {timeLabels[key]}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <figure className="overflow-hidden rounded-xl">
          <img src={src} alt="" className="aspect-video w-full object-cover" draggable={false} />
          <figcaption className="mt-2 text-center text-[0.78rem] font-semibold text-navy">
            {pairLabels.normal}
          </figcaption>
        </figure>
        <figure className="overflow-hidden rounded-xl">
          <img
            src={src}
            alt=""
            className="aspect-video w-full object-cover"
            style={{ filter: cataractFilter }}
            draggable={false}
          />
          <figcaption className="mt-2 text-center text-[0.78rem] font-semibold text-navy">
            {pairLabels.cataract}
          </figcaption>
        </figure>
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
      <p className="mt-3 text-[0.8rem] leading-relaxed text-muted">
        {locale === "en"
          ? "The demo beside you is not a diagnosis; a normal result does not rule out eye disease and does not replace dilated fundus exam or OCT."
          : locale === "ja"
            ? "横の図示は診断ではありません。正常でも病気を否定できず、散瞳眼底やOCTの代わりにもなりません。"
            : tx("旁側示意不是診斷；結果正常不能排除眼疾，亦不能代替散瞳眼底或 OCT。")}
      </p>
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
              ? "A few long-standing floaters should still have been checked with dilation. A sudden increase or new flashes without a curtain: urgent ophthalmic assessment (same day if possible) — dilation alone is not enough."
              : locale === "ja"
                ? "長年変わらない少量の飛蚊でも、散瞳で確認されたことが望ましいです。カーテンがなくても急増や新しい光視は緊急の眼科評価（できれば当日）。散瞳だけでは足りません。"
                : tx("少量多年不變的飛蚊仍應曾由眼科專科醫生散瞳確認。突然增多或新閃光、但沒有簾幕：須緊急眼科評估（當日儘快）；不是「只散瞳」便足夠。")}
          </p>
          <Link
            to="/urgent"
            className="mt-3 flex min-h-12 items-center justify-center rounded-xl border border-navy bg-card px-4 text-center text-[0.88rem] font-semibold text-navy no-underline"
          >
            {locale === "en"
              ? "New floaters / flashes without a curtain → same-day ophthalmic assessment"
              : locale === "ja"
                ? "カーテンのない新しい飛蚊／光視 → 当日の眼科評価"
                : "無簾幕的新飛蚊／閃光 → 當日眼科評估"}
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
  const [showHalo, setShowHalo] = useState(true);
  const [showStarburst, setShowStarburst] = useState(true);
  const intro =
    locale === "en"
      ? "Halo = soft ring(s) around lamps. Starburst = spikes from the same lights. Intensity rises monofocal → EDOF → trifocal/MF as a teaching ladder only — pupil and design matter. Not a post-op promise."
      : locale === "ja"
        ? "ハロー＝光源まわりのやわらかい環。スターバースト＝同じ光源からの放射状の筋。単焦点→EDOF→3焦点／多焦点で強さだけ示します。瞳孔と光学設計で変わり、術後保証ではありません。"
        : tx("光暈＝燈外一圈／多圈柔邊；星芒＝同一光源向外的放射線。單焦→延伸景深→三焦／多焦只調強度示意，實際因瞳孔與光學設計而異，唔係術後保證。");
  const haloLabel = locale === "en" ? "Halo" : locale === "ja" ? "ハロー" : tx("光暈");
  const starLabel = locale === "en" ? "Starburst" : locale === "ja" ? "スターバースト" : tx("星芒");

  return (
    <div>
      <p className="text-[0.88rem] leading-relaxed text-muted">{intro}</p>
      <div className="relative mt-4 overflow-hidden rounded-xl">
        <img src="/iol/night.jpg" alt="" className="aspect-video w-full object-cover" />
        <HaloOverlay kind={k} showHalo={showHalo} showStarburst={showStarburst} />
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
          {showHalo ? (
            <span className="rounded bg-navy/75 px-2 py-0.5 text-[0.68rem] font-semibold text-paper">
              {haloLabel}
            </span>
          ) : null}
          {showStarburst ? (
            <span className="rounded bg-navy/75 px-2 py-0.5 text-[0.68rem] font-semibold text-paper">
              {starLabel}
            </span>
          ) : null}
        </div>
      </div>
      <p className="mt-3 text-[0.75rem] font-semibold text-steel">
        {locale === "en" ? "Show on this night scene" : locale === "ja" ? "この夜景で表示" : tx("呢個夜景顯示")}
      </p>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setShowHalo((v) => !v)}
          className={cn(
            "min-h-11 rounded-xl border px-2 text-[0.78rem] font-semibold",
            showHalo ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
          )}
        >
          {haloLabel}
        </button>
        <button
          type="button"
          onClick={() => setShowStarburst((v) => !v)}
          className={cn(
            "min-h-11 rounded-xl border px-2 text-[0.78rem] font-semibold",
            showStarburst ? "border-navy bg-navy text-paper" : "border-line bg-card text-navy",
          )}
        >
          {starLabel}
        </button>
      </div>
      <p className="mt-3 text-[0.75rem] font-semibold text-steel">
        {locale === "en" ? "Intensity ladder (illustration)" : locale === "ja" ? "強さの段階（図示）" : tx("強度示意（唔係術後保證）")}
      </p>
      <div className="mt-1.5 grid grid-cols-3 gap-2">
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

