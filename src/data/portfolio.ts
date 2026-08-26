export type PortfolioProject = {
  name: string;
  category: string;
  description: string;
  services: readonly string[];
  outcomes?: readonly string[];
  image: string;
  imageAlt: string;
  href: string | null;
};

export const portfolioProjects = [
  {
    name: "FormLLC",
    category: "Corporate website",
    description:
      "A corporate website built to position a founder-focused U.S. company formation brand with clear service flows, trust signals, and conversion-focused sections.",
    services: ["Website development", "Service architecture", "Conversion copy"],
    outcomes: [
      "Clearer service hierarchy for first-time visitors.",
      "Stronger trust positioning for founder consultations."
    ],
    image: "/images/portfolio/formllc.webp",
    imageAlt: "Responsive FormLLC corporate website preview across desktop, tablet, and mobile screens",
    href: "https://formllc.us/"
  },
  {
    name: "PCOCBD Wholesale",
    category: "Wholesale e-commerce website",
    description:
      "A wholesale commerce website designed for product discovery, buyer confidence, catalog presentation, and transaction-ready browsing.",
    services: ["E-commerce setup", "UX refinement", "Catalog presentation"],
    outcomes: [
      "Cleaner product presentation for wholesale buyers.",
      "More confidence at the inquiry and purchase stage."
    ],
    image: "/images/portfolio/pcocbd.webp",
    imageAlt: "PCOCBD Wholesale e-commerce website preview showing product catalog and wholesale layout",
    href: "https://pcocbdwholesale.com/"
  },
  {
    name: "ToolifyHub",
    category: "E-commerce website",
    description:
      "An online storefront structured to support catalog browsing, product-led growth, responsive shopping flows, and cleaner merchandising.",
    services: ["Store setup", "Product architecture", "UI design"],
    outcomes: [
      "Improved merchandising clarity across collections.",
      "A more consistent responsive shopping experience."
    ],
    image: "/images/portfolio/toolifyhub.webp",
    imageAlt: "ToolifyHub e-commerce website preview across desktop, laptop, tablet, and mobile screens",
    href: "https://toolifyhub.bizfiller.com/"
  },
  {
    name: "The Veggie Stand",
    category: "E-commerce website",
    description:
      "A direct-to-consumer e-commerce website designed around approachable product presentation, simple navigation, and a clearer purchase path.",
    services: ["Storefront setup", "Commerce UX", "Launch support"],
    outcomes: [
      "Simpler navigation for faster product discovery.",
      "A cleaner path from browse to checkout."
    ],
    image: "/images/portfolio/veggie-stand.webp",
    imageAlt: "The Veggie Stand e-commerce website preview showing product and store pages",
    href: "https://shop.bizfiller.com/"
  },
  {
    name: "Purecannaorganics",
    category: "E-commerce website",
    description:
      "A product-led commerce experience built to support brand credibility, category navigation, responsive presentation, and growth-readiness.",
    services: ["E-commerce setup", "Content structure", "Visual polish"],
    outcomes: [
      "Stronger category clarity for repeat shoppers.",
      "Improved credibility through more polished presentation."
    ],
    image: "/images/portfolio/purecannaorganics.webp",
    imageAlt: "Purecannaorganics e-commerce website preview across multiple responsive devices",
    href: "https://purecannaorganic.com/"
  },
  {
    name: "CreateLLC Online",
    category: "Corporate website",
    description:
      "A business setup website structured around trust, service clarity, cross-border founder support, and SEO-friendly information architecture.",
    services: ["Website development", "Service design", "SEO structure"],
    outcomes: [
      "More informative service sections for search-ready traffic.",
      "Better trust flow for international founder audiences."
    ],
    image: "/images/portfolio/createllc-online.webp",
    imageAlt: "CreateLLC Online corporate website preview with service and business formation sections",
    href: null
  }
] as const satisfies readonly PortfolioProject[];
