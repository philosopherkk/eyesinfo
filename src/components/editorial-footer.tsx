import { Link } from "@tanstack/react-router";
import { editorialBits, useI18n } from "@/i18n";
import { DEFAULT_TOPIC_REVIEWER } from "@/data/editorial";
import type { TopicReviewer } from "@/data/topics";
import { CONTENT_UPDATED, CONTENT_VERSION } from "@/lib/site";

function formatReviewed(
  isoOrDisplay: string | undefined,
  locale: string,
  fallbackDisplay: string,
): string {
  if (!isoOrDisplay) return fallbackDisplay;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoOrDisplay)) return isoOrDisplay;
  const [y, m, d] = isoOrDisplay.split("-").map(Number);
  if (locale === "en") {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${d} ${months[m - 1]} ${y}`;
  }
  return `${y}年${m}月${d}日`;
}

export function EditorialFooter({
  toolCaveat,
  lastReviewed,
  reviewer,
  showEdition = true,
}: {
  toolCaveat?: boolean;
  /** ISO YYYY-MM-DD or pre-localized display string. */
  lastReviewed?: string;
  reviewer?: TopicReviewer;
  /** Show site-wide 內容版本 (topic + tool pages). Calendar stamp lives under 最近覆核. */
  showEdition?: boolean;
}) {
  const { t, locale, legal } = useI18n();
  const ed = editorialBits(locale);
  const reviewed = formatReviewed(lastReviewed, locale, ed.reviewed);
  const isDefault =
    !reviewer ||
    (reviewer.name === DEFAULT_TOPIC_REVIEWER.name &&
      reviewer.role === DEFAULT_TOPIC_REVIEWER.role);
  const name = isDefault ? ed.name : reviewer.name;
  const title = isDefault ? ed.title : reviewer.role;

  return (
    <aside className="mt-6 space-y-2 text-[0.75rem] leading-relaxed text-faint">
      {toolCaveat ? <p>{t("toolCaveat")}</p> : null}
      <p>
        {t("reviewed")}：{reviewed} · {name} · {title}（{ed.register}）
      </p>
      {showEdition ? (
        <>
          <p>
            {t("clinicalReviewLabel")}：{ed.reviewed}
          </p>
          <p>
            {t("siteVersionLabel")}：{CONTENT_VERSION} · {t("contentUpdated")}{" "}
            {CONTENT_UPDATED}
          </p>
          <p>{t("langAuthority")}</p>
        </>
      ) : null}
      <p>{legal.disclosure}</p>
      <p className="no-print">
        <Link to="/legal" className="text-navy underline">
          {t("legalLink")}
        </Link>
        {" · "}
        <Link to="/privacy" className="text-navy underline">
          {t("privacyLink")}
        </Link>
        {" · "}
        <Link to="/accessibility" className="text-navy underline">
          {t("a11yLink")}
        </Link>
      </p>
    </aside>
  );
}
