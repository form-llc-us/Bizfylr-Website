import { BriefcaseBusiness, ShieldCheck, Target, Workflow } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";

const indicators = [
  {
    title: "Founder-focused delivery",
    description: "We build around speed, commercial clarity, and operating realities.",
    icon: BriefcaseBusiness
  },
  {
    title: "Tech + compliance support",
    description: "Growth systems and operational readiness are treated as one conversation.",
    icon: ShieldCheck
  },
  {
    title: "Conversion-led execution",
    description: "Pages, offers, and systems are built to move visitors toward action.",
    icon: Target
  },
  {
    title: "Operational visibility",
    description: "Dashboards, workflows, and support processes reduce founder guesswork.",
    icon: Workflow
  }
];

export function TrustIndicators() {
  return (
    <section className="section-space-tight">
      <Container className="content-grid md:grid-cols-2 xl:grid-cols-4">
        {indicators.map((indicator, index) => {
          const Icon = indicator.icon;
          return (
            <Reveal delay={index * 0.05} key={indicator.title}>
              <div className="interactive-surface flex h-full min-h-[204px] flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary-light">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-base font-semibold text-foreground">{indicator.title}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{indicator.description}</p>
              </div>
            </Reveal>
          );
        })}
      </Container>
    </section>
  );
}
