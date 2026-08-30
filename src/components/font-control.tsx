import { FONT, usePrefs } from "@/lib/prefs";
import { useI18n } from "@/i18n";

export function FontControl() {
  const fontPx = usePrefs((s) => s.fontPx);
  const setFontPx = usePrefs((s) => s.setFontPx);
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2">
      <span className="text-[0.75rem] text-muted">{t("font")}</span>
      <button
        type="button"
        aria-label={t("fontDown")}
        className="grid size-10 place-items-center rounded-md border border-line bg-card text-sm font-semibold"
        onClick={() => setFontPx(fontPx - 1)}
      >
        A−
      </button>
      <button
        type="button"
        aria-label={t("fontReset")}
        className="grid size-10 place-items-center rounded-md border border-line bg-card text-sm font-semibold"
        onClick={() => setFontPx(FONT.def)}
      >
        A
      </button>
      <button
        type="button"
        aria-label={t("fontUp")}
        className="grid size-10 place-items-center rounded-md border border-line bg-card text-sm font-semibold"
        onClick={() => setFontPx(fontPx + 1)}
      >
        A＋
      </button>
    </div>
  );
}
