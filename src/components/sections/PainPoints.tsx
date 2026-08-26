import { AlertCircle } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";

const painPoints = [
  {
    title: "Disconnected operations",
    description:
      "Your business feels held together by disconnected tools, manual follow-ups, and fragmented handoffs.",
    points: [
      "Important customer context gets lost between inquiry, sales, and delivery.",
      "Founders end up compensating with manual tracking and repeated check-ins."
    ]
  },
  {
    title: "Underperforming digital presence",
    description:
      "The website or store looks functional but fails to communicate premium value or drive enough qualified leads.",
    points: [
      "Visitors do not get enough trust, clarity, or next-step direction quickly enough.",
      "The visual layer may exist, but the conversion architecture remains weak."
    ]
  },
  {
    title: "Growth without a backbone",
    description:
      "Growth channels exist, but there is no clean operational backbone connecting marketing, fulfillment, support, and reporting.",
    points: [
      "Traffic and effort increase, but reporting and execution stay harder to manage.",
      "Without structure, scaling creates more noise instead of stronger momentum."
    ]
  }
] as const;

export function PainPoints() {
  return (
    <section className="section-space">
      <Container className="section-stack">
        <SectionHeader
          align="center"
          description="The common issue is not ambition. It is infrastructure. Founders outgrow improvised systems faster than most teams expect."
          eyebrow="Pain Points"
          title="When the back office is fragile, growth starts to feel heavier than it should."
        />

        <div className="mx-auto grid w-full max-w-[1120px] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((point, index) => (
            <Reveal delay={index * 0.06} key={point.title}>
              <div className="interactive-surface flex h-full min-h-[228px] flex-col gap-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <AlertCircle className="h-6 w-6 text-gold" />
                </div>

                <div className="space-y-3">
                  <p className="text-lg font-semibold text-foreground">{point.title}</p>
                  <p className="text-sm leading-7 text-foreground/90">{point.description}</p>
                </div>

                <div className="grid gap-2 text-sm leading-6 text-foreground/82">
                  {point.points.map((item) => (
                    <p key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
