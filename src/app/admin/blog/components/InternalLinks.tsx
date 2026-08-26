"use client";

import Link from "next/link";

import type { InternalLinkSuggestion } from "@/types/blog";

export function InternalLinks({ suggestions }: { suggestions: InternalLinkSuggestion[] }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-background/40 p-4">
      <p className="text-sm font-semibold text-foreground">Internal link suggestions</p>
      <div className="mt-3 grid gap-3">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <Link
              className="interactive-surface rounded-[18px] border border-white/8 bg-white/[0.03] p-3"
              href={suggestion.url}
              key={suggestion.slug}
              target="_blank"
            >
              <p className="text-sm font-semibold text-foreground">{suggestion.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-primary-light">
                {suggestion.reason}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-sm leading-6 text-muted">
            Publish related posts or align tags/categories to unlock stronger suggestions.
          </p>
        )}
      </div>
    </div>
  );
}
