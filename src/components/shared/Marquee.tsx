"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Marquee({ children, className }: MarqueeProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("overflow-hidden", className)}>
      <div className={cn("flex w-max gap-5", prefersReducedMotion ? "flex-wrap" : "animate-marquee")}>
        {children}
        {children}
      </div>
    </div>
  );
}
