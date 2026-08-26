import { pricingDisclaimer, pricingPlans } from "@/data/pricing";
import { Container } from "@/components/shared/Container";
import { PricingCard } from "@/components/shared/PricingCard";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function PricingSection() {
  return (
    <section className="section-space" id="pricing">
      <Container className="section-stack">
        <SectionHeader
          align="center"
          description="Use these plans as guided starting points. Scope, integrations, and support depth determine the final engagement structure."
          eyebrow="Pricing"
          title="Choose a delivery model that matches your current stage."
        />
        <div className="mx-auto w-full max-w-[1120px]">
          <div className="content-grid lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
        <p className="text-center text-sm text-muted">{pricingDisclaimer}</p>
      </Container>
    </section>
  );
}
