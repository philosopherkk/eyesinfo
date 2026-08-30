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
            "h-8 min-w-8 rounded-full px-2 text-[0.72rem] font-semibold",
            locale === l.id
              ? "bg-paper text-navy"
              : "bg-navy-2/40 text-paper/85",
          )}
          aria-pressed={locale === l.id}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
