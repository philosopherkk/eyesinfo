import { useEffect } from "react";
import { Outlet } from "@tanstack/react-router";
import { usePrefs } from "@/lib/prefs";
import type { Locale } from "@/i18n/locale";

/**
 * Layout for `/en`, `/ja`, `/zh-Hans`.
 * Persists the URL locale into prefs so leaving the prefix keeps the language.
 * Effective UI locale is driven by the URL in `useI18n` (SSR-safe).
 */
export function LocaleLayout({ locale }: { locale: Locale }) {
  const setLocale = usePrefs((s) => s.setLocale);

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  // Persist rehydration can overwrite URL-driven locale with stale localStorage.
  useEffect(() => {
    const persist = usePrefs.persist;
    const apply = () => setLocale(locale);
    if (persist.hasHydrated()) apply();
    return persist.onFinishHydration(apply);
  }, [locale, setLocale]);

  return <Outlet />;
}
