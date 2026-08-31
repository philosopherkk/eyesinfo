import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { PUBLIC_ORIGIN } from "@/lib/site";
import { useI18n } from "@/i18n";

type Level = "L" | "M" | "Q" | "H";

const PRESETS = [
  { id: "prussian", label: "Prussian", fg: "#003153", bg: "#f3f0e9" },
  { id: "ink", label: "Ink", fg: "#171614", bg: "#fffcf7" },
  { id: "night", label: "Night", fg: "#f4f1ea", bg: "#141311" },
  { id: "navy", label: "Navy", fg: "#1e3348", bg: "#eef2f4" },
  { id: "forest", label: "Forest", fg: "#1c3a2e", bg: "#e7eee8" },
] as const;

const LEVEL_HINT: Record<Level, { zh: string; en: string; ja: string }> = {
  L: { zh: "約可復原 7% 損壞。檔最小。", en: "Recovers about 7% damage. Smallest file.", ja: "約7%の欠損に耐える。ファイル最小。" },
  M: { zh: "約可復原 15% 損壞。適合螢幕。", en: "Recovers about 15% damage. Best for screens.", ja: "約15%の欠損に耐える。画面向き。" },
  Q: { zh: "約可復原 25% 損壞。適合印刷。", en: "Recovers about 25% damage. Better for print.", ja: "約25%の欠損に耐える。印刷向き。" },
  H: { zh: "約可復原 30% 損壞。適合會被遮擋。", en: "Recovers about 30% damage. If part may be covered.", ja: "約30%の欠損に耐える。一部隠れても可。" },
};

function clampSize(n: number) {
  if (!Number.isFinite(n)) return 320;
  return Math.min(1024, Math.max(128, Math.round(n / 8) * 8));
}

export function QrLattice() {
  const { locale, t } = useI18n();
  const [text, setText] = useState(PUBLIC_ORIGIN);
  const [fg, setFg] = useState("#003153");
  const [bg, setBg] = useState("#f3f0e9");
  const [size, setSize] = useState(320);
  const [level, setLevel] = useState<Level>("M");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hint = LEVEL_HINT[level][locale === "ja" ? "ja" : locale === "en" ? "en" : "zh"];
  const trimmed = text.trim();
  const activePreset = PRESETS.find(
    (p) => p.fg.toLowerCase() === fg.toLowerCase() && p.bg.toLowerCase() === bg.toLowerCase(),
  );

  const previewCss = useMemo(
    () => ({ background: bg, color: fg }),
    [bg, fg],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!trimmed) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      setError("");
      return;
    }
    let cancelled = false;
    QRCode.toCanvas(canvas, trimmed, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: { dark: fg, light: bg },
    }).then(
      () => {
        if (!cancelled) setError("");
      },
      (err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "QR error");
      },
    );
    return () => {
      cancelled = true;
    };
  }, [trimmed, fg, bg, size, level]);

  async function downloadPng() {
    if (!trimmed || error) return;
    setBusy(true);
    try {
      const url = await QRCode.toDataURL(trimmed, {
        width: size,
        margin: 2,
        errorCorrectionLevel: level,
        color: { dark: fg, light: bg },
      });
      const a = document.createElement("a");
      a.href = url;
      a.download = "lattice-qr.png";
      a.click();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-line bg-card p-4">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="qr-content" className="text-[0.88rem] font-semibold text-navy">
            {t("qrContent")}
          </label>
          <span className="text-[0.72rem] tabular-nums text-faint">
            {text.length} {t("qrChars")}
          </span>
        </div>
        <textarea
          id="qr-content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          placeholder="https://eyesinfo.org"
          className="mt-2 min-h-28 w-full resize-y rounded-md border border-line bg-paper px-3 py-2.5 text-[0.9rem] leading-relaxed text-ink outline-none focus:border-navy"
        />
        <p className="mt-2 text-[0.75rem] leading-relaxed text-muted">
          {t("qrHint")}
        </p>
        <button
          type="button"
          className="mt-2 text-[0.78rem] font-semibold text-navy underline-offset-2 hover:underline"
          onClick={() => setText(PUBLIC_ORIGIN)}
        >
          {t("qrFill")}
        </button>
      </section>

      <aside className="flex flex-col items-center rounded-xl border border-line bg-navy/5 px-4 py-6">
        <div
          className="flex aspect-square w-full max-w-72 items-center justify-center rounded-lg p-3 shadow-sm"
          style={previewCss}
        >
          {trimmed && !error ? (
            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              className="h-full w-full"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <>
              <canvas ref={canvasRef} width={size} height={size} className="hidden" />
              <p className="px-4 text-center text-[0.85rem] text-muted">
                {error || t("qrEmpty")}
              </p>
            </>
          )}
        </div>
        <p className="mt-3 text-[0.72rem] tabular-nums text-faint">
          {size} × {size} · {level}
        </p>
        <button
          type="button"
          disabled={!trimmed || Boolean(error) || busy}
          onClick={() => void downloadPng()}
          className="mt-3 inline-flex h-12 w-full max-w-72 items-center justify-center gap-2 rounded-md bg-navy text-[0.9rem] font-semibold text-paper disabled:opacity-40"
        >
          <Download className="size-4" />
          {t("qrDownload")}
        </button>
      </aside>

      <section className="rounded-xl border border-line bg-card p-4">
        <h2 className="text-[0.88rem] font-semibold text-navy">{t("qrLook")}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ColorField
            id="qr-fg"
            label={t("qrFg")}
            value={fg}
            onChange={setFg}
          />
          <ColorField
            id="qr-bg"
            label={t("qrBg")}
            value={bg}
            onChange={setBg}
          />
        </div>
        <p className="mt-3 text-[0.8rem] font-medium text-ink">{t("qrPresets")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={activePreset?.id === p.id}
              aria-label={`${p.label}: ${p.fg} on ${p.bg}`}
              onClick={() => {
                setFg(p.fg);
                setBg(p.bg);
              }}
              className={`relative size-11 overflow-hidden rounded-md border ${
                activePreset?.id === p.id ? "border-navy ring-2 ring-navy/30" : "border-line"
              }`}
            >
              <span
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${p.fg} 50%, ${p.bg} 50%)` }}
              />
              <span className="sr-only">{p.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-1 text-[0.7rem] text-faint">
          Prussian · Ink · Night · Navy · Forest
        </p>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="qr-size" className="text-[0.88rem] font-semibold text-navy">
              {t("qrSize")}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="qr-size"
                type="number"
                min={128}
                max={1024}
                step={8}
                value={size}
                onChange={(e) => setSize(clampSize(Number(e.target.value)))}
                className="h-11 w-20 rounded-md border border-line bg-paper px-3 text-[0.9rem] tabular-nums"
              />
              <span className="text-[0.75rem] text-faint">px</span>
            </div>
          </div>
          <input
            type="range"
            min={128}
            max={1024}
            step={8}
            value={size}
            onChange={(e) => setSize(clampSize(Number(e.target.value)))}
            className="mt-2 w-full accent-[#003153]"
            aria-label={t("qrSize")}
          />
          <p className="mt-1 text-[0.75rem] text-muted">{t("qrSizeHint")}</p>
        </div>

        <div className="mt-5">
          <p className="text-[0.88rem] font-semibold text-navy">{t("qrEcc")}</p>
          <div className="mt-2 grid grid-cols-4 gap-1 rounded-md bg-navy/5 p-1">
            {(["L", "M", "Q", "H"] as const).map((lv) => (
              <button
                key={lv}
                type="button"
                role="radio"
                aria-checked={level === lv}
                onClick={() => setLevel(lv)}
                className={`flex min-h-11 flex-col items-center justify-center rounded-md px-1 py-1.5 ${
                  level === lv ? "bg-card text-navy shadow-sm" : "text-muted"
                }`}
              >
                <span className="text-[0.9rem] font-semibold">{lv}</span>
                <span className="mt-0.5 text-[0.65rem]">
                  {lv === "L" ? t("qrLow") : lv === "M" ? t("qrMid") : lv === "Q" ? "Q" : t("qrHigh")}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[0.75rem] leading-relaxed text-muted">{hint}</p>
        </div>
      </section>
    </div>
  );
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.8rem] font-medium text-ink">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-11 cursor-pointer rounded-md border border-line bg-paper p-1"
        />
        <input
          value={value}
          onChange={(e) => {
            const v = e.target.value.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
          }}
          spellCheck={false}
          autoComplete="off"
          aria-label={`${label} hex`}
          className="h-11 min-w-0 flex-1 rounded-md border border-line bg-paper px-3 font-medium uppercase tabular-nums"
        />
      </div>
    </div>
  );
}
