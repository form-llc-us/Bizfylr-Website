import Image from "next/image";

import { FinalCta } from "@/components/sections/FinalCta";
import { TrustIndicators } from "@/components/sections/TrustIndicators";
import { Container } from "@/components/shared/Container";
import {
  FillImagePlaceholder,
  isPlaceholderImageSrc,
} from "@/components/shared/ImagePlaceholder";
import { PageIntro } from "@/components/shared/PageIntro";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { siteImages } from "@/data/images";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "About Us | Bizfylr Story, Team, Values & Founder Focus",
  description:
    "Learn how Bizfylr helps founders and growing businesses launch, automate, and scale with premium digital infrastructure and execution support.",
  pathname: "/about-us",
});

const team = [
  {
    name: "Tousif Akram",
    role: "Founder & CEO",
    summary:
      "Leads Bizfylr’s vision, client strategy, service direction, and global business execution.",
    image: "/images/team/tousif.webp",
    imagePosition: "object-[center_12%]",
  },
  {
    name: "Modassir Khan",
    role: "Digital Operations Lead",
    summary:
      "Manages web delivery, digital marketing workflows, execution coordination, and growth operations.",
    image: "/images/team/modassir.webp",
    imagePosition: "object-center",
  },
  {
    name: "Aasif",
    role: "Business Operation",
    summary:
      "Supports company registration, documentation, marketplace readiness, and client onboarding workflows.",
    image: "/images/team/aasif-20260707.jpg",
    imagePosition: "object-center",
  },
  {
    name: "Ashutosh",
    role: "Web Developer",
    summary:
      "Builds clean, responsive, and performance-focused web experiences for modern business brands.",
    image: "/images/team/ashutosh.jpg",
    imagePosition: "object-center",
  },
  {
    name: "Supriya",
    role: "Customer Support Specialist",
    summary:
      "Helps clients stay informed, supported, and confident throughout their service journey.",
    image: "/images/team/supriya-20260707.jpg",
    imagePosition: "object-center",
  },
] as const;

const timeline = [
  "Started with founder-focused digital support for startups and online businesses.",
  "Expanded into business setup, websites, e-commerce operations, and marketplace support.",
  "Developed a broader systems-first model that combines growth, operations, and delivery.",
  "Now positioned as a premium partner for founders building global-ready digital businesses.",
];

export default function AboutPage() {
  const images = siteImages.about;

  return (
    <>
      <PageIntro
        align="center"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        currentPath="/about-us"
        description="Bizfylr exists to help founders build digital trust, operational structure, and growth-ready infrastructure without the chaos of juggling fragmented vendors."
        eyebrow="About Bizfylr"
        title="A founder-focused company built around execution, systems thinking, and global business readiness."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <AboutHeroCard
            {...images.hero}
            priority
            eyebrow="Team Culture"
            title="A delivery team built around practical growth support"
            description="Design, development, and operational thinking working side by side."
          />

          <AboutHeroCard
            alt="Tousif Akram leading Bizfylr digital business execution and client delivery planning"
            eyebrow="Founder Led"
            src="/images/team/tousif.webp"
            imagePosition="object-[center_12%]"
            title="Built with founder-level accountability at every step"
            description="A focused team structure that connects strategy, execution, and client delivery."
          />

          <AboutHeroCard
            {...images.founder}
            eyebrow="Founder Focus"
            title="Built for clients who need speed, clarity, and stronger systems"
            description="The company story centers on practical execution, not vanity positioning."
          />

          <AboutHeroCard
            {...images.process}
            eyebrow="How We Work"
            title="Execution stays close to the commercial problem being solved"
            description="That is what keeps the work useful beyond launch week."
          />
        </div>
      </PageIntro>

      <section className="section-space-tight">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            <ContentCard
              description="Help founders and growing businesses build stronger digital infrastructure, clearer growth systems, and more credible online experiences."
              points={[
                "Support launches, rebuilds, and operating improvements with one coordinated delivery layer.",
                "Make websites, workflows, reporting, and support systems work together more cleanly.",
              ]}
              title="Mission"
            />

            <ContentCard
              description="Become the premium operating and digital execution partner businesses trust as they move from local execution to global readiness."
              points={[
                "Serve founders who need strategic clarity without losing implementation speed.",
                "Build long-term trust through design quality, stronger systems, and practical delivery discipline.",
              ]}
              title="Vision"
            />

            <ContentCard
              description="Clarity, speed, accountability, design quality, technical rigor, and practical business usefulness."
              points={[
                "Every engagement should reduce confusion and make the next business decision easier.",
                "Execution quality should feel premium without becoming bloated or slow-moving.",
              ]}
              title="Values"
            />
          </div>
        </Container>
      </section>

      <TrustIndicators />

      <section className="section-space-tight">
        <Container className="section-stack">
          <SectionHeader
            description="A focused team combining founder-led strategy, digital execution, business setup support, web development, and client care."
            align="center"
            eyebrow="Team"
            title="Meet the people powering Bizfylr’s delivery engine."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {team.map((member) => (
              <TeamCard
                key={member.name}
                name={member.name}
                role={member.role}
                summary={member.summary}
                image={member.image}
                imagePosition={member.imagePosition}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space-tight">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <SectionHeader
                align="left"
                description="The business has evolved from individual service execution into a wider systems-first support model."
                eyebrow="Timeline"
                title="Milestones in how the company's delivery model matured."
              />
            </div>

            <div className="grid gap-4">
              {timeline.map((item, index) => (
                <article
                  key={item}
                  className="interactive-surface rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-7"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-light">
                    Phase {index + 1}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-foreground/90">
                    {item}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}

function AboutHeroCard({
  src,
  image,
  alt,
  eyebrow,
  title,
  description,
  imagePosition = "object-center",
  priority = false,
}: {
  src?: string;
  image?: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  imagePosition?: string;
  priority?: boolean;
}) {
  const imageSrc = src ?? image ?? "";

  return (
    <article className="group interactive-surface flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-2 shadow-glow">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[22px] bg-white/[0.04]">
        {isPlaceholderImageSrc(imageSrc) ? (
          <FillImagePlaceholder
            className={cn(
              "transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              imagePosition
            )}
            label={`${title} Placeholder`}
          />
        ) : (
          <Image
            alt={alt}
            className={cn(
              "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              imagePosition
            )}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 46vw, 100vw"
            src={imageSrc}
          />
        )}

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/45 via-background/5 to-transparent"
        />
      </div>

      <div className="flex min-h-[230px] flex-1 flex-col justify-between p-5 sm:p-6 md:p-7">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary-light">
            {eyebrow}
          </p>

          <h2 className="mt-3 max-w-xl font-heading text-2xl font-extrabold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-3xl">
            {title}
          </h2>
        </div>

        <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-muted sm:text-base">
          {description}
        </p>
      </div>
    </article>
  );
}

function TeamCard({
  name,
  role,
  summary,
  image,
  imagePosition = "object-center",
}: {
  name: string;
  role: string;
  summary: string;
  image: string;
  imagePosition?: string;
}) {
  return (
    <article className="group interactive-surface flex h-full flex-col overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] shadow-glow transition duration-300 hover:-translate-y-1 hover:border-primary-light/35">
      <div className="relative aspect-[4/5] overflow-hidden border-b border-white/10 bg-white/[0.04]">
        {isPlaceholderImageSrc(image) ? (
          <FillImagePlaceholder
            className={cn(
              "transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              imagePosition
            )}
            label={`${name} Placeholder`}
          />
        ) : (
          <Image
            alt={`${name} - ${role} at Bizfylr`}
            className={cn(
              "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              imagePosition
            )}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={image}
          />
        )}

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/70 to-transparent"
        />
      </div>

      <div className="flex min-h-[190px] flex-1 flex-col items-center p-5 text-center md:p-6">
        <h2 className="font-heading text-xl font-extrabold leading-tight tracking-[-0.03em] text-foreground">
          {name}
        </h2>

        <p className="mt-3 inline-flex min-h-8 items-center justify-center rounded-full border border-primary-light/25 bg-primary-light/10 px-3.5 py-1 text-center text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-light">
          {role}
        </p>

        <p className="mt-4 text-sm font-medium leading-6 text-muted">
          {summary}
        </p>
      </div>
    </article>
  );
}

function ContentCard({
  title,
  description,
  points,
}: {
  title: string;
  description: string;
  points?: readonly string[];
}) {
  return (
    <article className="interactive-surface flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>

      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>

      {points?.length ? (
        <div className="mt-5 grid gap-3 text-sm leading-6 text-foreground/82">
          {points.map((point) => (
            <p key={point} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" />
              <span>{point}</span>
            </p>
          ))}
        </div>
      ) : null}
    </article>
  );
}
