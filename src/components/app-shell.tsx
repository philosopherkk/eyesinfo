import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Bookmark, Home, LayoutGrid, Phone, Search } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePrefs } from "@/lib/prefs";
import { useI18n } from "@/i18n";
import { LOCALES } from "@/i18n/locale";
import { LangSwitch } from "@/components/lang-switch";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LocaleHrefLink, SpaHref } from "@/components/locale-href";
import { CONTENT_VERSION, COPYRIGHT_LINE, PUBLIC_ORIGIN } from "@/lib/site";
import { EDITORIAL } from "@/data/editorial";
import { LegalBanner } from "@/components/legal-banner";
import { LegalShortLine } from "@/components/legal-short-line";
import { ThemeControl } from "@/components/theme-control";
import { LayoutControl } from "@/components/layout-control";
import { applyTheme, readThemePref } from "@/lib/theme";
import { applyLayoutMode, readLayoutMode } from "@/lib/layout-mode";
import { hrefWithLang, isLocaleHomePath, pathForLocale } from "@/lib/locale-path";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fontPx = usePrefs((s) => s.fontPx);
  const { t, locale } = useI18n();
  const isHome = isLocaleHomePath(pathname);
  const homeHref = pathForLocale(locale);

  const tabs = [
    {
      path: homeHref,
      label: t("home"),
      icon: Home,
      // Visual highlight for education browsing (/c /t); aria-current only on true home.
      match: (p: string) =>
        isLocaleHomePath(p) || p.startsWith("/c/") || p.startsWith("/t/"),
      ariaCurrentPage: (p: string) => isLocaleHomePath(p),
    },
    { path: "/search", label: t("search"), icon: Search, match: (p: string) => p.startsWith("/search"), ariaCurrentPage: (p: string) => p.startsWith("/search") },
    { path: "/tools", label: t("tools"), icon: LayoutGrid, match: (p: string) => p.startsWith("/tools") || p.startsWith("/amsler") || p.startsWith("/iol"), ariaCurrentPage: (p: string) => p.startsWith("/tools") || p.startsWith("/amsler") || p.startsWith("/iol") },
    { path: "/saved", label: t("saved"), icon: Bookmark, match: (p: string) => p.startsWith("/saved"), ariaCurrentPage: (p: string) => p.startsWith("/saved") },
  ] as const;

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontPx}px`;
  }, [fontPx]);

  useEffect(() => {
    const htmlLang = LOCALES.find((l) => l.id === locale)?.htmlLang ?? "zh-Hant";
    document.documentElement.lang = htmlLang;
  }, [locale]);

  useEffect(() => {
    applyTheme(readThemePref());
    applyLayoutMode(readLayoutMode());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      if (readThemePref() === "system") applyTheme("system");
    };
    mq.addEventListener("change", onScheme);
    return () => mq.removeEventListener("change", onScheme);
  }, []);

  useEffect(() => {
    const onCopy = (e: ClipboardEvent) => {
      const sel = window.getSelection()?.toString() ?? "";
      if (sel.length < 48 || !e.clipboardData) return;
      e.clipboardData.setData("text/plain", `${sel.trim()}\n\n${t("copyClip")}`);
      e.preventDefault();
    };
    document.addEventListener("copy", onCopy);
    return () => document.removeEventListener("copy", onCopy);
  }, [t]);

  return (
    <div
      className="mx-auto flex min-h-dvh max-w-lg flex-col bg-paper text-ink layout-lg:max-w-5xl"
      data-site="eyesinfo.org"
      data-copyright={COPYRIGHT_LINE}
    >
      <a href="#main-content" className="skip-link">
        {t("skipToContent")}
      </a>

      <header
        className="sticky top-0 z-30 border-b border-line/80 bg-brand text-paper no-print"
        data-locale={locale}
        style={{ paddingTop: "max(0.35rem, env(safe-area-inset-top))" }}
      >
        <div className="flex items-center justify-between gap-2 px-3 pb-1.5 pt-0.5 sm:px-4 sm:pb-2 sm:pt-1 layout-lg:px-6">
          <SpaHref
            href={homeHref}
            className="flex min-h-10 min-w-0 items-center gap-2 no-underline sm:min-h-11 sm:gap-2.5"
          >
            <img
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="size-7 shrink-0 rounded-md sm:size-8"
            />
            <span className="flex min-w-0 items-baseline gap-2 leading-tight">
              <span className="whitespace-nowrap text-[0.88rem] font-semibold tracking-tight sm:text-[0.95rem] layout-lg:text-[1rem]">
                {t("brand")}
              </span>
              <span className="hidden truncate text-[0.68rem] text-paper/80 sm:inline layout-lg:text-[0.72rem]">
                {t("brandSub")}
              </span>
            </span>
          </SpaHref>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeControl compact surface="navy" />
            <LayoutControl compact surface="navy" />
            {/* On home, language lives in 「顯示選項」; keep it here on other pages. */}
            {!isHome ? <LangSwitch compact /> : null}
            <SpaHref
              href={hrefWithLang("/urgent", locale)}
              className="urgent-on-danger inline-flex min-h-10 items-center gap-1 rounded-full bg-danger px-2.5 text-[0.72rem] font-semibold text-paper no-underline sm:min-h-11 sm:px-3.5 sm:text-[0.75rem]"
            >
              <Phone className="size-3.5" strokeWidth={2.2} aria-hidden />
              {t("urgent")}
            </SpaHref>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))]"
        tabIndex={-1}
      >
        <LegalShortLine />
        <Breadcrumbs />
        {children}
        <div className="mt-8 no-print">
          <LegalBanner />
        </div>
        <footer className="px-4 pb-5 pt-4 text-center text-[0.7rem] leading-relaxed text-muted no-print layout-lg:px-6">
          <p>
            {t("reviewed")}：{EDITORIAL.reviewedIso}
          </p>
          <p className="mt-1">
            {t("siteVersionLabel")}：{CONTENT_VERSION}
          </p>
          <p className="mt-1">{t("langAuthority")}</p>
          <p className="mt-1">
            {t("copyFoot")}
            <span aria-hidden="true"> · </span>
            <a href={PUBLIC_ORIGIN} className="text-muted underline-offset-2 hover:underline">
              eyesinfo.org
            </a>
          </p>
          <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <LocaleHrefLink path="/legal" className="text-navy underline">
              {t("legalLink")}
            </LocaleHrefLink>
            <LocaleHrefLink path="/privacy" className="text-navy underline">
              {t("privacyLink")}
            </LocaleHrefLink>
            <LocaleHrefLink path="/accessibility" className="text-navy underline">
              {t("a11yLink")}
            </LocaleHrefLink>
          </p>
        </footer>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg border-t border-line bg-card no-print layout-lg:max-w-5xl"
        aria-label={t("navMain")}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4">
          {tabs.map((tab) => {
            const active = tab.match(pathname);
            const Icon = tab.icon;
            return (
              <li key={tab.path}>
                <LocaleHrefLink
                  path={tab.path}
                  aria-current={tab.ariaCurrentPage(pathname) ? "page" : undefined}
                  className={cn(
                    "flex min-h-[3.65rem] flex-col items-center justify-center gap-0.5 text-[0.7rem] no-underline",
                    active ? "font-semibold text-navy" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} aria-hidden />
                  {tab.label}
                </LocaleHrefLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
