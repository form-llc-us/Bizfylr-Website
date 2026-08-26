"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { companyNav, mainNav, serviceNav } from "@/data/nav";
import { SiteLogo } from "@/components/shared/SiteLogo";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const solutionsLink = mainNav.find((item) => item.label === "Solutions")!;
  const pricingLink = mainNav.find((item) => item.label === "Pricing")!;
  const portfolioLink = mainNav.find((item) => item.label === "Portfolio")!;
  const blogLink = companyNav.find((item) => item.label === "Blog")!;
  const primaryLinks = [solutionsLink, pricingLink];
  const resourcesLink = mainNav.find((item) => item.label === "Resources")!;
  const aboutLink = companyNav.find((item) => item.label === "About")!;
  const faqLink = companyNav.find((item) => item.label === "FAQ")!;
  const contactLink = companyNav.find((item) => item.label === "Contact")!;
  const companyLinks = [portfolioLink, blogLink, resourcesLink, faqLink];

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.removeProperty("overflow");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/5 text-foreground transition-colors duration-200 hover:bg-white/10"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Close navigation menu"
              className="fixed inset-0 z-30 bg-background/55 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={close}
              type="button"
            />
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              aria-modal="true"
              className="absolute inset-x-0 top-[calc(100%+12px)] z-40 rounded-[28px] border border-white/12 bg-background/95 p-6 shadow-glow backdrop-blur-xl"
              exit={{ opacity: 0, y: -12 }}
              id="mobile-navigation"
              initial={{ opacity: 0, y: -12 }}
              role="dialog"
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-5">
                <div className="border-b border-white/8 pb-4">
                  <SiteLogo className="hover:opacity-100 lg:opacity-100" />
                </div>
                <div className="space-y-3">
                  <Link
                    className={cn(
                      "block rounded-2xl px-1 py-1 text-base font-semibold text-muted transition-colors hover:text-foreground",
                      pathname === "/" && "text-foreground"
                    )}
                    href="/"
                    onClick={close}
                  >
                    Home
                  </Link>
                  {primaryLinks.map((item) => (
                    <Link
                      key={`${pathname}-${item.href}`}
                      className={cn(
                        "block rounded-2xl px-1 py-1 text-base font-semibold text-muted transition-colors hover:text-foreground",
                        pathname === item.href && "text-foreground"
                      )}
                      href={item.href}
                      onClick={close}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    className={cn(
                      "block rounded-2xl px-1 py-1 text-base font-semibold text-muted transition-colors hover:text-foreground",
                      pathname === aboutLink.href && "text-foreground"
                    )}
                    href={aboutLink.href}
                    onClick={close}
                  >
                    {aboutLink.label}
                  </Link>
                </div>
                <div className="border-t border-white/8 pt-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Company</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {companyLinks.map((item) => (
                      <Link
                        key={`${pathname}-${item.href}`}
                        className={cn(
                          "rounded-2xl px-1 py-1 text-sm text-muted transition-colors hover:text-foreground",
                          pathname === item.href && "text-foreground"
                        )}
                        href={item.href}
                        onClick={close}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  className={cn(
                    "block rounded-2xl px-1 py-1 text-base font-semibold text-muted transition-colors hover:text-foreground",
                    pathname === contactLink.href && "text-foreground"
                  )}
                  href={contactLink.href}
                  onClick={close}
                >
                  {contactLink.label}
                </Link>
                <div className="border-t border-white/8 pt-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Services</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {serviceNav.map((item) => (
                      <Link
                        key={`${pathname}-${item.href}`}
                        className="rounded-2xl px-1 py-1 text-sm text-muted transition-colors hover:text-foreground"
                        href={item.href}
                        onClick={close}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary via-primary-light to-indigo-400 px-5 py-3 text-sm font-semibold text-foreground"
                  href={SITE.consultationUrl}
                  onClick={close}
                  rel="noreferrer"
                  target="_blank"
                >
                  Book Free Consultation
                </Link>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
