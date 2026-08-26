import { serviceImages } from "@/data/images";
import type { ServiceItem } from "@/data/services";
import { Container } from "@/components/shared/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function ServiceFeatureGrid({ service }: { service: ServiceItem }) {
  const images = serviceImages[service.slug];

  return (
    <section className="section-space-tight">
      <Container className="section-stack-tight">
        <SectionHeader
          align="center"
          description="The service is structured around the business problems founders typically need to solve first."
          eyebrow="Solutions"
          title={`What's included in ${service.title.toLowerCase()}`}
        />
        <div className="content-grid mx-auto w-full max-w-[1120px] md:grid-cols-2 xl:grid-cols-3">
          {service.features.map((feature) => (
            <div key={feature} className="interactive-surface rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-left md:p-7">
              <p className="text-sm leading-7 text-foreground/90">{feature}</p>
            </div>
          ))}
        </div>
        <div className="content-grid mx-auto w-full max-w-[980px] lg:grid-cols-2">
          <ImagePlaceholder {...images.detail} variant="consultation" />
          <ImagePlaceholder {...images.workflow} variant="workflow" />
        </div>
      </Container>
    </section>
  );
}
