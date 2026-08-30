import { Link } from "@tanstack/react-router";
import { editorialBits, useI18n } from "@/i18n";

export function EditorialFooter({ toolCaveat }: { toolCaveat?: boolean }) {
  const { t, legal, locale } = useI18n();
  const ed = editorialBits(locale);
  return (
    <aside className="mt-6 space-y-2 text-[0.75rem] leading-relaxed text-faint">
      {toolCaveat ? <p>{t("toolCaveat")}</p> : null}
      <p>{legal.noServices}</p>
      <p>{legal.independent}</p>
      <p>{legal.notSubstitute}</p>
      <p>
        {t("reviewed")}：{ed.reviewed} · {ed.name} · {ed.title}（{ed.register}）
      </p>
      <p>
        <Link to="/legal" className="text-navy underline">
          {t("legalLink")}
        </Link>
        {" · "}
        <Link to="/privacy" className="text-navy underline">
          {t("privacyLink")}
        </Link>
      </p>
    </aside>
  );
}
