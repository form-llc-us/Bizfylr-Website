import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, FileSearch, FileText, ListChecks, SearchCheck } from "lucide-react";

import { FinalCta } from "@/components/sections/FinalCta";
import { PageIntro } from "@/components/shared/PageIntro";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { siteImages } from "@/data/images";
import { resources } from "@/data/resources";
import { createMetadata } from "@/lib/seo";

const resourceIcons: Record<string, LucideIcon> = {
  "website-redesign-seo-checklist": SearchCheck,
  "lead-generation-system-playbook": FileSearch,
  "ecommerce-launch-checklist": ListChecks,
  "global-founder-digital-infrastructure": FileText
};

export const metadata = createMetadata({
  title: "Resources | SEO Guides, Launch Checklists & Lead Generation Playbooks",
  description:
    "Browse Bizfylr resources covering website redesign SEO, lead generation systems, e-commerce launch planning, and growth-ready digital infrastructure.",
  pathname: "/resources",
  keywords: [
    "website redesign seo guide",
    "lead generation playbook",
    "ecommerce launch checklist",
    "digital infrastructure guide"
  ]
});

export default function ResourcesPage() {
  const images = siteImages.home;

  return (
    <>
      <PageIntro
        align="center"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        currentPath="/resources"
        description="Use these guides, checklists, and playbooks to plan launches, redesigns, lead generation systems, and operational improvements more intelligently."
        eyebrow="Resources"
        title="A content hub built to attract higher-intent traffic and answer real buyer questions early."
      >
        <div className="content-grid md:grid-cols-3">
          <ImagePlaceholder {...images.hero} priority variant="dashboard" />
          <ImagePlaceholder {...images.consultation} variant="consultation" />
          <ImagePlaceholder {...images.workflow} variant="workflow" />
        </div>
      </PageIntro>

      <section className="section-space-tight">
        <div className="container relative px-5 sm:px-6 lg:px-8">
          <div className="content-grid md:grid-cols-2 xl:grid-cols-4">
            {resources.map((resource) => {
              const Icon = resourceIcons[resource.slug] ?? FileText;
              const previewBullets = resource.sections.flatMap((section) => section.bullets ?? []).slice(0, 2);

              return (
                <article
                  key={resource.slug}
                  className="interactive-surface flex h-full flex-col gap-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary-light">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-light">
                      {resource.category} {" | "} {resource.readTime}
                    </p>
                    <h2 className="text-xl font-semibold leading-tight text-foreground">{resource.title}</h2>
                    <p className="text-sm leading-7 text-muted">{resource.excerpt}</p>
                  </div>
                  {previewBullets.length ? (
                    <div className="grid gap-2 text-sm leading-6 text-foreground/82">
                      {previewBullets.map((item) => (
                        <p key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" />
                          <span>{item}</span>
                        </p>
                      ))}
                    </div>
                  ) : null}
                  <Link
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary-light transition-colors duration-200 hover:text-foreground"
                    href={`/resources/${resource.slug}`}
                  >
                    Read guide
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCta
        description="Use the contact route when you want execution support for redesigns, growth systems, e-commerce, or conversion-focused page architecture."
        eyebrow="Resource support"
        title="Need Bizfylr to implement the strategy behind the guide, not just explain it?"
      />
    </>
  );
}
