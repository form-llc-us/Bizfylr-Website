"use client";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, className }: RevealProps) {
  return <div className={cn(className)}>{children}</div>;
}
