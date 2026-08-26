import { testimonials } from "@/data/testimonials";
import { Container } from "@/components/shared/Container";
import { Marquee } from "@/components/shared/Marquee";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { TestimonialCard } from "@/components/shared/TestimonialCard";

export function TestimonialsMarquee() {
  return (
    <section className="section-space">
      <Container className="section-stack">
        <SectionHeader
          align="center"
          description="Representative client feedback themes are shown with anonymized labels where public attribution is not yet approved."
          eyebrow="Testimonials"
          title="Credibility compounds when execution feels thoughtful, fast, and commercially grounded."
        />
        <Marquee>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={`${testimonial.author}-${testimonial.role}`} testimonial={testimonial} />
          ))}
        </Marquee>
      </Container>
    </section>
  );
}
