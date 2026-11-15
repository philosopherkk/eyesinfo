import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import type { UiKey } from "@/i18n/ui";
import "./teaching-sim-frame.css";

/** Map site locale → `?lang=` for public teaching HTML (no in-sim language picker). */
export function teachingSimLang(locale: Locale): Locale {
  return locale;
}

type TeachingSimFrameProps = {
  /** Public HTML path without leading slash, e.g. `presbyopia-sim.html`. */
  htmlFile: string;
  iframeId: string;
  titleKey: UiKey;
  captionKey: UiKey;
  footKey: UiKey;
  /** Taller iframe for multi-panel sims. */
  tall?: boolean;
};

/**
 * Embeds a same-origin teaching animation. Labels follow site locale via `?lang=`
 * remount — do not put a language selector inside the animation box.
 */
export function TeachingSimFrame({
  htmlFile,
  iframeId,
  titleKey,
  captionKey,
  footKey,
  tall = false,
}: TeachingSimFrameProps) {
  const { t, locale } = useI18n();
  const lang = teachingSimLang(locale);

  return (
    <section className="teaching-sim" aria-label={t(titleKey)}>
      <p className="teaching-sim__caption">{t(captionKey)}</p>
      <iframe
        key={lang}
        id={iframeId}
        src={`/${htmlFile}?lang=${encodeURIComponent(lang)}`}
        title={t(titleKey)}
        className={tall ? "teaching-sim__frame teaching-sim__frame--tall" : "teaching-sim__frame"}
        loading="lazy"
        referrerPolicy="same-origin"
      />
      <p className="teaching-sim__foot">{t(footKey)}</p>
    </section>
  );
}
