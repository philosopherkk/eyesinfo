import type { MouseEvent, ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { hrefWithLang, pathForLocale } from "@/lib/locale-path";

/** Route link for education paths only (topics, tools, categories, static pages). */
export function EduLink({
  href,
  className,
  children,
  onClick,
  role,
  "aria-selected": ariaSelected,
  "aria-current": ariaCurrent,
  "aria-label": ariaLabel,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  role?: string;
  "aria-selected"?: boolean;
  "aria-current"?: "page" | undefined;
  "aria-label"?: string;
}) {
  const { locale } = useI18n();
  const navigate = useNavigate();
  const clean = href.replace(/\/$/, "") || "/";

  let target = clean;
  if (clean === "/") {
    target = pathForLocale(locale);
  } else if (clean === "/en" || clean === "/ja" || clean === "/zh-Hans") {
    target = clean;
  } else {
    target = hrefWithLang(clean, locale);
  }

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.();
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    void navigate({ href: target });
  }

  return (
    <a
      href={target}
      className={className}
      onClick={handleClick}
      role={role}
      aria-selected={ariaSelected}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
