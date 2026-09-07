import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { pageHead } from "@/lib/page-seo";

export const Route = createFileRoute("/clinic")({
  head: () =>
    pageHead({
      title: "本站不提供執業資料",
      description:
        "這是公眾教育網站，不提供診所地址、電話、收費或預約。急症請到急症室；無法自行前往：致電 999。",
      path: "/clinic",
    }),
  component: NoPracticePage,
});

function NoPracticePage() {
  const { t } = useI18n();
  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("clinicTitle")}</h1>
      <p className="mt-3 text-[0.92rem] leading-relaxed">{t("clinicP1")}</p>
      <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{t("clinicP2")}</p>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-navy px-4 text-[0.88rem] font-semibold text-paper no-underline"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
