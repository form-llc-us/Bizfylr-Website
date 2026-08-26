import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageIntro } from "@/components/shared/PageIntro";
import { categorizedFaqs } from "@/data/faqs";
import { siteImages } from "@/data/images";
import { createMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";

export const metadata = createMetadata({
  title: "FAQ | Questions About Services, Pricing, Support & Delivery",
  description:
    "Find answers to common Bizfylr questions across websites, e-commerce, marketplaces, compliance, pricing, support, and founder-focused delivery.",
  pathname: "/faq"
});

const allFaqs = Object.values(categorizedFaqs).flat();

export default function FaqPage() {
  const images = siteImages.faq;

  return (
    <>
      <JsonLd data={faqSchema(allFaqs)} />
      <PageIntro
        align="center"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        currentPath="/faq"
        description="Questions are grouped by service area so founders can get to the right answer faster."
        eyebrow="FAQ"
        title="Answers to the most common questions across Bizfylr's service stack."
      >
        <div className="content-grid md:grid-cols-3">
          <ImagePlaceholder {...images.hero} priority variant="dashboard" />
          <ImagePlaceholder {...images.consultation} variant="consultation" />
          <ImagePlaceholder {...images.workflow} variant="workflow" />
        </div>
      </PageIntro>
      {Object.entries(categorizedFaqs).map(([category, items]) => (
        <FaqSection items={[...items]} key={category} title={category} />
      ))}
      <FinalCta />
    </>
  );
}
