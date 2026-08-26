"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, type ButtonProps } from "@/components/ui/button";

export function AdminLogoutButton({ size = "default" }: Pick<ButtonProps, "size">) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/blog-auth/logout", {
        method: "POST",
        headers: { "X-Bizfylr-CSRF": "1" }
      });
    } finally {
      router.replace("/admin/blog/login");
      router.refresh();
    }
  }

  return (
    <Button disabled={isSubmitting} onClick={handleLogout} size={size} type="button" variant="outline">
      <LogOut className="h-4 w-4" />
      {isSubmitting ? "Signing out..." : "Sign out"}
    </Button>
  );
}
