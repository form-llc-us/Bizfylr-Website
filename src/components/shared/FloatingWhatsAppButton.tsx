"use client";

import { usePathname } from "next/navigation";

import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

const hiddenRoutes = [
  "/api",
  "/admin",
  "/dashboard",
  "/checkout",
  "/payment",
  "/paypal",
  "/tax-intake",
  "/us-tax-filing-intake",
  "/payment-intake",
  "/thank-you",
  "/us/thank-you"
] as const;

export function FloatingWhatsAppButton() {
  const pathname = usePathname() ?? "";

  if (hiddenRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-4 z-40 hidden lg:block lg:right-6">
      <WhatsAppButton
        className="min-w-12 px-3 sm:px-4"
        label="WhatsApp Us"
        message="Hello Bizfylr team, I am interested in your services. Please guide me."
        variant="floating"
      />
    </div>
  );
}
