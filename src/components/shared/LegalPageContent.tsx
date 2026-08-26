import Link from "next/link";

import type { LegalSection } from "@/data/legal";
import { Container } from "@/components/shared/Container";

type LegalPageContentProps = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPageContent({ title, description, lastUpdated, sections }: LegalPageContentProps) {
  return (
    <section className="section-space-tight">
      <Container className="content-grid-lg lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-light">Legal</p>
            <h1 className="mt-4 font-heading text-[2.35rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-foreground md:text-4xl">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-muted">{description}</p>
            <p className="mt-4 text-sm text-foreground">Last updated: {lastUpdated}</p>
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Contents</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {sections.map((section, index) => (
                  <Link
                    className="text-sm text-muted transition-colors hover:text-foreground"
                    href={`#section-${index + 1}`}
                    key={section.title}
                  >
                    {section.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <div className="section-stack-tight">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-light">Policy overview</p>
            <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
          </div>
          <article className="prose prose-invert max-w-none rounded-[32px] border border-white/10 bg-white/[0.03] p-5 md:p-8 lg:p-9">
            {sections.map((section, index) => (
              <section className="scroll-mt-28" id={`section-${index + 1}`} key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
            <hr />
            <p>
              Questions about this document? Visit the <Link href="/contact-us">contact page</Link> and our team will route your
              request appropriately.
            </p>
          </article>
        </div>
      </Container>
    </section>
  );
}
