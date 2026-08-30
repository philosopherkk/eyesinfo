import { useI18n } from "@/i18n";

export function SimDisclaimer() {
  const { t } = useI18n();
  return <p className="mt-6 text-[0.78rem] leading-relaxed text-faint">{t("simFooter")}</p>;
}
