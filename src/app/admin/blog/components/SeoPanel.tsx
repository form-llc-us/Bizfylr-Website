"use client";

import { BlogSchemaType } from "@/lib/blog/constants";
import type { UseFormReturn } from "react-hook-form";

import { ContentScore } from "@/app/admin/blog/components/ContentScore";
import { InternalLinks } from "@/app/admin/blog/components/InternalLinks";
import { KeywordAnalyzer } from "@/app/admin/blog/components/KeywordAnalyzer";
import { MetaPreview } from "@/app/admin/blog/components/MetaPreview";
import { SlugEditor } from "@/app/admin/blog/components/SlugEditor";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/data/site";
import type { BlogPostInput } from "@/lib/blog/validations";
import type { BlogAnalysisResult, InternalLinkSuggestion } from "@/types/blog";

type SeoPanelProps = {
  form: UseFormReturn<BlogPostInput>;
  analysis: BlogAnalysisResult | null;
  internalLinkSuggestions: InternalLinkSuggestion[];
  slug: string;
  onSlugChange: (value: string) => void;
  onRegenerateSlug: () => void;
};

export function SeoPanel({
  form,
  analysis,
  internalLinkSuggestions,
  slug,
  onSlugChange,
  onRegenerateSlug,
}: SeoPanelProps) {
  return (
    <div className="grid gap-4">
      <ContentScore
        readabilityScore={analysis?.readabilityScore ?? form.watch("readabilityScore")}
        score={analysis?.score ?? form.watch("seoScore")}
      />

      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-foreground">SEO settings</p>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Focus keyword</span>
            <Input {...form.register("focusKeyword")} placeholder="lead generation system" />
          </label>

          <SlugEditor onChange={onSlugChange} onRegenerate={onRegenerateSlug} value={slug} />

          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Meta title</span>
            <Input {...form.register("metaTitle")} placeholder="SEO title for search results" />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Meta description</span>
            <Textarea {...form.register("metaDescription")} className="min-h-[96px]" />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Canonical URL</span>
            <Input {...form.register("canonicalUrl")} placeholder={`${SITE.url}/blog/your-post`} />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Schema type</span>
            <Select {...form.register("schemaType")}>
              <option className="bg-surface text-foreground" value={BlogSchemaType.ARTICLE}>
                Article
              </option>
              <option className="bg-surface text-foreground" value={BlogSchemaType.BLOG_POSTING}>
                BlogPosting
              </option>
              <option className="bg-surface text-foreground" value={BlogSchemaType.FAQ_PAGE}>
                FAQPage
              </option>
            </Select>
          </label>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-foreground">Open Graph and Twitter</p>
        <div className="mt-4 grid gap-4">
          <Input {...form.register("ogTitle")} placeholder="Open Graph title" />
          <Textarea {...form.register("ogDescription")} className="min-h-[88px]" placeholder="Open Graph description" />
          <Input {...form.register("ogImage")} placeholder="Open Graph image URL" />
          <Input {...form.register("twitterTitle")} placeholder="Twitter title" />
          <Textarea {...form.register("twitterDescription")} className="min-h-[88px]" placeholder="Twitter description" />
          <Input {...form.register("twitterImage")} placeholder="Twitter image URL" />
        </div>
      </div>

      <MetaPreview
        description={form.watch("metaDescription") || form.watch("excerpt")}
        slug={slug}
        title={form.watch("metaTitle") || form.watch("title")}
      />

      <KeywordAnalyzer analysis={analysis} focusKeyword={form.watch("focusKeyword") || ""} />
      <InternalLinks suggestions={internalLinkSuggestions} />
    </div>
  );
}
