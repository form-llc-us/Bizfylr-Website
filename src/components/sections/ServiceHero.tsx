import { serviceImages } from "@/data/images";
import type { ServiceItem } from "@/data/services";
import { Container } from "@/components/shared/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { TrustBadge } from "@/components/shared/TrustBadge";

export function ServiceHero({ service }: { service: ServiceItem }) {
  const heroImage = serviceImages[service.slug].hero;

  return (
    <section className="section-space-tight">
      <Container className="content-grid-lg lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,420px)] lg:items-center lg:justify-between">
        <div className="max-w-[52rem] space-y-5 md:space-y-6">
          <SectionHeader
            align="left"
            description={service.heroSummary}
            eyebrow={service.heroEyebrow}
            headingLevel="h1"
            title={service.heroTitle}
          />
          <div className="flex flex-wrap justify-start gap-3">
            <TrustBadge label="Founder-focused delivery" />
            <TrustBadge label="Fast execution" />
            <TrustBadge label="Global-ready support" />
          </div>
        </div>
        <div className="w-full max-w-[420px] lg:justify-self-end">
          <ImagePlaceholder {...heroImage} priority variant="dashboard" />
        </div>
      </Container>
    </section>
  );
}
