import { AlertTriangle, Clock, Info } from "lucide-react";
import { EduLink } from "@/components/edu-link";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export type SeekCareLevel = "immediate" | "same-day" | "routine";

type Props = {
  level: SeekCareLevel;
  className?: string;
};

/**
 * Care-timing callout for topic pages.
 * immediate → A&E / 999; same-day → 應盡快（最好當日）; routine → non-urgent education.
 * Links only to this site’s 急症頁 — no clinic booking.
 */
export function SeekCareCallout({ level, className }: Props) {
  const { t } = useI18n();

  if (level === "immediate") {
    return (
      <aside
        className={cn(
          "mb-4 rounded-lg border border-danger/40 bg-danger-bg px-3.5 py-3 text-danger",
          className,
        )}
        aria-label={t("seekCareImmediateTitle")}
      >
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="min-w-0 text-[0.88rem] leading-relaxed">
            <p className="font-semibold">{t("seekCareImmediateTitle")}</p>
            <p className="mt-1">{t("seekCareImmediateBody")}</p>
            <p className="mt-1.5">
              <EduLink
                href="/urgent"
                className="font-medium underline underline-offset-2"
              >
                {t("seekCareUrgentLink")}
              </EduLink>
            </p>
          </div>
        </div>
      </aside>
    );
  }

  if (level === "same-day") {
    return (
      <aside
        className={cn(
          "mb-4 rounded-lg border border-[#c2410c]/40 bg-[#fff7ed] px-3.5 py-3 text-[#9a3412]",
          className,
        )}
        aria-label={t("seekCareSameDayTitle")}
      >
        <div className="flex items-start gap-2.5">
          <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="min-w-0 text-[0.88rem] leading-relaxed">
            <p className="font-semibold">{t("seekCareSameDayTitle")}</p>
            <p className="mt-1">{t("seekCareSameDayBody")}</p>
            <p className="mt-1.5">
              <EduLink
                href="/urgent"
                className="font-medium underline underline-offset-2"
              >
                {t("seekCareUrgentLink")}
              </EduLink>
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "mb-4 rounded-lg border border-line bg-line/25 px-3.5 py-3 text-muted",
        className,
      )}
      aria-label={t("seekCareRoutineTitle")}
    >
      <div className="flex items-start gap-2.5">
        <Info className="mt-0.5 size-4 shrink-0 text-steel" aria-hidden />
        <div className="min-w-0 text-[0.88rem] leading-relaxed">
          <p className="font-semibold text-ink">{t("seekCareRoutineTitle")}</p>
          <p className="mt-1">{t("seekCareRoutineBody")}</p>
        </div>
      </div>
    </aside>
  );
}
