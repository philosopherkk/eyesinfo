import { EduToolCaveat } from "@/components/edu-tool-caveat";
import { SimDisclaimer } from "@/components/sim-disclaimer";
import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import "./pal-stairs-sim.css";

/** Map site locale → `?lang=` for `public/pal-stairs.html`. */
export function palStairsLang(locale: Locale): Locale {
  return locale;
}

type PalStairsSimProps = {
  /** When false, parent page owns EduToolCaveat / SimDisclaimer (tool route). */
  showChrome?: boolean;
};

/**
 * Embeds the progressive-lens stair-walking illustration (`public/pal-stairs.html`).
 * Control labels follow the site locale via `?lang=` (no in-sim language picker).
 */
export function PalStairsSim({ showChrome = true }: PalStairsSimProps) {
  const { t, locale } = useI18n();
  const lang = palStairsLang(locale);

  return (
    <section className="pal-stairs-sim" aria-label={t("palStairsSimTitle")}>
      {showChrome ? <EduToolCaveat /> : null}
      <p className="pal-stairs-sim__caption">{t("palStairsSimCaption")}</p>
      <iframe
        id="eyesinfo-pal-stairs-sim"
        src={`/pal-stairs.html?lang=${encodeURIComponent(lang)}`}
        title={t("palStairsSimTitle")}
        className="pal-stairs-sim__frame"
        loading="lazy"
        referrerPolicy="same-origin"
      />
      {showChrome ? <SimDisclaimer /> : null}
    </section>
  );
}
