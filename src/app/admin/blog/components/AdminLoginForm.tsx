"use client";

import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm({
  isConfigured,
  nextPath
}: {
  isConfigured: boolean;
  nextPath: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) {
      setMessage("Admin access is not configured.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/blog-auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Bizfylr-CSRF": "1"
        },
        body: JSON.stringify({ username, password })
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "Unable to sign in.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setMessage("Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="mx-auto grid w-full max-w-md gap-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
      onSubmit={handleSubmit}
    >
      <label className="grid gap-2 text-sm text-foreground">
        <span className="font-medium">Username</span>
        <Input
          autoComplete="username"
          disabled={!isConfigured || isSubmitting}
          name="username"
          placeholder="Admin username"
          required
          type="text"
        />
      </label>

      <label className="grid gap-2 text-sm text-foreground">
        <span className="font-medium">Password</span>
        <Input
          autoComplete="current-password"
          disabled={!isConfigured || isSubmitting}
          name="password"
          placeholder="Admin password"
          required
          type="password"
        />
      </label>

      {message ? (
        <div aria-live="polite" className="rounded-2xl border border-amber-300/20 bg-amber-400/5 px-4 py-3 text-sm text-muted" role="status">
          {message}
        </div>
      ) : null}

      <Button className="w-full" disabled={!isConfigured || isSubmitting} type="submit">
        <LogIn className="h-4 w-4" />
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
