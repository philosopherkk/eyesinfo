import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Contrast,
  EyeOff,
  Maximize2,
  Printer,
  Smartphone,
  Monitor,
} from "lucide-react";
import { AmslerGrid, type AmslerFinding } from "@/components/amsler-grid";
import { SimDisclaimer } from "@/components/sim-disclaimer";
import { EduToolCaveat } from "@/components/edu-tool-caveat";
import { EditorialFooter } from "@/components/editorial-footer";
import { usePrefs, type AmslerResult } from "@/lib/prefs";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/amsler")({ component: AmslerPage });

const CARD_W_MM = 85.6;
const GRID_MM = 100;
const DEG_PER_CELL = 1;
const TAN1 = Math.tan((DEG_PER_CELL * Math.PI) / 180);

function distanceCm(gridMm: number) {
  const squareMm = gridMm / 20;
  return Math.round(squareMm / TAN1 / 10);
}

function AmslerPage() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const [boxW, setBoxW] = useState(320);
  const [vp, setVp] = useState({ w: 360, h: 640 });
  const [inverted, setInverted] = useState(true);
  const [eye, setEye] = useState<"left" | "right">("right");
  const [testing, setTesting] = useState(false);
  const [cardPx, setCardPx] = useState(220);
  const pxPerMm = usePrefs((s) => s.amslerPxPerMm);
  const setPxPerMm = usePrefs((s) => s.setAmslerPxPerMm);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || testing) return;
    const apply = () => setBoxW(el.clientWidth);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [testing]);

  useEffect(() => {
    const apply = () => {
      const vv = window.visualViewport;
      setVp({
        w: Math.round(vv?.width ?? window.innerWidth),
        h: Math.round(vv?.height ?? window.innerHeight),
      });
    };
    apply();
    window.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("scroll", apply);
    return () => {
      window.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("scroll", apply);
    };
  }, []);

  useEffect(() => {
    if (!testing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [testing]);

  const calibrated = pxPerMm != null && pxPerMm > 0;
  const browseCap = Math.min(boxW, 360);
  const idealPx = calibrated ? GRID_MM * pxPerMm : browseCap;
  // Focus mode: size from the real viewport and cover shell chrome so the
  // grid stays on-screen and large enough to use (old layout kept grid under
  // sticky header / fixed tab bar, often scrolled away or tiny).
  const testFit = Math.max(200, Math.min(vp.w - 32, vp.h - 210));
  const browseGridPx = Math.max(180, Math.min(boxW, idealPx));
  const testGridPx = Math.max(220, Math.min(testFit, calibrated ? idealPx : testFit));
  const gridPx = testing ? testGridPx : browseGridPx;
  const sizeRef = testing ? testFit : Math.max(idealPx, 1);
  const shownMm = calibrated ? gridPx / pxPerMm : GRID_MM * (gridPx / sizeRef);
  const holdCm = distanceCm(shownMm);

  function saveCalibration() {
    setPxPerMm(cardPx / CARD_W_MM);
  }

  if (testing) {
    const onDark = inverted;
    const fg = onDark ? "text-paper" : "text-navy";
    const muted = onDark ? "text-paper/80" : "text-navy/75";
    const ghostBtn = onDark
      ? "border border-paper/35 text-paper"
      : "border border-navy/30 text-navy";
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]"
        style={{
          background: inverted ? "var(--color-amsler-dark)" : "var(--color-amsler-light)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="單眼阿姆斯勒檢查"
      >
        <div className="flex shrink-0 items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setTesting(false)}
            className="inline-flex h-11 items-center rounded-full bg-navy px-4 text-[0.85rem] font-semibold text-paper"
          >
            結束檢查
          </button>
          <button
            type="button"
            onClick={() => setInverted((v) => !v)}
            className={`inline-flex h-11 items-center gap-1 rounded-full px-3 text-[0.8rem] font-semibold ${ghostBtn}`}
          >
            <Contrast className="size-4" />
            黑白對調
          </button>
        </div>
        <p className={`mt-3 shrink-0 text-center text-[1.05rem] font-semibold ${fg}`}>
          用手掌遮蓋
          {eye === "right" ? "左眼" : "右眼"}
          ，注視中央圓點
        </p>
        <p className={`mt-1 shrink-0 text-center text-[0.8rem] ${muted}`}>
          螢幕置於眼前約 {holdCm} 厘米 · 戴閱讀眼鏡
        </p>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-2">
          <AmslerGrid sizePx={testGridPx} inverted={inverted} />
        </div>
        <div className="mx-auto grid w-full max-w-sm shrink-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setEye((e) => (e === "right" ? "left" : "right"))}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-navy text-[0.9rem] font-semibold text-paper"
          >
            換另一眼
          </button>
          <Link
            to="/urgent"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-danger text-[0.9rem] font-semibold text-paper no-underline"
          >
            發覺異常
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="amsler-page pb-8">
      <div className="flex items-center gap-1 px-2 pt-3 no-print">
        <Link
          to="/"
          className="grid size-11 place-items-center rounded-md text-navy no-underline"
          aria-label={t("back")}
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <h1 className="flex-1 text-[1.25rem] font-semibold text-navy">
          {t("amslerTitle")}
        </h1>
        <button
          type="button"
          onClick={() => window.print()}
          className="mr-2 inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-[0.8rem] font-semibold text-navy"
        >
          <Printer className="size-3.5" aria-hidden />
          {t("printPage")}
        </button>
      </div>

      <h1 className="print-only px-4 pt-2 text-[1.25rem] font-semibold text-navy">
        {t("amslerTitle")}
      </h1>

      <div className="amsler-print-keep px-4 pt-2">
        <EduToolCaveat />
      </div>

      <p className="amsler-print-keep px-4 pt-1 text-[0.88rem] leading-relaxed text-muted">
        {t("amslerLead")}
      </p>

      <div ref={boxRef} className="amsler-print-keep px-4 pt-4">
        <div className="rounded-xl bg-navy p-3 print:bg-transparent print:p-0">
          <AmslerGrid sizePx={gridPx} inverted={inverted} />
          <p className="mt-3 text-center text-[0.78rem] text-paper/85 print:text-ink">
            {t("amslerDist", { n: holdCm })}
            {calibrated ? t("amslerCal") : t("amslerUncal")}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 no-print">
          <button
            type="button"
            onClick={() => setInverted((v) => !v)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-card text-[0.82rem] font-semibold text-navy"
          >
            <Contrast className="size-4" />
            {inverted ? t("amslerWhite") : t("amslerBlack")}
          </button>
          <button
            type="button"
            onClick={() => setTesting(true)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy text-[0.82rem] font-semibold text-paper"
          >
            <Maximize2 className="size-4" />
            {t("amslerStart")}
          </button>
        </div>
      </div>

      <div className="no-print">
        <AmslerFindingDemo sizePx={Math.max(200, Math.min(gridPx, 320))} inverted={inverted} />
      </div>

      <section className="mt-6 px-4 no-print">
        <h2 className="text-[1.05rem] font-semibold text-navy">
          {t("amslerCalH")}
        </h2>
        <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">
          螢幕像素與真實厘米不同。把八達通或信用卡（短邊 85.6
          毫米）貼在下面的長方形上，拖動滑桿直至兩邊一樣闊。對準後，方格會接近標準 10
          厘米。
        </p>
        <div className="mt-3 rounded-xl border border-line bg-card p-3">
          <div
            className="rounded-sm border-2 border-dashed border-navy bg-paper"
            style={{
              width: cardPx,
              height: cardPx * (54 / CARD_W_MM),
              maxWidth: "100%",
            }}
          />
          <p className="mt-2 text-[0.75rem] text-muted">
            卡片示意（對準短邊闊度）
          </p>
          <input
            type="range"
            min={120}
            max={Math.max(200, boxW)}
            value={Math.min(cardPx, boxW)}
            onChange={(e) => setCardPx(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-navy)]"
            aria-label="調整卡片闊度以對準實體卡"
          />
          <button
            type="button"
            onClick={saveCalibration}
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-navy text-[0.88rem] font-semibold text-paper"
          >
            儲存尺寸
          </button>
          {calibrated ? (
            <p className="mt-2 text-[0.78rem] text-steel">
              已儲存在此裝置。換手機或電腦請重新對準。
            </p>
          ) : null}
        </div>
      </section>

      <section className="amsler-print-keep mt-6 px-4">
        <h2 className="text-[1.05rem] font-semibold text-navy">2. 檢查步驟</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-[0.9rem] leading-relaxed">
          <li>戴你平日看報、看手機的閱讀眼鏡。不要戴太陽眼鏡。</li>
          <li>在室內、光線穩定、螢幕無反光。亮度調至舒適、不要過暗。</li>
          <li>
            用手掌輕輕遮蓋一眼，不要按壓眼球。先查較佳或慣用眼，再查另一眼。
          </li>
          <li>單眼注視中央圓點，不要轉動眼球去「找」線條。</li>
          <li>
            問自己：四邊能否看見？直線有無波浪、斷開、缺格？中央有無暗影或圓點消失？
          </li>
          <li>換另一眼重做。兩眼不要同時看。</li>
        </ol>
      </section>

      <section className="mt-6 grid gap-3 px-4 no-print">
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="flex items-center gap-2 font-semibold text-navy">
            <Smartphone className="size-4" />
            用手機
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.88rem] leading-relaxed">
            <li>直向拿着，螢幕正對面部，不要側傾。</li>
            <li>
              對準尺寸後，把手機放在眼前約 {holdCm}{" "}
              厘米（大約一隻前臂、接近閱讀距離）。
            </li>
            <li>螢幕太細時，方格會小於 10 厘米——請依上面顯示的距離拿近一點。</li>
            <li>關掉自動旋轉、通知，以免檢查中途跳畫面。</li>
            <li>可按「開始單眼檢查」隱藏其他文字，較易專心。</li>
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="flex items-center gap-2 font-semibold text-navy">
            <Monitor className="size-4" />
            用電腦螢幕
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.88rem] leading-relaxed">
            <li>把瀏覽器視窗放大，坐直，螢幕與眼等高。</li>
            <li>
              用信用卡對準後，若方格接近 10 厘米，觀看距離約 30
              厘米（閱讀距離）。
            </li>
            <li>筆記型電腦請放在桌上，不要躺着看，以免距離不穩。</li>
            <li>外置螢幕較手機準；仍須對準卡片，不要假設「電腦一定準確」。</li>
            <li>檢查時關閉其他視窗。有閱讀眼鏡就戴上。</li>
          </ul>
        </div>
      </section>

      <section className="amsler-print-keep mt-6 px-4">
        <h2 className="text-[1.05rem] font-semibold text-navy">
          3. 甚麼算異常
        </h2>
        <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">
          上面的示意可對照：視物變形、中央暗點、旁中央暗點。另須留意與昨日相比的新變化。
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.9rem] leading-relaxed">
          <li>直線變彎、扭曲（視物變形，metamorphopsia）</li>
          <li>正中間缺一塊或圓點消失（中央暗點，central scotoma）</li>
          <li>圓點仍在、旁邊缺格或看不見一塊（旁中央暗點，paracentral scotoma）</li>
          <li>與昨天相比，新出現的變形（建議固定每週同一時間自查）</li>
        </ul>
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-danger-bg px-3 py-3 text-[0.88rem] leading-relaxed text-danger">
          <EyeOff className="mt-0.5 size-4 shrink-0" />
          新出現或突然加重的變形、中央或旁中央暗點，須盡快由眼科專科醫生作散瞳眼底檢查。突然視力急降請立即到急症室；無法自行前往：致電 999。
        </p>
      </section>

      <div className="no-print">
        <AmslerNotebook />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 px-4 no-print">
        <Link
          to="/t/$topicId"
          params={{ topicId: "d5" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          年齡相關性黃斑病變
        </Link>
      </div>

      <div className="amsler-print-keep px-4">
        <SimDisclaimer />
        <EditorialFooter />
      </div>
    </div>
  );
}

function AmslerNotebook() {
  const notes = usePrefs((s) => s.amslerNotes);
  const add = usePrefs((s) => s.addAmslerNote);
  const clear = usePrefs((s) => s.clearAmslerNotes);
  const last = notes[notes.length - 1];

  function save(result: AmslerResult) {
    add(result);
  }

  return (
    <section className="mt-6 px-4">
      <h2 className="text-[1.05rem] font-semibold text-navy">4. 今日記錄（只在此裝置）</h2>
      <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">
        不記姓名、不上載。用來同自己昨日比，不是診斷。
      </p>
      <div className="mt-3 grid gap-2">
        <button
          type="button"
          onClick={() => save("same")}
          className="min-h-12 rounded-xl border border-line bg-card px-3 text-left text-[0.88rem] font-semibold text-navy"
        >
          今日同昨日差不多
        </button>
        <button
          type="button"
          onClick={() => save("warp")}
          className="min-h-12 rounded-xl border border-line bg-card px-3 text-left text-[0.88rem] font-semibold text-navy"
        >
          新出現變形
        </button>
        <button
          type="button"
          onClick={() => save("spot")}
          className="min-h-12 rounded-xl border border-line bg-card px-3 text-left text-[0.88rem] font-semibold text-navy"
        >
          中央暗點
        </button>
      </div>
      {last?.result === "warp" || last?.result === "spot" ? (
        <p className="mt-3 rounded-xl bg-danger-bg px-3 py-3 text-[0.88rem] leading-relaxed text-danger">
          盡快散瞳眼底檢查。突然視力急降請立即到急症室，不要只等普通門診。無法自行前往：致電 999。
        </p>
      ) : null}
      {notes.length > 0 ? (
        <div className="mt-3">
          <p className="text-[0.75rem] text-muted">最近紀錄</p>
          <ul className="mt-1 space-y-1 text-[0.8rem] text-steel">
            {notes.slice(-5).reverse().map((n) => (
              <li key={n.t}>
                {new Date(n.t).toLocaleString("zh-HK")} ·{" "}
                {n.result === "same" ? "差不多" : n.result === "warp" ? "新變形" : "中央暗點"}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={clear}
            className="mt-2 text-[0.75rem] text-faint underline"
          >
            清除此裝置紀錄
          </button>
        </div>
      ) : null}
    </section>
  );
}

function AmslerFindingDemo({ sizePx, inverted }: { sizePx: number; inverted: boolean }) {
  const { t } = useI18n();
  const [finding, setFinding] = useState<AmslerFinding>("normal");
  const items: { id: AmslerFinding; title: string; en: string }[] = [
    { id: "normal", title: t("amslerFindNormal"), en: "" },
    { id: "meta", title: t("amslerFindMeta"), en: t("amslerFindMetaEn") },
    { id: "central", title: t("amslerFindCentral"), en: t("amslerFindCentralEn") },
    { id: "para", title: t("amslerFindPara"), en: t("amslerFindParaEn") },
  ];
  const caption =
    finding === "meta"
      ? t("amslerFindMetaP")
      : finding === "central"
        ? t("amslerFindCentralP")
        : finding === "para"
          ? t("amslerFindParaP")
          : t("amslerFindLead");

  return (
    <section className="mt-6 px-4">
      <h2 className="text-[1.05rem] font-semibold text-navy">{t("amslerFindH")}</h2>
      <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">{t("amslerFindLead")}</p>
      <div className="mt-3 rounded-xl bg-navy p-3">
        <AmslerGrid sizePx={sizePx} inverted={inverted} finding={finding} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFinding(item.id)}
            className={
              finding === item.id
                ? "min-h-12 rounded-xl border border-navy bg-navy px-2 py-1.5 text-paper"
                : "min-h-12 rounded-xl border border-line bg-card px-2 py-1.5 text-navy"
            }
          >
            <span className="block text-[0.82rem] font-semibold leading-tight">{item.title}</span>
            {item.en ? (
              <span
                className={
                  finding === item.id
                    ? "mt-0.5 block text-[0.68rem] text-paper/75"
                    : "mt-0.5 block text-[0.68rem] text-muted"
                }
              >
                {item.en}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-ink">{caption}</p>
      <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">{t("amslerFindNote")}</p>
    </section>
  );
}
