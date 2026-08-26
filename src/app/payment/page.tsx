import type { ReactNode } from "react";
import {
  BadgeIndianRupee,
  CheckCircle2,
  FileText,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { PaymentForm } from "@/components/forms/PaymentForm";
import { Container } from "@/components/shared/Container";
import { GlassCard } from "@/components/shared/GlassCard";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { PageIntro } from "@/components/shared/PageIntro";
import { siteImages } from "@/data/images";
import { isPaymentConfigured } from "@/lib/payment";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Payment | Secure Service Payments",
  description:
    "Complete secure Bizfylr service payments with Razorpay, server-side validation, invoice-ready billing details, and production-safe verification.",
  pathname: "/payment",
});

export default function PaymentPage() {
  const paymentEnabled = isPaymentConfigured();
  const images = siteImages.payment;

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Payment" }]}
        currentPath="/payment"
        eyebrow="Secure Payment"
        title="Complete your Bizfylr payment securely."
        description="Use this checkout only after your service amount, billing details, coupon, and engagement scope have been confirmed by the Bizfylr team."
        align="center"
      />

      <section className="section-space-tight pt-0">
        <Container>
          <div className="mx-auto max-w-6xl">
            <GlassCard className="overflow-visible p-0">
              <div className="border-b border-white/10 bg-white/[0.035] px-5 py-5 md:px-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">
                      Checkout Details
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                      Payment information
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-muted">
                      Fill in the approved amount and billing details. Coupon,
                      GST, and total payable amount are verified securely before
                      Razorpay checkout.
                    </p>
                  </div>

                  <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1.5 text-xs font-semibold text-emerald">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    Razorpay secured
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-5 md:px-7 md:py-7">
                <PaymentForm paymentEnabled={paymentEnabled} />
              </div>
            </GlassCard>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={<CheckCircle2 className="h-4 w-4 text-emerald" />}
                title="Approved amount"
                text="Use only the amount confirmed by the Bizfylr team."
              />

              <InfoCard
                icon={<BadgeIndianRupee className="h-4 w-4 text-emerald" />}
                title="Coupon and GST"
                text="Coupon impact and GST are calculated inside checkout."
              />

              <InfoCard
                icon={<FileText className="h-4 w-4 text-emerald" />}
                title="Billing record"
                text="Billing details are saved with the payment order."
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <TrustRow
                icon={<ShieldCheck className="h-4 w-4 text-emerald" />}
                text="Server-side order verification"
              />

              <TrustRow
                icon={<LockKeyhole className="h-4 w-4 text-emerald" />}
                text="No secret keys exposed"
              />

              <TrustRow
                icon={<BadgeIndianRupee className="h-4 w-4 text-emerald" />}
                text="Coupon and GST validated securely"
              />
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <GlassCard className="overflow-hidden p-0 transition duration-300 hover:border-primary-light/30 hover:bg-white/[0.045]">
                <div className="border-b border-white/10 px-5 py-4 md:px-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">
                    Secure Checkout
                  </p>

                  <h2 className="mt-2 text-lg font-semibold text-foreground">
                    Payment process overview
                  </h2>
                </div>

                <div className="pointer-events-none select-none overflow-hidden [&_*]:!transform-none [&_*]:!transition-none">
                  <ImagePlaceholder
                    {...images.hero}
                    priority
                    variant="dashboard"
                  />
                </div>
              </GlassCard>

              <GlassCard className="overflow-hidden p-0 transition duration-300 hover:border-primary-light/30 hover:bg-white/[0.045]">
                <div className="border-b border-white/10 px-5 py-4 md:px-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">
                    Billing Summary
                  </p>

                  <h2 className="mt-2 text-lg font-semibold text-foreground">
                    Coupon, GST, and invoice details
                  </h2>
                </div>

                <div className="pointer-events-none select-none overflow-hidden [&_*]:!transform-none [&_*]:!transition-none">
                  <ImagePlaceholder {...images.summary} variant="consultation" />
                </div>
              </GlassCard>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <GlassCard className="h-full p-5 transition duration-300 hover:border-primary-light/30 hover:bg-white/[0.055]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          {icon}
        </span>

        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function TrustRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex h-full items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-foreground/90 transition duration-300 hover:border-primary-light/30 hover:bg-white/[0.055]">
      <span className="mt-1 shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
