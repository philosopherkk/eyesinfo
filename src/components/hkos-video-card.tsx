import { ExternalLink } from "lucide-react";
import {
  getHkosVideo,
  hkosThumbUrl,
  hkosWatchUrl,
  type HkosSoftCalloutKey,
} from "@/data/hkos-videos";
import { useI18n } from "@/i18n";
import type { UiKey } from "@/i18n/ui";

const SOFT_KEYS: Record<HkosSoftCalloutKey, UiKey> = {
  hkosSoftMyopia: "hkosSoftMyopia",
  hkosSoftRvo: "hkosSoftRvo",
};

/**
 * HKOS「眼睛解碼」education video card — linked thumbnail + Exact chrome.
 * Soft mode (myopia / RVO) shows Cap/Lex callout before credit/disclaimer.
 */
export function HkosVideoCard({ topicId }: { topicId: string }) {
  const { t, tx } = useI18n();
  const entry = getHkosVideo(topicId);
  if (!entry) return null;

  const title = tx(entry.title);
  const watchUrl = hkosWatchUrl(entry.videoId);
  const thumbUrl = hkosThumbUrl(entry.videoId);
  const softKey =
    entry.soft && entry.softCalloutKey
      ? SOFT_KEYS[entry.softCalloutKey]
      : undefined;

  return (
    <section
      className="mt-6 border-t border-line pt-4"
      aria-labelledby={`hkos-video-${topicId}`}
    >
      <h2
        id={`hkos-video-${topicId}`}
        className="scroll-mt-20 text-[0.95rem] font-semibold tracking-tight text-navy"
      >
        {t("hkosSectionHeading")}
      </h2>

      {softKey ? (
        <aside
          className="mt-3 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.82rem] leading-relaxed text-muted"
          aria-label={t("hkosSoftLabel")}
        >
          <p className="font-semibold text-navy">{t("hkosSoftLabel")}</p>
          <p className="mt-1.5">{t(softKey)}</p>
        </aside>
      ) : null}

      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex gap-3 rounded-lg border border-line bg-card p-3 text-navy no-underline transition-colors hover:border-navy/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
      >
        <img
          src={thumbUrl}
          alt={t("hkosThumbAlt", { title })}
          width={160}
          height={90}
          className="h-[4.5rem] w-28 shrink-0 rounded-md object-cover"
          loading="lazy"
          decoding="async"
        />
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <span className="text-[0.9rem] font-semibold leading-snug">{title}</span>
          <span className="inline-flex items-center gap-1 text-[0.78rem] font-medium text-steel">
            {t("hkosOpenYoutube")}
            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
          </span>
        </span>
      </a>

      <p className="mt-2.5 text-[0.78rem] leading-relaxed text-muted">
        {t("hkosCredit")}
      </p>
      <p className="mt-1 text-[0.78rem] font-semibold leading-relaxed text-navy">
        {t("hkosDisclaimer")}
      </p>
    </section>
  );
}
