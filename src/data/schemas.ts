import { SITE } from "@/data/site";

export const organizationSchemaSeed = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.legalName,
  url: SITE.url
} as const;

export const websiteSchemaSeed = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url
} as const;
