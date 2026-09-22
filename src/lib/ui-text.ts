import type { Locale } from "@/i18n/locale";
import { UI, type UiKey } from "@/i18n/ui";
import { toHans } from "@/i18n/hans";

/** Resolve a UI string for SSR / route `head()` (mirrors `useI18n().t` without hooks). */
export function uiText(locale: Locale, key: UiKey): string {
  let s = UI[locale][key] ?? UI["zh-Hant"][key];
  if (locale === "zh-Hans") s = toHans(s);
  return s;
}
