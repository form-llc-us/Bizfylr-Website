import Link from "next/link";

import { FaqSection } from "@/components/sections/FaqSection";
import { ServiceCta } from "@/components/sections/ServiceCta";
import { ServiceFeatureGrid } from "@/components/sections/ServiceFeatureGrid";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ServiceProcess } from "@/components/sections/ServiceProcess";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { JsonLd } from "@/components/shared/JsonLd";
import { serviceLookup, services, type ServiceItem } from "@/data/services";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";

export function ServiceDetailPage({ slug }: { slug: ServiceItem["slug"] }) {
  const service = serviceLookup[slug];
  const related = service.relatedServices.map((relatedSlug) => serviceLookup[relatedSlug]);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.title }
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.title, href: `/services/${service.slug}` }
        ])}
      />
      <JsonLd
        data={serviceSchema({
          name: service.title,
          description: service.seoDescription,
          url: `/services/${service.slug}`
        })}
      />
      <section className="pt-8 md:pt-10">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </section>
      <ServiceHero service={service} />
      <section className="section-space-tight">
        <Container className="content-grid-lg mx-auto w-full max-w-[1120px] lg:grid-cols-2 lg:items-start">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-left md:p-7 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Problems we solve</p>
            <div className="mt-5 grid gap-4">
              {service.painPoints.map((point) => (
                <div key={point} className="interactive-surface rounded-[20px] border border-white/8 bg-background/50 p-4 text-sm leading-7 text-foreground/90">
                  {point}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-left md:p-7 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald">Deliverables</p>
            <div className="mt-5 grid gap-4">
              {service.deliverables.map((deliverable) => (
                <div
                  key={deliverable}
                  className="interactive-surface rounded-[20px] border border-white/8 bg-background/50 p-4 text-sm leading-7 text-foreground/90"
                >
                  {deliverable}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <ServiceFeatureGrid service={service} />
      <ServiceProcess service={service} />
      <section className="section-space-tight">
        <Container className="content-grid-lg mx-auto w-full max-w-[1120px] lg:grid-cols-2 lg:items-start">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-left md:p-7 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-light">Use cases</p>
            <ul className="mt-4 space-y-3">
              {service.useCases.map((useCase) => (
                <li key={useCase} className="interactive-surface rounded-[20px] border border-white/8 bg-background/50 p-4 text-sm leading-7 text-foreground/90">
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-left md:p-7 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Related services</p>
            <div className="mt-4 grid gap-4">
              {related.map((item) => (
                <Link
                  className="interactive-surface rounded-[20px] border border-white/8 bg-background/50 p-4 text-left text-sm transition-colors hover:text-primary-light"
                  href={`/services/${item.slug}`}
                  key={item.slug}
                >
                  <span className="block font-semibold text-foreground">{item.title}</span>
                  <span className="mt-2 block leading-7 text-muted">{item.shortDescription}</span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <FaqSection items={service.faqs} title={`What to know about ${service.title.toLowerCase()}`} />
      <ServiceCta title={service.title} />
    </>
  );
}

export function getServiceStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}
