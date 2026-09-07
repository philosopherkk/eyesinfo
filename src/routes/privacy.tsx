import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { pageHead } from "@/lib/page-seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: "私隱與本機資料",
      description:
        "本教育網站如何處理本機資料：不經此站收集病歷或聯絡電話，偏好設定只存於裝置。",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t, legal } = useI18n();
  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("privacyTitle")}</h1>
      <p className="mt-3 text-[0.92rem] leading-relaxed">{legal.privacy}</p>
      <section className="mt-5 space-y-3 text-[0.92rem] leading-relaxed">
        <div>
          <h2 className="font-semibold text-navy">{t("privacyCap486H")}</h2>
          <p className="mt-1 text-muted">{t("privacyCap486")}</p>
        </div>
        <p className="text-muted">{t("privacyP2")}</p>
      </section>
      <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-[0.8rem]">
        <Link to="/legal" className="text-navy underline">
          {t("legalLink")}
        </Link>
        <Link to="/accessibility" className="text-navy underline">
          {t("a11yLink")}
        </Link>
      </p>
    </div>
  );
}
