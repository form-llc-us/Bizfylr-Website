import type { ReactNode } from "react";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { siteImages } from "@/data/images";
import { SITE } from "@/data/site";
import { Container } from "@/components/shared/Container";
import { GlassCard } from "@/components/shared/GlassCard";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const mapImage = siteImages.contact.map;

  return (
    <section className="section-space relative overflow-hidden">
      <Container>
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1fr)] lg:items-start xl:gap-12">
          <div className="min-w-0 space-y-6 md:space-y-8">
            <SectionHeader
              align="left"
              eyebrow="Contact"
              title="Talk to a team that understands both growth and execution."
              description="Use the form for project discussions, support questions, or lead generation inquiries. Include your business stage, goal, and timeline so we can recommend the right next step."
              className="max-w-2xl"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <ContactCard
                href={SITE.phoneHref}
                icon={<Phone className="h-5 w-5 text-primary-light" />}
                title="Phone"
                value={SITE.phone}
              />

              <ContactCard
                href={`mailto:${SITE.email}`}
                icon={<Mail className="h-5 w-5 text-primary-light" />}
                title="Email"
                value={SITE.email}
              />

              <ContactCard
                className="sm:col-span-2"
                action={
                  <WhatsAppButton
                    className="mt-5 w-full justify-center sm:w-auto"
                    label="Chat on WhatsApp"
                    message="Hello Bizfylr team, I would like to connect with your support team."
                    variant="inline"
                  />
                }
                description="Chat with our team for quick guidance on company formation, compliance, websites, and global business setup."
                icon={<MessageCircle className="h-5 w-5 text-emerald" />}
                title="WhatsApp Support"
                value={SITE.whatsapp.display}
              />

              <ContactCard
                icon={<MapPin className="h-5 w-5 text-primary-light" />}
                title="Address"
                value={`${SITE.address.streetAddress}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`}
              />

              <ContactCard
                icon={<Clock3 className="h-5 w-5 text-primary-light" />}
                title="Working Hours"
                value="Mon - Sat, 10:00 AM - 7:00 PM IST"
              />
            </div>

            <div className="pointer-events-none select-none overflow-hidden rounded-[28px] [&_*]:!transform-none [&_*]:!transition-none">
              <ImagePlaceholder {...mapImage} variant="workflow" />
            </div>
          </div>

          <GlassCard className="w-full p-5 md:p-6 lg:sticky lg:top-28 lg:p-7 xl:p-8">
            <div className="mx-auto w-full max-w-[620px] space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-light">
                  Send a message
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  Tell us what you want to build.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Share a few details and the Bizfylr team will review your
                  request before recommending the next practical step.
                </p>
              </div>

              <ContactForm />

              <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
                <p className="text-sm font-semibold text-foreground">
                  What to expect after you reach out
                </p>

                <p className="mt-2 text-sm leading-7 text-muted">
                  Share your goal, timeline, and current setup. Bizfylr can then
                  guide the next step more clearly, whether you need a
                  consultation, scoped proposal, or support follow-up.
                </p>

                <div className="mt-5 grid gap-3 text-sm leading-6 text-foreground/85">
                  <ExpectationItem>
                    Useful for websites, e-commerce, marketplace support,
                    compliance coordination, and founder-facing digital systems.
                  </ExpectationItem>

                  <ExpectationItem>
                    If you are an international founder, mention your country
                    and business stage so the team can guide the conversation
                    faster.
                  </ExpectationItem>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}

function ContactCard({
  icon,
  title,
  value,
  description,
  action,
  href,
  className,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  description?: string;
  action?: ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "interactive-surface group flex min-h-[168px] flex-col rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:border-primary-light/30 hover:bg-white/[0.055] md:p-6",
        className
      )}
    >
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition duration-300 group-hover:border-primary-light/25 group-hover:bg-primary-light/10">
        {icon}
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {title}
      </p>

      {href ? (
        <a
          className="mt-2 break-words text-sm font-medium leading-7 text-foreground transition-colors duration-200 hover:text-primary-light"
          href={href}
        >
          {value}
        </a>
      ) : (
        <p className="mt-2 break-words text-sm font-medium leading-7 text-foreground">
          {value}
        </p>
      )}

      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-auto pt-1">{action}</div> : null}
    </div>
  );
}

function ExpectationItem({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-3">
      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" />
      <span>{children}</span>
    </p>
  );
}
