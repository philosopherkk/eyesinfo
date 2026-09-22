import { Monitor, Smartphone, Ratio } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import {
  applyLayoutMode,
  LAYOUT_MODES,
  readLayoutMode,
  writeLayoutMode,
  type LayoutMode,
} from "@/lib/layout-mode";

function labelKey(
  mode: LayoutMode,
): "layoutAuto" | "layoutMobile" | "layoutDesktop" {
  if (mode === "mobile") return "layoutMobile";
  if (mode === "desktop") return "layoutDesktop";
  return "layoutAuto";
}

function ariaKey(
  mode: LayoutMode,
): "layoutAriaAuto" | "layoutAriaMobile" | "layoutAriaDesktop" {
  if (mode === "mobile") return "layoutAriaMobile";
  if (mode === "desktop") return "layoutAriaDesktop";
  return "layoutAriaAuto";
}

function ModeIcon({ mode }: { mode: LayoutMode }) {
  if (mode === "mobile")
    return <Smartphone className="size-3.5" strokeWidth={2.2} aria-hidden />;
  if (mode === "desktop")
    return <Monitor className="size-3.5" strokeWidth={2.2} aria-hidden />;
  return <Ratio className="size-3.5" strokeWidth={2.2} aria-hidden />;
}

/**
 * Layout override only — viewport CSS is default; persists eyesinfo.layoutMode.
 * Adjacent 「手機版」｜「電腦版」｜「自動」 controls (not a 3-state cycle).
 * Not clinical; lives in chrome / display options.
 */
export function LayoutControl({
  compact,
  surface = "paper",
}: {
  compact?: boolean;
  /** navy = sticky header; paper = home display options */
  surface?: "navy" | "paper";
}) {
  const { t } = useI18n();
  const [mode, setMode] = useState<LayoutMode>("auto");

  useEffect(() => {
    const initial = readLayoutMode();
    setMode(initial);
    applyLayoutMode(initial);
  }, []);

  const choose = (next: LayoutMode) => {
    setMode(next);
    writeLayoutMode(next);
  };

  const onNavy = surface === "navy";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center",
        compact ? "gap-1" : "gap-2",
      )}
      role="group"
      aria-label={t("layoutToggle")}
    >
      {compact ? null : (
        <span className="text-[0.75rem] text-muted">{t("layoutToggle")}</span>
      )}
      {LAYOUT_MODES.map((option) => (
        <button
          key={option}
          type="button"
          aria-label={t(ariaKey(option))}
          aria-pressed={mode === option}
          title={t(ariaKey(option))}
          className={cn(
            "inline-flex items-center gap-1 font-semibold",
            compact
              ? "min-h-10 rounded-full px-2 text-[0.68rem] sm:min-h-11 sm:px-2.5 sm:text-[0.72rem]"
              : "min-h-11 gap-1.5 rounded-md border px-2.5 text-[0.75rem]",
            mode === option
              ? onNavy
                ? "border border-[#f3f0e9]/40 bg-[#f3f0e9] text-brand"
                : "border border-brand bg-brand text-paper"
              : onNavy
                ? "border border-[#f3f0e9]/25 bg-navy-2/40 text-[#f3f0e9]/90"
                : "border border-line bg-card text-muted",
          )}
          onClick={() => choose(option)}
        >
          {compact ? null : <ModeIcon mode={option} />}
          {t(labelKey(option))}
        </button>
      ))}
    </div>
  );
}
