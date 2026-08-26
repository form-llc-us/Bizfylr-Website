import { FinalCta } from "@/components/sections/FinalCta";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { PageIntro } from "@/components/shared/PageIntro";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Portfolio | Selected Websites, Commerce & Growth Projects",
  description:
    "Explore Bizfylr portfolio examples across corporate websites, e-commerce builds, product showcases, and founder-focused digital experiences.",
  pathname: "/portfolio"
});

export default function PortfolioPage() {
  return (
    <>
      <PageIntro
        align="center"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
        currentPath="/portfolio"
        description="Selected work across commerce, corporate websites, showcase experiences, and service-led digital brands."
        eyebrow="Portfolio"
        title="A portfolio built to communicate trust, clarity, and commercial intent."
      />
      <PortfolioGrid showHeader={false} />
      <FinalCta />
    </>
  );
}
