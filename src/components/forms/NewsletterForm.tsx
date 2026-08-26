"use client";

import { useId, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSchema } from "@/lib/validations";

export function NewsletterForm() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const result = newsletterSchema.safeParse({ email, website });
    if (!result.success) {
      setMessage(result.error.issues[0]?.message ?? "Please enter a valid email.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data)
        });
        const payload = (await response.json()) as { message?: string };
        setMessage(payload.message ?? (response.ok ? "Subscribed." : "Unable to subscribe."));
        if (response.ok) setEmail("");
      } catch {
        setMessage("Unable to subscribe.");
      }
    });
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <input
        autoComplete="off"
        className="sr-only"
        onChange={(event) => setWebsite(event.target.value)}
        tabIndex={-1}
        type="text"
        value={website}
      />
      <Input
        aria-describedby={message ? `${inputId}-message` : undefined}
        id={inputId}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email address"
        type="email"
        value={email}
      />
      <Button disabled={isPending} type="submit">
        {isPending ? "Submitting..." : "Subscribe"}
      </Button>
      {message ? (
        <p aria-live="polite" className="w-full text-sm text-muted" id={`${inputId}-message`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
