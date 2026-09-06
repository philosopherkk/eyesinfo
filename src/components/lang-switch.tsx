import { LOCALES } from "@/i18n/locale";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export function LangSwitch({ compact }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div
      className={cn("flex items-center gap-1", compact ? "" : "flex-wrap")}
      role="group"
      aria-label={t("lang")}
    >
      {LOCALES.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => setLocale(l.id)}
          className={cn(
            "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2.5 text-[0.72rem] font-semibold",
            locale === l.id
              ? "bg-paper text-navy"
              : "bg-navy-2/40 text-paper/90",
          )}
          aria-pressed={locale === l.id}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
