import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Container } from "@/components/shared/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { PageIntro } from "@/components/shared/PageIntro";
import { PricingCard } from "@/components/shared/PricingCard";
import { categorizedFaqs } from "@/data/faqs";
import { siteImages } from "@/data/images";
import { pricingAddOns, pricingDisclaimer, pricingPlans } from "@/data/pricing";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Pricing | Starter, Growth & Scale Delivery Models",
  description:
    "Review Bizfylr's pricing structure for websites, growth systems, e-commerce, marketing, and ongoing business support engagements.",
  pathname: "/pricing"
});

export default function PricingPage() {
  const images = siteImages.pricing;

  return (
    <>
      <PageIntro
        align="center"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        currentPath="/pricing"
        description="Use the plan structure below as a practical starting point. Scope, delivery depth, integrations, and support duration determine the final commercial model."
        eyebrow="Pricing"
        title="Pricing designed around founder stage, implementation depth, and business complexity."
      >
        <div className="content-grid md:grid-cols-2 xl:grid-cols-3">
          <ImagePlaceholder {...images.hero} priority variant="dashboard" />
          <ImagePlaceholder {...images.card} variant="consultation" />
          <ImagePlaceholder {...images.workflow} variant="workflow" />
        </div>
      </PageIntro>
      <section className="section-space-tight">
        <Container className="content-grid mx-auto max-w-[1180px] lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </Container>
      </section>
      <section className="section-space-tight">
        <Container className="content-grid-lg mx-auto max-w-[1180px] lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-light">Add-ons</p>
            <div className="mt-4 grid gap-3">
              {pricingAddOns.map((item) => (
                <div key={item} className="interactive-surface rounded-[20px] border border-white/8 bg-background/50 p-4 text-sm leading-7 text-foreground/90">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-4 border-b border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-foreground">
                  <div>Capability</div>
                  <div>Starter</div>
                  <div>Growth</div>
                  <div>Scale</div>
                </div>
                {[
                  ["Strategy", "Focused", "Expanded", "Executive-led"],
                  ["Delivery scope", "Single sprint", "Multi-scope", "Cross-functional"],
                  ["Support", "Basic handoff", "Post-launch optimization", "Ongoing partnership"],
                  ["Integrations", "Light", "Moderate", "Advanced"],
                  ["Best fit", "New launch", "Growing team", "Serious scaling"]
                ].map((row) => (
                  <div className="grid grid-cols-4 gap-4 border-b border-white/8 px-6 py-4 text-sm text-muted last:border-0" key={row[0]}>
                    {row.map((cell) => (
                      <div key={cell} className="leading-6">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
        <Container className="pt-2 md:pt-4">
          <p className="mx-auto max-w-4xl text-center text-sm leading-7 text-muted">{pricingDisclaimer}</p>
        </Container>
      </section>
      <FaqSection items={[...categorizedFaqs.Pricing, ...categorizedFaqs.General].slice(0, 6)} title="Pricing questions before you commit" />
      <FinalCta
        description="Share your scope, timeline, and business stage to get a founder-friendly recommendation on the right delivery model."
        eyebrow="Pricing support"
        title="Need a scoped quote instead of guessing which plan fits?"
      />
    </>
  );
}
