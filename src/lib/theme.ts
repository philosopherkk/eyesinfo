/** On-device appearance preference. Not uploaded; Cap 231 education chrome only. */
export const THEME_STORAGE_KEY = "eyesinfo.theme";

export type ThemePref = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_PREFS: readonly ThemePref[] = ["light", "dark", "system"];

export const THEME_COLOR_LIGHT = "#003153";
export const THEME_COLOR_DARK = "#0c1a28";

export function isThemePref(v: unknown): v is ThemePref {
  return v === "light" || v === "dark" || v === "system";
}

/** Read stored pref; missing/invalid → system (then prefers-color-scheme → light). */
export function readThemePref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePref(v)) return v;
  } catch {
    /* private mode / blocked storage */
  }
  return "system";
}

export function resolveTheme(pref: ThemePref): ResolvedTheme {
  if (pref === "light") return "light";
  if (pref === "dark") return "dark";
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function themeColorFor(resolved: ResolvedTheme): string {
  return resolved === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
}

/** Apply resolved light/dark tokens + theme-color meta. Pref kept on data-theme-pref. */
export function applyTheme(pref: ThemePref): ResolvedTheme {
  const resolved = resolveTheme(pref);
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-pref", pref);
  root.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", themeColorFor(resolved));
  return resolved;
}

export function writeThemePref(pref: ThemePref): ResolvedTheme {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* ignore quota / private mode */
  }
  return applyTheme(pref);
}

export function clearThemePref(): void {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * FOUC-safe boot: runs before paint. Keep in sync with read/resolve/apply above.
 * Sets data-theme to resolved light|dark only.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var v=localStorage.getItem(k);var dark=false;if(v==="dark")dark=true;else if(v==="light")dark=false;else dark=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=dark?"dark":"light";var r=document.documentElement;r.setAttribute("data-theme",t);r.setAttribute("data-theme-pref",v==="light"||v==="dark"||v==="system"?v:"system");r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",dark?"#0c1a28":"#003153");}catch(e){}})();`;
