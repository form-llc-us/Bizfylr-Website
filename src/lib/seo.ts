import type { Metadata } from "next";

import { SITE } from "@/data/site";
import { absoluteUrl } from "@/lib/utils";

export const defaultOpenGraph = {
  type: "website",
  siteName: SITE.name,
  images: [
    {
      url: absoluteUrl("/images/og-default.avif"),
      width: 1200,
      height: 630,
      alt: `${SITE.name} Open Graph Preview`
    }
  ]
} satisfies NonNullable<Metadata["openGraph"]>;

export const defaultTwitter = {
  card: "summary_large_image",
  images: [absoluteUrl("/images/og-default.avif")]
} satisfies NonNullable<Metadata["twitter"]>;

export function createCanonical(pathname: string) {
  return absoluteUrl(pathname);
}

function createPageTitle(title: string) {
  return title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
}

export function createMetadata(input: {
  title: string;
  description: string;
  pathname: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const image = absoluteUrl(input.image ?? "/images/og-default.avif");
  const url = createCanonical(input.pathname);
  const title = createPageTitle(input.title);

  return {
    title: {
      absolute: title
    },
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: url
    },
    openGraph: {
      ...defaultOpenGraph,
      title,
      description: input.description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      ...defaultTwitter,
      title,
      description: input.description,
      images: [image]
    }
  };
}
