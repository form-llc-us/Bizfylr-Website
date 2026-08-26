export const BlogPostStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED"
} as const;

export type BlogPostStatus = (typeof BlogPostStatus)[keyof typeof BlogPostStatus];

export const BlogSchemaType = {
  ARTICLE: "ARTICLE",
  BLOG_POSTING: "BLOG_POSTING",
  FAQ_PAGE: "FAQ_PAGE"
} as const;

export type BlogSchemaType = (typeof BlogSchemaType)[keyof typeof BlogSchemaType];
