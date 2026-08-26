import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { GradientButton } from "@/components/shared/GradientButton";
import { TrustBadge } from "@/components/shared/TrustBadge";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: {
    absolute: "Payment Received | Bizfylr"
  },
  description: "Thank you for contacting Bizfylr or completing the next step in your project journey.",
  alternates: {
    canonical: `${SITE.url}/thank-you`
  },
  robots: {
    index: false,
    follow: false
  }
};

export default async function ThankYouPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const source = typeof params.source === "string" ? params.source : "lead";

  const message =
    source === "payment"
      ? "Your payment request has been received. If payment verification completed successfully, our team will continue the next operational step from the server-side workflow."
      : source === "contact"
        ? "Your message has been sent. Bizfylr will review your requirements and follow up with the appropriate next steps."
        : "Your request is in. Our team will use your details to recommend the right growth, website, or systems path.";

  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/12 bg-white/[0.04] px-6 py-12 text-center shadow-glow md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald">Success</p>
          <h1 className="mt-4 font-heading text-5xl font-extrabold tracking-[-0.06em] text-foreground">Thank you.</h1>
          <p className="mt-4 text-base leading-8 text-muted">{message}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <TrustBadge label="Founder-focused follow-up" />
            <TrustBadge label="No fake payment verification" />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <GradientButton href="/">Back to Homepage</GradientButton>
            <GradientButton href="/services" variant="outline">
              Explore Services
            </GradientButton>
          </div>
          <div className="mt-6 text-sm text-muted">
            <Link href="/contact-us">Need anything urgent? Contact the team.</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
