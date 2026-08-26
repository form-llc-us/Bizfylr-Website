import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Rocket, ShieldCheck, Workflow } from "lucide-react";

import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { Badge } from "@/components/shared/Badge";
import { GradientButton } from "@/components/shared/GradientButton";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { Reveal } from "@/components/shared/Reveal";
import { StatCard } from "@/components/shared/StatCard";
import { TrustBadge } from "@/components/shared/TrustBadge";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { siteImages } from "@/data/images";
import { SITE } from "@/data/site";

const trustBadges = [
  "1,500+ founders supported",
  "Global-ready business solutions",
  "Fast execution",
  "Tech + compliance support"
];

export function HeroSection() {
  const heroImage = siteImages.home.hero;

  return (
    <section className="relative isolate overflow-hidden pb-16 pt-12 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20">
      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(380px,440px)] lg:items-start lg:gap-14">
          <Reveal className="max-w-[760px] space-y-8">
            <div className="space-y-6">
              <Badge>Global Business Growth &amp; Digital Infrastructure Partner</Badge>

              <h1 className="font-heading text-[34px] font-extrabold leading-[0.96] tracking-[-0.055em] text-foreground sm:text-5xl md:text-6xl xl:text-[68px]">
                Build,{" "}
                <span className="bg-gradient-to-r from-primary-light to-white bg-clip-text text-transparent">
                  Launch
                </span>{" "}
                &amp;{" "}
                <span className="bg-gradient-to-r from-emerald to-primary-light bg-clip-text text-transparent">
                  Scale
                </span>{" "}
                Your Business With Premium Digital Infrastructure
              </h1>

              <p className="max-w-[690px] text-[0.97rem] leading-7 text-muted md:text-lg md:leading-8">
                Bizfylr helps founders turn weak digital presence, scattered lead flow, and manual operations into
                premium websites, connected growth systems, and conversion-ready infrastructure built to support real
                revenue conversations.
              </p>
            </div>

            <div className="flex max-w-[720px] flex-wrap gap-3">
              {trustBadges.map((badge) => (
                <TrustBadge key={badge} label={badge} />
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <GradientButton href={SITE.consultationUrl} rel="noreferrer" size="lg" target="_blank">
                {SITE.primaryCtaLabel}
              </GradientButton>

              <GradientButton href="/portfolio" size="lg" variant="outline">
                View Case Studies
                <ArrowRight className="h-4 w-4" />
              </GradientButton>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <Link
                className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-foreground"
                href={SITE.phoneHref}
              >
                Call {SITE.phone}
              </Link>
              <Link
                className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-foreground"
                href={getWhatsAppUrl("Hello Bizfylr team, I am interested in your services. Please guide me.")}
                rel="noreferrer"
                target="_blank"
              >
                WhatsApp project inquiry
              </Link>
              <span className="inline-flex items-center gap-2 text-foreground/80">
                30-minute founder consultation
              </span>
            </div>
          </Reveal>

          <Reveal className="w-full lg:justify-self-end" delay={0.1}>
            <div className="mx-auto w-full max-w-[440px] lg:mx-0">
              <LeadCaptureForm />
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-10" delay={0.15}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Clients Supported" value="1,500+" />
            <StatCard label="Digital Support" value="24/7" />
            <StatCard label="Core Services" value="10+" />
            <StatCard label="Founder Focus" value="Global" />
          </div>
        </Reveal>

        <Reveal className="mt-8" delay={0.2}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.96fr)_minmax(300px,0.72fr)] lg:items-start">
            <div className="w-full max-w-[640px]">
              <ImagePlaceholder {...heroImage} priority variant="dashboard" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <FeatureMini
                icon={<Rocket className="h-5 w-5 text-primary-light" />}
                title="Global-ready launch"
                description="Web, trust, and intake foundations for serious launches"
              />

              <FeatureMini
                icon={<Workflow className="h-5 w-5 text-emerald" />}
                title="Execution with speed"
                description="Design, setup, and implementation carried through cleanly"
              />

              <FeatureMini
                icon={<ShieldCheck className="h-5 w-5 text-gold" />}
                title="Operational confidence"
                description="Reporting, process clarity, and more reliable workflows"
              />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute right-[-140px] top-10 h-80 w-80 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 left-[-140px] h-80 w-80 rounded-full bg-emerald/15 blur-[120px]" />
    </section>
  );
}

function FeatureMini({
  icon,
  title,
  description
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="interactive-surface flex min-h-[118px] items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/5">
        {icon}
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold leading-6 text-foreground">{title}</p>

        <p className="text-xs uppercase tracking-[0.16em] text-muted">{description}</p>
      </div>
    </div>
  );
}
