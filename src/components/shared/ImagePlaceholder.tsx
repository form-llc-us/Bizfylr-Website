import Image from "next/image";

import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  src: string;
  alt: string;
  eyebrow?: string;
  title: string;
  description?: string;
  width: number;
  height: number;
  variant?: "dashboard" | "consultation" | "workflow";
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function isPlaceholderImageSrc(src: string) {
  const normalized = src.trim().toLowerCase();

  return (
    normalized === "#" ||
    normalized.includes("?placeholder=1") ||
    normalized.endsWith("-placeholder.jpg") ||
    normalized.endsWith("-placeholder.jpeg") ||
    normalized.endsWith("-placeholder.png") ||
    normalized.endsWith("-placeholder.webp") ||
    normalized.endsWith("-placeholder.svg")
  );
}

export function FillImagePlaceholder({
  label = "Image Placeholder",
  className,
  overlayClassName
}: {
  label?: string;
  className?: string;
  overlayClassName?: string;
}) {
  return (
    <div
      aria-label={label}
      className={cn(
        "absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(77,143,255,0.18),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]",
        className
      )}
      role="img"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-background/35",
          overlayClassName
        )}
      />

      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
        <div className="rounded-full border border-white/12 bg-background/78 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-foreground/72 shadow-glow backdrop-blur-md">
          {label}
        </div>
      </div>
    </div>
  );
}

export function ImagePlaceholder({
  src,
  alt,
  eyebrow,
  title,
  description,
  width,
  height,
  className,
  priority = false,
  sizes = "(min-width: 1280px) 42vw, (min-width: 1024px) 50vw, 100vw"
}: ImagePlaceholderProps) {
  const isPlaceholder = isPlaceholderImageSrc(src);

  return (
    <figure
      className={cn(
        "group interactive-surface overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.04] p-2 shadow-glow",
        className
      )}
    >
      <div
        className="relative isolate overflow-hidden rounded-[24px]"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {isPlaceholder ? (
          <FillImagePlaceholder
            label={`${title} Placeholder`}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <Image
            alt={alt}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            fill
            priority={priority}
            sizes={sizes}
            src={src}
          />
        )}

        {/* Very light polish only. Text is no longer placed on image. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent"
        />

        <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.04]" />
      </div>

      <figcaption className="px-4 pb-5 pt-5 text-left sm:px-5">
        {eyebrow ? (
          <p className="mb-2 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-primary-light">
            {eyebrow}
          </p>
        ) : null}

        <h3 className="font-heading text-xl font-extrabold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-2xl">
          {title}
        </h3>

        {description ? (
          <p className="mt-3 text-sm font-medium leading-6 text-foreground/74">
            {description}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
