import { useI18n } from "@/i18n";

/** Shared education / self-awareness caveat for Amsler, eye map, ask-doctor, drops. */
export function EduToolCaveat() {
  const { t } = useI18n();
  return (
    <aside
      className="mb-4 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-[0.82rem] leading-relaxed text-muted"
      aria-label={t("eduToolBadge")}
    >
      <p className="font-semibold text-navy">{t("eduToolBadge")}</p>
      <p className="mt-1.5">{t("eduToolCaveat")}</p>
    </aside>
  );
}
