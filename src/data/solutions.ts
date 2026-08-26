export type SolutionItem = {
  slug: string;
  title: string;
  audience: string;
  summary: string;
  painPoint: string;
  outcome: string;
  bullets: string[];
  href: string;
};

export const solutions: SolutionItem[] = [
  {
    slug: "founder-launch-systems",
    title: "Founder Launch Systems",
    audience: "Startups, agencies, and founder-led service businesses",
    summary:
      "Combine positioning, website clarity, lead capture, and operational setup so launch momentum turns into actual sales conversations.",
    painPoint:
      "Founders often launch with scattered tools, weak website trust, and no clean system for capturing or converting demand.",
    outcome:
      "A credible digital presence, connected inquiry flow, and stronger first-touch experience for leads and partners.",
    bullets: ["Premium website build", "Lead capture workflow", "Calendly and CRM connection", "Trust-building page structure"],
    href: "/services/business-expansion",
  },
  {
    slug: "ecommerce-growth-ops",
    title: "E-commerce Growth Ops",
    audience: "DTC brands and product businesses",
    summary:
      "Launch or improve stores with better catalog structure, conversion paths, operations support, and campaign readiness.",
    painPoint:
      "Many stores underperform because the merchandising, checkout flow, and post-purchase operations are not aligned.",
    outcome:
      "Cleaner store architecture, stronger conversion paths, and reporting visibility that supports repeatable growth.",
    bullets: ["Store setup or rebuild", "Catalog and checkout optimization", "Operations workflow support", "Performance reporting setup"],
    href: "/services/ecommerce-setup",
  },
  {
    slug: "marketplace-scale-support",
    title: "Marketplace Scale Support",
    audience: "Amazon, Etsy, Walmart, and eBay sellers",
    summary:
      "Structure seller operations, listing quality, reporting, and account support around channel health and growth.",
    painPoint:
      "Marketplace growth stalls when catalog upkeep, support handling, and performance oversight are reactive.",
    outcome:
      "A more stable seller workflow, clearer reporting cadence, and stronger operational control across active channels.",
    bullets: ["Marketplace onboarding", "Listing optimization", "Seller performance support", "Cross-channel operations cadence"],
    href: "/services/marketplace-operations",
  },
  {
    slug: "growth-funnel-optimization",
    title: "Growth Funnel Optimization",
    audience: "Businesses investing in paid traffic or outbound demand generation",
    summary:
      "Align traffic, landing pages, tracking, and creative so acquisition spend leads to better-quality inquiries.",
    painPoint:
      "Traffic underperforms when messaging, conversion paths, and measurement are disconnected.",
    outcome:
      "A clearer growth funnel with better attribution, stronger trust signals, and more qualified lead flow.",
    bullets: ["Landing page strategy", "Paid growth alignment", "Tracking and analytics setup", "Offer and CTA optimization"],
    href: "/services/digital-marketing",
  },
] as const;
