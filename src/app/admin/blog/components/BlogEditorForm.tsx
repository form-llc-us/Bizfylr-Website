"use client";

import { useEffect, useMemo, useState } from "react";
import { BlogPostStatus, BlogSchemaType } from "@/lib/blog/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/core";

import { Editor } from "@/app/admin/blog/components/Editor";
import { PublishPanel } from "@/app/admin/blog/components/PublishPanel";
import { SeoPanel } from "@/app/admin/blog/components/SeoPanel";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateSlug } from "@/lib/blog/slug";
import { blogPostInputSchema, type BlogPostInput } from "@/lib/blog/validations";
import type { BlogAnalysisResult, InternalLinkSuggestion, PublicBlogPost } from "@/types/blog";

const emptyDoc: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: []
    }
  ]
};

export function BlogEditorForm({
  initialPost,
}: {
  initialPost: PublicBlogPost | null;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [analysis, setAnalysis] = useState<BlogAnalysisResult | null>(null);
  const [internalLinkSuggestions, setInternalLinkSuggestions] = useState<InternalLinkSuggestion[]>([]);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost));

  const form = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostInputSchema),
    defaultValues: {
      id: initialPost?.id,
      title: initialPost?.title ?? "",
      slug: initialPost?.slug ?? "",
      excerpt: initialPost?.excerpt ?? "",
      contentJson: initialPost?.contentJson ?? emptyDoc,
      renderedHtml: initialPost?.renderedHtml ?? "<p></p>",
      focusKeyword: initialPost?.focusKeyword ?? "",
      metaTitle: initialPost?.metaTitle ?? "",
      metaDescription: initialPost?.metaDescription ?? "",
      canonicalUrl: initialPost?.canonicalUrl ?? "",
      ogTitle: initialPost?.ogTitle ?? "",
      ogDescription: initialPost?.ogDescription ?? "",
      ogImage: initialPost?.ogImage ?? "",
      twitterTitle: initialPost?.twitterTitle ?? "",
      twitterDescription: initialPost?.twitterDescription ?? "",
      twitterImage: initialPost?.twitterImage ?? "",
      schemaType: initialPost?.schemaType ?? BlogSchemaType.ARTICLE,
      tags: initialPost?.tags ?? [],
      categories: initialPost?.categories ?? [],
      featuredImageUrl: initialPost?.featuredImageUrl ?? "",
      featuredImageAlt: initialPost?.featuredImageAlt ?? "",
      seoScore: initialPost?.seoScore ?? 0,
      readabilityScore: initialPost?.readabilityScore ?? 0,
      status: initialPost?.status ?? BlogPostStatus.DRAFT,
      faqItems: initialPost?.faqItems ?? []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqItems"
  });

  const [tagInput, setTagInput] = useState((initialPost?.tags ?? []).join(", "));
  const [categoryInput, setCategoryInput] = useState((initialPost?.categories ?? []).join(", "));

  const watchedTitle = useWatch({ control: form.control, name: "title" });
  const watchedSlug = useWatch({ control: form.control, name: "slug" });
  const watchedMetaDescription = useWatch({ control: form.control, name: "metaDescription" });
  const watchedFocusKeyword = useWatch({ control: form.control, name: "focusKeyword" });
  const watchedRenderedHtml = useWatch({ control: form.control, name: "renderedHtml" });
  const watchedCategories = useWatch({ control: form.control, name: "categories" });
  const watchedTags = useWatch({ control: form.control, name: "tags" });

  useEffect(() => {
    form.setValue(
      "tags",
      tagInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      { shouldDirty: true }
    );
  }, [form, tagInput]);

  useEffect(() => {
    form.setValue(
      "categories",
      categoryInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      { shouldDirty: true }
    );
  }, [categoryInput, form]);

  useEffect(() => {
    if (!slugTouched && watchedTitle.trim()) {
      form.setValue("slug", generateSlug(watchedTitle), { shouldDirty: true });
    }
  }, [form, slugTouched, watchedTitle]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const payload = {
        title: form.getValues("title"),
        slug: form.getValues("slug"),
        excerpt: form.getValues("excerpt"),
        renderedHtml: form.getValues("renderedHtml"),
        contentJson: form.getValues("contentJson"),
        focusKeyword: form.getValues("focusKeyword"),
        metaDescription: form.getValues("metaDescription"),
        categories: form.getValues("categories"),
        tags: form.getValues("tags")
      };

      if (!payload.title || !payload.slug || !payload.renderedHtml) {
        return;
      }

      try {
        const response = await fetch("/api/blog/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Bizfylr-CSRF": "1" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          return;
        }
        const result = (await response.json()) as {
          analysis: BlogAnalysisResult;
          internalLinkSuggestions: InternalLinkSuggestion[];
        };
        setAnalysis(result.analysis);
        setInternalLinkSuggestions(result.internalLinkSuggestions);
        form.setValue("seoScore", result.analysis.score);
        form.setValue("readabilityScore", result.analysis.readabilityScore);
      } catch {
        // ignore analyzer network issues during editing
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [form, watchedTitle, watchedSlug, watchedMetaDescription, watchedFocusKeyword, watchedRenderedHtml, watchedCategories, watchedTags]);

  const heading = useMemo(
    () => (initialPost ? `Edit "${initialPost.title}"` : "Create a new blog post"),
    [initialPost]
  );

  async function submit(status: BlogPostStatus) {
    setIsSaving(true);
    setServerMessage("");

    form.setValue("status", status);
    const payload = form.getValues();

    try {
      const endpoint = initialPost ? "/api/blog/update" : "/api/blog/create";
      const response = await fetch(endpoint, {
        method: initialPost ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Bizfylr-CSRF": "1"
        },
        body: JSON.stringify({
          ...payload,
          status
        })
      });

      const result = (await response.json()) as { message?: string; post?: PublicBlogPost };

      if (!response.ok || !result.post) {
        setServerMessage(result.message ?? "Unable to save the blog post.");
        return;
      }

      setServerMessage(result.message ?? "Blog post saved.");
      router.push(`/admin/blog/edit/${result.post.slug}`);
      router.refresh();
    } catch {
      setServerMessage("Unable to save the blog post.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleFeaturedImageUpload(file: File) {
    setIsUploading(true);
    setServerMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/blog/upload", {
        method: "POST",
        headers: { "X-Bizfylr-CSRF": "1" },
        body: formData
      });

      const result = (await response.json()) as { url?: string; alt?: string; message?: string };

      if (!response.ok || !result.url) {
        setServerMessage(result.message ?? "Unable to upload image.");
        return;
      }

      form.setValue("featuredImageUrl", result.url, { shouldDirty: true });

      if (!form.getValues("featuredImageAlt")) {
        form.setValue("featuredImageAlt", result.alt ?? "", { shouldDirty: true });
      }
    } catch {
      setServerMessage("Unable to upload image.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="section-space-tight">
      <Container className="section-stack">
        <SectionHeader
          align="left"
          eyebrow="Blog CMS"
          title={heading}
          description="Write, optimize, and publish blog content with live SEO scoring, metadata controls, and a draft/publish workflow."
        />

        {serverMessage ? (
          <div aria-live="polite" className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted" role="status">
            {serverMessage}
          </div>
        ) : null}

        <div className="content-grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="grid gap-5">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-6">
              <div className="grid gap-4">
                <label className="grid gap-2 text-sm text-foreground">
                  <span className="font-medium">Post title</span>
                  <Input {...form.register("title")} placeholder="Write a specific, search-friendly headline" />
                </label>

                <Editor
                  initialContent={form.getValues("contentJson") as JSONContent}
                  onChange={({ json, html }) => {
                    form.setValue("contentJson", json as Record<string, unknown>, { shouldDirty: true });
                    form.setValue("renderedHtml", html, { shouldDirty: true });
                  }}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-6">
              <p className="text-sm font-semibold text-foreground">FAQ schema items</p>
              <div className="mt-4 grid gap-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="rounded-[20px] border border-white/10 bg-background/40 p-4">
                    <div className="grid gap-3">
                      <Input {...form.register(`faqItems.${index}.question`)} placeholder="FAQ question" />
                      <Textarea {...form.register(`faqItems.${index}.answer`)} className="min-h-[100px]" placeholder="FAQ answer" />
                      <button
                        className="inline-flex w-fit items-center rounded-2xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10"
                        onClick={() => remove(index)}
                        type="button"
                      >
                        Remove FAQ item
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="inline-flex w-fit items-center rounded-2xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10"
                  onClick={() => append({ question: "", answer: "" })}
                  type="button"
                >
                  Add FAQ item
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:sticky lg:top-28">
            <SeoPanel
              analysis={analysis}
              form={form}
              internalLinkSuggestions={internalLinkSuggestions}
              onRegenerateSlug={() => {
                setSlugTouched(true);
                form.setValue("slug", generateSlug(form.getValues("title")), { shouldDirty: true });
              }}
              onSlugChange={(value) => {
                setSlugTouched(true);
                form.setValue("slug", generateSlug(value), { shouldDirty: true });
              }}
              slug={watchedSlug}
            />
            <PublishPanel
              categoryInput={categoryInput}
              form={form}
              isSaving={isSaving}
              isUploading={isUploading}
              onCategoryInputChange={setCategoryInput}
              onSubmitAs={submit}
              onTagInputChange={setTagInput}
              onUploadImage={handleFeaturedImageUpload}
              tagInput={tagInput}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
