import Link from "next/link";
import { Edit3 } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { isDatabaseConfigured } from "@/lib/prisma";
import { getAdminBlogPosts } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export default async function AdminBlogDashboardPage() {
  const posts = await getAdminBlogPosts();
  const databaseReady = isDatabaseConfigured();

  const stats = {
    total: posts.length,
    published: posts.filter((post) => post.status === "PUBLISHED").length,
    drafts: posts.filter((post) => post.status === "DRAFT").length,
    avgSeo:
      posts.length > 0
        ? Math.round(posts.reduce((sum, post) => sum + post.seoScore, 0) / posts.length)
        : 0,
  };

  return (
    <section className="section-space-tight">
      <Container className="section-stack">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            align="left"
            eyebrow="Admin Blog"
            title="Blog publishing dashboard"
            description="Create, optimize, and publish articles with a workflow designed around SEO quality, internal linking, and metadata control."
          />
        </div>

        {!databaseReady ? (
          <div className="rounded-[28px] border border-amber-300/20 bg-amber-400/5 p-6 text-sm leading-7 text-muted">
            DATABASE_URL is not configured yet. The CMS UI is installed, but the Prisma-backed publishing layer needs a configured database connection before posts can be stored.
          </div>
        ) : null}

        <div className="content-grid md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total posts" value={String(stats.total)} />
          <StatCard label="Published" value={String(stats.published)} />
          <StatCard label="Drafts" value={String(stats.drafts)} />
          <StatCard label="Average SEO score" value={`${stats.avgSeo}/100`} />
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-[1.3fr_0.8fr_0.7fr_0.7fr_0.6fr] gap-4 border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            <div>Post</div>
            <div>Status</div>
            <div>SEO</div>
            <div>Updated</div>
            <div>Actions</div>
          </div>

          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                className="grid grid-cols-[1.3fr_0.8fr_0.7fr_0.7fr_0.6fr] gap-4 border-b border-white/8 px-6 py-5 text-sm last:border-b-0"
                key={post.id}
              >
                <div>
                  <p className="font-semibold text-foreground">{post.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">/blog/{post.slug}</p>
                </div>
                <div className="text-foreground/90">{post.status}</div>
                <div className="text-foreground/90">{post.seoScore}/100</div>
                <div className="text-muted">{post.updatedAt.toLocaleDateString()}</div>
                <div>
                  <Link
                    className="inline-flex items-center gap-2 text-primary-light transition-colors hover:text-foreground"
                    href={`/admin/blog/edit/${post.slug}`}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-sm text-muted">
              No blog posts yet. Create your first post to start populating the blog index, sitemap, and RSS feed.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-foreground">{value}</p>
    </div>
  );
}
