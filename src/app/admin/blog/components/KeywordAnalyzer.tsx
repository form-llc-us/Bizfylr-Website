"use client";

import type { BlogAnalysisResult } from "@/types/blog";

export function KeywordAnalyzer({
  analysis,
  focusKeyword,
}: {
  analysis: BlogAnalysisResult | null;
  focusKeyword: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-background/40 p-4">
      <p className="text-sm font-semibold text-foreground">Keyword analyzer</p>
      <div className="mt-3 grid gap-3 text-sm text-muted">
        <p>
          Focus keyword:{" "}
          <span className="font-semibold text-foreground">
            {focusKeyword || "Not set"}
          </span>
        </p>
        <p>Word count: {analysis?.stats.wordCount ?? 0}</p>
        <p>Keyword density: {analysis?.stats.keywordDensity ?? 0}%</p>
        <p>Internal links: {analysis?.stats.internalLinkCount ?? 0}</p>
        <p>External links: {analysis?.stats.externalLinkCount ?? 0}</p>
      </div>
    </div>
  );
}
