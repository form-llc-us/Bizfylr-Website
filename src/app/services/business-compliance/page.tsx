import { ServiceDetailPage } from "@/components/sections/ServiceDetailPage";
import { serviceLookup } from "@/data/services";
import { createMetadata } from "@/lib/seo";

const service = serviceLookup["business-compliance"];

export const metadata = createMetadata({
  title: service.seoTitle,
  description: service.seoDescription,
  pathname: `/services/${service.slug}`
});

export default function BusinessCompliancePage() {
  return <ServiceDetailPage slug="business-compliance" />;
}
