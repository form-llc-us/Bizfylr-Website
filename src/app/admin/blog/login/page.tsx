import { AdminLoginForm } from "@/app/admin/blog/components/AdminLoginForm";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getAdminAuthErrorMessage, isAdminAuthConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

function normalizeNextPath(value: string | string[] | undefined) {
  const nextPath = Array.isArray(value) ? value[0] : value;

  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/admin/blog";
  }

  if (nextPath.startsWith("/admin/blog/login")) {
    return "/admin/blog";
  }

  return nextPath;
}

export default async function AdminBlogLoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const isConfigured = isAdminAuthConfigured();

  return (
    <section className="section-space-tight">
      <Container className="section-stack">
        <SectionHeader
          align="center"
          eyebrow="Admin Blog"
          title="Sign in to the blog CMS"
          description={
            isConfigured
              ? "Use the configured admin credentials to manage drafts, SEO metadata, uploads, and publishing."
              : getAdminAuthErrorMessage()
          }
        />
        <AdminLoginForm isConfigured={isConfigured} nextPath={normalizeNextPath(params.next)} />
      </Container>
    </section>
  );
}
