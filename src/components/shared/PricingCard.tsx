import { Check } from "lucide-react";

import type { PricingPlan } from "@/data/pricing";
import { GradientButton } from "@/components/shared/GradientButton";
import { GlassCard } from "@/components/shared/GlassCard";

type PricingCardProps = {
  plan: PricingPlan;
};

export function PricingCard({ plan }: PricingCardProps) {
  return (
    <GlassCard
      className={`interactive-surface relative flex h-full min-h-[420px] flex-col gap-5 p-6 md:p-7 ${plan.featured ? "border-primary/50 bg-primary/[0.08]" : ""}`}
    >
      {plan.featured ? (
        <div className="absolute right-6 top-6 rounded-full bg-foreground px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-background">
          Most Popular
        </div>
      ) : null}
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{plan.name}</p>
        <h3 className="font-heading text-4xl font-extrabold tracking-[-0.05em] text-foreground">
          {plan.priceLabel}
        </h3>
        <p className="min-h-[84px] text-sm leading-7 text-muted">{plan.description}</p>
      </div>
      {plan.highlights?.length ? (
        <div className="grid gap-3 rounded-[22px] border border-white/8 bg-background/40 p-4 text-sm leading-6 text-foreground/86">
          {plan.highlights.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      ) : null}
      <ul className="space-y-3 text-sm text-foreground/90">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <Check className="h-4 w-4 shrink-0 text-emerald" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <GradientButton className="mt-auto" href="/contact-us">
        {plan.cta}
      </GradientButton>
    </GlassCard>
  );
}
