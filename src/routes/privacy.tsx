import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  const { t, legal } = useI18n();
  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("privacyTitle")}</h1>
      <p className="mt-3 text-[0.92rem] leading-relaxed">{legal.privacy}</p>
      <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{t("privacyP2")}</p>
      <p className="mt-6 text-[0.8rem]">
        <Link to="/legal" className="text-navy underline">
          {t("legalLink")}
        </Link>
      </p>
    </div>
  );
}
