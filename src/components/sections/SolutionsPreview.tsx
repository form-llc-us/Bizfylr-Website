import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Rocket, ShoppingCart, Store, TrendingUp } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { solutions } from "@/data/solutions";

const solutionIcons: Record<string, LucideIcon> = {
  "founder-launch-systems": Rocket,
  "ecommerce-growth-ops": ShoppingCart,
  "marketplace-scale-support": Store,
  "growth-funnel-optimization": TrendingUp
};

export function SolutionsPreview() {
  return (
    <section className="section-space">
      <Container className="section-stack">
        <SectionHeader
          align="center"
          description="Use these solution tracks to move from generic service shopping to a clearer growth decision."
          eyebrow="Solutions"
          title="Solution paths aligned to the business stage, traffic model, and operational complexity you actually have."
        />

        <div className="content-grid mx-auto w-full max-w-[1120px] md:grid-cols-2">
          {solutions.map((solution) => {
            const Icon = solutionIcons[solution.slug] ?? Rocket;

            return (
              <article
                key={solution.slug}
                className="interactive-surface flex h-full min-h-[420px] flex-col gap-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-7"
              >
                <div className="space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary-light">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-light">
                      {solution.audience}
                    </p>
                    <h2 className="text-2xl font-semibold leading-tight text-foreground">{solution.title}</h2>
                    <p className="text-sm leading-7 text-muted">{solution.summary}</p>
                  </div>
                </div>

                <div className="grid gap-4 rounded-[24px] border border-white/8 bg-background/40 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Common pain point</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/90">{solution.painPoint}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald">Expected outcome</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/90">{solution.outcome}</p>
                  </div>
                </div>

                <ul className="grid gap-3 text-sm text-foreground/90">
                  {solution.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary-light transition-colors duration-200 hover:text-foreground"
                  href={solution.href}
                >
                  Explore solution fit
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
