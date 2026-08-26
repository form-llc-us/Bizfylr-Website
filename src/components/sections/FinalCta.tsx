import { Container } from "@/components/shared/Container";
import { GradientButton } from "@/components/shared/GradientButton";

export function FinalCta({
  title = "Ready to turn your website, systems, and growth operations into a stronger business asset?",
  description = "Book a consultation and get a clear next-step path tailored to your current stage, priorities, and commercial goals.",
  eyebrow = "Next step",
}: {
  title?: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <section className="section-space-tight">
      <Container>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-white/12 bg-gradient-to-br from-primary/16 via-white/[0.045] to-emerald/14 px-6 py-8 shadow-glow sm:px-8 md:px-10 md:py-9">
          <div className="pointer-events-none absolute right-[-60px] top-[-60px] h-44 w-44 rounded-full bg-primary/25 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-[-60px] left-[-60px] h-40 w-40 rounded-full bg-emerald/20 blur-[100px]" />

          <div className="relative z-10 grid gap-6 text-center lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:text-left">
            <div className="mx-auto max-w-3xl space-y-4 lg:mx-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-light">
                {eyebrow}
              </p>

              <h2 className="font-heading text-2xl font-extrabold leading-[1.08] tracking-[-0.045em] text-foreground sm:text-3xl md:text-4xl">
                {title}
              </h2>

              <p className="mx-auto max-w-2xl text-sm leading-7 text-muted md:text-base lg:mx-0">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-end">
              <GradientButton href="/contact-us" size="lg">
                Book Free Consultation
              </GradientButton>

              <GradientButton href="/services" size="lg" variant="outline">
                Explore Services
              </GradientButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
