export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceItem = {
  slug:
    | "business-expansion"
    | "business-compliance"
    | "website-development"
    | "ecommerce-setup"
    | "ecommerce-management"
    | "marketplace-setup"
    | "marketplace-operations"
    | "digital-marketing"
    | "graphic-design-video-editing";
  title: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSummary: string;
  bullets: string[];
  painPoints: string[];
  features: string[];
  deliverables: string[];
  useCases: string[];
  process: string[];
  faqs: ServiceFaq[];
  relatedServices: ServiceItem["slug"][];
};

export const services: ServiceItem[] = [
  {
    slug: "business-expansion",
    title: "Business Expansion",
    shortDescription:
      "Automation, CRM, dashboards, portals, and scalable digital infrastructure for ambitious founders.",
    seoTitle: "Business Expansion Services | Automation, CRM & Growth Systems | Bizfylr",
    seoDescription:
      "Build scalable business operations with CRM setup, automation, client portals, reporting dashboards, and global-ready digital workflows.",
    heroEyebrow: "Growth Systems & Business Infrastructure",
    heroTitle: "Scale operations with the digital systems serious founders need.",
    heroSummary:
      "Bizfylr designs the operational layer behind growth: CRM architecture, automation workflows, dashboards, client portals, and integrated business systems that reduce manual work and unlock faster execution.",
    bullets: ["CRM setup", "Client portals", "Workflow automation", "Dashboards", "Growth tech advisory"],
    painPoints: [
      "Growth stalls when leads, clients, and delivery workflows live across disconnected tools.",
      "Founders lose visibility when reporting is manual and operational data is fragmented.",
      "Teams spend too much time on repetitive tasks instead of sales, service, and expansion."
    ],
    features: [
      "CRM pipeline design for inbound, outbound, and account management.",
      "Workflow automation across lead capture, onboarding, follow-ups, and reporting.",
      "Custom client portals and internal dashboards for visibility across operations.",
      "Cross-tool integrations for forms, calendars, payment systems, and communication tools.",
      "Global-ready stack recommendations for startups, agencies, and service businesses.",
      "Analytics views that surface pipeline health, delivery status, and growth trends."
    ],
    deliverables: [
      "CRM architecture map",
      "Automation flow diagrams",
      "Lead routing setup",
      "Founder reporting dashboard",
      "Client portal interface",
      "Implementation documentation"
    ],
    useCases: [
      "Service businesses scaling from founder-led sales to a repeatable pipeline.",
      "Agencies needing streamlined onboarding, reporting, and fulfillment workflows.",
      "International founders setting up lean digital operations from day one.",
      "Teams replacing spreadsheets with structured operating systems."
    ],
    process: [
      "Audit your current tools, bottlenecks, and handoff points.",
      "Design the target workflow and recommend the right stack.",
      "Implement CRM, automation, dashboards, and portal components.",
      "Train the team and refine the system for operational clarity."
    ],
    faqs: [
      {
        question: "Can Bizfylr work with our existing CRM or tools?",
        answer:
          "Yes. We can optimize your current stack or recommend a cleaner setup if the existing tools are slowing the team down."
      },
      {
        question: "Do you only build dashboards, or do you improve the workflow behind them too?",
        answer:
          "We do both. The dashboard is only useful when the workflow feeding it is accurate, automated, and trusted."
      },
      {
        question: "Is this suitable for early-stage founders?",
        answer:
          "Yes. We scope systems for current needs while keeping them flexible enough to support later scale."
      }
    ],
    relatedServices: ["website-development", "digital-marketing", "business-compliance"]
  },
  {
    slug: "business-compliance",
    title: "Business Compliance",
    shortDescription:
      "Operational compliance support, policy structure, documentation flows, reporting, and governance systems.",
    seoTitle: "Business Compliance Support & Governance Systems | Bizfylr",
    seoDescription:
      "Strengthen compliance operations with documentation workflows, reporting systems, governance support, data handling controls, and readiness frameworks.",
    heroEyebrow: "Governance, Documentation & Operational Readiness",
    heroTitle: "Build compliance systems that support growth instead of slowing it down.",
    heroSummary:
      "Bizfylr helps growing teams organize policies, reporting, access controls, documentation processes, and operating safeguards so compliance becomes manageable, auditable, and easier to scale.",
    bullets: ["Policy structure", "Documentation systems", "Reporting workflows", "Access controls", "Readiness support"],
    painPoints: [
      "Teams often treat compliance as scattered files and ad hoc approvals until risk catches up.",
      "Operational changes create documentation gaps, access issues, and reporting blind spots.",
      "Founders need practical governance support without building an enterprise bureaucracy."
    ],
    features: [
      "Documentation frameworks for policies, SOPs, approvals, and recurring evidence capture.",
      "Reporting systems for recurring tasks, deadlines, and internal accountability.",
      "Access, role, and workflow guidance for safer operational controls.",
      "Readiness support for privacy, governance, and business process audits.",
      "Templates for recurring reviews, logs, and business support tasks.",
      "Operational compliance layers that fit startup and SME realities."
    ],
    deliverables: [
      "Compliance workflow map",
      "Policy and SOP starter library",
      "Reporting templates",
      "Governance checklist",
      "Access control guidance",
      "Owner and cadence matrix"
    ],
    useCases: [
      "Startups preparing for larger clients with stricter operating expectations.",
      "Remote teams that need cleaner documentation and workflow governance.",
      "Businesses handling sensitive customer data and internal approvals.",
      "Growing operations that need recurring accountability around compliance tasks."
    ],
    process: [
      "Review current documentation, responsibilities, and risk points.",
      "Define the controls, workflows, and reporting structure you need.",
      "Build operating templates and implementation guidance.",
      "Create a repeatable cadence for upkeep, reviews, and support."
    ],
    faqs: [
      {
        question: "Do you offer legal advice?",
        answer:
          "No. Bizfylr provides operational and documentation support. Legal review should be handled by qualified counsel when required."
      },
      {
        question: "Can you help with privacy-related workflow structure?",
        answer:
          "Yes. We can organize data handling, access controls, and internal documentation workflows to improve privacy readiness."
      },
      {
        question: "Is this useful for small teams?",
        answer:
          "Yes. We focus on lightweight systems that reduce risk without overwhelming lean teams."
      }
    ],
    relatedServices: ["business-expansion", "website-development", "marketplace-operations"]
  },
  {
    slug: "website-development",
    title: "Website Development",
    shortDescription:
      "Premium websites, SaaS landing pages, CMS builds, e-commerce experiences, and high-performance growth pages.",
    seoTitle: "Website Development Services | Premium Next.js, CMS & Shopify Builds | Bizfylr",
    seoDescription:
      "Launch premium business websites, landing pages, dashboards, CMS platforms, and performance-first digital experiences built for growth and SEO.",
    heroEyebrow: "Premium Websites & Conversion Systems",
    heroTitle: "Move beyond brochure sites with revenue-focused digital experiences.",
    heroSummary:
      "From founder landing pages to larger marketing systems, Bizfylr builds polished, fast, and SEO-conscious websites that combine design quality, technical clarity, and conversion intent.",
    bullets: ["Next.js builds", "CMS integration", "Landing pages", "Performance tuning", "Technical SEO"],
    painPoints: [
      "Generic websites fail to communicate credibility, clarity, or business positioning.",
      "Slow pages and weak information architecture quietly reduce conversions and search visibility.",
      "Founders need a site that supports lead generation, content publishing, and future iteration."
    ],
    features: [
      "Premium SaaS-style landing pages and multi-page business websites.",
      "Performance-first frontends built for speed, accessibility, and clean UX.",
      "CMS, Shopify, and custom integration support where content or commerce is required.",
      "Technical SEO architecture with semantic structure, metadata, and internal linking.",
      "Conversion-aware page strategy with clear CTAs and trust-building patterns.",
      "Scalable component systems for long-term content and growth updates."
    ],
    deliverables: [
      "Information architecture",
      "Responsive page templates",
      "Development-ready component system",
      "Technical SEO setup",
      "Lead capture integration",
      "Launch checklist"
    ],
    useCases: [
      "Startups launching a credible first digital presence.",
      "Service businesses upgrading from outdated static websites.",
      "Founders needing a faster, more conversion-focused landing experience.",
      "Companies combining marketing pages with dashboards or CMS content."
    ],
    process: [
      "Define positioning, conversion goals, and content hierarchy.",
      "Design the core pages and reusable interface system.",
      "Build, optimize, and QA the site across devices and routes.",
      "Launch with metadata, forms, analytics, and growth-ready structure."
    ],
    faqs: [
      {
        question: "Do you only build custom-coded websites?",
        answer:
          "No. We support custom-coded builds, CMS implementations, and commerce platforms depending on the use case."
      },
      {
        question: "Will the site be optimized for SEO?",
        answer:
          "Yes. Technical SEO, metadata, semantic structure, internal linking, and performance are part of the build approach."
      },
      {
        question: "Can you maintain the site after launch?",
        answer:
          "Yes. We offer ongoing support for updates, iterations, new sections, and performance tuning."
      }
    ],
    relatedServices: ["business-expansion", "ecommerce-setup", "graphic-design-video-editing"]
  },
  {
    slug: "ecommerce-setup",
    title: "E-commerce Setup",
    shortDescription:
      "Store architecture, product catalogs, checkout systems, integrations, and conversion foundations for online sales.",
    seoTitle: "E-commerce Setup Services | Shopify, WooCommerce & Custom Commerce | Bizfylr",
    seoDescription:
      "Launch high-converting online stores with product catalog setup, payments, checkout, migration, and conversion-focused commerce infrastructure.",
    heroEyebrow: "Store Launch & Commerce Infrastructure",
    heroTitle: "Launch an e-commerce store with a cleaner path from visit to checkout.",
    heroSummary:
      "Bizfylr helps founders and growing brands build the commerce foundation: storefront setup, product structure, payments, shipping logic, tracking, and conversion-ready customer flows.",
    bullets: ["Store setup", "Catalog structure", "Payment gateways", "Checkout UX", "Migration support"],
    painPoints: [
      "Many stores launch with weak product structure, inconsistent checkout flows, and fragile integrations.",
      "Platform choice and technical setup mistakes create long-term operational drag.",
      "Founders need more than a design theme; they need a working sales system."
    ],
    features: [
      "Shopify, WooCommerce, and custom commerce planning based on business needs.",
      "Product catalog architecture, collections, variants, and merchandising logic.",
      "Payment, shipping, tax, and checkout setup aligned with the target market.",
      "Conversion-focused UX patterns across PDPs, carts, and trust sections.",
      "Migration and launch support for teams moving from a weaker storefront.",
      "Analytics and tracking foundations for future optimization."
    ],
    deliverables: [
      "Platform recommendation",
      "Store structure setup",
      "Product catalog import plan",
      "Checkout and payment configuration",
      "Tracking checklist",
      "Launch QA notes"
    ],
    useCases: [
      "New brands launching their first store.",
      "Offline businesses moving sales online.",
      "Existing stores needing a better technical foundation.",
      "Cross-border founders needing global-ready checkout flows."
    ],
    process: [
      "Choose the right commerce model and platform.",
      "Structure products, checkout flows, and store pages.",
      "Configure payments, shipping, tracking, and launch details.",
      "QA conversion paths and hand over the live commerce system."
    ],
    faqs: [
      {
        question: "Can you help choose between Shopify and WooCommerce?",
        answer:
          "Yes. We recommend a platform based on complexity, budget, operations, and growth plans rather than forcing one stack."
      },
      {
        question: "Do you handle product upload and collections?",
        answer:
          "Yes. Catalog structure, products, variants, and collection logic are part of setup scope."
      },
      {
        question: "Can you integrate payment gateways?",
        answer:
          "Yes. We support payment gateway setup and checkout configuration based on the project requirements."
      }
    ],
    relatedServices: ["ecommerce-management", "website-development", "digital-marketing"]
  },
  {
    slug: "ecommerce-management",
    title: "E-commerce Management",
    shortDescription:
      "Operational support for inventory, orders, customer service, reporting, and optimization across active stores.",
    seoTitle: "E-commerce Management Services | Store Operations & Reporting | Bizfylr",
    seoDescription:
      "Scale online store operations with inventory oversight, order workflows, support processes, reporting, and commerce performance management.",
    heroEyebrow: "Commerce Operations & Performance Support",
    heroTitle: "Keep your store running like an operating system, not a daily scramble.",
    heroSummary:
      "Bizfylr supports post-launch e-commerce execution with store operations, order coordination, reporting, customer workflows, and the recurring tasks that protect revenue.",
    bullets: ["Inventory support", "Order workflows", "Customer support coordination", "Reporting", "Promotions management"],
    painPoints: [
      "Operational complexity grows quickly once sales volume increases.",
      "Customer issues, inventory gaps, and reporting delays eat into growth capacity.",
      "Founders need execution support without losing control or visibility."
    ],
    features: [
      "Inventory coordination and product update support.",
      "Order processing workflows and fulfillment handoff management.",
      "Customer support operations and escalation structure.",
      "Sales, campaign, and operations reporting dashboards.",
      "Promotion execution, seasonal updates, and merchandising support.",
      "Store hygiene processes that keep listings accurate and current."
    ],
    deliverables: [
      "Operations checklist",
      "Fulfillment workflow map",
      "Customer support handling guide",
      "Performance dashboard",
      "Update cadence plan",
      "Promotion execution tracker"
    ],
    useCases: [
      "Founder-led stores that need an operations partner.",
      "Brands preparing for higher order volume or seasonal spikes.",
      "Teams with scattered reporting and inconsistent catalog upkeep.",
      "Businesses wanting better visibility into store performance."
    ],
    process: [
      "Review current operations, order flow, and reporting gaps.",
      "Define the operational support model and cadence.",
      "Implement workflows, trackers, and reporting views.",
      "Run recurring support with clear visibility and optimization."
    ],
    faqs: [
      {
        question: "Do you replace my internal store team?",
        answer:
          "Not necessarily. We can act as a hands-on partner, an extension of your team, or a structured support layer depending on scope."
      },
      {
        question: "Can you handle recurring product and campaign updates?",
        answer:
          "Yes. Ongoing store management can include catalog changes, launches, promotions, and reporting support."
      },
      {
        question: "Is this only for Shopify stores?",
        answer:
          "No. We can support multiple commerce platforms where the workflow and operating model are clearly defined."
      }
    ],
    relatedServices: ["ecommerce-setup", "marketplace-operations", "business-expansion"]
  },
  {
    slug: "marketplace-setup",
    title: "Marketplace Setup",
    shortDescription:
      "Account setup, listing optimization, catalog architecture, and marketplace launch support across major platforms.",
    seoTitle: "Marketplace Setup Services | Amazon, Etsy, Walmart & eBay Launch Support | Bizfylr",
    seoDescription:
      "Launch marketplace selling channels with account setup, listing optimization, catalog structure, fulfillment logic, and marketplace-ready execution.",
    heroEyebrow: "Marketplace Launch & Seller Readiness",
    heroTitle: "Open new sales channels with cleaner marketplace execution from day one.",
    heroSummary:
      "Bizfylr helps brands and founders enter marketplace ecosystems with structured account setup, listing foundations, catalog logic, and launch readiness across platforms like Amazon, Etsy, Walmart, and eBay.",
    bullets: ["Account onboarding", "Listing optimization", "Catalog setup", "Fulfillment logic", "Marketplace launch support"],
    painPoints: [
      "Marketplace onboarding mistakes create approval delays, poor listing structure, and compliance headaches.",
      "Product data often gets copied into marketplaces without a platform-specific strategy.",
      "Brands need a repeatable setup process that protects performance and discoverability."
    ],
    features: [
      "Marketplace account setup and onboarding support.",
      "Listing optimization for titles, imagery, copy, and discoverability.",
      "Catalog hierarchy and variation planning for better product structure.",
      "Fulfillment, shipping, and operational readiness guidance.",
      "Marketplace compliance checkpoints and launch preparation.",
      "Cross-channel setup thinking for brands expanding beyond one platform."
    ],
    deliverables: [
      "Marketplace setup checklist",
      "Listing optimization framework",
      "Catalog structure plan",
      "Fulfillment alignment notes",
      "Launch readiness review",
      "Post-launch support recommendations"
    ],
    useCases: [
      "Brands launching onto Amazon or Walmart for the first time.",
      "Craft and product businesses entering Etsy or eBay.",
      "Existing e-commerce brands adding marketplace channels.",
      "Teams needing structure before paid promotion or scaling."
    ],
    process: [
      "Review products, categories, and target marketplace fit.",
      "Set up accounts and structure catalog data correctly.",
      "Optimize listings and prepare fulfillment flows.",
      "Launch with a cleaner operating baseline and next-step roadmap."
    ],
    faqs: [
      {
        question: "Can you set up more than one marketplace?",
        answer:
          "Yes. We can scope multi-marketplace rollouts and align catalog structure across channels."
      },
      {
        question: "Do you help with listing copy and optimization?",
        answer:
          "Yes. Listing structure, copy direction, and optimization are core parts of marketplace setup."
      },
      {
        question: "Can you advise on fulfillment setup?",
        answer:
          "Yes. We can guide the operational setup needed for marketplace launch and account health."
      }
    ],
    relatedServices: ["marketplace-operations", "ecommerce-setup", "graphic-design-video-editing"]
  },
  {
    slug: "marketplace-operations",
    title: "Marketplace Operations",
    shortDescription:
      "Ongoing seller support, listing upkeep, support handling, ad coordination, and performance reporting.",
    seoTitle: "Marketplace Operations Services | Seller Support, Reporting & Growth | Bizfylr",
    seoDescription:
      "Manage marketplace growth with ongoing listing maintenance, customer support, ad coordination, seller performance tracking, and operational reporting.",
    heroEyebrow: "Seller Performance & Marketplace Operations",
    heroTitle: "Protect marketplace performance while you focus on bigger growth decisions.",
    heroSummary:
      "Bizfylr provides the recurring operating layer marketplace businesses need: catalog upkeep, account health awareness, support coordination, ad support, and clearer reporting across active channels.",
    bullets: ["Listing maintenance", "Support workflows", "Ad coordination", "Account health", "Performance reporting"],
    painPoints: [
      "Marketplace channels punish slow reactions to issues, listing drift, or support breakdowns.",
      "Performance data is hard to action when each platform reports differently.",
      "Teams need recurring execution to keep marketplace channels healthy and profitable."
    ],
    features: [
      "Listing maintenance, content updates, and catalog cleanliness support.",
      "Customer support coordination and issue tracking workflows.",
      "Seller performance visibility and escalation support.",
      "Ad campaign coordination and marketplace promotion support.",
      "Cross-platform reporting for active sales channels.",
      "Operational safeguards that reduce avoidable account issues."
    ],
    deliverables: [
      "Marketplace operations dashboard",
      "Issue management workflow",
      "Listing maintenance cadence",
      "Performance review notes",
      "Ad support tracker",
      "Optimization backlog"
    ],
    useCases: [
      "Marketplace sellers with growing catalog complexity.",
      "Brands needing recurring support to protect account performance.",
      "Teams expanding from one marketplace to several active channels.",
      "Operators who need clearer visibility into marketplace execution."
    ],
    process: [
      "Audit current seller workflows and recurring risk areas.",
      "Define the support cadence, reporting model, and priorities.",
      "Run listing, support, and performance operations.",
      "Review outputs regularly and optimize for healthier channel performance."
    ],
    faqs: [
      {
        question: "Can you support marketplace ads too?",
        answer:
          "Yes. We can coordinate ad execution as part of broader marketplace operations depending on the engagement."
      },
      {
        question: "Do you help with account health issues?",
        answer:
          "We can help structure monitoring, issue handling, and support workflows, though platform-specific enforcement decisions remain with the marketplace."
      },
      {
        question: "Is this separate from marketplace setup?",
        answer:
          "Yes. Setup focuses on launch readiness, while operations focuses on ongoing execution and maintenance."
      }
    ],
    relatedServices: ["marketplace-setup", "ecommerce-management", "digital-marketing"]
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    shortDescription:
      "Paid media, funnel strategy, performance tracking, creative testing, and demand generation support.",
    seoTitle: "Digital Marketing Services | Paid Growth, Funnels & Analytics | Bizfylr",
    seoDescription:
      "Drive pipeline and sales with Google Ads, Meta, LinkedIn, TikTok, funnel strategy, tracking, analytics, and performance-focused campaign execution.",
    heroEyebrow: "Paid Growth & Performance Marketing",
    heroTitle: "Build a demand engine that turns traffic into measurable business outcomes.",
    heroSummary:
      "Bizfylr supports growth through channel strategy, paid acquisition, creative testing, offer alignment, funnel structure, and cleaner performance visibility across campaigns.",
    bullets: ["Paid media", "Funnel strategy", "Tracking setup", "Creative testing", "Analytics reviews"],
    painPoints: [
      "Campaign spend gets wasted when landing pages, measurement, and offer clarity are weak.",
      "Teams launch channels without a unified funnel or feedback loop.",
      "Founders need practical performance guidance, not vanity dashboards."
    ],
    features: [
      "Channel strategy across Google, Meta, LinkedIn, TikTok, and relevant platforms.",
      "Tracking, attribution, and conversion event setup for better decision-making.",
      "Campaign structure and testing frameworks for creatives, audiences, and offers.",
      "Landing page and funnel alignment to improve conversion quality.",
      "Performance reporting that ties spend to leads, revenue signals, and next actions.",
      "Growth support designed for founders, e-commerce brands, and service businesses."
    ],
    deliverables: [
      "Channel strategy plan",
      "Tracking setup checklist",
      "Campaign launch framework",
      "Creative testing matrix",
      "Performance dashboard",
      "Optimization roadmap"
    ],
    useCases: [
      "Founders launching paid growth for the first time.",
      "Teams with active ad spend but weak measurement clarity.",
      "Service businesses looking to improve lead quality.",
      "E-commerce brands needing structured growth experiments."
    ],
    process: [
      "Review business goals, funnel, and current acquisition data.",
      "Define channels, tracking, messaging, and testing priorities.",
      "Launch or restructure campaigns with cleaner measurement.",
      "Optimize weekly using reporting, insights, and creative iteration."
    ],
    faqs: [
      {
        question: "Do you handle both strategy and execution?",
        answer:
          "Yes. Engagements can include strategy, channel setup, execution support, and ongoing optimization."
      },
      {
        question: "Can you improve our landing pages too?",
        answer:
          "Yes. Marketing performance improves when creative, targeting, and landing experience are aligned."
      },
      {
        question: "Do you guarantee ROAS or rankings?",
        answer:
          "No. We focus on disciplined execution, measurement, and optimization without making unsupported guarantees."
      }
    ],
    relatedServices: ["website-development", "ecommerce-setup", "business-expansion"]
  },
  {
    slug: "graphic-design-video-editing",
    title: "Graphic Design & Video Editing",
    shortDescription:
      "Brand identity, social creatives, UI support, motion assets, and video editing for high-clarity brand communication.",
    seoTitle: "Graphic Design & Video Editing Services | Brand, UI & Creative Assets | Bizfylr",
    seoDescription:
      "Create polished brand visuals, ad creatives, social assets, UI designs, motion graphics, and edited videos that strengthen digital presence and conversion quality.",
    heroEyebrow: "Brand Presentation & Creative Production",
    heroTitle: "Sharpen brand perception with design and motion built for modern digital channels.",
    heroSummary:
      "Bizfylr produces creative systems that make brands look more credible and campaign assets perform better, from brand identity and product visuals to social creatives and video editing.",
    bullets: ["Brand identity", "UI design", "Social creatives", "Ad assets", "Video editing"],
    painPoints: [
      "Weak creative execution makes even strong offers feel less trustworthy.",
      "Teams struggle when design assets are inconsistent across web, ads, and marketplaces.",
      "Brands need fast, polished creative production without losing strategic cohesion."
    ],
    features: [
      "Brand identity support including logos, visual language, and presentation systems.",
      "Creative assets for websites, social campaigns, product launches, and ads.",
      "UI design support for pages, interfaces, and digital touchpoints.",
      "Video editing for promos, explainers, social content, and paid campaigns.",
      "Motion, packaging, and marketplace-ready visual asset support.",
      "Cross-channel creative consistency for growing founder-led brands."
    ],
    deliverables: [
      "Creative direction board",
      "Brand asset set",
      "Campaign creatives",
      "Landing page visuals",
      "Video edit exports",
      "Editable design handoff"
    ],
    useCases: [
      "Founders needing a stronger launch identity.",
      "Brands refreshing creative for paid growth or marketplace expansion.",
      "Service businesses upgrading brand presentation across channels.",
      "Teams needing recurring asset production support."
    ],
    process: [
      "Align on brand goals, channels, references, and asset priorities.",
      "Create the visual direction and production plan.",
      "Produce designs, edits, and campaign-ready assets.",
      "Deliver organized outputs for publishing, testing, and iteration."
    ],
    faqs: [
      {
        question: "Do you create both design and video assets?",
        answer:
          "Yes. We support static visual design, UI assets, ad creatives, and edited video outputs."
      },
      {
        question: "Can you support websites and marketing campaigns together?",
        answer:
          "Yes. We often align creative production with landing pages, store launches, and ad campaigns."
      },
      {
        question: "Will we get editable source files?",
        answer:
          "That can be included based on scope and delivery requirements."
      }
    ],
    relatedServices: ["website-development", "digital-marketing", "marketplace-setup"]
  }
] as const;

export const serviceLookup = Object.fromEntries(
  services.map((service) => [service.slug, service])
) as Record<ServiceItem["slug"], ServiceItem>;
