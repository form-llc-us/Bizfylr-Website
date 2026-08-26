import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FinalCta } from "@/components/sections/FinalCta";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { FillImagePlaceholder, isPlaceholderImageSrc } from "@/components/shared/ImagePlaceholder";
import { JsonLd } from "@/components/shared/JsonLd";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog/repository";
import { createBlogMetadata } from "@/lib/seo/metadata";
import { createBlogArticleSchema, createBlogBreadcrumbSchema, createBlogFaqSchema } from "@/lib/seo/schema";
import { isAllowedBlogImageUrl } from "@/lib/blog/images";

export const revalidate = 300;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return createBlogMetadata(post);
}

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post);
  const faqSchema = createBlogFaqSchema(post.faqItems);
  const readingMinutes = Math.max(1, Math.ceil(post.plainText.split(/\s+/).filter(Boolean).length / 220));

  return (
    <>
      <JsonLd data={createBlogArticleSchema(post)} />
      <JsonLd data={createBlogBreadcrumbSchema(post)} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}

      <section className="section-space-tight">
        <Container className="section-stack-tight">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title }
            ]}
          />

          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-light">
              {(post.categories[0] || "Blog")} {" | "} {(post.publishedAt || post.updatedAt).toLocaleDateString()} {" | "} {readingMinutes} min read
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] text-foreground md:text-6xl">
              {post.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted md:text-lg">
              {post.excerpt}
            </p>
          </div>
        </Container>
      </section>

      <section className="section-space-tight pt-0">
        <Container className="content-grid-lg lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <aside className="grid gap-5 lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
              {post.featuredImageUrl && isAllowedBlogImageUrl(post.featuredImageUrl) && !isPlaceholderImageSrc(post.featuredImageUrl) ? (
                <Image
                  alt={post.featuredImageAlt || post.title}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  src={post.featuredImageUrl}
                />
              ) : (
                <FillImagePlaceholder label={`${post.title} Placeholder`} />
              )}
            </div>

            {post.tableOfContents.length > 0 ? (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm font-semibold text-foreground">On this page</p>
                <div className="mt-3 grid gap-3">
                  {post.tableOfContents.map((item) => (
                    <a
                      className="text-sm leading-6 text-muted transition-colors hover:text-foreground"
                      href={`#${item.id}`}
                      key={item.id}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-semibold text-foreground">Post signals</p>
              <div className="mt-3 grid gap-2 text-sm text-muted">
                <p>SEO score: {post.seoScore}/100</p>
                <p>Readability score: {post.readabilityScore}/100</p>
                <p>Focus keyword: {post.focusKeyword || "Not set"}</p>
              </div>
            </div>
          </aside>

          <div className="grid gap-8">
            <article
              className="prose prose-invert max-w-none rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8"
              dangerouslySetInnerHTML={{ __html: post.renderedHtml }}
            />

            {post.faqItems.length > 0 ? (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <h2 className="font-heading text-3xl font-extrabold tracking-[-0.04em] text-foreground">
                  Frequently asked questions
                </h2>
                <div className="mt-6 grid gap-4">
                  {post.faqItems.map((item) => (
                    <div className="rounded-[24px] border border-white/10 bg-background/40 p-5" key={item.question}>
                      <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {relatedPosts.length > 0 ? (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <h2 className="font-heading text-3xl font-extrabold tracking-[-0.04em] text-foreground">
                  Related posts
                </h2>
                <div className="mt-6 content-grid md:grid-cols-2">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      className="interactive-surface rounded-[24px] border border-white/10 bg-background/40 p-5"
                      href={`/blog/${relatedPost.slug}`}
                      key={relatedPost.id}
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-primary-light">
                        {(relatedPost.categories[0] || "Blog")} {" | "} {(relatedPost.publishedAt || relatedPost.updatedAt).toLocaleDateString()}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">{relatedPost.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted">{relatedPost.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <FinalCta
        description="Use the contact route if you want Bizfylr to implement the strategy, not just explain it."
        eyebrow="Blog to execution"
        title="Want help applying this article to your website, SEO stack, or conversion system?"
      />
    </>
  );
}
