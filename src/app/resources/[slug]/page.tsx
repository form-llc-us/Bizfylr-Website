import Link from "next/link";
import { notFound } from "next/navigation";

import { FinalCta } from "@/components/sections/FinalCta";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { JsonLd } from "@/components/shared/JsonLd";
import { resources, resourcesLookup } from "@/data/resources";
import { SITE } from "@/data/site";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { createMetadata } from "@/lib/seo";

type ResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = resourcesLookup[slug as keyof typeof resourcesLookup];

  if (!resource) {
    return createMetadata({
      title: "Resources",
      description: SITE.description,
      pathname: "/resources"
    });
  }

  return createMetadata({
    title: resource.seoTitle,
    description: resource.seoDescription,
    pathname: `/resources/${resource.slug}`,
    keywords: [resource.category, "bizfylr resource", "lead generation", "seo content"]
  });
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = resourcesLookup[slug as keyof typeof resourcesLookup];

  if (!resource) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
          { name: resource.title, href: `/resources/${resource.slug}` }
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: resource.title,
          description: resource.seoDescription,
          url: `/resources/${resource.slug}`,
          dateModified: resource.updatedAt
        })}
      />

      <section className="section-space-tight">
        <Container className="section-stack-tight">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: resource.title }
            ]}
          />

          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-light">
              {resource.heroEyebrow} {" | "} {resource.category} {" | "} {resource.readTime}
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] text-foreground md:text-6xl">
              {resource.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted md:text-lg">
              {resource.excerpt}
            </p>
          </div>
        </Container>
      </section>

      <section className="section-space-tight pt-0">
        <Container className="content-grid-lg lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <aside className="grid gap-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-light">In this guide</p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-foreground/84">
                {resource.keyTakeaways.map((item) => (
                  <p key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" />
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Guide outline</p>
              <div className="mt-4 grid gap-3">
                {resource.sections.map((section, index) => (
                  <a
                    className="interactive-surface rounded-[18px] border border-white/8 bg-background/40 px-4 py-3 text-sm font-semibold text-foreground/90"
                    href={`#section-${index + 1}`}
                    key={section.title}
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Quick actions</p>
              <div className="mt-4 grid gap-3">
                {resource.relatedLinks.map((item) => (
                  <Link
                    key={item.href}
                    className="interactive-surface rounded-[18px] border border-white/8 bg-background/40 px-4 py-3 text-sm font-semibold text-foreground/90"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <article className="prose prose-invert max-w-none rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            {resource.sections.map((section, index) => (
              <section id={`section-${index + 1}`} key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>
        </Container>
      </section>

      <FinalCta
        description="Use the contact route when you want implementation, not just information."
        eyebrow="Guide to execution"
        title="Want Bizfylr to apply this framework to your business, website, or funnel?"
      />
    </>
  );
}
