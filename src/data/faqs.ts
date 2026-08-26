import { services } from "@/data/services";

export const categorizedFaqs = {
  General: [
    {
      question: "Who does Bizfylr work with?",
      answer:
        "We work with founders, startups, SMEs, freelancers, creators, and international entrepreneurs who need business growth systems, websites, e-commerce support, or digital execution."
    },
    {
      question: "Do you only build websites?",
      answer:
        "No. Website development is one part of a broader service mix that includes compliance support, e-commerce, marketplaces, marketing, automation, and creative execution."
    }
  ],
  "Website Development": services.find((service) => service.slug === "website-development")!.faqs,
  "E-commerce": [
    ...services.find((service) => service.slug === "ecommerce-setup")!.faqs,
    ...services.find((service) => service.slug === "ecommerce-management")!.faqs.slice(0, 1)
  ],
  Marketplace: [
    ...services.find((service) => service.slug === "marketplace-setup")!.faqs,
    ...services.find((service) => service.slug === "marketplace-operations")!.faqs.slice(0, 1)
  ],
  Marketing: services.find((service) => service.slug === "digital-marketing")!.faqs,
  Compliance: services.find((service) => service.slug === "business-compliance")!.faqs,
  Pricing: [
    {
      question: "Do you offer fixed packages or custom pricing?",
      answer:
        "We use structured plan tiers as a starting point, then refine pricing based on scope, complexity, integrations, and ongoing support requirements."
    },
    {
      question: "Are third-party fees included?",
      answer:
        "Not always. Domain, hosting, platform subscriptions, ads, government fees, and other third-party costs are quoted separately where relevant."
    }
  ],
  Support: [
    {
      question: "Do you offer post-launch support?",
      answer:
        "Yes. We support ongoing optimization, updates, operations help, and iterative improvements where the engagement calls for it."
    },
    {
      question: "How quickly can a project start?",
      answer:
        "Timing depends on scope and queue, but we prioritize clarity, fast onboarding, and practical delivery timelines from the first conversation."
    }
  ]
} as const;
