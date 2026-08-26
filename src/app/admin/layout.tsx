import type { Metadata } from "next";

import { AdminBlogToolbar } from "@/app/admin/blog/components/AdminBlogToolbar";

export const metadata: Metadata = {
  title: {
    absolute: "Admin | Bizfylr"
  },
  description: "Private Bizfylr content administration area.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminBlogToolbar />
      {children}
    </>
  );
}
