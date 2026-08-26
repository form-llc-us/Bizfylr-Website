import { LegalPageContent } from "@/components/shared/LegalPageContent";
import { legalDocuments } from "@/data/legal";
import { createMetadata } from "@/lib/seo";

const document = legalDocuments.privacy;

export const metadata = createMetadata({
  title: document.title,
  description: document.description,
  pathname: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  return <LegalPageContent {...document} />;
}
