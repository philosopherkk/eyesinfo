import { EduToolCaveat } from "@/components/edu-tool-caveat";
import { SimDisclaimer } from "@/components/sim-disclaimer";
import { useI18n } from "@/i18n";
import "./pal-stairs-sim.css";

/**
 * Embeds the progressive-lens stair-walking illustration (`public/pal-stairs.html`).
 * Canvas control labels stay English for this preview; React chrome is localized.
 */
export function PalStairsSim() {
  const { t } = useI18n();

  return (
    <section className="pal-stairs-sim" aria-label={t("palStairsSimTitle")}>
      <EduToolCaveat />
      <p className="pal-stairs-sim__caption">{t("palStairsSimCaption")}</p>
      <iframe
        id="eyesinfo-pal-stairs-sim"
        src="/pal-stairs.html"
        title={t("palStairsSimTitle")}
        className="pal-stairs-sim__frame"
        loading="lazy"
        referrerPolicy="same-origin"
      />
      <SimDisclaimer />
    </section>
  );
}
