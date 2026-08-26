import type { ServiceItem } from "@/data/services";

export type FeatureImage = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  width: number;
  height: number;
};

const imageSize = {
  width: 1200,
  height: 800
} as const;

export const siteImages = {
  home: {
    hero: {
      src: "/images/home/home-hero.avif",
      alt: "Business dashboard interface showing charts, reporting modules, and digital operations metrics",
      eyebrow: "Growth dashboard",
      title: "Visibility for founders scaling across channels and workflows",
      description: "A cleaner view of reporting, CRM activity, and execution health.",
      ...imageSize
    },
    consultation: {
      src: "/images/home/founder-consultation.avif",
      alt: "Startup team collaborating around laptops during a founder consultation session",
      eyebrow: "Founder consultation",
      title: "Strategy discussions grounded in execution realities",
      description: "Positioning, systems, and next-step planning without generic agency framing.",
      ...imageSize
    },
    workflow: {
      src: "/images/home/operations-workflow.avif",
      alt: "Workflow monitoring interface representing business process visibility and compliance oversight",
      eyebrow: "Operational workflow",
      title: "Processes that stay clear as the business grows",
      description: "Structured systems for delivery, governance, and recurring execution.",
      ...imageSize
    }
  },
  servicesHub: {
    hero: {
      src: "/images/services/services-hero.avif",
      alt: "High-end website interface preview representing Bizfylr service delivery",
      eyebrow: "Service ecosystem",
      title: "Web, growth, and operations support built to work together",
      description: "A service stack designed around founders who need stronger digital infrastructure.",
      ...imageSize
    },
    support: {
      src: "/images/services/collaborative-delivery.avif",
      alt: "Business team meeting in a modern office environment",
      eyebrow: "Collaborative delivery",
      title: "Cross-functional support with a structured operating model",
      description: "Design, execution, and process thinking aligned from the start.",
      ...imageSize
    },
    workflow: {
      src: "/images/services/execution-flow.avif",
      alt: "Desk workspace with planning materials for operational workflow execution",
      eyebrow: "Execution flow",
      title: "A cleaner route from decision to implementation",
      description: "Useful when websites, commerce, automation, and support need to connect cleanly.",
      ...imageSize
    }
  },
  pricing: {
    hero: {
      src: "/images/pricing/pricing-hero.avif",
      alt: "Business strategy discussion around project pricing and planning",
      eyebrow: "Delivery planning",
      title: "Commercial clarity before execution begins",
      description: "Packages are structured around scope, complexity, and operating support.",
      ...imageSize
    },
    card: {
      src: "/images/pricing/consultation-fit.avif",
      alt: "Consultation session between a digital services team and business stakeholders",
      eyebrow: "Consultation fit",
      title: "Choose the support model that matches your stage",
      description: "From focused launch work to broader growth partnerships.",
      ...imageSize
    },
    workflow: {
      src: "/images/pricing/scope-visibility.avif",
      alt: "Dashboard indicating measurable implementation scope and reporting",
      eyebrow: "Scope visibility",
      title: "Pricing linked to execution depth and measurable outputs",
      description: "Useful for aligning support expectations before kickoff.",
      ...imageSize
    }
  },
  about: {
    hero: {
      src: "/images/about/team-culture.avif",
      alt: "Creative and technical team collaborating in a studio environment",
      eyebrow: "Team culture",
      title: "A delivery team built around practical growth support",
      description: "Design, development, and operational thinking working side by side.",
      ...imageSize
    },
    founder: {
      src: "/images/about/founder-focus.avif",
      alt: "Leadership team meeting around a business growth discussion",
      eyebrow: "Founder focus",
      title: "Built for clients who need speed, clarity, and stronger systems",
      description: "The company story centers on practical execution, not vanity positioning.",
      ...imageSize
    },
    process: {
      src: "/images/about/how-we-work.avif",
      alt: "Operational planning and collaboration across a startup support team",
      eyebrow: "How we work",
      title: "Execution stays close to the commercial problem being solved",
      description: "That is what keeps the work useful beyond launch week.",
      ...imageSize
    }
  },
  faq: {
    hero: {
      src: "/images/faq/support-planning.avif",
      alt: "Desk workspace set up for planning, support documentation, and operational clarity",
      eyebrow: "Support planning",
      title: "Answers shaped around real delivery questions",
      description: "Useful before scope, pricing, and implementation decisions are finalized.",
      ...imageSize
    },
    consultation: {
      src: "/images/faq/consultation-clarity.avif",
      alt: "Client consultation meeting discussing digital services and implementation questions",
      eyebrow: "Consultation clarity",
      title: "Questions usually surface before founders commit to scope",
      description: "The FAQ is organized to answer those with less friction.",
      ...imageSize
    },
    workflow: {
      src: "/images/faq/operational-detail.avif",
      alt: "Digital operations dashboard representing support workflows and oversight",
      eyebrow: "Operational detail",
      title: "Clear answers on process, support, pricing, and systems",
      description: "Designed to reduce ambiguity before kickoff.",
      ...imageSize
    }
  },
  contact: {
    hero: {
      src: "/images/contact/project-intake.avif",
      alt: "Business consultation meeting for service inquiries and project discovery",
      eyebrow: "Project intake",
      title: "Start with a direct conversation about your next build",
      description: "Use the contact route when you need structured guidance, not generic sales language.",
      ...imageSize
    },
    support: {
      src: "/images/contact/support-expectations.avif",
      alt: "Support team in a collaborative office setting",
      eyebrow: "Support expectations",
      title: "A clear line into the Bizfylr delivery team",
      description: "Good for project inquiries, support requests, and consultation booking.",
      ...imageSize
    },
    map: {
      src: "/images/contact/coordination-map.avif",
      alt: "Workspace overview representing contact, coordination, and operational follow-up",
      eyebrow: "Coordination",
      title: "Fast follow-up backed by organized internal workflows",
      description: "The map block stays lightweight for performance, but the support path remains clear.",
      ...imageSize
    }
  },
  payment: {
    hero: {
      src: "/images/payment/secure-checkout.avif",
      alt: "Payment gateway interface representing secure digital checkout infrastructure",
      eyebrow: "Secure checkout",
      title: "Payments structured around verified server-side workflows",
      description: "Built for real billing, not simulated query-parameter confirmation.",
      ...imageSize
    },
    summary: {
      src: "/images/payment/billing-visibility.avif",
      alt: "Payment summary dashboard with structured billing visibility",
      eyebrow: "Billing visibility",
      title: "Clear summary and trust signals before payment submission",
      description: "Useful for service invoices, custom scopes, and structured project billing.",
      ...imageSize
    }
  }
} as const;

export const serviceImages: Record<
  ServiceItem["slug"],
  {
    hero: FeatureImage;
    detail: FeatureImage;
    workflow: FeatureImage;
  }
> = {
  "business-expansion": {
    hero: {
      src: "/images/services/business-expansion/hero.avif",
      alt: "Operational dashboard showing growth metrics and business system visibility",
      eyebrow: "Automation and reporting",
      title: "Digital systems that give founders more control as they scale",
      description: "CRM, reporting, and process visibility built into daily operations.",
      ...imageSize
    },
    detail: {
      src: "/images/services/business-expansion/detail.avif",
      alt: "Business consultation meeting focused on automation and operating systems",
      eyebrow: "Systems consulting",
      title: "Strategy sessions tied directly to implementation outcomes",
      description: "Useful when lead flow, onboarding, and fulfillment need to connect cleanly.",
      ...imageSize
    },
    workflow: {
      src: "/images/services/business-expansion/workflow.avif",
      alt: "Business workflow interface representing operational monitoring and process oversight",
      eyebrow: "Workflow architecture",
      title: "Repeatable workflows reduce operational drag",
      description: "Designed for scaling teams that need more than manual follow-ups.",
      ...imageSize
    }
  },
  "business-compliance": {
    hero: {
      src: "/images/services/business-compliance/hero.avif",
      alt: "Compliance monitoring interface showing reporting and operational oversight",
      eyebrow: "Governance visibility",
      title: "Operational compliance made clearer and easier to maintain",
      description: "Documentation, reporting, and review structure built into execution.",
      ...imageSize
    },
    detail: {
      src: "/images/services/business-compliance/detail.avif",
      alt: "Digital validation and documentation interface representing compliance record keeping",
      eyebrow: "Documentation systems",
      title: "Evidence, records, and recurring controls organized with less friction",
      description: "Useful when growth starts to demand more internal structure.",
      ...imageSize
    },
    workflow: {
      src: "/images/services/business-compliance/workflow.avif",
      alt: "Business certificate document representing compliant business record systems",
      eyebrow: "Readiness support",
      title: "Process hygiene that supports client trust and audit readiness",
      description: "Built for lean teams that still need operational discipline.",
      ...imageSize
    }
  },
  "website-development": {
    hero: {
      src: "/images/services/website-development/hero.avif",
      alt: "Premium website concept with modern SaaS style layout",
      eyebrow: "Premium frontend",
      title: "Fast, credible websites built to carry stronger business positioning",
      description: "A modern visual layer paired with technical clarity and conversion intent.",
      ...imageSize
    },
    detail: {
      src: "/images/services/website-development/detail.avif",
      alt: "Website interface design boards representing UI and UX planning",
      eyebrow: "Interface design",
      title: "Design systems that make the site feel premium, not generic",
      description: "Useful across landing pages, multi-page websites, and product experiences.",
      ...imageSize
    },
    workflow: {
      src: "/images/services/website-development/workflow.avif",
      alt: "Website integration visual showing connected payment and system components",
      eyebrow: "Technical integration",
      title: "The frontend is supported by clean operational and technical setup",
      description: "Important when websites need forms, payments, CMS, or reporting flows.",
      ...imageSize
    }
  },
  "ecommerce-setup": {
    hero: {
      src: "/images/services/ecommerce-setup/hero.avif",
      alt: "E-commerce storefront interface designed for online sales",
      eyebrow: "Commerce launch",
      title: "Storefronts structured for conversion, trust, and product clarity",
      description: "Useful when founders need more than just a theme installation.",
      ...imageSize
    },
    detail: {
      src: "/images/services/ecommerce-setup/detail.avif",
      alt: "Product listing management interface for online retail catalog setup",
      eyebrow: "Catalog structure",
      title: "Product architecture that helps customers browse and buy more easily",
      description: "Strong store setup starts with cleaner product organization.",
      ...imageSize
    },
    workflow: {
      src: "/images/services/ecommerce-setup/workflow.avif",
      alt: "Secure payment gateway setup for an online commerce experience",
      eyebrow: "Checkout systems",
      title: "Payments and checkout flows configured to support real transactions",
      description: "Critical for stores that need a reliable path from cart to confirmation.",
      ...imageSize
    }
  },
  "ecommerce-management": {
    hero: {
      src: "/images/services/ecommerce-management/hero.avif",
      alt: "Inventory management dashboard for e-commerce operations",
      eyebrow: "Store operations",
      title: "Commerce execution becomes easier when operations stay organized",
      description: "Inventory, support, fulfillment, and reporting handled with more structure.",
      ...imageSize
    },
    detail: {
      src: "/images/services/ecommerce-management/detail.avif",
      alt: "Order processing and fulfillment visual for e-commerce operations",
      eyebrow: "Fulfillment workflows",
      title: "Order flows, customer experience, and recurring tasks kept in sync",
      description: "Useful when post-launch execution becomes harder than the build itself.",
      ...imageSize
    },
    workflow: {
      src: "/images/services/ecommerce-management/workflow.avif",
      alt: "Customer support management interface for e-commerce support handling",
      eyebrow: "Support operations",
      title: "Customer issues are easier to resolve when the operating model is clear",
      description: "Important for protecting revenue and brand trust as order volume grows.",
      ...imageSize
    }
  },
  "marketplace-setup": {
    hero: {
      src: "/images/services/marketplace-setup/hero.avif",
      alt: "Marketplace listing management interface for seller onboarding",
      eyebrow: "Marketplace launch",
      title: "Product and listing structure matters before the first marketplace sale",
      description: "Built for Amazon, Walmart, Etsy, eBay, and other active seller ecosystems.",
      ...imageSize
    },
    detail: {
      src: "/images/services/marketplace-setup/detail.avif",
      alt: "Fulfillment and logistics visual for marketplace order setup",
      eyebrow: "Seller readiness",
      title: "Catalog, shipping, and fulfillment logic aligned before launch",
      description: "Useful when account setup needs to lead into cleaner operations later.",
      ...imageSize
    },
    workflow: {
      src: "/images/services/marketplace-setup/workflow.avif",
      alt: "Marketplace analytics interface for listing performance and optimization",
      eyebrow: "Performance setup",
      title: "Marketplace visibility improves when structure and reporting are cleaner",
      description: "Critical for sellers who want stronger discoverability from the start.",
      ...imageSize
    }
  },
  "marketplace-operations": {
    hero: {
      src: "/images/services/marketplace-operations/hero.avif",
      alt: "Marketplace monitoring interface showing performance and compliance tracking",
      eyebrow: "Seller operations",
      title: "Operational discipline protects marketplace performance over time",
      description: "Listing hygiene, support, ads, and reporting need a recurring execution rhythm.",
      ...imageSize
    },
    detail: {
      src: "/images/services/marketplace-operations/detail.avif",
      alt: "Customer support interface for marketplace operations handling",
      eyebrow: "Support handling",
      title: "Channel support becomes easier when issues are tracked and resolved systematically",
      description: "Useful for active sellers managing customer questions across platforms.",
      ...imageSize
    },
    workflow: {
      src: "/images/services/marketplace-operations/workflow.avif",
      alt: "Marketplace reporting dashboard for performance optimization",
      eyebrow: "Reporting cadence",
      title: "Better seller decisions come from clearer operational reporting",
      description: "Important for ongoing channel health and cross-platform optimization.",
      ...imageSize
    }
  },
  "digital-marketing": {
    hero: {
      src: "/images/services/digital-marketing/hero.avif",
      alt: "Digital marketing dashboard and campaign planning visual for e-commerce growth",
      eyebrow: "Demand generation",
      title: "Campaigns perform better when the funnel and measurement layer are strong",
      description: "Paid growth, creative testing, and attribution aligned around business outcomes.",
      ...imageSize
    },
    detail: {
      src: "/images/services/digital-marketing/detail.avif",
      alt: "Social media creative assets representing marketing campaign design",
      eyebrow: "Creative testing",
      title: "Creative and landing experience need to work as one system",
      description: "Useful when ad execution needs stronger message-to-page consistency.",
      ...imageSize
    },
    workflow: {
      src: "/images/services/digital-marketing/workflow.avif",
      alt: "Marketing analytics dashboard for campaign measurement and optimization",
      eyebrow: "Measurement",
      title: "The reporting layer should make next decisions more obvious",
      description: "Important when growth spend needs a clearer feedback loop.",
      ...imageSize
    }
  },
  "graphic-design-video-editing": {
    hero: {
      src: "/images/services/graphic-design-video-editing/hero.avif",
      alt: "Brand identity design boards and logo development materials",
      eyebrow: "Creative production",
      title: "Brand presentation improves when visual systems feel deliberate and polished",
      description: "Creative support across web, social, product, and campaign assets.",
      ...imageSize
    },
    detail: {
      src: "/images/services/graphic-design-video-editing/detail.avif",
      alt: "Packaging and brand creative design visual for product presentation",
      eyebrow: "Brand assets",
      title: "Design work that strengthens credibility across channels",
      description: "Useful when launches need more than ad hoc creative output.",
      ...imageSize
    },
    workflow: {
      src: "/images/services/graphic-design-video-editing/workflow.avif",
      alt: "Motion graphics and video editing interface for promotional content",
      eyebrow: "Motion and editing",
      title: "Video and motion assets that support campaigns and storytelling",
      description: "Important for modern brands working across paid and organic channels.",
      ...imageSize
    }
  }
} as const;
