import { LocaleHrefLink } from "@/components/locale-href";
import { editorialBits, useI18n } from "@/i18n";
import { CONTENT_VERSION } from "@/lib/site";

/**
 * The review stamp is SITE-level (網站最近覆核 · EDITORIAL.reviewedIso · site
 * reviewer), not a per-page review claim, so pages no longer pass a date.
 */
export function EditorialFooter({
  toolCaveat,
  showEdition = true,
}: {
  toolCaveat?: boolean;
  /** Show site-wide 內容版本 (topic + tool pages). Calendar stamp lives under 網站最近覆核. */
  showEdition?: boolean;
}) {
  const { t, locale, legal } = useI18n();
  const ed = editorialBits(locale);

  return (
    <aside className="mt-6 space-y-2 text-[0.75rem] leading-relaxed text-faint">
      {toolCaveat ? <p>{t("toolCaveat")}</p> : null}
      <p>
        {t("reviewed")}
        {locale === "en" ? ": " : "："}
        {ed.reviewed} · {ed.name} · {ed.title}（{ed.register}）
      </p>
      {showEdition ? (
        <>
          <p>
            {t("siteVersionLabel")}：{CONTENT_VERSION}
          </p>
          <p>{t("langAuthority")}</p>
        </>
      ) : null}
      <p>{legal.disclosure}</p>
      <p className="no-print">
        <LocaleHrefLink path="/legal" className="text-navy underline">
          {t("legalLink")}
        </LocaleHrefLink>
        {" · "}
        <LocaleHrefLink path="/privacy" className="text-navy underline">
          {t("privacyLink")}
        </LocaleHrefLink>
        {" · "}
        <LocaleHrefLink path="/accessibility" className="text-navy underline">
          {t("a11yLink")}
        </LocaleHrefLink>
        {" · "}
        <LocaleHrefLink path="/resources" className="text-navy underline">
          {t("resourcesLink")}
        </LocaleHrefLink>
      </p>
    </aside>
  );
}
