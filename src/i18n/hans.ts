import { Converter } from "opencc-js";

const toCn = Converter({ from: "hk", to: "cn" });

export function toHans(s: string): string {
  return toCn(s);
}
