import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { FinalCta } from "@/components/sections/FinalCta";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { FillImagePlaceholder, isPlaceholderImageSrc } from "@/components/shared/ImagePlaceholder";
import { PageIntro } from "@/components/shared/PageIntro";
import { createMetadata } from "@/lib/seo";
import { getPublishedBlogSummaries } from "@/lib/blog/repository";
import { siteImages } from "@/data/images";
import { isAllowedBlogImageUrl } from "@/lib/blog/images";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Blog | SEO, Lead Generation, E-commerce & Growth Insights",
  description:
    "Read Bizfylr blog articles about website SEO, lead generation systems, e-commerce operations, and founder-focused digital growth infrastructure.",
  pathname: "/blog",
  keywords: ["business blog", "seo blog", "lead generation blog", "ecommerce growth articles"]
});

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogSummaries();
  const images = siteImages.home;

  return (
    <>
      <PageIntro
        align="center"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        currentPath="/blog"
        eyebrow="Blog"
        title="Practical articles designed to attract search traffic and help founders make stronger growth decisions."
        description="Use the blog to explore SEO strategy, website redesign planning, conversion systems, and e-commerce execution guidance."
      >
        <div className="content-grid md:grid-cols-3">
          <ImagePlaceholder {...images.hero} priority variant="dashboard" />
          <ImagePlaceholder {...images.consultation} variant="consultation" />
          <ImagePlaceholder {...images.workflow} variant="workflow" />
        </div>
      </PageIntro>

      <section className="section-space-tight">
        <div className="container relative px-5 sm:px-6 lg:px-8">
          <div className="content-grid md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
                <article
                  className="interactive-surface flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]"
                  key={post.id}
                >
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10">
                    {post.featuredImageUrl && isAllowedBlogImageUrl(post.featuredImageUrl) && !isPlaceholderImageSrc(post.featuredImageUrl) ? (
                      <Image
                        alt={post.featuredImageAlt || post.title}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        src={post.featuredImageUrl}
                      />
                    ) : (
                      <FillImagePlaceholder label={`${post.title} Placeholder`} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">
                        {(post.categories[0] || "Blog")} {" | "} {(post.publishedAt || post.updatedAt).toLocaleDateString()}
                      </p>
                      <h2 className="text-2xl font-semibold leading-tight text-foreground">
                        {post.title}
                      </h2>
                    </div>
                    <p className="text-sm leading-7 text-muted">{post.excerpt}</p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          className="inline-flex items-center rounded-full border border-white/10 bg-background/40 px-3 py-1 text-xs text-foreground/85"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light transition-colors duration-200 hover:text-foreground"
                      href={`/blog/${post.slug}`}
                    >
                      Read article
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      <FinalCta
        description="Talk to Bizfylr when you want to turn SEO, content, growth systems, or redesign insights into execution."
        eyebrow="Blog support"
        title="Need implementation help after reading the strategy?"
      />
    </>
  );
}
