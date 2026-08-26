export type PricingPlan = {
  name: "Starter" | "Growth" | "Scale";
  priceLabel: string;
  description: string;
  highlights?: readonly string[];
  cta: string;
  featured?: boolean;
  features: string[];
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    priceLabel: "Starting at $299",
    description: "For founders validating an offer, service, or first digital presence.",
    highlights: [
      "Best when you need a fast first launch without overbuilding the stack.",
      "Useful for early-stage pages, setup work, and a cleaner conversion starting point."
    ],
    cta: "Start With Starter",
    features: [
      "Strategy call and scope definition",
      "Focused landing page or setup sprint",
      "Core automation or website foundation",
      "Light SEO and conversion guidance",
      "Launch checklist and handoff"
    ]
  },
  {
    name: "Growth",
    priceLabel: "Starting at $899",
    description: "For growing teams that need a stronger system across design, growth, and operations.",
    highlights: [
      "Built for businesses that have traction and need better structure behind lead flow, sales, or delivery.",
      "Adds deeper implementation, stronger reporting visibility, and more post-launch refinement."
    ],
    cta: "Choose Growth",
    featured: true,
    features: [
      "Multi-page experience or deeper system implementation",
      "Analytics, CRM, or campaign integration",
      "Priority delivery planning",
      "Conversion and content refinement",
      "Post-launch optimization support"
    ]
  },
  {
    name: "Scale",
    priceLabel: "Custom scope",
    description: "For businesses that need full-stack execution across growth, technology, and operations.",
    highlights: [
      "Designed for brands that need multiple workstreams coordinated under one delivery model.",
      "Best for longer engagements where reporting, automation, marketing, and operations need to move together."
    ],
    cta: "Talk to Sales",
    features: [
      "Cross-functional delivery plan",
      "Ongoing growth and operations support",
      "Advanced integrations and automation",
      "Leadership reporting and visibility systems",
      "Dedicated collaboration cadence"
    ]
  }
] as const;

export const pricingAddOns = [
  "Additional landing pages and campaign pages",
  "CRM implementation and reporting layers",
  "Content publishing workflows",
  "Marketplace expansion support",
  "Creative production retainers",
  "Ongoing maintenance and optimization"
] as const;

export const pricingDisclaimer =
  "Final pricing may vary based on scope, state or government fees, third-party tools, integrations, and implementation complexity.";
