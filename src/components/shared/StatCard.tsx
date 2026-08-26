import { GlassCard } from "@/components/shared/GlassCard";

type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <GlassCard className="interactive-surface p-5 md:p-6">
      <div className="space-y-3">
        <p className="font-heading text-3xl font-extrabold tracking-[-0.04em] text-foreground">{value}</p>
        <p className="text-sm leading-6 text-muted">{label}</p>
      </div>
    </GlassCard>
  );
}
