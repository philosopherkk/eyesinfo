import { createFileRoute } from "@tanstack/react-router";
import { LocaleHrefLink } from "@/components/locale-href";
import { editorialBits, useI18n } from "@/i18n";
import { KEY_REFS } from "@/data/editorial";
import { toHans } from "@/i18n/hans";
import { pageHead } from "@/lib/page-seo";
import { localeFromMatch } from "@/lib/locale-path";
import { uiText } from "@/lib/ui-text";

export const Route = createFileRoute("/legal")({
  head: ({ match }) => {
    const locale = localeFromMatch(match);
    return pageHead({
      title: uiText(locale, "legalTitle"),
      description: uiText(locale, "legalIntro"),
      path: "/legal",
      locale,
    });
  },
  component: LegalPage,
});

function LegalPage() {
  const { t, legal, locale } = useI18n();
  const ed = editorialBits(locale);
  const refs =
    locale === "zh-Hans" ? KEY_REFS.map(toHans) : KEY_REFS;
  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("legalTitle")}</h1>
      <p className="mt-2 text-[0.85rem] text-muted">{t("legalIntro")}</p>
      <p className="mt-2 text-[0.85rem] text-muted">{t("langAuthority")}</p>

      <section className="mt-5 space-y-4 text-[0.9rem] leading-relaxed">
        <div>
          <h2 className="font-semibold text-navy">{t("umaoH")}</h2>
          <p className="mt-1">{legal.umao}</p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">{t("ppoH")}</h2>
          <p className="mt-1">{legal.ppo}</p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">{t("mchkH")}</h2>
          <p className="mt-1">{legal.mchk}</p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">{t("whoH")}</h2>
          <p className="mt-1">{legal.notSubstitute}</p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">{t("reviewH")}</h2>
          <p className="mt-1">
            {t("reviewed")}：{ed.reviewed}. {ed.name}，{ed.title}（{ed.register}）。
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.88rem]">
            {ed.quals.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <p className="mt-3">{ed.disclosure}</p>
          {ed.ownership ? <p className="mt-2">{ed.ownership}</p> : null}
          {ed.funding ? <p className="mt-2">{ed.funding}</p> : null}
          <p className="mt-2">{ed.correction}</p>
        </div>
        <div>
          <h2 className="font-semibold text-navy">{t("refsH")}</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-[0.88rem]">
            {refs.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-navy">{t("copyH")}</h2>
          <p className="mt-1">{t("copyP")}</p>
        </div>
        <p>
          <LocaleHrefLink path="/privacy" className="font-semibold text-navy">
            {t("privacyLink")}
          </LocaleHrefLink>
          {" · "}
          <LocaleHrefLink path="/accessibility" className="font-semibold text-navy">
            {t("a11yLink")}
          </LocaleHrefLink>
        </p>
      </section>
    </div>
  );
}
