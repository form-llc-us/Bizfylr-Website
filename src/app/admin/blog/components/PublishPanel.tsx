"use client";

import Image from "next/image";
import { BlogPostStatus, type BlogPostStatus as BlogPostStatusValue } from "@/lib/blog/constants";
import { Loader2, UploadCloud } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { GradientButton } from "@/components/shared/GradientButton";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPostInput } from "@/lib/blog/validations";

type PublishPanelProps = {
  form: UseFormReturn<BlogPostInput>;
  tagInput: string;
  categoryInput: string;
  onTagInputChange: (value: string) => void;
  onCategoryInputChange: (value: string) => void;
  onSubmitAs: (status: BlogPostStatusValue) => void;
  isSaving: boolean;
  isUploading: boolean;
  onUploadImage: (file: File) => Promise<void>;
};

export function PublishPanel({
  form,
  tagInput,
  categoryInput,
  onTagInputChange,
  onCategoryInputChange,
  onSubmitAs,
  isSaving,
  isUploading,
  onUploadImage,
}: PublishPanelProps) {
  const featuredImageUrl = form.watch("featuredImageUrl");

  return (
    <div className="grid gap-4">
      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-foreground">Publish</p>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Status</span>
            <Select {...form.register("status")}>
              <option className="bg-surface text-foreground" value={BlogPostStatus.DRAFT}>
                Draft
              </option>
              <option className="bg-surface text-foreground" value={BlogPostStatus.PUBLISHED}>
                Published
              </option>
              <option className="bg-surface text-foreground" value={BlogPostStatus.ARCHIVED}>
                Archived
              </option>
            </Select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 disabled:opacity-70"
              disabled={isSaving}
              onClick={() => onSubmitAs(BlogPostStatus.DRAFT)}
              type="button"
            >
              {isSaving ? "Saving..." : "Save draft"}
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-primary via-primary-light to-indigo-400 px-4 text-sm font-semibold text-foreground shadow-blue disabled:opacity-70"
              disabled={isSaving}
              onClick={() => onSubmitAs(BlogPostStatus.PUBLISHED)}
              type="button"
            >
              {isSaving ? "Publishing..." : "Publish post"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-foreground">Featured image</p>
        <div className="mt-4 grid gap-3">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-background/40 px-4 py-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {isUploading ? "Uploading image..." : "Upload image"}
            <input
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void onUploadImage(file);
                }
              }}
              type="file"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Featured image URL</span>
            <Input {...form.register("featuredImageUrl")} placeholder="/uploads/blog/2026/05/article-image.webp" />
          </label>

          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Featured image alt text</span>
            <Input {...form.register("featuredImageAlt")} placeholder="Describe the image in a useful, search-friendly way" />
          </label>

          {featuredImageUrl ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] border border-white/10 bg-background/40">
              <Image alt={form.watch("featuredImageAlt") || form.watch("title")} className="object-cover" fill src={featuredImageUrl} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-foreground">Taxonomy and summary</p>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Excerpt</span>
            <Textarea {...form.register("excerpt")} className="min-h-[120px]" />
          </label>
          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Categories</span>
            <Input onChange={(event) => onCategoryInputChange(event.target.value)} value={categoryInput} />
          </label>
          <label className="grid gap-2 text-sm text-foreground">
            <span className="font-medium">Tags</span>
            <Input onChange={(event) => onTagInputChange(event.target.value)} value={tagInput} />
          </label>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-foreground">Distribution</p>
        <p className="mt-3 text-sm leading-7 text-muted">
          Published posts are included in metadata generation, sitemap indexing, and the RSS feed automatically.
        </p>
        <div className="mt-4">
          <GradientButton href="/blog" variant="outline">
            Preview public blog index
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
