import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { useI18n } from "@/i18n";
import { hrefWithLang } from "@/lib/locale-path";
import { absolutePublicUrl, isShareAbort, sharePayload } from "@/lib/share";
import { cn } from "@/lib/utils";

/**
 * Share the canonical public topic/tool URL.
 * Phones: Web Share API when available. Otherwise copy link + 已複製.
 */
export function ShareButton({
  path,
  pageTitle,
  className,
}: {
  /** Site path beginning with `/`, e.g. `/t/t-cataract` or `/iol`. */
  path: string;
  pageTitle: string;
  className?: string;
}) {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const label = copied ? t("shareCopied") : t("share");

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  async function onShare() {
    const url = absolutePublicUrl(hrefWithLang(path, locale));
    const payload = sharePayload(pageTitle, url);
    if (typeof navigator.share === "function") {
      const allowed =
        typeof navigator.canShare !== "function" || navigator.canShare(payload);
      if (allowed) {
        try {
          await navigator.share(payload);
          return;
        } catch (err) {
          if (isShareAbort(err)) return;
        }
      }
    }
    await copyUrl(url);
  }

  return (
    <button
      type="button"
      onClick={() => void onShare()}
      aria-label={label}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[0.85rem] font-semibold no-print transition-colors sm:px-3.5",
        copied
          ? "bg-navy text-paper"
          : "border-2 border-navy bg-card text-navy",
        className,
      )}
    >
      {copied ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Share2 className="size-4" aria-hidden />
      )}
      <span aria-hidden="true" className="hidden sm:inline">
        {label}
      </span>
    </button>
  );
}
