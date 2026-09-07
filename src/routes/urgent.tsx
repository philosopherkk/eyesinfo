import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { TOPICS } from "@/data/topics";
import { localizeTopic, localizedUrgent, useI18n } from "@/i18n";
import { pageHead } from "@/lib/page-seo";

export const Route = createFileRoute("/urgent")({
  head: () =>
    pageHead({
      title: "急症與盡快求醫",
      description:
        "立即急症室與盡快散瞳眼底評估的教育指引。無法自行前往急症室：致電 999。本站不作轉介。",
      path: "/urgent",
    }),
  component: UrgentPage,
});

/** Existing chem / GCA first; then symptoms already listed on this page. */
const RELATED_TOPIC_IDS = ["t-chem", "t-gca", "t-rvo", "d8", "d4"] as const;

function Call999() {
  const { t } = useI18n();
  return (
    <a
      // compliance-allow: tel:9
      href="tel:999"
      className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-paper px-4 text-[1rem] font-semibold text-danger no-underline"
    >
      <Phone className="size-4 shrink-0" strokeWidth={2.2} aria-hidden />
      {t("call999")}
    </a>
  );
}

function UrgentPage() {
  const { t, locale } = useI18n();
  const { flags, same } = localizedUrgent(locale);
  return (
    <div className="px-4 pt-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <h1 className="text-[1.35rem] font-semibold text-danger">{t("urgentTitle")}</h1>
      <p className="mt-2 text-[0.92rem] leading-relaxed">{t("urgentLead")}</p>

      <section className="mt-5 rounded-xl bg-danger px-4 py-4 text-paper">
        <h2 className="text-[1rem] font-semibold">{t("urgent999")}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9rem] leading-relaxed">
          {flags.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <Call999 />
      </section>

      <section className="mt-5 rounded-xl bg-danger px-4 py-4 text-paper">
        <h2 className="text-[1rem] font-semibold">{t("chemH")}</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[0.9rem] leading-relaxed">
          <li>{t("chem1")}</li>
          <li>{t("chem2")}</li>
          <li>{t("chem3")}</li>
          <li>{t("chem4")}</li>
        </ol>
        <Call999 />
      </section>

      <section className="mt-5">
        <h2 className="text-[1rem] font-semibold text-navy">{t("sameDayH")}</h2>
        <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">{t("sameDayP")}</p>
        <ul className="mt-3 space-y-2">
          {same.map((s) => (
            <li key={s} className="rounded-lg border border-line bg-card px-3 py-2.5 text-[0.92rem]">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <p className="mb-2 text-[0.8rem] font-semibold text-muted">{t("related")}</p>
        <div className="flex flex-wrap gap-2">
          {RELATED_TOPIC_IDS.slice(0, 2).map((id) => (
            <RelatedTopicLink key={id} topicId={id} locale={locale} />
          ))}
          <Link
            to="/c/$catId"
            params={{ catId: "surface" }}
            className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
          >
            {t("cat_surface")}
          </Link>
          {RELATED_TOPIC_IDS.slice(2).map((id) => (
            <RelatedTopicLink key={id} topicId={id} locale={locale} />
          ))}
        </div>
      </section>

      <p className="mt-6 text-[0.88rem] leading-relaxed text-muted">{t("urgentFollow")}</p>
      <p className="mt-3 text-[0.8rem] leading-relaxed text-faint">
        <Link to="/legal" className="text-navy underline">
          {t("legalLink")}
        </Link>
      </p>
    </div>
  );
}

function RelatedTopicLink({
  topicId,
  locale,
}: {
  topicId: (typeof RELATED_TOPIC_IDS)[number];
  locale: Parameters<typeof localizeTopic>[1];
}) {
  const topic = TOPICS.find((x) => x.id === topicId);
  if (!topic) return null;
  const loc = localizeTopic(topic, locale);
  return (
    <Link
      to="/t/$topicId"
      params={{ topicId }}
      className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
    >
      {loc.title}
    </Link>
  );
}
