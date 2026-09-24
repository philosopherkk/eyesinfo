import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { LocaleHrefLink } from "@/components/locale-href";
import { RESOURCE_GROUPS } from "@/data/resources";
import { useI18n } from "@/i18n";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch } from "@/lib/locale-path";
import { uiText } from "@/lib/ui-text";

export const Route = createFileRoute("/resources")({
  head: ({ match }) => {
    const locale = localeFromMatch(match);
    return pageHead({
      title: uiText(locale, "resourcesTitle"),
      description: uiText(locale, "resourcesIntro"),
      path: "/resources",
      locale,
    });
  },
  component: ResourcesPage,
});

function ResourcesPage() {
  const { t, locale } = useI18n();

  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("resourcesTitle")}</h1>
      <p className="mt-3 text-[0.92rem] leading-relaxed">{t("resourcesIntro")}</p>

      <p className="mt-4 text-[0.88rem] leading-relaxed text-muted">
        {t("resourcesDisclaimerBefore")}
        <LocaleHrefLink path="/urgent" className="font-semibold text-navy underline">
          {t("urgent")}
        </LocaleHrefLink>
        {t("resourcesDisclaimerAfter")}
      </p>

      <div className="mt-6 space-y-7">
        {RESOURCE_GROUPS.map((group) => (
          <section key={group.id} aria-labelledby={`res-${group.id}`}>
            <h2 id={`res-${group.id}`} className="text-[1.02rem] font-semibold text-navy">
              {t(group.headingKey)}
            </h2>
            <ul className="mt-3 space-y-4">
              {group.links.map((link) => {
                const href = link.hrefFor(locale);
                return (
                  <li
                    key={link.id}
                    className="border-b border-line pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="text-[0.92rem] font-semibold text-ink">{t(link.orgKey)}</p>
                    <p className="mt-0.5 text-[0.88rem] text-ink">{t(link.titleKey)}</p>
                    <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">
                      {t(link.descKey)}
                    </p>
                    <p className="mt-2 break-all text-[0.8rem]">
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        referrerPolicy="no-referrer"
                        className="font-medium text-navy underline underline-offset-2"
                      >
                        {href}
                      </a>
                      <span className="ml-2 inline-flex items-center gap-0.5 whitespace-nowrap text-[0.75rem] text-muted">
                        {t("resourcesExternal")}
                        <ExternalLink className="size-3 shrink-0" aria-hidden />
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-8 flex flex-wrap gap-x-3 gap-y-1 text-[0.8rem]">
        <LocaleHrefLink path="/legal" className="text-navy underline">
          {t("legalLink")}
        </LocaleHrefLink>
        <LocaleHrefLink path="/privacy" className="text-navy underline">
          {t("privacyLink")}
        </LocaleHrefLink>
        <LocaleHrefLink path="/accessibility" className="text-navy underline">
          {t("a11yLink")}
        </LocaleHrefLink>
      </p>
    </div>
  );
}
