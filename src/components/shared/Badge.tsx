import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLDivElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted backdrop-blur transition-colors duration-300 hover:border-primary/30 hover:bg-primary/[0.08] hover:text-foreground sm:text-[0.7rem] sm:tracking-[0.18em]",
        className
      )}
      {...props}
    />
  );
}
