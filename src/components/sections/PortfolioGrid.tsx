import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { FillImagePlaceholder, isPlaceholderImageSrc } from "@/components/shared/ImagePlaceholder";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { portfolioProjects } from "@/data/portfolio";

export function PortfolioGrid({
  limit,
  showHeader = true,
}: {
  limit?: number;
  showHeader?: boolean;
}) {
  const projects =
    typeof limit === "number" ? portfolioProjects.slice(0, limit) : portfolioProjects;

  return (
    <section className={showHeader ? "section-space" : "pb-16 pt-2 md:pb-20 md:pt-4"}>
      <Container className="section-stack">
        {showHeader ? (
          <SectionHeader
            align="center"
            description="Selected work spanning corporate sites, commerce builds, and category-specific digital experiences."
            eyebrow="Portfolio"
            title="A portfolio built around business outcomes, not template repetition."
          />
        ) : null}

        <div className="mx-auto grid w-full max-w-[1120px] gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const projectHref = project.href ?? "/contact-us";
            const isExternal = Boolean(project.href && /^https?:\/\//.test(project.href));
            const visibleServices = project.services.slice(0, 3);
            const hiddenServicesCount = project.services.length - visibleServices.length;

            return (
              <article
                key={project.name}
                className="group interactive-surface flex h-full min-h-[480px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] md:min-h-[530px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-white/[0.02]">
                  {isPlaceholderImageSrc(project.image) ? (
                    <FillImagePlaceholder
                      className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      label={`${project.name} Placeholder`}
                    />
                  ) : (
                    <Image
                      alt={project.name}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      src={project.image}
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
                      {project.category}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold leading-tight text-foreground">
                      {project.name}
                    </h3>
                  </div>

                  <p className="mt-4 min-h-[72px] overflow-hidden text-sm leading-7 text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] md:min-h-[80px]">
                    {project.description}
                  </p>

                  {project.outcomes?.length ? (
                    <div className="mt-4 grid gap-2 text-sm leading-6 text-foreground/84">
                      {project.outcomes.slice(0, 2).map((item) => (
                        <p key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" />
                          <span>{item}</span>
                        </p>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 flex min-h-[66px] flex-wrap content-start gap-2 md:min-h-[74px]">
                    {visibleServices.map((service) => (
                      <span
                        key={service}
                        className="inline-flex h-8 items-center rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs text-foreground/90"
                      >
                        {service}
                      </span>
                    ))}

                    {hiddenServicesCount > 0 ? (
                      <span className="inline-flex h-8 items-center rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs text-muted">
                        +{hiddenServicesCount} more
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-auto pt-6">
                    <Link
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light transition-colors duration-200 group-hover:text-foreground"
                      href={projectHref}
                      rel={isExternal ? "noreferrer" : undefined}
                      target={isExternal ? "_blank" : undefined}
                    >
                      {project.href ? "View Project" : "Discuss Similar Project"}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
