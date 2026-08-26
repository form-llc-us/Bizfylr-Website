"use client";

import { RefreshCcw } from "lucide-react";

import { Input } from "@/components/ui/input";

export function SlugEditor({
  value,
  onChange,
  onRegenerate,
}: {
  value: string;
  onChange: (value: string) => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-foreground" htmlFor="slug">
        Slug
      </label>
      <div className="flex gap-2">
        <Input
          id="slug"
          onChange={(event) => onChange(event.target.value)}
          placeholder="blog-post-slug"
          value={value}
        />
        <button
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-4 text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10"
          onClick={onRegenerate}
          type="button"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
