import { Star } from "lucide-react";

import { GlassCard } from "@/components/shared/GlassCard";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  rating: number;
};

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.author
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <GlassCard className="interactive-surface h-[318px] w-[320px] shrink-0 p-6 sm:w-[340px] md:p-7">
      <div className="flex h-full flex-col">
        <div
          className="flex h-5 items-center gap-1 text-gold"
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, index) => {
            const isFilled = index < testimonial.rating;

            return (
              <Star
                key={`${testimonial.author}-${index}`}
                className={`h-4 w-4 ${
                  isFilled ? "fill-current text-gold" : "text-muted/35"
                }`}
              />
            );
          })}
        </div>

        <p className="mt-5 min-h-[132px] overflow-hidden text-sm leading-7 text-foreground/90 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:6]">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="mt-auto flex min-h-[56px] w-full items-center gap-3 border-t border-white/8 pt-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/5 text-sm font-bold text-foreground">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {testimonial.author}
            </p>
            <p className="mt-1 line-clamp-1 text-xs uppercase tracking-[0.14em] text-muted">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
