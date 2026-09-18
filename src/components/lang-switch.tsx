import { useNavigate, useRouterState } from "@tanstack/react-router";
import { LOCALES, type Locale } from "@/i18n/locale";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { isLocaleHomePath, pathForLocale } from "@/lib/locale-path";

export function LangSwitch({
  compact,
  surface = "navy",
}: {
  compact?: boolean;
  /** navy = sticky header; paper = home display options / light chrome */
  surface?: "navy" | "paper";
}) {
  const { locale, setLocale, t } = useI18n();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onPaper = surface === "paper";
  const onLocaleHome = isLocaleHomePath(pathname);

  function pick(next: Locale) {
    setLocale(next);
    // On home / locale entry pages, keep the URL honest so /en is not a 404.
    if (onLocaleHome) {
      const target = pathForLocale(next);
      if (target !== pathname.replace(/\/$/, "") && !(target === "/" && (pathname === "/" || pathname === ""))) {
        void navigate({ href: target, replace: true });
      }
    }
  }

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
          onClick={() => pick(l.id)}
          className={cn(
            "inline-flex items-center justify-center rounded-full font-semibold",
            compact
              ? "min-h-9 min-w-9 px-2 text-[0.68rem] sm:min-h-11 sm:min-w-11 sm:px-2.5 sm:text-[0.72rem]"
              : "min-h-11 min-w-11 px-2.5 text-[0.72rem]",
            onPaper
              ? locale === l.id
                ? "bg-navy text-paper"
                : "border border-line bg-card text-muted"
              : locale === l.id
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
