import { ServiceDetailPage } from "@/components/sections/ServiceDetailPage";
import { serviceLookup } from "@/data/services";
import { createMetadata } from "@/lib/seo";

const service = serviceLookup["graphic-design-video-editing"];

export const metadata = createMetadata({
  title: service.seoTitle,
  description: service.seoDescription,
  pathname: `/services/${service.slug}`
});

export default function GraphicDesignVideoEditingPage() {
  return <ServiceDetailPage slug="graphic-design-video-editing" />;
}
