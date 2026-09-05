import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";

/** Grey Cap. 231 / no-referral callout — note-equivalent styling. */
export function LegalBanner({ compact }: { compact?: boolean }) {
  const { t, legal } = useI18n();
  if (compact) {
    return (
      <p className="mt-6 text-[0.75rem] leading-relaxed text-faint">
        {legal.topicFooter} {legal.noServices}{" "}
        <Link to="/legal" className="text-navy underline">
          {t("legalLink")}
        </Link>
      </p>
    );
  }
  return (
    <div className="mx-4 mb-4 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.88rem] leading-relaxed text-muted">
      {legal.short} {legal.independent}{" "}
      <Link to="/legal" className="font-semibold text-navy underline">
        {t("legalLink")}
      </Link>
    </div>
  );
}
