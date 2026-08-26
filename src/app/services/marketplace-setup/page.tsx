import { ServiceDetailPage } from "@/components/sections/ServiceDetailPage";
import { serviceLookup } from "@/data/services";
import { createMetadata } from "@/lib/seo";

const service = serviceLookup["marketplace-setup"];

export const metadata = createMetadata({
  title: service.seoTitle,
  description: service.seoDescription,
  pathname: `/services/${service.slug}`
});

export default function MarketplaceSetupPage() {
  return <ServiceDetailPage slug="marketplace-setup" />;
}
