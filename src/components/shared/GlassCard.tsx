import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/12 bg-white/[0.04] shadow-glow backdrop-blur-xl transition-[border-color,background-color,box-shadow,transform] duration-300 ease-out",
        className
      )}
      {...props}
    />
  );
}
