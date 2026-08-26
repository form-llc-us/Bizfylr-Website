import { BadgeCheck, Clock3, Globe2, Wrench } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";

const reasons = [
  {
    title: "Premium but pragmatic",
    description:
      "The output feels enterprise-grade without losing speed or founder accessibility.",
    points: [
      "Useful when you want premium positioning without bloated process overhead.",
      "The work stays commercially practical, not design-forward for its own sake."
    ],
    icon: BadgeCheck,
  },
  {
    title: "Global founder awareness",
    description:
      "We understand cross-border setup, digital trust, and remote-first business operations.",
    points: [
      "Relevant for founders serving clients, buyers, or partners across multiple markets.",
      "The support model accounts for credibility, process, and international-ready execution."
    ],
    icon: Globe2,
  },
  {
    title: "Hands-on execution",
    description:
      "Strategy only matters if the build, setup, and support are carried through properly.",
    points: [
      "That includes implementation details across pages, workflows, support, and handoff quality.",
      "The goal is not recommendations alone; it is usable execution that actually ships."
    ],
    icon: Wrench,
  },
  {
    title: "Fast-moving support",
    description:
      "Clear communication and operational follow-through help projects keep momentum.",
    points: [
      "Fast-moving does not mean loose; it means priorities stay visible and actionable.",
      "That helps founders make decisions quickly without losing quality control."
    ],
    icon: Clock3,
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-space">
      <Container className="section-stack">
        <SectionHeader
          align="center"
          description="Bizfylr is structured to support businesses that want higher quality and stronger systems without the drag of fragmented vendors."
          eyebrow="Why Choose Bizfylr"
          title="Built for founders who want a credible growth partner, not a task-only vendor."
        />

        <div className="mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-2">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <div
                key={reason.title}
                className="interactive-surface flex h-full min-h-[220px] flex-col items-center rounded-[26px] border border-white/10 bg-white/[0.03] p-6 text-center md:p-7"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-primary-light">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="max-w-md">
                  <p className="text-lg font-semibold text-foreground">
                    {reason.title}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {reason.description}
                  </p>

                  <div className="mt-4 grid gap-2 text-sm leading-6 text-foreground/82">
                    {reason.points.map((point) => (
                      <p key={point} className="flex items-start justify-center gap-3 text-center">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" />
                        <span>{point}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
