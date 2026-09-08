import { Bookmark, BookmarkCheck } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * Local-device save toggle for topics and education tools.
 * Persists via prefs.saved → /saved. Not an account or booking control.
 */
export function SaveButton({
  saveId,
  className,
}: {
  /** Topic id, or toolSaveKey(toolId). */
  saveId: string;
  className?: string;
}) {
  const saved = usePrefs((s) => s.saved.includes(saveId));
  const toggleSaved = usePrefs((s) => s.toggleSaved);
  const { t } = useI18n();
  const label = saved ? t("bookmarked") : t("bookmark");

  return (
    <button
      type="button"
      onClick={() => toggleSaved(saveId)}
      aria-pressed={saved}
      aria-label={label}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[0.85rem] font-semibold no-print transition-colors sm:px-3.5",
        saved
          ? "bg-navy text-paper"
          : "border-2 border-navy bg-card text-navy",
        className,
      )}
    >
      {saved ? (
        <BookmarkCheck className="size-4" aria-hidden />
      ) : (
        <Bookmark className="size-4" aria-hidden />
      )}
      {/* Icon-only on narrow viewports so long topic titles are not squeezed. */}
      <span aria-hidden="true" className="hidden sm:inline">
        {label}
      </span>
    </button>
  );
}
