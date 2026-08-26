import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, FileSearch, FileText, ListChecks, SearchCheck } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { resources } from "@/data/resources";

const resourceIcons: Record<string, LucideIcon> = {
  "website-redesign-seo-checklist": SearchCheck,
  "lead-generation-system-playbook": FileSearch,
  "ecommerce-launch-checklist": ListChecks,
  "global-founder-digital-infrastructure": FileText
};

export function ResourcesPreview() {
  return (
    <section className="section-space">
      <Container className="section-stack">
        <SectionHeader
          align="center"
          description="The resource hub is structured to support long-tail search visibility, internal linking, and earlier-stage buyer education."
          eyebrow="Resources"
          title="SEO-focused content that answers buyer questions before they turn into sales objections."
        />

        <div className="content-grid mx-auto w-full max-w-[1120px] md:grid-cols-2 xl:grid-cols-4">
          {resources.map((resource) => {
            const Icon = resourceIcons[resource.slug] ?? FileText;
            const previewBullets = resource.sections.flatMap((section) => section.bullets ?? []).slice(0, 2);

            return (
              <article
                key={resource.slug}
                className="interactive-surface flex h-full min-h-[320px] flex-col gap-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-7"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary-light">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-light">
                    {resource.category} • {resource.readTime}
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
                  Read resource
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light transition-colors duration-200 hover:text-foreground"
            href="/resources"
          >
            View the full resource hub
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
