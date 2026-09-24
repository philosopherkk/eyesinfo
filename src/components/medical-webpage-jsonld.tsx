import type { Locale } from "@/i18n/locale";
import { canonicalUrl } from "@/lib/page-seo";
import { COPYRIGHT_HOLDER, PUBLIC_ORIGIN } from "@/lib/site";
import { seoAboutNames } from "@/lib/seo-description";

const IN_LANGUAGE: Record<Locale, string> = {
  "zh-Hant": "zh-Hant",
  "zh-Hans": "zh-Hans",
  en: "en",
  ja: "ja",
};

export type MedicalWebPageJsonLdProps = {
  /** Bare path beginning with `/` (no query). */
  path: string;
  locale: Locale;
  name: string;
  description: string;
  /** ISO date `YYYY-MM-DD` from 最近覆核 / CONTENT_UPDATED. */
  lastReviewed: string;
};

/**
 * Server-rendered MedicalWebPage JSON-LD for `/t/*` and `/c/*`.
 * No Person / Physician / Clinic / review / offer fields.
 */
export function MedicalWebPageJsonLd({
  path,
  locale,
  name,
  description,
  lastReviewed,
}: MedicalWebPageJsonLdProps) {
  const url = canonicalUrl(path);
  const aboutNames = seoAboutNames(path, locale);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name,
    description,
    url,
    inLanguage: IN_LANGUAGE[locale],
    isAccessibleForFree: true,
    lastReviewed,
    audience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
    publisher: {
      "@type": "Organization",
      name: COPYRIGHT_HOLDER,
      url: PUBLIC_ORIGIN,
    },
  };
  if (aboutNames && aboutNames.length > 0) {
    data.about =
      aboutNames.length === 1
        ? { "@type": "MedicalCondition", name: aboutNames[0] }
        : aboutNames.map((n) => ({
            "@type": "MedicalCondition",
            name: n,
          }));
  }

  return (
    <script
      type="application/ld+json"
      // JSON-LD must appear in SSR HTML for crawlers.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
