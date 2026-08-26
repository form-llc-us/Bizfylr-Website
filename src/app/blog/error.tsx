"use client";

import { Button } from "@/components/ui/button";

export default function BlogError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section-space-tight">
      <div className="container grid max-w-2xl gap-5 px-5 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-extrabold text-foreground">Blog temporarily unavailable</h1>
        <p className="text-sm leading-7 text-muted">
          The articles could not be loaded right now. Please try again shortly.
        </p>
        <Button className="mx-auto" onClick={reset} type="button">Try again</Button>
      </div>
    </section>
  );
}
