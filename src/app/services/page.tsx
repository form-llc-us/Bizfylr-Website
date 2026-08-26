import Link from "next/link";

import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { ServiceProcess } from "@/components/sections/ServiceProcess";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Container } from "@/components/shared/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { PageIntro } from "@/components/shared/PageIntro";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { categorizedFaqs } from "@/data/faqs";
import { siteImages } from "@/data/images";
import { services } from "@/data/services";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Services | Business Growth, E-commerce, Websites & Compliance",
  description:
    "Explore Bizfylr's premium service hub covering business expansion, compliance support, websites, e-commerce, marketplaces, marketing, and creative execution.",
  pathname: "/services"
});

export default function ServicesPage() {
  const images = siteImages.servicesHub;

  return (
    <>
      <PageIntro
        align="center"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        currentPath="/services"
        description="Bizfylr combines growth systems, design quality, and operational support so each service can connect back to a stronger business foundation."
        eyebrow="Service Hub"
        title="A premium service architecture for founders building serious digital businesses."
      >
        <div className="content-grid md:grid-cols-2 xl:grid-cols-3">
          <ImagePlaceholder {...images.hero} priority variant="dashboard" />
          <ImagePlaceholder {...images.support} variant="consultation" />
          <ImagePlaceholder {...images.workflow} variant="workflow" />
        </div>
      </PageIntro>
      <section className="section-space-tight">
        <Container className="content-grid mx-auto max-w-[1180px] md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </Container>
      </section>
      <section className="section-space-tight">
        <Container className="section-stack">
          <SectionHeader
            align="center"
            description="The categories below show how Bizfylr's services map to core founder priorities."
            eyebrow="Capability View"
            title="Choose the right entry point based on the problem you need solved first."
          />
          <div className="content-grid md:grid-cols-3">
            <ComparisonCard
              description="Websites, branding, UX, and conversion architecture."
              examples={["Landing pages that position offers more clearly", "Creative systems that make trust and CTA paths stronger"]}
              links={["/services/website-development", "/services/graphic-design-video-editing", "/portfolio"]}
              title="Digital presence"
            />
            <ComparisonCard
              description="Store setup, marketplaces, launch support, and operations management."
              examples={["Product, checkout, and listing flows designed for smoother execution", "Useful when sales channels are active but operational clarity is weak"]}
              links={["/services/ecommerce-setup", "/services/ecommerce-management", "/services/marketplace-setup"]}
              title="Commerce infrastructure"
            />
            <ComparisonCard
              description="Automation, dashboards, reporting, marketing, and founder operating systems."
              examples={["Better lead handling, reporting, and internal workflow visibility", "Built for founders who need growth support without fragmented vendors"]}
              links={["/services/business-expansion", "/services/business-compliance", "/services/digital-marketing"]}
              title="Growth systems"
            />
          </div>
        </Container>
      </section>
      <ServiceProcess service={services[0]} />
      <WhyChooseUs />
      <FaqSection items={[...categorizedFaqs.General, ...categorizedFaqs.Support].slice(0, 6)} title="Questions before choosing a service category" />
      <FinalCta />
    </>
  );
}

function ComparisonCard({
  title,
  description,
  examples,
  links
}: {
  title: string;
  description: string;
  examples: string[];
  links: string[];
}) {
  return (
    <div className="interactive-surface rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-center md:p-7">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
      <div className="mt-4 grid gap-2 text-sm leading-6 text-foreground/82">
        {examples.map((item) => (
          <p key={item} className="flex items-start justify-center gap-3 text-center">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" />
            <span>{item}</span>
          </p>
        ))}
      </div>
      <div className="mt-5 grid gap-2">
        {links.map((href) => (
          <Link className="text-sm text-primary-light transition-colors duration-200 hover:text-foreground" href={href} key={href}>
            {href.replace("/services/", "").replace(/-/g, " ")}
          </Link>
        ))}
      </div>
    </div>
  );
}
