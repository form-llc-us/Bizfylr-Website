"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, PhoneCall } from "lucide-react";

import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { SITE } from "@/data/site";

export function FloatingContactBar() {
  const pathname = usePathname() ?? "";
  const hiddenPrefixes = [
    "/admin",
    "/payment",
    "/thank-you",
    "/privacy-policy",
    "/refund-policy",
    "/terms-of-service"
  ];

  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.25rem)] max-w-[22rem] -translate-x-1/2 lg:hidden">
        <div className="grid grid-cols-3 gap-1.5 rounded-[22px] border border-white/12 bg-background/92 p-1.5 shadow-glow backdrop-blur-xl">
          <Link className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary via-primary-light to-indigo-400 px-3 text-[13px] font-semibold text-foreground" href={SITE.consultationUrl} rel="noreferrer" target="_blank">
            <CalendarDays className="h-4 w-4" />
            Book
          </Link>
          <WhatsAppButton
            className="w-full"
            label="Chat"
            message="Hello Bizfylr team, I am interested in your services. Please guide me."
            variant="inline"
          />
          <Link className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-background/90 px-3 py-2.5 text-[13px] font-semibold text-foreground shadow-glow backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10" href={SITE.phoneHref}>
            <PhoneCall className="h-4 w-4 text-gold" />
            Call
          </Link>
        </div>
      </div>
    </>
  );
}
