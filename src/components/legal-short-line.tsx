import { useI18n } from "@/i18n";

/**
 * Cap. 231 short one-liner — visible near top of main on every page.
 * Full Cap. 231 / legal block remains in LegalBanner at the bottom.
 */
export function LegalShortLine() {
  const { t } = useI18n();
  return (
    <p
      className="border-b border-line/70 bg-line/20 px-4 py-2.5 text-[0.8rem] leading-snug text-muted"
      role="note"
    >
      {t("legalShortLine")}
    </p>
  );
}
