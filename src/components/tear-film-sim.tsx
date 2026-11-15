import { useEffect, useRef } from "react";
import { EduLink } from "@/components/edu-link";
import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import "./tear-film-sim.css";

/** Map site locale → `?lang=` for `public/tear-film.html`. */
export function tearFilmLang(locale: Locale): Locale {
  return locale;
}

type TearFilmSimProps = {
  /**
   * When true (default on topic embed), show teaching-only badge + footer.
   * Tool route sets false and owns its own teaching chrome.
   */
  showChrome?: boolean;
};

/** Locked teaching caveat — not a self-check; red flags only → /urgent. */
export function TearFilmTeachingCaveat() {
  const { t } = useI18n();
  return (
    <aside
      className="mb-4 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.82rem] leading-relaxed text-muted"
      aria-label={t("tearFilmEduBadge")}
    >
      <p className="font-semibold text-navy">{t("tearFilmLockedBanner")}</p>
      <p className="mt-2 font-semibold text-navy">{t("tearFilmEduBadge")}</p>
      <p className="mt-1.5">{t("tearFilmEduCaveat")}</p>
      <p className="mt-1.5">
        {t("tearFilmEduRedFlag")}{" "}
        <EduLink href="/urgent" className="font-medium text-navy underline underline-offset-2">
          {t("tearFilmEduRedFlagLink")}
        </EduLink>
        {t("tearFilmEduRedFlagAfter")}
      </p>
      <p className="mt-1.5">{t("tearFilmEduSystemic")}</p>
      <p className="mt-1.5 font-medium text-navy">{t("tearFilmNoTreatment")}</p>
    </aside>
  );
}

export function TearFilmTeachingFooter() {
  const { t } = useI18n();
  return (
    <p className="mt-6 text-[0.78rem] leading-relaxed text-faint">
      {t("tearFilmSimFooter")}
    </p>
  );
}

/**
 * Embeds the tear-film / dry-eye mechanism illustration (`public/tear-film.html`).
 * Control labels follow the site locale via `?lang=` (no in-sim language picker).
 */
export function TearFilmSim({ showChrome = true }: TearFilmSimProps) {
  const { t, locale } = useI18n();
  const lang = tearFilmLang(locale);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      const data = ev.data;
      if (
        !data ||
        typeof data !== "object" ||
        data.type !== "eyesinfo-tear-film-height" ||
        typeof data.height !== "number"
      ) {
        return;
      }
      const el = iframeRef.current;
      if (!el) return;
      const next = Math.max(720, Math.min(1600, Math.ceil(data.height)));
      el.style.height = `${next}px`;
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section className="tear-film-sim" aria-label={t("tearFilmSimTitle")}>
      {showChrome ? <TearFilmTeachingCaveat /> : null}
      <p className="tear-film-sim__caption">{t("tearFilmSimCaption")}</p>
      <iframe
        ref={iframeRef}
        key={lang}
        id="eyesinfo-tear-film-sim"
        src={`/tear-film.html?lang=${encodeURIComponent(lang)}`}
        title={t("tearFilmSimTitle")}
        className="tear-film-sim__frame"
        loading="lazy"
        referrerPolicy="same-origin"
      />
      {showChrome ? <TearFilmTeachingFooter /> : null}
    </section>
  );
}
