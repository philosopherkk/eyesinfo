import { useI18n } from "@/i18n";

/**
 * Cap. 231 short one-liner — visible near top of main on every page.
 * Full Cap. 231 / legal block remains in LegalBanner at the bottom.
 * Language-authority line (education only): Traditional Chinese prevails.
 */
export function LegalShortLine() {
  const { t } = useI18n();
  return (
    <div
      className="border-b border-line/70 bg-line/20 px-4 py-1.5 text-[0.75rem] leading-snug text-muted sm:py-2.5 sm:text-[0.8rem]"
      role="note"
    >
      <p>{t("legalShortLine")}</p>
      <p className="mt-1">{t("langAuthority")}</p>
    </div>
  );
}
