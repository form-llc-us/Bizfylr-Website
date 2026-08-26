import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/utils";
import { createMetadata, defaultOpenGraph, defaultTwitter } from "@/lib/seo";
import type { PublicBlogPost } from "@/types/blog";

export function createBlogMetadata(post: PublicBlogPost): Metadata {
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const image = post.ogImage || post.twitterImage || post.featuredImageUrl || "/images/og-default.avif";
  const canonical = post.canonicalUrl || absoluteUrl(`/blog/${post.slug}`);

  return {
    ...createMetadata({
      title,
      description,
      pathname: `/blog/${post.slug}`,
      image
    }),
    alternates: {
      canonical
    },
    openGraph: {
      ...defaultOpenGraph,
      type: "article",
      title: post.ogTitle || title,
      description: post.ogDescription || description,
      url: canonical,
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || title
        }
      ],
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString()
    },
    twitter: {
      ...defaultTwitter,
      title: post.twitterTitle || post.ogTitle || title,
      description: post.twitterDescription || post.ogDescription || description,
      images: [absoluteUrl(post.twitterImage || image)]
    }
  };
}
