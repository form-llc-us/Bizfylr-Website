"use client";

import Link from "next/link";
import { ExternalLink, Home, LayoutDashboard, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

import { AdminLogoutButton } from "@/app/admin/blog/components/AdminLogoutButton";
import { Button } from "@/components/ui/button";

export function AdminBlogToolbar() {
  const pathname = usePathname() ?? "";
  const isLoginPage = pathname === "/admin/blog/login";

  if (!pathname.startsWith("/admin/blog")) {
    return null;
  }

  return (
    <div className="border-b border-white/10 bg-background/92 py-3 backdrop-blur-xl">
      <div className="container flex flex-col gap-3 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">Blog Admin</p>
          <p className="mt-1 text-sm text-muted">
            {isLoginPage ? "Enter the CMS or return to the public site." : "Manage posts, publishing, and public exits."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isLoginPage ? (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/blog">
                  <ExternalLink className="h-4 w-4" />
                  Blog
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/blog">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/admin/blog/create">
                  <PlusCircle className="h-4 w-4" />
                  New Post
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/blog">
                  <ExternalLink className="h-4 w-4" />
                  Public Blog
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Site
                </Link>
              </Button>
              <AdminLogoutButton size="sm" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
