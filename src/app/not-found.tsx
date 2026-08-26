import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { GradientButton } from "@/components/shared/GradientButton";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Page Not Found",
  description: "The page you requested could not be found. Explore Bizfylr services, pricing, or contact the team.",
  pathname: "/404"
});

metadata.robots = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false
  }
};

export default function NotFound() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/12 bg-white/[0.04] px-6 py-12 text-center shadow-glow md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-light">404</p>
          <h1 className="mt-4 font-heading text-5xl font-extrabold tracking-[-0.06em] text-foreground">
            The route exists in neither the growth plan nor the codebase.
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Use the links below to get back to the pages most visitors need.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <GradientButton href="/">Back to Homepage</GradientButton>
            <GradientButton href="/services" variant="outline">
              Services
            </GradientButton>
            <GradientButton href="/pricing" variant="outline">
              Pricing
            </GradientButton>
            <GradientButton href="/contact-us" variant="outline">
              Contact
            </GradientButton>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-5 text-sm text-muted">
            <Link href="/services">Explore services</Link>
            <Link href="/pricing">View pricing</Link>
            <Link href="/portfolio">See portfolio</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
