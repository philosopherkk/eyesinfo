import type { MouseEvent, ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { hrefWithLang } from "@/lib/locale-path";

/** `href` with `?lang=` when the active UI locale is not zh-Hant. */
export function useLocaleHref(path: string): string {
  const { locale } = useI18n();
  return hrefWithLang(path, locale);
}

type LocaleHrefLinkProps = {
  path: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
};

function useSpaHrefNavigate() {
  const navigate = useNavigate();
  return (href: string, e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    void navigate({ href });
  };
}

/**
 * Chrome / education link that preserves the active locale via `?lang=`
 * (same mechanism as `/en/…` deep redirects). Uses `navigate({ href })`
 * because typed `<Link to>` cannot carry arbitrary `?lang=` search.
 */
export function LocaleHrefLink({
  path,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: LocaleHrefLinkProps) {
  const href = useLocaleHref(path);
  const onNavigate = useSpaHrefNavigate();
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      onClick={(e) => onNavigate(href, e)}
    >
      {children}
    </a>
  );
}

/** SPA `<a href>` that keeps client routing (for dynamic locale hrefs). */
export function SpaHref({
  href,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const onNavigate = useSpaHrefNavigate();
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={(e) => onNavigate(href, e)}
    >
      {children}
    </a>
  );
}
