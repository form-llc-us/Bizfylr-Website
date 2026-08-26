import { SITE } from "@/data/site";
import { absoluteUrl } from "@/lib/utils";
import type { FaqItem, PublicBlogPost } from "@/types/blog";

type JsonLd = Record<string, unknown>;

export function createBlogArticleSchema(post: PublicBlogPost): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": post.schemaType === "BLOG_POSTING" ? "BlogPosting" : "Article",
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    image: absoluteUrl(post.ogImage || post.twitterImage || post.featuredImageUrl || "/images/og-default.avif"),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
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
    }
  };
}

export function createBlogFaqSchema(faqItems: FaqItem[]): JsonLd | null {
  if (faqItems.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function createBlogBreadcrumbSchema(post: PublicBlogPost): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE.url
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: absoluteUrl(`/blog/${post.slug}`)
      }
    ]
  };
}
