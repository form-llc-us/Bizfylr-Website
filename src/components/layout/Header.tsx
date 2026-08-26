import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { MobileNav } from "@/components/layout/MobileNav";
import { Container } from "@/components/shared/Container";
import { GradientButton } from "@/components/shared/GradientButton";
import { SiteLogo } from "@/components/shared/SiteLogo";
import { companyNav, mainNav, serviceNav } from "@/data/nav";
import { SITE } from "@/data/site";

export function Header() {
  const solutionsLink = mainNav.find((item) => item.label === "Solutions")!;
  const pricingLink = mainNav.find((item) => item.label === "Pricing")!;
  const portfolioLink = mainNav.find((item) => item.label === "Portfolio")!;
  const resourcesLink = mainNav.find((item) => item.label === "Resources")!;
  const aboutLink = companyNav.find((item) => item.label === "About")!;
  const blogLink = companyNav.find((item) => item.label === "Blog")!;
  const faqLink = companyNav.find((item) => item.label === "FAQ")!;
  const contactLink = companyNav.find((item) => item.label === "Contact")!;

  const primaryLinks = [solutionsLink, pricingLink];
  const companyLinks = [portfolioLink, blogLink, resourcesLink, faqLink];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <Container className="relative flex min-h-20 items-center justify-between gap-3">
        <SiteLogo priority />

        <nav
          aria-label="Primary navigation"
          className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:flex xl:gap-5"
        >
          <Link
            className="whitespace-nowrap text-sm font-semibold text-muted transition-colors duration-200 hover:text-primary-light"
            href="/"
          >
            Home
          </Link>

          <HeaderDropdown items={serviceNav} label="Services" rootHref="/services" />

          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              className="whitespace-nowrap text-sm font-semibold text-muted transition-colors duration-200 hover:text-primary-light"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}

          <Link
            className="whitespace-nowrap text-sm font-semibold text-muted transition-colors duration-200 hover:text-primary-light"
            href={aboutLink.href}
          >
            {aboutLink.label}
          </Link>

          <HeaderDropdown items={companyLinks} label="Company" />

          <Link
            className="whitespace-nowrap text-sm font-semibold text-muted transition-colors duration-200 hover:text-primary-light"
            href={contactLink.href}
          >
            {contactLink.label}
          </Link>
        </nav>

        <div className="hidden shrink-0 lg:block">
          <GradientButton href={SITE.consultationUrl} rel="noreferrer" target="_blank">
            Book Free Consultation
          </GradientButton>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}

function HeaderDropdown({
  label,
  items,
  rootHref
}: {
  label: string;
  items: ReadonlyArray<{
    href: string;
    label: string;
  }>;
  rootHref?: string;
}) {
  return (
    <div className="group relative">
      {rootHref ? (
        <Link
          className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-muted transition-colors duration-200 hover:text-primary-light"
          href={rootHref}
        >
          {label}
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
        </Link>
      ) : (
        <button
          aria-haspopup="menu"
          className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-muted transition-colors duration-200 hover:text-primary-light"
          type="button"
        >
          {label}
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
        </button>
      )}

      <div className="pointer-events-none invisible absolute left-0 top-full z-30 w-[300px] pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-[22px] border border-white/10 bg-background/95 p-4 shadow-glow backdrop-blur-xl">
          <div className="grid gap-2">
            {items.map((item) => (
              <Link
                key={item.href}
                className="rounded-2xl px-3 py-2.5 text-sm text-muted transition-all duration-200 hover:bg-primary/10 hover:text-foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
