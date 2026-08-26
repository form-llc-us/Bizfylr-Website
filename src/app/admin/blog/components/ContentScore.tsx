"use client";

import { cn } from "@/lib/utils";

export function ContentScore({
  score,
  readabilityScore,
}: {
  score: number;
  readabilityScore: number;
}) {
  return (
    <div className="grid gap-3 rounded-[24px] border border-white/10 bg-background/40 p-4">
      <div className="grid grid-cols-2 gap-3">
        <ScoreBlock label="SEO score" tone="primary" value={score} />
        <ScoreBlock label="Readability" tone="emerald" value={readabilityScore} />
      </div>
      <p className="text-xs leading-6 text-muted">
        Scores update as title, content structure, links, media, and metadata improve.
      </p>
    </div>
  );
}

function ScoreBlock({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "emerald";
}) {
  const fillClassName = tone === "primary" ? "bg-primary" : "bg-emerald";

  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-foreground">{value}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={cn("h-full rounded-full transition-all duration-300", fillClassName)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
