import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import "./spectacle-image-sim.css";

/** Map site locale → `?lang=` for `public/spectacle-image.html`. */
export function spectacleImageLang(locale: Locale): Locale {
  return locale;
}

type SpectacleImageSimProps = {
  /**
   * When true (default on a topic embed), show teaching-only badge + footer.
   * The tool route sets false and owns its own teaching chrome.
   * Do not mount shared EduToolCaveat / SimDisclaimer here.
   */
  showChrome?: boolean;
};

/** Teaching-only caveat (not the shared Amsler normal/abnormal / OCT boilerplate). */
export function SpectacleImageTeachingCaveat() {
  const { t } = useI18n();
  return (
    <aside
      className="mb-4 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.82rem] leading-relaxed text-muted"
      aria-label={t("spectacleImageEduBadge")}
    >
      <p className="font-semibold text-navy">{t("spectacleImageEduBadge")}</p>
      <p className="mt-1.5">{t("spectacleImageEduCaveat")}</p>
    </aside>
  );
}

export function SpectacleImageTeachingFooter() {
  const { t } = useI18n();
  return (
    <p className="mt-6 text-[0.78rem] leading-relaxed text-faint">
      {t("spectacleImageSimFooter")}
    </p>
  );
}

/**
 * Embeds the spectacle / contact-lens / monofocal illustration
 * (`public/spectacle-image.html`).
 * Control labels follow the site locale via `?lang=` (no in-sim language picker).
 */
export function SpectacleImageSim({ showChrome = true }: SpectacleImageSimProps) {
  const { t, locale } = useI18n();
  const lang = spectacleImageLang(locale);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;
    let obs: ResizeObserver | undefined;
    let timer = 0;

    function fit(reported?: number) {
      const frame = iframeRef.current;
      if (!frame) return false;
      const sim = frame.contentDocument?.getElementById("sim");
      const measured = sim ? sim.getBoundingClientRect().height : 0;
      const next = Math.ceil(measured > 0 ? measured : (reported ?? 0));
      if (next < 320) return false;
      const target = next + 2;
      if (Math.abs(frame.offsetHeight - target) > 1) frame.style.height = `${target}px`;
      return measured > 0;
    }

    function watch() {
      try {
        const ready = fit();
        const sim = el.contentDocument?.getElementById("sim");
        if (sim && !obs && typeof ResizeObserver !== "undefined") {
          obs = new ResizeObserver(() => fit());
          obs.observe(sim);
        }
        return ready;
      } catch {
        return false;
      }
    }

    function onMessage(ev: MessageEvent) {
      const data = ev.data;
      if (
        !data ||
        typeof data !== "object" ||
        data.type !== "eyesinfo-spectacle-image-height" ||
        typeof data.height !== "number"
      ) {
        return;
      }
      fit(data.height);
    }

    el.addEventListener("load", watch);
    window.addEventListener("message", onMessage);
    watch();
    timer = window.setInterval(watch, 100);
    const stop = window.setTimeout(() => window.clearInterval(timer), 4000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(stop);
      el.removeEventListener("load", watch);
      window.removeEventListener("message", onMessage);
      obs?.disconnect();
    };
  }, [lang]);

  return (
    <section className="spectacle-image-sim" aria-label={t("spectacleImageSimTitle")}>
      {showChrome ? <SpectacleImageTeachingCaveat /> : null}
      <p className="spectacle-image-sim__caption">{t("spectacleImageSimCaption")}</p>
      <iframe
        ref={iframeRef}
        key={lang}
        id="eyesinfo-spectacle-image-sim"
        src={`/spectacle-image.html?lang=${encodeURIComponent(lang)}`}
        title={t("spectacleImageSimTitle")}
        className="spectacle-image-sim__frame"
        loading="eager"
        referrerPolicy="same-origin"
      />
      {showChrome ? <SpectacleImageTeachingFooter /> : null}
    </section>
  );
}
