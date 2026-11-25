import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import "./tissue-sections-sim.css";

/** Map site locale → `?lang=` for `/tissue/index.html`. */
function tissueSectionsLang(locale: Locale): Locale {
  return locale;
}

type TissueSectionsSimProps = {
  /**
   * When true, show the teaching-only badge + footer inside this embed.
   * The tool route sets false and owns its own teaching chrome.
   * Do not mount shared EduToolCaveat / SimDisclaimer here.
   */
  showChrome?: boolean;
};

/** Teaching-only caveat (colours and thicknesses are exaggerated). */
export function TissueSectionsTeachingCaveat() {
  const { t } = useI18n();
  return (
    <aside
      className="mb-4 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.82rem] leading-relaxed text-muted"
      aria-label={t("tissueSectionsEduBadge")}
    >
      <p className="font-semibold text-navy">{t("tissueSectionsEduBadge")}</p>
      <p className="mt-1.5">{t("tissueSectionsEduCaveat")}</p>
    </aside>
  );
}

export function TissueSectionsTeachingFooter() {
  const { t } = useI18n();
  return (
    <p className="mt-6 text-[0.78rem] leading-relaxed text-faint">
      {t("tissueSectionsSimFooter")}
    </p>
  );
}

/**
 * Embeds the living tissue sections (`public/tissue/index.html`).
 * Language follows `?lang=` only. `embed=1` hides the in-app language pills.
 */
export function TissueSectionsSim({ showChrome = true }: TissueSectionsSimProps) {
  const { t, locale } = useI18n();
  const lang = tissueSectionsLang(locale);

  return (
    <section className="tissue-sections-sim" aria-label={t("tissueSectionsSimTitle")}>
      {showChrome ? <TissueSectionsTeachingCaveat /> : null}
      <p className="tissue-sections-sim__caption">{t("tissueSectionsSimCaption")}</p>
      <iframe
        id="eyesinfo-tissue-sections"
        src={`/tissue/index.html?lang=${encodeURIComponent(lang)}&embed=1#/tools`}
        title={t("tissueSectionsSimTitle")}
        className="tissue-sections-sim__frame"
        loading="lazy"
        referrerPolicy="same-origin"
      />
      {showChrome ? <TissueSectionsTeachingFooter /> : null}
    </section>
  );
}
