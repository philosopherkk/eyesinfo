import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { pageHead } from "@/lib/page-seo";

export const Route = createFileRoute("/accessibility")({
  head: () =>
    pageHead({
      title: "無障礙聲明",
      description:
        "護眼學堂無障礙目標、評估方法與已知限制。以 WCAG 2.1 Level AA 為持續改善目標。",
      path: "/accessibility",
    }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  const { t } = useI18n();
  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("a11yTitle")}</h1>
      <p className="mt-3 text-[0.92rem] leading-relaxed">{t("a11yIntro")}</p>

      <section className="mt-5 space-y-4 text-[0.9rem] leading-relaxed">
        <div>
          <h2 className="font-semibold text-navy">{t("a11yTargetH")}</h2>
          <p className="mt-1">{t("a11yTarget")}</p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">{t("a11yMethodH")}</h2>
          <p className="mt-1">{t("a11yMethod")}</p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">{t("a11yGapsH")}</h2>
          <p className="mt-1">{t("a11yGaps")}</p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">{t("a11yDateH")}</h2>
          <p className="mt-1">{t("a11yDate")}</p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">{t("a11yFeedbackH")}</h2>
          <p className="mt-1">{t("a11yFeedback")}</p>
        </div>
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-[0.85rem]">
          <Link to="/legal" className="font-semibold text-navy underline">
            {t("legalLink")}
          </Link>
          <Link to="/privacy" className="font-semibold text-navy underline">
            {t("privacyLink")}
          </Link>
        </p>
      </section>
    </div>
  );
}
