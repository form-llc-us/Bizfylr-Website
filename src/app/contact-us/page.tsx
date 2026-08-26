import { ContactSection } from "@/components/sections/ContactSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { PageIntro } from "@/components/shared/PageIntro";
import { siteImages } from "@/data/images";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact Us | Lead Generation, Consultations & Support",
  description:
    "Contact Bizfylr for founder-focused growth consultations, website projects, e-commerce support, compliance help, or digital execution planning.",
  pathname: "/contact-us"
});

const contactPaths = [
  {
    label: "Project consultation",
    title: "Start a new website, store, or digital system",
    description:
      "Share your business goal, current stage, and expected timeline so we can recommend the right execution path.",
    points: [
      "Good for launches, redesigns, e-commerce builds, and digital infrastructure planning.",
      "Useful when you need scope clarity before committing to delivery."
    ]
  },
  {
    label: "Growth and operations",
    title: "Improve an existing digital business setup",
    description:
      "Discuss marketing, marketplace operations, e-commerce management, automation, reporting, or support workflows.",
    points: [
      "Best for active businesses that need cleaner systems, stronger reporting, or execution support.",
      "Relevant when the business is running, but the operating layer is not scaling cleanly."
    ]
  },
  {
    label: "Client support",
    title: "Get clarity on a service or active request",
    description:
      "Use this route for service questions, follow-ups, scope clarification, or coordination with the Bizfylr team.",
    points: [
      "Helpful for current clients, retained support, or requests already in progress.",
      "Keeps follow-up conversations structured and easier to route internally."
    ]
  }
] as const;

const responseSteps = [
  "Share your business stage, project goal, and the main problem you want solved.",
  "Mention whether you need a new build, improvement, or ongoing support.",
  "Add links, references, current website details, or marketplace/store links if available."
] as const;

export default function ContactPage() {
  const images = siteImages.contact;

  return (
    <>
      <PageIntro
        align="center"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        currentPath="/contact-us"
        description="Use this page to discuss a new project, request support, plan a growth system, or get clarity before moving into execution."
        eyebrow="Contact Bizfylr"
        title="Let's understand what you want to build, improve, or scale next."
      />

      <section className="section-space-tight pt-0">
        <div className="container">
          <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-3">
            {contactPaths.map((item) => (
              <article
                key={item.title}
                className="rounded-[26px] border border-white/12 bg-white/[0.035] p-5 shadow-glow transition duration-300 hover:-translate-y-1 hover:border-primary-light/35 hover:bg-white/[0.055] sm:p-6"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-primary-light">
                  {item.label}
                </p>

                <h2 className="mt-3 font-heading text-xl font-extrabold leading-tight tracking-[-0.035em] text-foreground">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-foreground/72">
                  {item.description}
                </p>

                <div className="mt-4 grid gap-2 text-sm leading-6 text-foreground/78">
                  {item.points.map((point) => (
                    <p key={point} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" />
                      <span>{point}</span>
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      <section className="section-space-tight pt-0">
        <div className="container">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-primary-light">
              How to get a useful response
            </p>

            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight tracking-[-0.045em] text-foreground sm:text-4xl">
              Clear intake helps us guide the next step faster.
            </h2>

            <p className="mt-4 text-base leading-7 text-foreground/72">
              A structured request helps our team evaluate your requirement, timeline, scope, and the right support model without unnecessary back-and-forth.
            </p>
          </div>

          <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div className="rounded-[28px] border border-white/12 bg-white/[0.04] p-5 shadow-glow backdrop-blur sm:p-6">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-primary-light">
                Response flow
              </p>

              <h3 className="mt-3 font-heading text-2xl font-extrabold leading-tight tracking-[-0.04em] text-foreground sm:text-3xl">
                Send the right context and we can respond with better direction.
              </h3>

              <p className="mt-4 text-sm leading-6 text-foreground/72 sm:text-base sm:leading-7">
                Whether you need a website, e-commerce setup, marketplace support, marketing execution, or operational systems, the first message should explain what stage you are in and what outcome you want.
              </p>

              <div className="mt-6 grid gap-3">
                {responseSteps.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-background/45 p-3 text-sm leading-6 text-foreground/76"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ImagePlaceholder
                {...images.hero}
                priority
                variant="dashboard"
              />

              <ImagePlaceholder
                {...images.support}
                variant="consultation"
              />
            </div>
          </div>
        </div>
      </section>

      <FinalCta
        description="Share the business stage, project goal, and timeline so Bizfylr can guide the right next step without unnecessary back-and-forth."
        eyebrow="Contact support"
        title="Need a practical next step for your website, launch, compliance, or growth systems?"
      />
    </>
  );
}
