import { LegalPageContent } from "@/components/shared/LegalPageContent";
import { legalDocuments } from "@/data/legal";
import { createMetadata } from "@/lib/seo";

const document = legalDocuments.terms;

export const metadata = createMetadata({
  title: document.title,
  description: document.description,
  pathname: "/terms-of-service"
});

export default function TermsOfServicePage() {
  return <LegalPageContent {...document} />;
}
