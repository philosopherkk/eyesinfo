import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import { DICTIONARY } from "@/lib/iol-optics-studio/explanations";
import { studioLangFromLocale } from "@/lib/iol-optics-studio/scene";
import "./iol-optics-studio.css";

/** Studio HTML is EN / 繁 only (`?lang=en|zh`), same pattern as eye-viewer. */
export function iolStudioLang(locale: Locale): "zh" | "en" {
  return studioLangFromLocale(locale);
}

/**
 * Embeds KK’s IOL Optics Studio (vendored Three.js, educational-paraxial-v1)
 * on its own /iol-optics tool page. /iol stays the simpler appearance demo.
 */
export function IolOpticsStudio() {
  const { locale } = useI18n();
  const lang = iolStudioLang(locale);
  const dict = DICTIONARY[lang === "zh" ? "zh" : "en"];

  return (
    <section className="iol-studio" aria-label={dict.title}>
      <p className="iol-studio__notice">{dict.notice}</p>
      <p className="iol-studio__phone-tip">{dict.phoneTip}</p>

      <iframe
        id="eyesinfo-iol-optics-studio"
        src={`/iol-optics-studio.html?lang=${lang}`}
        title={dict.title}
        className="iol-studio__frame"
        loading="lazy"
        referrerPolicy="same-origin"
      />

      <p className="iol-studio__copyright">{dict.footer}</p>
    </section>
  );
}
