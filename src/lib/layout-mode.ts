/** On-device layout override. Viewport CSS is default; not uploaded. */
export const LAYOUT_STORAGE_KEY = "eyesinfo.layoutMode";

export type LayoutMode = "auto" | "mobile" | "desktop";

export const LAYOUT_MODES: readonly LayoutMode[] = ["auto", "mobile", "desktop"];

export function isLayoutMode(v: unknown): v is LayoutMode {
  return v === "auto" || v === "mobile" || v === "desktop";
}

/** Read stored mode; missing/invalid → auto (follow viewport width). */
export function readLayoutMode(): LayoutMode {
  try {
    const v = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (isLayoutMode(v)) return v;
  } catch {
    /* private mode / blocked storage */
  }
  return "auto";
}

/** Apply data-layout on <html>. auto = viewport media; mobile/desktop force. */
export function applyLayoutMode(mode: LayoutMode): LayoutMode {
  document.documentElement.setAttribute("data-layout", mode);
  return mode;
}

export function writeLayoutMode(mode: LayoutMode): LayoutMode {
  try {
    if (mode === "auto") localStorage.removeItem(LAYOUT_STORAGE_KEY);
    else localStorage.setItem(LAYOUT_STORAGE_KEY, mode);
  } catch {
    /* ignore quota / private mode */
  }
  return applyLayoutMode(mode);
}

/**
 * FOUC-safe boot: runs before paint. Keep in sync with read/apply above.
 * Sets data-layout to auto | mobile | desktop (never UA sniffing).
 */
export const LAYOUT_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(LAYOUT_STORAGE_KEY)};var v=localStorage.getItem(k);var r=document.documentElement;r.setAttribute("data-layout",v==="mobile"||v==="desktop"||v==="auto"?v:"auto");}catch(e){try{document.documentElement.setAttribute("data-layout","auto");}catch(_){}}})();`;
