import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function FaqSection({
  items,
  title = "Questions founders usually ask before they move.",
}: {
  items: Array<{ question: string; answer: string }>;
  title?: string;
}) {
  return (
    <section className="section-space-tight">
      <Container className="section-stack-tight">
        <SectionHeader
          align="center"
          description="The answers below focus on scope, process, and practical expectations."
          eyebrow="FAQ"
          title={title}
        />

        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4 sm:p-5 md:p-7">
            <FAQAccordion items={items} />
          </div>
        </div>
      </Container>
    </section>
  );
}
