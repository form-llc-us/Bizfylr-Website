import type { Prisma } from "@prisma/client";
import type { JSONContent } from "@tiptap/core";
import type { BlogPostStatus, BlogSchemaType } from "@/lib/blog/constants";

export type TocItem = {
  id: string;
  level: number;
  text: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type BlogSeoCheckStatus = "passed" | "warning" | "failed";

export type BlogSeoCheck = {
  id: string;
  label: string;
  description: string;
  status: BlogSeoCheckStatus;
  points: number;
};

export type BlogAnalysisResult = {
  score: number;
  readabilityScore: number;
  checks: BlogSeoCheck[];
  passedChecks: BlogSeoCheck[];
  warningChecks: BlogSeoCheck[];
  failedChecks: BlogSeoCheck[];
  stats: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    internalLinkCount: number;
    externalLinkCount: number;
    imageCount: number;
    keywordDensity: number;
    readingTimeMinutes: number;
  };
};

export type InternalLinkSuggestion = {
  slug: string;
  title: string;
  url: string;
  reason: string;
  score: number;
};

export type BlogEditorPayload = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  contentJson: JSONContent;
  renderedHtml: string;
  plainText: string;
  tableOfContents: TocItem[];
  focusKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaType: BlogSchemaType;
  tags: string[];
  categories: string[];
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  seoScore: number;
  readabilityScore: number;
  status: BlogPostStatus;
  faqItems: FaqItem[];
};

export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  categories: string[];
  seoScore: number;
  readabilityScore: number;
  status: BlogPostStatus;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicBlogPost = BlogListItem & {
  contentJson: JSONContent;
  renderedHtml: string;
  plainText: string;
  tableOfContents: TocItem[];
  focusKeyword: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  schemaType: BlogSchemaType;
  faqItems: FaqItem[];
};

export type BlogPostRecord = Prisma.BlogPostGetPayload<Record<string, never>>;
