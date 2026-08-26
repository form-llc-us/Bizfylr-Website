import { notFound } from "next/navigation";

import { BlogEditorForm } from "@/app/admin/blog/components/BlogEditorForm";
import { getBlogPostBySlug } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export default async function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, true);

  if (!post) {
    notFound();
  }

  return <BlogEditorForm initialPost={post} />;
}
