import { Monitor, Smartphone, Ratio } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import {
  applyLayoutMode,
  readLayoutMode,
  writeLayoutMode,
  type LayoutMode,
} from "@/lib/layout-mode";

const CYCLE: LayoutMode[] = ["auto", "mobile", "desktop"];

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

  if (compact) {
    const next = CYCLE[(CYCLE.indexOf(mode) + 1) % CYCLE.length]!;
    return (
      <button
        type="button"
        aria-label={t(ariaKey(mode))}
        title={t(ariaKey(mode))}
        className={cn(
          "inline-flex min-h-10 items-center gap-1 rounded-full px-2.5 text-[0.68rem] font-semibold sm:min-h-11 sm:px-3 sm:text-[0.72rem]",
          onNavy
            ? "border border-[#f3f0e9]/30 bg-navy-2/55 text-[#f3f0e9]/95"
            : "border border-line bg-card text-muted",
        )}
        onClick={() => choose(next)}
      >
        <ModeIcon mode={mode} />
        <span className="hidden sm:inline">{t(labelKey(mode))}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("layoutToggle")}>
      <span className="text-[0.75rem] text-muted">{t("layoutToggle")}</span>
      {CYCLE.map((option) => (
        <button
          key={option}
          type="button"
          aria-label={t(ariaKey(option))}
          aria-pressed={mode === option}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-md border px-2.5 text-[0.75rem] font-semibold",
            mode === option
              ? onNavy
                ? "border-[#f3f0e9]/40 bg-[#f3f0e9] text-brand"
                : "border-brand bg-brand text-paper"
              : onNavy
                ? "border-[#f3f0e9]/25 bg-navy-2/40 text-[#f3f0e9]/90"
                : "border-line bg-card text-muted",
          )}
          onClick={() => choose(option)}
        >
          <ModeIcon mode={option} />
          {t(labelKey(option))}
        </button>
      ))}
    </div>
  );
}
