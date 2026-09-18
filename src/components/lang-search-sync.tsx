import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { usePrefs } from "@/lib/prefs";
import type { Locale } from "@/i18n/locale";

/**
 * When deep locale URLs redirect to `?lang=…`, persist that locale into prefs
 * and strip the query so the rest of the SPA stays clean.
 */
export function LangSearchSync() {
  const setLocale = usePrefs((s) => s.setLocale);
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(
      searchStr.startsWith("?") ? searchStr.slice(1) : searchStr,
    );
    const raw = params.get("lang");
    let locale: Locale | null = null;
    if (raw === "en" || raw === "ja" || raw === "zh-Hans" || raw === "zh-Hant") locale = raw;
    if (raw === "zh-CN" || raw === "zh-cn") locale = "zh-Hans";
    if (!locale) return;
    setLocale(locale);
    params.delete("lang");
    const q = params.toString();
    const next = `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", next);
  }, [searchStr, setLocale]);

  return null;
}
