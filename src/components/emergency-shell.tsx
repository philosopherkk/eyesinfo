import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

type Props = {
  /** Compact home / acute-topic banner (links to /urgent). */
  variant?: "banner" | "block";
  className?: string;
};

/**
 * Shared emergency copy (zh / zh-Hans / en / ja). Used on home, acute topics,
 * and the urgent page so offline-saved views keep the same Exact 1.46 wording.
 */
export function EmergencyShell({ variant = "banner", className }: Props) {
  const { t } = useI18n();
  const body = (
    <span>
      <span className="block text-[0.9rem] font-semibold">{t("homeUrgentTitle")}</span>
      <span className="mt-0.5 block text-[0.8rem] leading-snug text-paper/90">
        {t("homeUrgentBody")}
      </span>
      <span className="mt-1.5 block text-[0.8rem] leading-snug text-paper/90">
        {t("emergencyDoNotDrive")}
      </span>
      <span className="mt-1 block text-[0.78rem] leading-snug text-paper/85">
        {t("emergencyCannotTravel")}
      </span>
    </span>
  );

  if (variant === "block") {
    return (
      <aside
        className={cn(
          "rounded-xl bg-danger px-3.5 py-3 text-paper",
          className,
        )}
        aria-label={t("homeUrgentTitle")}
      >
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
          {body}
        </div>
      </aside>
    );
  }

  return (
    <Link
      to="/urgent"
      className={cn(
        "flex items-start gap-3 rounded-xl bg-danger px-3.5 py-3 text-paper no-underline",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
      {body}
    </Link>
  );
}
