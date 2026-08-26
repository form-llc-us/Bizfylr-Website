import type { JSONContent } from "@tiptap/core";

import { buildBlogArtifacts } from "@/lib/blog/parser";
import { ensureUniqueSlug, generateSlug } from "@/lib/blog/slug";
import { getAllBlogSlugs, getInternalLinkSuggestions } from "@/lib/blog/repository";
import { scoreBlogPost } from "@/lib/seo/score";
import type { BlogAnalysisResult, BlogEditorPayload } from "@/types/blog";

type PrepareInput = {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  contentJson: JSONContent;
  renderedHtml: string;
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
  schemaType: BlogEditorPayload["schemaType"];
  tags: string[];
  categories: string[];
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  status: BlogEditorPayload["status"];
  faqItems: BlogEditorPayload["faqItems"];
};

function dedupeAndNormalize(items: string[]) {
  return Array.from(
    new Set(
      items
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

export async function analyzeBlogContent(input: {
  title: string;
  slug: string;
  excerpt?: string;
  contentJson: JSONContent;
  renderedHtml: string;
  focusKeyword?: string;
  metaDescription?: string;
  categories: string[];
  tags: string[];
}) {
  const artifacts = buildBlogArtifacts({
    html: input.renderedHtml,
    contentJson: input.contentJson,
    excerpt: input.excerpt
  });

  const analysis = scoreBlogPost({
    title: input.title,
    slug: input.slug,
    plainText: artifacts.plainText,
    paragraphs: artifacts.paragraphs,
    headings: artifacts.headings,
    metaDescription: input.metaDescription,
    focusKeyword: input.focusKeyword,
    imageAltTexts: artifacts.imageAltTexts,
    internalLinkCount: artifacts.internalLinks.length,
    externalLinkCount: artifacts.externalLinks.length
  });

  const internalLinkSuggestions = await getInternalLinkSuggestions({
    currentSlug: input.slug,
    categories: dedupeAndNormalize(input.categories),
    tags: dedupeAndNormalize(input.tags),
    focusKeyword: input.focusKeyword
  });

  return {
    analysis,
    internalLinkSuggestions,
    artifacts
  };
}

export async function prepareBlogPayload(input: PrepareInput) {
  const normalizedSlug = generateSlug(input.slug || input.title);
  const existingSlugs = (await getAllBlogSlugs(true)).filter((slug) => slug !== input.slug);
  const slug = ensureUniqueSlug(normalizedSlug, existingSlugs);
  const categories = dedupeAndNormalize(input.categories);
  const tags = dedupeAndNormalize(input.tags);

  const { analysis, artifacts } = await analyzeBlogContent({
    title: input.title,
    slug,
    excerpt: input.excerpt,
    contentJson: input.contentJson,
    renderedHtml: input.renderedHtml,
    focusKeyword: input.focusKeyword,
    metaDescription: input.metaDescription,
    categories,
    tags
  });

  return {
    payload: {
      id: input.id,
      title: input.title.trim(),
      slug,
      excerpt: artifacts.excerpt,
      contentJson: artifacts.contentJson,
      renderedHtml: artifacts.renderedHtml,
      plainText: artifacts.plainText,
      tableOfContents: artifacts.toc,
      focusKeyword: input.focusKeyword?.trim(),
      metaTitle: input.metaTitle?.trim(),
      metaDescription: input.metaDescription?.trim(),
      canonicalUrl: input.canonicalUrl?.trim(),
      ogTitle: input.ogTitle?.trim(),
      ogDescription: input.ogDescription?.trim(),
      ogImage: input.ogImage?.trim(),
      twitterTitle: input.twitterTitle?.trim(),
      twitterDescription: input.twitterDescription?.trim(),
      twitterImage: input.twitterImage?.trim(),
      schemaType: input.schemaType,
      tags,
      categories,
      featuredImageUrl: input.featuredImageUrl?.trim(),
      featuredImageAlt: input.featuredImageAlt?.trim(),
      seoScore: analysis.score,
      readabilityScore: analysis.readabilityScore,
      status: input.status,
      faqItems: input.faqItems
    } satisfies BlogEditorPayload & { plainText: string; tableOfContents: unknown },
    analysis
  };
}

export function summarizeSeoAnalysis(analysis: BlogAnalysisResult) {
  return {
    score: analysis.score,
    readabilityScore: analysis.readabilityScore,
    passed: analysis.passedChecks.length,
    warnings: analysis.warningChecks.length,
    failed: analysis.failedChecks.length
  };
}
