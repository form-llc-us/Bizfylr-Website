import { siteImages } from "@/data/images";
import { Container } from "@/components/shared/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";

const steps = [
  {
    title: "Discovery and growth audit",
    description: "We understand the offer, growth bottlenecks, customer flow, and current infrastructure.",
    note: "This stage clarifies where positioning, systems, or funnel friction are costing momentum."
  },
  {
    title: "System and page architecture",
    description: "We define the right structure for website pages, workflows, integrations, and support cadence.",
    note: "The output is a clearer execution map, not just a list of disconnected deliverables."
  },
  {
    title: "Execution with quality control",
    description: "Design, build, configure, and refine the experience with production-level attention to detail.",
    note: "Delivery moves through design, setup, QA, and iteration with visibility on what is being shipped."
  },
  {
    title: "Launch and support rhythm",
    description: "You go live with a clearer foundation and a path for continued growth, iteration, and support.",
    note: "Post-launch support focuses on improvements that strengthen conversion, reporting, and operational clarity."
  }
] as const;

export function HowItWorks() {
  const workflowImage = siteImages.home.workflow;

  return (
    <section className="section-space">
      <Container className="section-stack">
        <SectionHeader
          align="center"
          description="A structured process keeps the work founder-friendly while preserving design, engineering, and conversion quality."
          eyebrow="How It Works"
          title="A practical delivery model built for speed without chaos."
        />
        <div className="content-grid-lg lg:grid-cols-[1fr_0.92fr] lg:items-start">
          <div className="content-grid">
            {steps.map((step, index) => (
              <Reveal delay={index * 0.05} key={step.title}>
                <div className="interactive-surface rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary-light">Step {index + 1}</p>
                  <p className="text-lg font-semibold text-foreground">{step.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{step.description}</p>
                  <p className="mt-4 text-sm leading-6 text-foreground/82">{step.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <ImagePlaceholder {...workflowImage} variant="workflow" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
