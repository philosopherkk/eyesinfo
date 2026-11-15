import { Converter } from "opencc-js";

const toCn = Converter({ from: "hk", to: "cn" });

/**
 * OpenCC hk→cn leaves some 於 residues (e.g. 「相對高於單焦」→「相对高於单焦»).
 * One-line post-map: any leftover 於 → 于. Not a site-wide 简 audit.
 */
export function toHans(s: string): string {
  return toCn(s).replaceAll("於", "于");
}
