import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, CheckCircle2, Rocket, ShoppingCart, Store, TrendingUp } from "lucide-react";

import { FinalCta } from "@/components/sections/FinalCta";
import { PageIntro } from "@/components/shared/PageIntro";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { siteImages } from "@/data/images";
import { solutions } from "@/data/solutions";
import { createMetadata } from "@/lib/seo";

const solutionIcons: Record<string, LucideIcon> = {
  "founder-launch-systems": Rocket,
  "ecommerce-growth-ops": ShoppingCart,
  "marketplace-scale-support": Store,
  "growth-funnel-optimization": TrendingUp
};

export const metadata = createMetadata({
  title: "Solutions | Lead Generation, E-commerce, Marketplace & Growth Systems",
  description:
    "Explore Bizfylr solutions for founder launches, e-commerce growth, marketplace operations, and conversion-focused digital infrastructure.",
  pathname: "/solutions",
  keywords: [
    "business solutions company",
    "lead generation solutions",
    "ecommerce growth solutions",
    "marketplace operations support",
    "founder growth systems"
  ]
});

export default function SolutionsPage() {
  const images = siteImages.servicesHub;

  return (
    <>
      <PageIntro
        align="center"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Solutions" }]}
        currentPath="/solutions"
        description="These solution paths combine the right services, workflows, and conversion priorities based on the problem you need solved first."
        eyebrow="Solutions"
        title="Solution tracks designed around business outcomes, not disconnected service menus."
      >
        <div className="content-grid md:grid-cols-2 xl:grid-cols-3">
          <ImagePlaceholder {...images.hero} priority variant="dashboard" />
          <ImagePlaceholder {...images.support} variant="consultation" />
          <ImagePlaceholder {...images.workflow} variant="workflow" />
        </div>
      </PageIntro>

      <section className="section-space-tight">
        <div className="container relative px-5 sm:px-6 lg:px-8">
          <div className="content-grid md:grid-cols-2">
            {solutions.map((solution) => {
              const Icon = solutionIcons[solution.slug] ?? Rocket;

              return (
                <article
                  key={solution.slug}
                  className="interactive-surface flex h-full flex-col gap-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-7"
                >
                  <div className="space-y-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary-light">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-light">
                      {solution.audience}
                    </p>
                    <h2 className="text-2xl font-semibold leading-tight text-foreground">{solution.title}</h2>
                    <p className="text-sm leading-7 text-muted">{solution.summary}</p>
                  </div>

                  <div className="grid gap-4 rounded-[24px] border border-white/8 bg-background/40 p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Problem</p>
                      <p className="mt-2 text-sm leading-7 text-foreground/90">{solution.painPoint}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald">Outcome</p>
                      <p className="mt-2 text-sm leading-7 text-foreground/90">{solution.outcome}</p>
                    </div>
                  </div>

                  <ul className="grid gap-3 text-sm text-foreground/90">
                    {solution.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary-light transition-colors duration-200 hover:text-foreground"
                    href={solution.href}
                  >
                    Explore recommended service path
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCta
        description="Book a founder-focused consultation and we will map the right service stack, CTA strategy, and implementation sequence for your current stage."
        title="Need help choosing the right solution path before you commit to scope?"
      />
    </>
  );
}
