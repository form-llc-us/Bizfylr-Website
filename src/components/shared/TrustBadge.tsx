import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type TrustBadgeProps = {
  label: string;
  className?: string;
};

export function TrustBadge({ label, className }: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm leading-5 text-foreground transition-colors duration-300 hover:border-primary/30 hover:bg-primary/[0.08]",
        className
      )}
    >
      <CheckCircle2 className="h-4 w-4 text-emerald" />
      <span>{label}</span>
    </div>
  );
}
