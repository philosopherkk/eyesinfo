import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Home, LayoutGrid, Phone, Search } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePrefs } from "@/lib/prefs";
import { useI18n } from "@/i18n";
import { LOCALES } from "@/i18n/locale";
import { LangSwitch } from "@/components/lang-switch";
import { CONTENT_UPDATED, CONTENT_VERSION, COPYRIGHT_LINE, PUBLIC_ORIGIN } from "@/lib/site";
import { LegalBanner } from "@/components/legal-banner";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fontPx = usePrefs((s) => s.fontPx);
  const { t, locale } = useI18n();

  const tabs = [
    { to: "/", label: t("home"), icon: Home, match: (p: string) => p === "/" || p.startsWith("/c/") || p.startsWith("/t/") },
    { to: "/search", label: t("search"), icon: Search, match: (p: string) => p.startsWith("/search") },
    { to: "/tools", label: t("tools"), icon: LayoutGrid, match: (p: string) => p.startsWith("/tools") || p.startsWith("/amsler") || p.startsWith("/iol") },
    { to: "/saved", label: t("saved"), icon: Bookmark, match: (p: string) => p.startsWith("/saved") },
  ] as const;

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontPx}px`;
  }, [fontPx]);

  useEffect(() => {
    const htmlLang = LOCALES.find((l) => l.id === locale)?.htmlLang ?? "zh-Hant";
    document.documentElement.lang = htmlLang;
  }, [locale]);

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
      className="mx-auto flex min-h-dvh max-w-lg flex-col bg-paper text-ink"
      data-site="eyesinfo.org"
      data-copyright={COPYRIGHT_LINE}
    >
      <header
        className="sticky top-0 z-30 border-b border-line/80 bg-navy text-paper"
        data-locale={locale}
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <div className="flex items-center justify-between px-4 pb-2">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <img
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-md"
            />
            <span className="leading-tight">
              <span className="block text-[0.95rem] font-semibold tracking-tight">
                {t("brand")}
              </span>
              <span className="block text-[0.68rem] text-paper/70">
                {t("brandSub")}
              </span>
            </span>
          </Link>
          <Link
            to="/urgent"
            className="inline-flex h-9 items-center gap-1 rounded-full bg-danger px-3 text-[0.75rem] font-semibold text-paper no-underline"
          >
            <Phone className="size-3.5" strokeWidth={2.2} />
            {t("urgent")}
          </Link>
        </div>
        <div className="flex justify-end px-4 pb-2">
          <LangSwitch compact />
        </div>
      </header>

      <main className="flex-1 pb-24">
        {children}
        <div className="mt-8">
          <LegalBanner />
        </div>
        <p className="px-4 pb-5 pt-4 text-center text-[0.7rem] leading-relaxed text-faint">
          {t("contentVer")} {CONTENT_VERSION}
          <span aria-hidden="true"> · </span>
          {t("contentUpdated")} {CONTENT_UPDATED}
          <span className="mt-1 block">
            {t("copyFoot")}
            <span aria-hidden="true"> · </span>
            <a href={PUBLIC_ORIGIN} className="text-faint no-underline">
              eyesinfo.org
            </a>
          </span>
        </p>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg border-t border-line bg-card/95 backdrop-blur-md"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4">
          {tabs.map((tab) => {
            const active = tab.match(pathname);
            const Icon = tab.icon;
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-0.5 text-[0.7rem] no-underline",
                    active ? "font-semibold text-navy" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
