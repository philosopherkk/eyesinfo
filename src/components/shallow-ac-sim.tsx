import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import "./shallow-ac-sim.css";

/** Map site locale → `?lang=` for `public/shallow-ac.html`. */
export function shallowAcLang(locale: Locale): Locale {
  return locale;
}

type ShallowAcSimProps = {
  /**
   * When true (default on topic embed), show teaching-only badge + footer.
   * Tool route sets false and owns its own teaching chrome.
   * Do not mount shared EduToolCaveat / SimDisclaimer here.
   */
  showChrome?: boolean;
};

/** Teaching-only caveat (not the shared Amsler normal/abnormal / OCT boilerplate). */
export function ShallowAcTeachingCaveat() {
  const { t } = useI18n();
  return (
    <aside
      className="mb-4 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.82rem] leading-relaxed text-muted"
      aria-label={t("shallowAcEduBadge")}
    >
      <p className="font-semibold text-navy">{t("shallowAcEduBadge")}</p>
      <p className="mt-1.5">{t("shallowAcEduCaveat")}</p>
    </aside>
  );
}

export function ShallowAcTeachingFooter() {
  const { t } = useI18n();
  return (
    <p className="mt-6 text-[0.78rem] leading-relaxed text-faint">
      {t("shallowAcSimFooter")}
    </p>
  );
}

/**
 * Embeds the shallow-AC / angle-closure mechanism illustration (`public/shallow-ac.html`).
 * Control labels follow the site locale via `?lang=` (no in-sim language picker).
 */
export function ShallowAcSim({ showChrome = true }: ShallowAcSimProps) {
  const { t, locale } = useI18n();
  const lang = shallowAcLang(locale);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      const data = ev.data;
      if (
        !data ||
        typeof data !== "object" ||
        data.type !== "eyesinfo-shallow-ac-height" ||
        typeof data.height !== "number"
      ) {
        return;
      }
      const el = iframeRef.current;
      if (!el) return;
      const next = Math.max(640, Math.min(1400, Math.ceil(data.height)));
      el.style.height = `${next}px`;
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section className="shallow-ac-sim" aria-label={t("shallowAcSimTitle")}>
      {showChrome ? <ShallowAcTeachingCaveat /> : null}
      <p className="shallow-ac-sim__caption">{t("shallowAcSimCaption")}</p>
      <iframe
        ref={iframeRef}
        key={lang}
        id="eyesinfo-shallow-ac-sim"
        src={`/shallow-ac.html?lang=${encodeURIComponent(lang)}`}
        title={t("shallowAcSimTitle")}
        className="shallow-ac-sim__frame"
        loading="lazy"
        referrerPolicy="same-origin"
      />
      {showChrome ? <ShallowAcTeachingFooter /> : null}
    </section>
  );
}
