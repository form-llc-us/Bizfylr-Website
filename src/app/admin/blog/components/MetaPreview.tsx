"use client";

import { SITE } from "@/data/site";

export function MetaPreview({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-background/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Search preview</p>
      <div className="mt-3 space-y-1">
        <p className="line-clamp-2 text-lg font-semibold leading-6 text-primary-light">
          {title || "Your SEO title will appear here"}
        </p>
        <p className="text-sm text-emerald">{new URL(SITE.url).host}/blog/{slug || "your-post-slug"}</p>
        <p className="line-clamp-3 text-sm leading-6 text-muted">
          {description || "Write a meta description that explains the topic, outcome, and click reason."}
        </p>
      </div>
    </div>
  );
}
