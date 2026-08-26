import { LegalPageContent } from "@/components/shared/LegalPageContent";
import { legalDocuments } from "@/data/legal";
import { createMetadata } from "@/lib/seo";

const document = legalDocuments.refund;

export const metadata = createMetadata({
  title: document.title,
  description: document.description,
  pathname: "/refund-policy"
});

export default function RefundPolicyPage() {
  return <LegalPageContent {...document} />;
}
