import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import { COPYRIGHT_LINE } from "@/lib/site";
import { DICTIONARY } from "@/lib/iol-optics-studio/explanations";
import { studioLangFromLocale } from "@/lib/iol-optics-studio/scene";
import "./iol-optics-studio.css";

/** Studio HTML is EN / 繁 only (`?lang=en|zh`), same pattern as eye-viewer. */
export function iolStudioLang(locale: Locale): "zh" | "en" {
  return studioLangFromLocale(locale);
}

/**
 * Embeds KK’s IOL Optics Studio (vendored Three.js, educational-paraxial-v1)
 * on the existing /iol tool page — not a second competing tool route.
 */
export function IolOpticsStudio() {
  const { locale } = useI18n();
  const lang = iolStudioLang(locale);
  const dict = DICTIONARY[lang === "zh" ? "zh" : "en"];

  return (
    <section className="iol-studio" aria-label={dict.title}>
      <div className="iol-studio__intro">
        <h2 className="iol-studio__title">{dict.title}</h2>
        <p className="iol-studio__subtitle">{dict.subtitle}</p>
        <p className="iol-studio__notice">{dict.notice}</p>
        <p className="iol-studio__phone-tip">{dict.phoneTip}</p>
      </div>

      <iframe
        id="eyesinfo-iol-optics-studio"
        src={`/iol-optics-studio.html?lang=${lang}`}
        title={dict.title}
        className="iol-studio__frame"
        loading="lazy"
        referrerPolicy="same-origin"
      />

      <p className="iol-studio__copyright">
        {dict.footer}
        <br />
        {COPYRIGHT_LINE}
      </p>
    </section>
  );
}
