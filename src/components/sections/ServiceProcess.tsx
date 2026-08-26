import type { ServiceItem } from "@/data/services";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function ServiceProcess({ service }: { service: ServiceItem }) {
  return (
    <section className="section-space-tight">
      <Container className="section-stack-tight">
        <SectionHeader
          align="center"
          description="We keep the process structured so priorities stay clear and the engagement stays commercially useful."
          eyebrow="Process"
          title="How the engagement moves from idea to execution"
        />
        <div className="content-grid mx-auto w-full max-w-[1120px] md:grid-cols-2 xl:grid-cols-4">
          {service.process.map((step, index) => (
            <div key={step} className="interactive-surface rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-left md:p-7">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary-light">Step {index + 1}</p>
              <p className="text-sm leading-7 text-foreground/90">{step}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
