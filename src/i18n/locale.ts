export type Locale = "zh-Hant" | "zh-Hans" | "en" | "ja";

export const LOCALES: { id: Locale; short: string; name: string; htmlLang: string }[] = [
  { id: "zh-Hant", short: "繁", name: "繁體中文", htmlLang: "zh-Hant" },
  { id: "zh-Hans", short: "简", name: "简体中文", htmlLang: "zh-CN" },
  { id: "en", short: "EN", name: "English", htmlLang: "en" },
  { id: "ja", short: "日", name: "日本語", htmlLang: "ja" },
];
