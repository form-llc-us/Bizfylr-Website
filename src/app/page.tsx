import Link from "next/link";

import { FaqSection } from "@/components/sections/FaqSection";
import { FeatureHighlights } from "@/components/sections/FeatureHighlights";
import { FinalCta } from "@/components/sections/FinalCta";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { LogoCloud } from "@/components/sections/LogoCloud";
import { PainPoints } from "@/components/sections/PainPoints";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { PricingSection } from "@/components/sections/PricingSection";
import { ResourcesPreview } from "@/components/sections/ResourcesPreview";
import { SolutionsPreview } from "@/components/sections/SolutionsPreview";
import { TestimonialsMarquee } from "@/components/sections/TestimonialsMarquee";
import { TrustIndicators } from "@/components/sections/TrustIndicators";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { createMetadata } from "@/lib/seo";
import { categorizedFaqs } from "@/data/faqs";
import { services } from "@/data/services";

export const metadata = createMetadata({
  title: "Bizfylr | Build, Launch & Scale With Premium Digital Infrastructure",
  description:
    "Premium websites, growth systems, e-commerce execution, compliance support, automation, and founder-focused digital infrastructure for global-ready businesses.",
  pathname: "/",
  keywords: [
    "business growth services",
    "website development company",
    "ecommerce setup services",
    "digital marketing agency",
    "business compliance support",
    "lead generation systems"
  ]
});

const homepageFaqs = [...categorizedFaqs.General, ...categorizedFaqs.Pricing, ...categorizedFaqs.Support].slice(0, 6);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustIndicators />
      <LogoCloud />
      <SolutionsPreview />
      <PainPoints />
      <FeatureHighlights />
      <HowItWorks />
      <section className="section-space">
        <Container className="section-stack">
          <SectionHeader
            align="center"
            description="Explore the service stack Bizfylr uses to help founders build, launch, support, and scale modern digital businesses."
            eyebrow="Services Preview"
            title="A full stack of growth, commerce, compliance, and execution support."
          />
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="content-grid md:grid-cols-2 xl:grid-cols-3">
              {services.slice(0, 6).map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </div>
          <div className="text-center">
            <Link className="inline-flex text-sm font-semibold text-primary-light transition-colors hover:text-foreground" href="/services">
              Explore all services
            </Link>
          </div>
        </Container>
      </section>
      <PricingSection />
      <WhyChooseUs />
      <PortfolioGrid limit={6} />
      <TestimonialsMarquee />
      <ResourcesPreview />
      <FaqSection items={homepageFaqs} />
      <FinalCta />
    </>
  );
}
