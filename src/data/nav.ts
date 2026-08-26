import { ROUTES } from "@/data/routes";

export const mainNav = [
  { href: ROUTES.services, label: "Services" },
  { href: ROUTES.solutions, label: "Solutions" },
  { href: ROUTES.pricing, label: "Pricing" },
  { href: ROUTES.portfolio, label: "Portfolio" },
  { href: ROUTES.resources, label: "Resources" },
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.faq, label: "FAQ" },
  { href: ROUTES.contact, label: "Contact" }
] as const;

export const headerNav = [
  { href: ROUTES.services, label: "Services" },
  { href: ROUTES.solutions, label: "Solutions" },
  { href: ROUTES.pricing, label: "Pricing" },
  { href: ROUTES.portfolio, label: "Portfolio" },
  { href: ROUTES.resources, label: "Resources" }
] as const;

export const companyNav = [
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.blog, label: "Blog" },
  { href: ROUTES.faq, label: "FAQ" },
  { href: ROUTES.contact, label: "Contact" }
] as const;

export const serviceNav = [
  { href: ROUTES.businessExpansion, label: "Business Expansion" },
  { href: ROUTES.businessCompliance, label: "Business Compliance" },
  { href: ROUTES.websiteDevelopment, label: "Website Development" },
  { href: ROUTES.ecommerceSetup, label: "E-commerce Setup" },
  { href: ROUTES.ecommerceManagement, label: "E-commerce Management" },
  { href: ROUTES.marketplaceSetup, label: "Marketplace Setup" },
  { href: ROUTES.marketplaceOperations, label: "Marketplace Operations" },
  { href: ROUTES.digitalMarketing, label: "Digital Marketing" },
  { href: ROUTES.graphicDesignVideoEditing, label: "Graphic Design & Video Editing" }
] as const;

export const footerNav = {
  company: [
    { href: ROUTES.about, label: "About Us" },
    { href: ROUTES.portfolio, label: "Portfolio" },
    { href: ROUTES.solutions, label: "Solutions" },
    { href: ROUTES.pricing, label: "Pricing" },
    { href: ROUTES.contact, label: "Contact Us" }
  ],
  services: serviceNav.slice(0, 5),
  growth: serviceNav.slice(5),
  legal: [
    { href: ROUTES.privacyPolicy, label: "Privacy Policy" },
    { href: ROUTES.refundPolicy, label: "Refund Policy" },
    { href: ROUTES.termsOfService, label: "Terms of Service" }
  ],
  resources: [{ href: ROUTES.resources, label: "Resources" }]
} as const;
