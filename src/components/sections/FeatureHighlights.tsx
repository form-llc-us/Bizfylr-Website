import { Layers3, Laptop2, LineChart } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { siteImages } from "@/data/images";

const highlights = [
  {
    title: "Premium digital frontends",
    description:
      "Websites, landing pages, and commerce experiences designed to increase trust and conversion quality.",
    points: [
      "Positioning pages built to communicate credibility in the first scroll.",
      "Responsive journeys shaped around inquiry, checkout, or booking outcomes."
    ],
    icon: Laptop2,
  },
  {
    title: "Growth infrastructure",
    description:
      "CRM, automation, dashboards, and founder reporting that reduce bottlenecks and improve operational clarity.",
    points: [
      "Lead flow, onboarding, and delivery systems connected behind the scenes.",
      "Reporting layers that make handoffs and growth decisions easier to trust."
    ],
    icon: Layers3,
  },
  {
    title: "Measurable optimization",
    description:
      "Marketing systems, marketplace support, and execution rhythms backed by cleaner reporting and iteration.",
    points: [
      "Traffic, conversion, and operational performance reviewed through useful metrics.",
      "Optimizations tied to business outcomes instead of isolated vanity numbers."
    ],
    icon: LineChart,
  },
];

export function FeatureHighlights() {
  const featureImage = siteImages.home.consultation;

  return (
    <section className="section-space">
      <Container className="section-stack">
        <SectionHeader
          align="center"
          description="Bizfylr combines product-grade frontend thinking with business operations support so the website is not isolated from the systems behind it."
          eyebrow="Feature Highlights"
          title="A premium digital layer only works when the operating layer behind it is just as strong."
        />

        <div className="mx-auto grid w-full max-w-[1120px] gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <Reveal delay={0.05}>
            <div className="mx-auto w-full max-w-[560px] lg:max-w-none">
              <ImagePlaceholder
                {...featureImage}
                variant="consultation"
              />
            </div>
          </Reveal>

          <div className="grid gap-5">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;

              return (
                <Reveal delay={index * 0.06} key={highlight.title}>
                  <div className="interactive-surface flex h-full min-h-[156px] gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary-light">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="max-w-xl">
                      <p className="text-base font-semibold text-foreground">
                        {highlight.title}
                      </p>

                      <p className="mt-2 text-sm leading-7 text-muted">
                        {highlight.description}
                      </p>

                      <div className="mt-4 grid gap-2 text-sm leading-6 text-foreground/84">
                        {highlight.points.map((point) => (
                          <p key={point} className="flex items-start gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" />
                            <span>{point}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
