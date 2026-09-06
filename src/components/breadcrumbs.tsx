import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { CATEGORIES, getTopic } from "@/data/topics";
import { TOOLS } from "@/data/tools";
import { PUBLIC_ORIGIN } from "@/lib/site";
import { localizeTopic, useI18n, TOOL_TEXT } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import type { UiKey } from "@/i18n/ui";
import { EduLink } from "@/components/edu-link";

export type Crumb = {
  label: string;
  href?: string;
};

const CAT_UI: Record<string, UiKey> = {
  lens: "cat_lens",
  lid: "cat_lid",
  glaucoma: "cat_glaucoma",
  retina: "cat_retina",
  surface: "cat_surface",
};

const STATIC_LABEL: Record<string, UiKey> = {
  "/search": "search",
  "/tools": "toolsTitle",
  "/saved": "saved",
  "/urgent": "urgentTitle",
  "/legal": "legalTitle",
  "/privacy": "privacyTitle",
  "/accessibility": "a11yTitle",
  "/clinic": "clinicTitle",
  "/install": "installTitle",
  "/qr": "qrSub",
  "/amsler": "amslerTitle",
  "/iol": "iolTitle",
};

function buildCrumbs(pathname: string, t: (k: UiKey) => string, locale: Locale): Crumb[] | null {
  if (pathname === "/" || pathname === "") return null;

  const home: Crumb = { label: t("home"), href: "/" };
  const trail: Crumb[] = [home];

  const topicMatch = pathname.match(/^\/t\/([^/]+)\/?$/);
  if (topicMatch) {
    const topic = getTopic(topicMatch[1]);
    if (topic) {
      const cat = CATEGORIES.find((c) => c.id === topic.category);
      if (cat) {
        trail.push({
          label: t(CAT_UI[cat.id]),
          href: `/c/${cat.id}`,
        });
      }
      const loc = localizeTopic(topic, locale);
      trail.push({ label: loc.title });
      return trail;
    }
  }

  const catMatch = pathname.match(/^\/c\/([^/]+)\/?$/);
  if (catMatch) {
    const cat = CATEGORIES.find((c) => c.id === catMatch[1]);
    if (cat) {
      trail.push({ label: t(CAT_UI[cat.id]) });
      return trail;
    }
  }

  const toolMatch = pathname.match(/^\/tools\/([^/]+)\/?$/);
  if (toolMatch) {
    trail.push({ label: t("toolsTitle"), href: "/tools" });
    const tool = TOOLS.find((x) => x.id === toolMatch[1]);
    if (tool) {
      const title = TOOL_TEXT[locale]?.[tool.id]?.title ?? tool.title;
      trail.push({ label: title });
    } else {
      trail.push({ label: toolMatch[1] });
    }
    return trail;
  }

  if (pathname === "/amsler" || pathname === "/iol") {
    trail.push({ label: t("toolsTitle"), href: "/tools" });
    trail.push({
      label: t(pathname === "/amsler" ? "amslerTitle" : "iolTitle"),
    });
    return trail;
  }

  if (pathname === "/tools" || pathname === "/tools/") {
    trail.push({ label: t("toolsTitle") });
    return trail;
  }

  const key = STATIC_LABEL[pathname.replace(/\/$/, "") || pathname];
  if (key) {
    trail.push({ label: t(key) });
    return trail;
  }

  const seg = pathname.split("/").filter(Boolean).pop() ?? pathname;
  trail.push({ label: seg });
  return trail;
}

function absoluteUrl(href: string): string {
  if (href.startsWith("http")) return href;
  return `${PUBLIC_ORIGIN}${href.startsWith("/") ? href : `/${href}`}`;
}

/**
 * Visible breadcrumb trail for every non-home page + BreadcrumbList JSON-LD.
 */
export function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, locale } = useI18n();
  const crumbs = useMemo(() => buildCrumbs(pathname, t, locale), [pathname, t, locale]);

  if (!crumbs || crumbs.length < 2) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href
        ? { item: absoluteUrl(c.href) }
        : i === crumbs.length - 1
          ? { item: absoluteUrl(pathname) }
          : {}),
    })),
  };

  return (
    <>
      <nav
        className="border-b border-line/60 bg-paper px-4 py-2 no-print"
        aria-label={t("breadcrumbNav")}
      >
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[0.75rem] leading-snug text-muted">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={`${crumb.label}-${i}`} className="inline-flex min-w-0 items-center gap-1">
                {i > 0 ? (
                  <ChevronRight className="size-3 shrink-0 text-faint" aria-hidden />
                ) : null}
                {last || !crumb.href ? (
                  <span
                    className="truncate font-medium text-navy"
                    aria-current={last ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <EduLink
                    href={crumb.href}
                    className="truncate text-muted no-underline underline-offset-2 hover:text-navy hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                  >
                    {crumb.label}
                  </EduLink>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

/** Tiny helper retained for typed home-only crumbs if needed elsewhere. */
export function HomeCrumbLink({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Link to="/" className={className}>
      {children}
    </Link>
  );
}
