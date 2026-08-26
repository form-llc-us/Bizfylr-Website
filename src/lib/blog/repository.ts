import { BlogPostStatus, Prisma } from "@prisma/client";
import type { JSONContent } from "@tiptap/core";

import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { parseStoredToc } from "@/lib/blog/parser";
import { tokenize } from "@/lib/seo/keyword";
import type {
  BlogEditorPayload,
  BlogListItem,
  BlogPostRecord,
  InternalLinkSuggestion,
  PublicBlogPost
} from "@/types/blog";

export class BlogConflictError extends Error {}
export class BlogNotFoundError extends Error {}
export class BlogValidationError extends Error {}

function parseFaqItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is { question: string; answer: string } => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof (item as { question?: unknown }).question === "string" &&
        typeof (item as { answer?: unknown }).answer === "string"
      );
    })
    .map((item) => ({
      question: item.question,
      answer: item.answer
    }));
}

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function mapPostRecord(record: BlogPostRecord): PublicBlogPost {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    tags: parseStringArray(record.tags),
    categories: parseStringArray(record.categories),
    seoScore: record.seoScore,
    readabilityScore: record.readabilityScore,
    status: record.status,
    featuredImageUrl: record.featuredImageUrl,
    featuredImageAlt: record.featuredImageAlt,
    publishedAt: record.publishedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    contentJson: record.contentJson as JSONContent,
    renderedHtml: record.renderedHtml,
    plainText: record.plainText,
    tableOfContents: parseStoredToc(record.tableOfContents),
    focusKeyword: record.focusKeyword,
    metaTitle: record.metaTitle,
    metaDescription: record.metaDescription,
    canonicalUrl: record.canonicalUrl,
    ogTitle: record.ogTitle,
    ogDescription: record.ogDescription,
    ogImage: record.ogImage,
    twitterTitle: record.twitterTitle,
    twitterDescription: record.twitterDescription,
    twitterImage: record.twitterImage,
    schemaType: record.schemaType,
    faqItems: parseFaqItems(record.faqItems)
  };
}

function mapListRecord(record: BlogPostRecord): BlogListItem {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    tags: parseStringArray(record.tags),
    categories: parseStringArray(record.categories),
    seoScore: record.seoScore,
    readabilityScore: record.readabilityScore,
    status: record.status,
    featuredImageUrl: record.featuredImageUrl,
    featuredImageAlt: record.featuredImageAlt,
    publishedAt: record.publishedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

async function safeQuery<T>(resolver: () => Promise<T>, fallback: T) {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured.");
  }
  void fallback;
  return resolver();
}

export async function getAdminBlogPosts() {
  const records = await safeQuery(
    () =>
      prisma.blogPost.findMany({
        orderBy: [{ updatedAt: "desc" }]
      }),
    [] as BlogPostRecord[]
  );

  return records.map(mapListRecord);
}

export async function getPublishedBlogPosts() {
  const records = await safeQuery(
    () =>
      prisma.blogPost.findMany({
        where: {
          status: BlogPostStatus.PUBLISHED,
          publishedAt: {
            not: null
          }
        },
        orderBy: [{ publishedAt: "desc" }]
      }),
    [] as BlogPostRecord[]
  );

  return records.map(mapPostRecord);
}

export async function getPublishedBlogSummaries() {
  const records = await safeQuery(
    () =>
      prisma.blogPost.findMany({
        where: {
          status: BlogPostStatus.PUBLISHED,
          publishedAt: {
            not: null
          }
        },
        orderBy: [{ publishedAt: "desc" }]
      }),
    [] as BlogPostRecord[]
  );

  return records.map(mapListRecord);
}

export async function getBlogPostBySlug(slug: string, includeDraft = false) {
  const record = await safeQuery(
    () =>
      prisma.blogPost.findUnique({
        where: { slug }
      }),
    null as BlogPostRecord | null
  );

  if (!record) {
    return null;
  }

  if (!includeDraft && record.status !== BlogPostStatus.PUBLISHED) {
    return null;
  }

  return mapPostRecord(record);
}

export async function getAllBlogSlugs(includeDraft = false) {
  const records = await safeQuery(
    () =>
      prisma.blogPost.findMany({
        where: includeDraft
          ? undefined
          : {
              status: BlogPostStatus.PUBLISHED,
              publishedAt: {
                not: null
              }
            },
        select: {
          slug: true
        }
      }),
    [] as Array<{ slug: string }>
  );

  return records.map((record) => record.slug);
}

export async function saveBlogPost(payload: BlogEditorPayload, mode: "create" | "update") {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const data = {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    contentJson: payload.contentJson,
    renderedHtml: payload.renderedHtml,
    plainText: payload.plainText,
    tableOfContents: payload.tableOfContents,
    focusKeyword: payload.focusKeyword || null,
    metaTitle: payload.metaTitle || null,
    metaDescription: payload.metaDescription || null,
    canonicalUrl: payload.canonicalUrl || null,
    ogTitle: payload.ogTitle || null,
    ogDescription: payload.ogDescription || null,
    ogImage: payload.ogImage || null,
    twitterTitle: payload.twitterTitle || null,
    twitterDescription: payload.twitterDescription || null,
    twitterImage: payload.twitterImage || null,
    schemaType: payload.schemaType,
    featuredImageUrl: payload.featuredImageUrl || null,
    featuredImageAlt: payload.featuredImageAlt || null,
    tags: payload.tags as Prisma.InputJsonValue,
    categories: payload.categories as Prisma.InputJsonValue,
    faqItems: payload.faqItems,
    seoScore: payload.seoScore,
    readabilityScore: payload.readabilityScore,
    status: payload.status,
    publishedAt: payload.status === BlogPostStatus.PUBLISHED ? new Date() : null
  };

  if (mode === "update" && !payload.id) {
    throw new BlogValidationError("A post ID is required for updates.");
  }
  if (mode === "create" && payload.id) {
    throw new BlogValidationError("New posts cannot include an existing post ID.");
  }

  try {
    if (mode === "create") {
      return mapPostRecord(await prisma.blogPost.create({ data }));
    }

    const id = payload.id as string;
    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } });
    if (!existing) {
      throw new BlogNotFoundError("The blog post no longer exists.");
    }
    return mapPostRecord(await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt: payload.status === BlogPostStatus.PUBLISHED ? existing.publishedAt ?? new Date() : null
      }
    }));
  } catch (error) {
    if (error instanceof BlogNotFoundError || error instanceof BlogValidationError) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new BlogConflictError("A blog post with this slug already exists.");
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new BlogNotFoundError("The blog post no longer exists.");
    }
    throw error;
  }
}

export async function updateBlogStatus(slug: string, status: BlogPostStatus) {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  try {
    const record = await prisma.blogPost.update({
      where: { slug },
      data: { status, publishedAt: status === BlogPostStatus.PUBLISHED ? new Date() : null }
    });
    return mapPostRecord(record);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new BlogNotFoundError("The blog post no longer exists.");
    }
    throw error;
  }
}

function scoreKeywordSimilarity(sourceTokens: string[], candidateTokens: string[]) {
  const shared = sourceTokens.filter((token) => candidateTokens.includes(token));
  const uniqueShared = Array.from(new Set(shared));
  return uniqueShared.length;
}

export async function getInternalLinkSuggestions(input: {
  currentSlug?: string;
  categories: string[];
  tags: string[];
  focusKeyword?: string;
}) {
  const records = await safeQuery(
    () =>
      prisma.blogPost.findMany({
        where: {
          status: BlogPostStatus.PUBLISHED,
          ...(input.currentSlug
            ? {
                slug: {
                  not: input.currentSlug
                }
              }
            : {})
        },
        orderBy: [{ publishedAt: "desc" }]
      }),
    [] as BlogPostRecord[]
  );

  const seedTokens = tokenize(
    [...input.categories, ...input.tags, input.focusKeyword ?? ""].join(" ")
  );

  const suggestions = records
    .map((record) => {
      const recordCategories = parseStringArray(record.categories);
      const recordTags = parseStringArray(record.tags);
      const candidateTokens = tokenize(
        [record.title, record.excerpt, ...recordCategories, ...recordTags, record.focusKeyword ?? ""].join(" ")
      );
      const sharedCategoryCount = recordCategories.filter((category) =>
        input.categories.includes(category)
      ).length;
      const sharedTagCount = recordTags.filter((tag) => input.tags.includes(tag)).length;
      const keywordScore = scoreKeywordSimilarity(seedTokens, candidateTokens);
      const score = sharedCategoryCount * 4 + sharedTagCount * 3 + keywordScore;

      return {
        slug: record.slug,
        title: record.title,
        url: `/blog/${record.slug}`,
        reason:
          sharedCategoryCount > 0
            ? "Shared category context"
            : sharedTagCount > 0
              ? "Shared tags"
              : "Keyword similarity",
        score
      } satisfies InternalLinkSuggestion;
    })
    .filter((suggestion) => suggestion.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return suggestions;
}

export async function getRelatedBlogPosts(post: PublicBlogPost) {
  const suggestions = await getInternalLinkSuggestions({
    currentSlug: post.slug,
    categories: post.categories,
    tags: post.tags,
    focusKeyword: post.focusKeyword ?? undefined
  });

  const slugs = suggestions.map((suggestion) => suggestion.slug);

  if (slugs.length === 0) {
    return [];
  }

  const records = await safeQuery(
    () =>
      prisma.blogPost.findMany({
        where: {
          slug: {
            in: slugs
          }
        }
      }),
    [] as BlogPostRecord[]
  );

  return records.map(mapListRecord);
}
