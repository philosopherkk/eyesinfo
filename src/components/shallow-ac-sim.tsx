import { useEffect, useRef, useState } from "react";
import { EduLink } from "@/components/edu-link";
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

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
};
type FullscreenElement = HTMLElement & { webkitRequestFullscreen?: () => void };

/** Teaching-only caveat (not the shared Amsler normal/abnormal / OCT boilerplate). */
export function ShallowAcTeachingCaveat() {
  const { t } = useI18n();
  return (
    <aside
      className="mb-4 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.82rem] leading-relaxed text-muted"
      aria-label={t("shallowAcEduBadge")}
    >
      <p className="font-semibold text-navy">{t("shallowAcEduBadge")}</p>
      <p className="mt-1.5">
        {t("shallowAcEduCaveatBefore")}
        <EduLink
          href="/urgent"
          className="font-medium text-navy underline underline-offset-2"
        >
          {t("shallowAcUrgentLink")}
        </EduLink>
        {t("shallowAcEduCaveatAfter")}
      </p>
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
  const chromeRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

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
      // While fullscreen, CSS flex sizing owns the frame height.
      if (chromeRef.current?.classList.contains("is-fullscreen")) return;
      const next = Math.max(640, Math.min(1400, Math.ceil(data.height)));
      el.style.height = `${next}px`;
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const root = document.documentElement as FullscreenElement;
    setFullscreenSupported(
      typeof root.requestFullscreen === "function" ||
        typeof root.webkitRequestFullscreen === "function",
    );
    const sync = () => {
      const doc = document as FullscreenDocument;
      const active = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setFullscreen(active !== null && active === chromeRef.current);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const enterFullscreen = () => {
    const el = chromeRef.current as FullscreenElement | null;
    if (!el) return;
    if (typeof el.requestFullscreen === "function") {
      void el.requestFullscreen().catch(() => {});
    } else {
      el.webkitRequestFullscreen?.();
    }
  };

  const exitFullscreen = () => {
    const doc = document as FullscreenDocument;
    if (typeof doc.exitFullscreen === "function" && doc.fullscreenElement) {
      void doc.exitFullscreen().catch(() => {});
    } else {
      doc.webkitExitFullscreen?.();
    }
  };

  return (
    <section className="shallow-ac-sim" aria-label={t("shallowAcSimTitle")}>
      {showChrome ? <ShallowAcTeachingCaveat /> : null}
      <p className="shallow-ac-sim__caption">{t("shallowAcSimCaption")}</p>
      {fullscreenSupported ? (
        <div className="shallow-ac-sim__toolbar">
          <button
            type="button"
            id="shallow-ac-enter-fullscreen"
            className="shallow-ac-sim__fs-button"
            aria-pressed={fullscreen}
            onClick={enterFullscreen}
          >
            {t("shallowAcFullscreen")}
          </button>
        </div>
      ) : null}
      <div
        id="shallow-ac-teaching-chrome"
        ref={chromeRef}
        className={
          fullscreen
            ? "shallow-ac-sim__chrome is-fullscreen"
            : "shallow-ac-sim__chrome"
        }
      >
        <div className="shallow-ac-sim__fs-exit-bar">
          <button
            type="button"
            id="shallow-ac-exit-fullscreen"
            className="shallow-ac-sim__fs-button"
            onClick={exitFullscreen}
          >
            {t("shallowAcExitFullscreen")}
          </button>
        </div>
        <iframe
          ref={iframeRef}
          key={lang}
          id="eyesinfo-shallow-ac-sim"
          src={`/shallow-ac.html?lang=${encodeURIComponent(lang)}`}
          title={t("shallowAcSimTitle")}
          className="shallow-ac-sim__frame"
          loading="lazy"
          referrerPolicy="same-origin"
          allow="fullscreen"
        />
      </div>
      {showChrome ? <ShallowAcTeachingFooter /> : null}
    </section>
  );
}
