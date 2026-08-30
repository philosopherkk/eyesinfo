import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";

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
    <div className="mx-4 mb-4 rounded-xl border border-line bg-card px-3.5 py-3 text-[0.78rem] leading-relaxed text-muted">
      {legal.short} {legal.independent}{" "}
      <Link to="/legal" className="font-semibold text-navy no-underline">
        {t("details")}
      </Link>
    </div>
  );
}
