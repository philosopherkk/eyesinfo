import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import {
  applyTheme,
  readThemePref,
  writeThemePref,
  type ThemePref,
} from "@/lib/theme";

const CYCLE: ThemePref[] = ["light", "dark", "system"];

function labelKey(pref: ThemePref): "themeLight" | "themeDark" | "themeSystem" {
  if (pref === "light") return "themeLight";
  if (pref === "dark") return "themeDark";
  return "themeSystem";
}

function ariaKey(
  pref: ThemePref,
): "themeAriaLight" | "themeAriaDark" | "themeAriaSystem" {
  if (pref === "light") return "themeAriaLight";
  if (pref === "dark") return "themeAriaDark";
  return "themeAriaSystem";
}

function PrefIcon({ pref }: { pref: ThemePref }) {
  if (pref === "dark") return <Moon className="size-3.5" strokeWidth={2.2} aria-hidden />;
  if (pref === "system") return <Monitor className="size-3.5" strokeWidth={2.2} aria-hidden />;
  return <Sun className="size-3.5" strokeWidth={2.2} aria-hidden />;
}

/**
 * Appearance toggle only — no clinical claims. Persists eyesinfo.theme on-device.
 */
export function ThemeControl({
  compact,
  surface = "paper",
}: {
  compact?: boolean;
  /** navy = sticky header; paper = home display options */
  surface?: "navy" | "paper";
}) {
  const { t } = useI18n();
  const [pref, setPref] = useState<ThemePref>("system");

  useEffect(() => {
    const initial = readThemePref();
    setPref(initial);
    applyTheme(initial);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      const current = readThemePref();
      if (current === "system") applyTheme("system");
    };
    mq.addEventListener("change", onScheme);
    return () => mq.removeEventListener("change", onScheme);
  }, []);

  const choose = (next: ThemePref) => {
    setPref(next);
    writeThemePref(next);
  };

  const onNavy = surface === "navy";

  if (compact) {
    const next = CYCLE[(CYCLE.indexOf(pref) + 1) % CYCLE.length]!;
    return (
      <button
        type="button"
        aria-label={t(ariaKey(pref))}
        title={t(ariaKey(pref))}
        className={cn(
          "inline-flex min-h-10 items-center gap-1 rounded-full px-2.5 text-[0.68rem] font-semibold sm:min-h-11 sm:px-3 sm:text-[0.72rem]",
          onNavy
            ? "border border-[#f3f0e9]/30 bg-navy-2/55 text-[#f3f0e9]/95"
            : "border border-line bg-card text-muted",
        )}
        onClick={() => choose(next)}
      >
        <PrefIcon pref={pref} />
        <span className="hidden sm:inline">{t(labelKey(pref))}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("themeToggle")}>
      <span className="text-[0.75rem] text-muted">{t("themeToggle")}</span>
      {CYCLE.map((option) => (
        <button
          key={option}
          type="button"
          aria-label={t(ariaKey(option))}
          aria-pressed={pref === option}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-md border px-2.5 text-[0.75rem] font-semibold",
            pref === option
              ? onNavy
                ? "border-[#f3f0e9]/40 bg-[#f3f0e9] text-brand"
                : "border-brand bg-brand text-paper"
              : onNavy
                ? "border-[#f3f0e9]/25 bg-navy-2/40 text-[#f3f0e9]/90"
                : "border-line bg-card text-muted",
          )}
          onClick={() => choose(option)}
        >
          <PrefIcon pref={option} />
          {t(labelKey(option))}
        </button>
      ))}
    </div>
  );
}
