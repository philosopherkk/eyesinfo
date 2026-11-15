import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import "./pal-stairs-sim.css";

/** Map site locale → `?lang=` for `public/pal-stairs.html`. */
export function palStairsLang(locale: Locale): Locale {
  return locale;
}

type PalStairsSimProps = {
  /**
   * When true (default on topic embed), show teaching-only badge + footer.
   * Tool route sets false and owns its own teaching chrome.
   * Do not mount shared EduToolCaveat / SimDisclaimer here (Amsler etc.).
   */
  showChrome?: boolean;
};

/** Teaching-only caveat (not the shared Amsler normal/abnormal / OCT boilerplate). */
export function PalStairsTeachingCaveat() {
  const { t } = useI18n();
  return (
    <aside
      className="mb-4 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.82rem] leading-relaxed text-muted"
      aria-label={t("palStairsEduBadge")}
    >
      <p className="font-semibold text-navy">{t("palStairsEduBadge")}</p>
      <p className="mt-1.5">{t("palStairsEduCaveat")}</p>
    </aside>
  );
}

export function PalStairsTeachingFooter() {
  const { t } = useI18n();
  return (
    <p className="mt-6 text-[0.78rem] leading-relaxed text-faint">
      {t("palStairsSimFooter")}
    </p>
  );
}

/**
 * Embeds the progressive-lens stair-walking illustration (`public/pal-stairs.html`).
 * Control labels follow the site locale via `?lang=` (no in-sim language picker).
 */
export function PalStairsSim({ showChrome = true }: PalStairsSimProps) {
  const { t, locale } = useI18n();
  const lang = palStairsLang(locale);

  return (
    <section className="pal-stairs-sim" aria-label={t("palStairsSimTitle")}>
      {showChrome ? <PalStairsTeachingCaveat /> : null}
      <p className="pal-stairs-sim__caption">{t("palStairsSimCaption")}</p>
      <iframe
        id="eyesinfo-pal-stairs-sim"
        src={`/pal-stairs.html?lang=${encodeURIComponent(lang)}`}
        title={t("palStairsSimTitle")}
        className="pal-stairs-sim__frame"
        loading="lazy"
        referrerPolicy="same-origin"
      />
      {showChrome ? <PalStairsTeachingFooter /> : null}
    </section>
  );
}
