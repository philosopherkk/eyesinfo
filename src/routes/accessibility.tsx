import { createFileRoute } from "@tanstack/react-router";
import { LocaleHrefLink } from "@/components/locale-href";
import { useI18n } from "@/i18n";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch } from "@/lib/locale-path";
import { uiText } from "@/lib/ui-text";
import { seoDescriptionFor } from "@/lib/seo-description";

export const Route = createFileRoute("/accessibility")({
  head: ({ match }) => {
    const locale = localeFromMatch(match);
    return pageHead({
      title: uiText(locale, "a11yTitle"),
      description: seoDescriptionFor(
        "/accessibility",
        locale,
        uiText(locale, "a11yIntro"),
      ),
      path: "/accessibility",
      locale,
    });
  },
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
          <LocaleHrefLink path="/legal" className="font-semibold text-navy underline">
            {t("legalLink")}
          </LocaleHrefLink>
          <LocaleHrefLink path="/privacy" className="font-semibold text-navy underline">
            {t("privacyLink")}
          </LocaleHrefLink>
        </p>
      </section>
    </div>
  );
}
