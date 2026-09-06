import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";

/**
 * Full Cap. 231 / education disclaimer — bottom of page only (AppShell).
 * Short top one-liner is LegalShortLine; do not mount this block mid-page.
 */
export function LegalBanner() {
  const { t, legal } = useI18n();
  return (
    <aside
      className="mx-4 mb-2 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.82rem] leading-relaxed text-muted"
      aria-label={t("legalLink")}
    >
      <p>{legal.short}</p>
      <p className="mt-2">{legal.independent}</p>
      <p className="mt-2">{legal.notSubstitute}</p>
      <p className="mt-2">
        <Link to="/legal" className="font-semibold text-navy underline">
          {t("legalLink")}
        </Link>
      </p>
    </aside>
  );
}
