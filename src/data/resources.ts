export type ResourceSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ResourceItem = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  readTime: string;
  heroEyebrow: string;
  updatedAt: string;
  keyTakeaways: string[];
  sections: ResourceSection[];
  relatedLinks: Array<{ label: string; href: string }>;
};

export const resources: ResourceItem[] = [
  {
    slug: "website-redesign-seo-checklist",
    category: "SEO Foundations",
    title: "Website Redesign SEO Checklist for Businesses That Cannot Afford a Traffic Drop",
    excerpt:
      "A practical checklist covering redirects, metadata, page architecture, content preservation, and technical cleanup before a redesign goes live.",
    seoTitle: "Website Redesign SEO Checklist | Protect Rankings During a Rebuild",
    seoDescription:
      "Use this Bizfylr checklist to protect search visibility during a website redesign with redirects, metadata mapping, content retention, and technical SEO checks.",
    readTime: "8 min read",
    heroEyebrow: "SEO Playbook",
    updatedAt: "2026-05-19T00:00:00.000Z",
    keyTakeaways: [
      "Protect the URLs, metadata, and topical intent that already drive qualified impressions.",
      "Use redirects and internal-link updates as a traffic-preservation task, not a launch afterthought.",
      "Treat redesign QA as part of SEO execution before and after go-live."
    ],
    sections: [
      {
        title: "Map what already brings traffic",
        paragraphs: [
          "Before a redesign, identify which pages already attract impressions, clicks, or qualified inquiries. The objective is not to preserve every old page equally; it is to preserve the pages and themes that already have search value.",
          "This is where many redesigns quietly fail. Teams focus on visuals first, then remove or consolidate pages without understanding which URLs, headings, or keyword clusters were driving discoverability.",
        ],
        bullets: [
          "Export top pages from Search Console and analytics",
          "Map current titles, meta descriptions, and H1s",
          "Document high-performing blog, service, and landing pages",
        ],
      },
      {
        title: "Preserve intent, not just words",
        paragraphs: [
          "When copy is rewritten, the page still needs to satisfy the same search intent if you want to preserve or improve rankings. That means the new version should answer the same core questions, support the same user outcomes, and keep equivalent topical relevance.",
        ],
        bullets: [
          "Retain core service keywords where relevant",
          "Keep supporting FAQ and proof sections",
          "Strengthen internal links instead of deleting context",
        ],
      },
      {
        title: "Treat redirects as a revenue decision",
        paragraphs: [
          "Every removed or renamed page should have a destination. Redirects protect rankings, referral traffic, backlinks, and user trust.",
          "A redirect map is one of the simplest ways to reduce traffic loss during launch.",
        ],
        bullets: [
          "Create 301 redirects for replaced URLs",
          "Update internal links to final destinations",
          "Check for old HTML or misspelled route patterns",
        ],
      },
      {
        title: "Review the launch like a search engine and a buyer",
        paragraphs: [
          "Once the redesigned site is live, verify that search crawlers can still understand the page structure and that real visitors can still reach the right information quickly. A visually cleaner site is not enough if internal linking, heading hierarchy, or conversion paths become weaker after launch.",
        ],
        bullets: [
          "Recheck canonical URLs, indexing, and structured metadata output",
          "Validate service-page CTA paths, forms, and trust sections after launch",
          "Watch impression, click, and inquiry trends during the first few weeks"
        ],
      },
    ],
    relatedLinks: [
      { label: "Website Development", href: "/services/website-development" },
      { label: "Contact Bizfylr", href: "/contact-us" },
    ],
  },
  {
    slug: "lead-generation-system-playbook",
    category: "Lead Generation",
    title: "Lead Generation System Playbook for Founder-Led Businesses",
    excerpt:
      "How to connect offers, landing pages, forms, calendars, follow-up, and reporting into a cleaner conversion system.",
    seoTitle: "Lead Generation System Playbook | Convert More Website Traffic Into Sales Calls",
    seoDescription:
      "Learn how Bizfylr structures lead generation systems using landing pages, forms, CRM flows, calendars, and follow-up automation for better conversion quality.",
    readTime: "7 min read",
    heroEyebrow: "Conversion Systems",
    updatedAt: "2026-05-19T00:00:00.000Z",
    keyTakeaways: [
      "The conversion path starts with offer clarity, not just traffic volume or form design.",
      "Inquiry routing and follow-up speed are part of the sales system, not an admin task.",
      "Measure call quality and downstream outcomes, not just raw lead counts."
    ],
    sections: [
      {
        title: "Start with the offer and friction points",
        paragraphs: [
          "A lead generation system is not just a form. It is the path from attention to trust to action. If the offer is unclear or the CTA asks for too much too early, conversion quality drops even with strong traffic.",
        ],
        bullets: [
          "Define one primary CTA per page",
          "Match the CTA to buyer readiness",
          "Reduce unnecessary form fields on mobile",
        ],
      },
      {
        title: "Connect the inquiry flow end to end",
        paragraphs: [
          "Once a visitor submits a form, the system should route that inquiry quickly and consistently. Slow, manual handoffs are where many websites lose the majority of sales opportunities.",
        ],
        bullets: [
          "Route leads into CRM or inbox workflows",
          "Offer booking links for warm prospects",
          "Add WhatsApp or call paths for high-intent visitors",
        ],
      },
      {
        title: "Measure what happens after the form",
        paragraphs: [
          "It is not enough to count submissions. You need visibility into show-up rates, qualification quality, and which pages produce the strongest business outcomes.",
        ],
        bullets: [
          "Track form submissions and CTA clicks",
          "Track booking and call intent separately",
          "Review which channels create qualified inquiries",
        ],
      },
      {
        title: "Build the follow-up layer before scaling traffic",
        paragraphs: [
          "Many founder-led businesses increase ad spend or publish more content before the follow-up system is reliable. That usually creates more noise instead of more revenue. The website, CRM, call-booking flow, and owner visibility layer should be aligned before you push for volume.",
        ],
        bullets: [
          "Document who owns first response and qualification review",
          "Set response standards for web forms, calls, and WhatsApp inquiries",
          "Review missed-lead patterns monthly so traffic growth does not hide process gaps"
        ],
      },
    ],
    relatedLinks: [
      { label: "Business Expansion", href: "/services/business-expansion" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
    ],
  },
  {
    slug: "ecommerce-launch-checklist",
    category: "E-commerce",
    title: "E-commerce Launch Checklist for Stores That Want Stronger Conversion From Day One",
    excerpt:
      "A pre-launch checklist covering product structure, trust sections, checkout clarity, payments, shipping, and post-launch monitoring.",
    seoTitle: "E-commerce Launch Checklist | Conversion, Checkout, and Store Readiness",
    seoDescription:
      "Prepare your store launch with a Bizfylr checklist for product setup, checkout optimization, trust-building content, and operational readiness.",
    readTime: "6 min read",
    heroEyebrow: "Store Launch",
    updatedAt: "2026-05-19T00:00:00.000Z",
    keyTakeaways: [
      "Product structure and collection logic affect conversion as much as the visual theme.",
      "Trust-building content should appear before checkout friction becomes a drop-off problem.",
      "Operational readiness after launch matters as much as the storefront build."
    ],
    sections: [
      {
        title: "Get the product architecture right first",
        paragraphs: [
          "Customers convert faster when product pages, collections, and navigation feel deliberate. Catalog structure is a conversion issue, not just a store admin task.",
        ],
        bullets: [
          "Create clear category and collection logic",
          "Review title, media, and variant structure",
          "Reduce duplicate or confusing product options",
        ],
      },
      {
        title: "Build trust before checkout",
        paragraphs: [
          "Shoppers hesitate when policies, delivery details, and brand credibility are hard to find. Those elements should be visible throughout the purchase journey, not hidden in the footer.",
        ],
        bullets: [
          "Clarify delivery, returns, and contact paths",
          "Show trust badges and support assurances",
          "Use product and cart copy that reduces uncertainty",
        ],
      },
      {
        title: "Protect operations after launch",
        paragraphs: [
          "A good launch still needs a clean process for order handling, support questions, and performance review once traffic arrives.",
        ],
        bullets: [
          "Check payment and shipping workflows",
          "Set up tracking and reporting views",
          "Create a recurring update and QA cadence",
        ],
      },
      {
        title: "Prepare launch pages for search and retention, not just day-one traffic",
        paragraphs: [
          "A store launch should not depend entirely on ads or social pushes. Category pages, FAQs, trust copy, and post-purchase clarity all shape how quickly the store becomes easier to find, easier to trust, and easier to buy from again.",
        ],
        bullets: [
          "Write clearer collection and category copy for search visibility",
          "Support product pages with FAQs, shipping clarity, and contact access",
          "Plan a post-launch content and merchandising rhythm from the start"
        ],
      },
    ],
    relatedLinks: [
      { label: "E-commerce Setup", href: "/services/ecommerce-setup" },
      { label: "E-commerce Management", href: "/services/ecommerce-management" },
    ],
  },
  {
    slug: "global-founder-digital-infrastructure",
    category: "Business Growth",
    title: "Digital Infrastructure Priorities for Global-Ready Founders",
    excerpt:
      "What international and cross-border founders should prioritize first across trust, operations, compliance support, and growth systems.",
    seoTitle: "Digital Infrastructure Priorities for Global Founders | Bizfylr",
    seoDescription:
      "See how global-ready founders can prioritize websites, operations, compliance support, and growth systems to build a stronger digital business foundation.",
    readTime: "7 min read",
    heroEyebrow: "Founder Strategy",
    updatedAt: "2026-05-19T00:00:00.000Z",
    keyTakeaways: [
      "Cross-border trust signals should be treated as core infrastructure, not secondary branding.",
      "Documented workflows reduce friction faster when teams, tools, or time zones expand.",
      "Growth channels work better when website, CRM, payment, and support systems are connected."
    ],
    sections: [
      {
        title: "Credibility comes before scale",
        paragraphs: [
          "Cross-border founders often need to establish trust quickly with customers, partners, and service providers. That makes the website, messaging, and support flow part of the infrastructure, not just branding.",
        ],
        bullets: [
          "Clarify what the company does in one screen",
          "Show contact paths and legitimacy signals",
          "Use clean service and pricing architecture",
        ],
      },
      {
        title: "Operations need to be documented early",
        paragraphs: [
          "When the team is distributed or the founder is operating internationally, loose processes create avoidable confusion. Documentation and workflow clarity reduce friction as the business grows.",
        ],
        bullets: [
          "Create lead handling and delivery workflows",
          "Define where reporting lives",
          "Document approvals, ownership, and support responsibilities",
        ],
      },
      {
        title: "Growth works better when the stack is connected",
        paragraphs: [
          "Traffic, forms, payments, CRM, calendars, and support should work as one system. When those tools are fragmented, growth becomes expensive and hard to trust.",
        ],
        bullets: [
          "Connect forms to follow-up systems",
          "Track CTA clicks and booked calls",
          "Review the stack regularly for bottlenecks",
        ],
      },
      {
        title: "Use service architecture to reduce fragmentation early",
        paragraphs: [
          "Global-ready founders often work with multiple vendors, jurisdictions, or delivery partners. That makes service architecture important. The website, support flow, CRM, reporting, compliance handling, and payment systems should reinforce each other instead of becoming separate operational islands.",
        ],
        bullets: [
          "Centralize intake, service routing, and follow-up ownership",
          "Align trust pages, contact paths, and payment logic with the real operating model",
          "Review whether the current stack supports scale or only the current stage"
        ],
      },
    ],
    relatedLinks: [
      { label: "Business Compliance", href: "/services/business-compliance" },
      { label: "Book a Consultation", href: "/contact-us" },
    ],
  },
] as const;

export const resourcesLookup = Object.fromEntries(
  resources.map((resource) => [resource.slug, resource]),
) as Record<(typeof resources)[number]["slug"], ResourceItem>;
