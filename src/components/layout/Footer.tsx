import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { SiteLogo } from "@/components/shared/SiteLogo";
import { footerNav } from "@/data/nav";
import { SITE } from "@/data/site";
import { WORKING_HOURS } from "@/lib/constants";

const companyLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/solutions",
    label: "Solutions",
  },
  {
    href: "/about-us",
    label: "About Us",
  },
  {
    href: "/portfolio",
    label: "Portfolio",
  },
  {
    href: "/contact-us",
    label: "Contact Us",
  },
];

const serviceLinks = [
  ...footerNav.services.slice(0, 6),
  {
    href: "/services",
    label: "All Services",
  },
];

const resourceLinks = [
  {
    href: "/payment",
    label: "Make a Payment",
  },
  {
    href: "/faq",
    label: "FAQ",
  },
  {
    href: "/resources",
    label: "Resources",
  },
  {
    href: "/blog",
    label: "Blog",
  },
  {
    href: "/portfolio",
    label: "Portfolio",
  },
  {
    href: "/contact-us",
    label: "Contact Support",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface/60">
      <Container className="py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_2.72fr] lg:gap-16">
          <div className="max-w-md space-y-5 text-left">
            <div className="space-y-2.5">
              <SiteLogo
                className="hover:opacity-100 lg:opacity-100"
                iconClassName="h-11 w-11 rounded-[18px]"
                labelClassName="text-2xl"
              />

              <p className="text-sm leading-7 text-muted">
                {SITE.description}
              </p>
            </div>

            <div className="space-y-1.5 text-sm leading-6 text-muted">
              <p>{SITE.address.streetAddress}</p>

              <p>
                {SITE.address.city}, {SITE.address.region}{" "}
                {SITE.address.postalCode}, {SITE.address.country}
              </p>

              <p>
                <Link className="interactive-link" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </Link>
              </p>

              <p>
                <Link
                  className="interactive-link"
                  href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                >
                  {SITE.phone}
                </Link>
              </p>

              <p>{WORKING_HOURS}</p>
            </div>
          </div>

          <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            <FooterColumn items={companyLinks} title="Company" />
            <FooterColumn items={serviceLinks} title="Services" />
            <FooterColumn items={resourceLinks} title="Resources" />
            <FooterColumn items={footerNav.legal} title="Legal" />
          </div>
        </div>
      </Container>

      <div className="border-t border-white/8 py-5 text-sm text-muted">
        <Container className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="leading-6 text-left">
            Copyright {new Date().getFullYear()} {SITE.legalName}. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 md:justify-end">
            {Object.entries(SITE.socials)
              .filter(([, href]) => href)
              .map(([network, href]) => (
                <Link
                  key={network}
                  className="capitalize transition-colors duration-200 hover:text-foreground"
                  href={href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {network}
                </Link>
              ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<{
    href: string;
    label: string;
  }>;
}) {
  return (
    <div className="space-y-4 text-left">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {title}
      </p>

      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            className="text-sm leading-6 text-foreground/80 transition-colors duration-200 hover:text-white/95"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
