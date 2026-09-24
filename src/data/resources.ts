import type { Locale } from "@/i18n/locale";

/**
 * External patient-education links for /resources.
 * URLs verified 2026-09-24 (GET 200). Locale variants only where the
 * publisher ships a matching education page; otherwise the same URL is used.
 */

export type ResourceLinkDef = {
  id: string;
  /** Organisation name (ui key). */
  orgKey:
    | "resourcesOrgGovHk"
    | "resourcesOrgStudentHealth"
    | "resourcesOrgHkos"
    | "resourcesOrgAao"
    | "resourcesOrgCleveland";
  /** Page title on the destination site (ui key). */
  titleKey:
    | "resourcesPageGovHk"
    | "resourcesPageStudentHealth"
    | "resourcesPageHkos"
    | "resourcesPageAao"
    | "resourcesPageCleveland";
  /** Our one-line neutral description (ui key). */
  descKey:
    | "resourcesDescGovHk"
    | "resourcesDescStudentHealth"
    | "resourcesDescHkos"
    | "resourcesDescAao"
    | "resourcesDescCleveland";
  hrefFor: (locale: Locale) => string;
};

export type ResourceGroupDef = {
  id: string;
  headingKey:
    | "resourcesGroupGov"
    | "resourcesGroupHkos"
    | "resourcesGroupAao"
    | "resourcesGroupCleveland";
  links: ResourceLinkDef[];
};

function govHkHref(locale: Locale): string {
  if (locale === "zh-Hans") {
    return "https://www.gov.hk/sc/residents/health/healthadvice/healthcare/eyecare.htm";
  }
  if (locale === "en" || locale === "ja") {
    return "https://www.gov.hk/en/residents/health/healthadvice/healthcare/eyecare.htm";
  }
  return "https://www.gov.hk/tc/residents/health/healthadvice/healthcare/eyecare.htm";
}

function studentHealthHref(locale: Locale): string {
  if (locale === "en" || locale === "ja") {
    return "https://www.studenthealth.gov.hk/english/health/health_ev/health_ev.html";
  }
  // 繁 / 简 — publisher’s Chinese education page
  return "https://www.studenthealth.gov.hk/tc_chi/health/health_ev/health_ev.html";
}

/** Exact HKOS Public Education URL (http — https cert does not match the host). */
export const HKOS_PUBLIC_EDUCATION_URL =
  "http://www.hkos.org.hk/?section=Top&id=3";

export const AAO_EYE_HEALTH_URL = "https://www.aao.org/eye-health";

export const CLEVELAND_EYES_URL =
  "https://my.clevelandclinic.org/health/body/21823-eyes";

export const RESOURCE_GROUPS: ResourceGroupDef[] = [
  {
    id: "gov",
    headingKey: "resourcesGroupGov",
    links: [
      {
        id: "govhk-eyecare",
        orgKey: "resourcesOrgGovHk",
        titleKey: "resourcesPageGovHk",
        descKey: "resourcesDescGovHk",
        hrefFor: govHkHref,
      },
      {
        id: "student-health-ev",
        orgKey: "resourcesOrgStudentHealth",
        titleKey: "resourcesPageStudentHealth",
        descKey: "resourcesDescStudentHealth",
        hrefFor: studentHealthHref,
      },
    ],
  },
  {
    id: "hkos",
    headingKey: "resourcesGroupHkos",
    links: [
      {
        id: "hkos-public-education",
        orgKey: "resourcesOrgHkos",
        titleKey: "resourcesPageHkos",
        descKey: "resourcesDescHkos",
        hrefFor: () => HKOS_PUBLIC_EDUCATION_URL,
      },
    ],
  },
  {
    id: "aao",
    headingKey: "resourcesGroupAao",
    links: [
      {
        id: "aao-eye-health",
        orgKey: "resourcesOrgAao",
        titleKey: "resourcesPageAao",
        descKey: "resourcesDescAao",
        hrefFor: () => AAO_EYE_HEALTH_URL,
      },
    ],
  },
  {
    id: "cleveland",
    headingKey: "resourcesGroupCleveland",
    links: [
      {
        id: "cleveland-eyes",
        orgKey: "resourcesOrgCleveland",
        titleKey: "resourcesPageCleveland",
        descKey: "resourcesDescCleveland",
        hrefFor: () => CLEVELAND_EYES_URL,
      },
    ],
  },
];
