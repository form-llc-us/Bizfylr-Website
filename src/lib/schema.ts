import { absoluteUrl } from "@/lib/utils";
import { SITE } from "@/data/site";

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  const sameAs = [
    SITE.socials.facebook,
    SITE.socials.instagram,
    SITE.socials.linkedin,
    SITE.socials.x,
    SITE.socials.youtube
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.countryCode
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      email: SITE.email,
      contactType: "customer support",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Hindi"]
    },
    sameAs
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en"
  };
}

export function breadcrumbSchema(
  items: Array<{
    name: string;
    href: string;
  }>
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href)
    }))
  };
}

export function faqSchema(
  faqs: Array<{
    question: string;
    answer: string;
  }>
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  url: string;
  areaServed?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: input.name,
    name: input.name,
    description: input.description,
    provider: {
      "@type": "Organization",
      name: SITE.legalName,
      url: SITE.url
    },
    areaServed: input.areaServed ?? "Worldwide",
    url: absoluteUrl(input.url)
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  url: string;
  dateModified?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    author: {
      "@type": "Organization",
      name: SITE.legalName
    },
    publisher: {
      "@type": "Organization",
      name: SITE.legalName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(SITE.logo)
      }
    },
    mainEntityOfPage: absoluteUrl(input.url),
    url: absoluteUrl(input.url),
    ...(input.dateModified ? { dateModified: input.dateModified } : {})
  };
}
