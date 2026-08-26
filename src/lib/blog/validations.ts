import { z } from "zod";
import { isAllowedBlogImageUrl } from "@/lib/blog/images";
import { BlogPostStatus, BlogSchemaType } from "@/lib/blog/constants";

const optionalTrimmedString = z.string().trim().optional().or(z.literal(""));
const optionalBlogImageUrl = optionalTrimmedString.refine(isAllowedBlogImageUrl, {
  message: "Use an uploaded Bizfylr image or an approved HTTPS image URL."
});

export const faqItemSchema = z.object({
  question: z.string().trim().min(3, "FAQ question must be at least 3 characters.").max(180),
  answer: z.string().trim().min(6, "FAQ answer must be at least 6 characters.").max(1200)
});

export const blogPostInputSchema = z.object({
  id: z.string().trim().optional(),
  title: z.string().trim().min(10, "Title must be at least 10 characters.").max(180),
  slug: z.string().trim().min(3, "Slug is required.").max(120),
  excerpt: z.string().trim().min(20, "Excerpt must be at least 20 characters.").max(260),
  contentJson: z.custom<Record<string, unknown>>((value) => typeof value === "object" && value !== null),
  renderedHtml: z.string().trim().min(20, "Content is required."),
  focusKeyword: optionalTrimmedString,
  metaTitle: optionalTrimmedString,
  metaDescription: optionalTrimmedString,
  canonicalUrl: optionalTrimmedString,
  ogTitle: optionalTrimmedString,
  ogDescription: optionalTrimmedString,
  ogImage: optionalBlogImageUrl,
  twitterTitle: optionalTrimmedString,
  twitterDescription: optionalTrimmedString,
  twitterImage: optionalBlogImageUrl,
  schemaType: z.nativeEnum(BlogSchemaType),
  tags: z.array(z.string().trim().min(2).max(40)).max(12),
  categories: z.array(z.string().trim().min(2).max(40)).max(8),
  featuredImageUrl: optionalBlogImageUrl,
  featuredImageAlt: optionalTrimmedString,
  seoScore: z.number().min(0).max(100),
  readabilityScore: z.number().min(0).max(100),
  status: z.nativeEnum(BlogPostStatus),
  faqItems: z.array(faqItemSchema).max(12)
});

export const blogAnalyzeSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  renderedHtml: z.string().trim().min(1),
  contentJson: z.custom<Record<string, unknown>>((value) => typeof value === "object" && value !== null),
  excerpt: optionalTrimmedString,
  focusKeyword: optionalTrimmedString,
  metaDescription: optionalTrimmedString,
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
});

export const blogPublishSchema = z.object({
  slug: z.string().trim().min(1),
  status: z.nativeEnum(BlogPostStatus)
});

export type BlogPostInput = z.infer<typeof blogPostInputSchema>;
