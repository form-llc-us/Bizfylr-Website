import Image from "next/image";
import Link from "next/link";

import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  showWordmark?: boolean;
  href?: string;
  priority?: boolean;
};

export function SiteLogo({
  className,
  iconClassName,
  labelClassName,
  showWordmark = true,
  href = "/",
  priority = false
}: SiteLogoProps) {
  const content = (
    <>
      <span
        className={cn(
          "relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-white p-1 shadow-blue",
          iconClassName
        )}
      >
        <Image
          alt={`${SITE.name} logo`}
          className="object-contain"
          fill
          priority={priority}
          sizes="40px"
          src={SITE.logo}
        />
      </span>

      {showWordmark ? (
        <span className={cn("font-heading text-[1.05rem] font-extrabold tracking-[-0.04em] text-foreground", labelClassName)}>
          {SITE.name}
        </span>
      ) : null}
    </>
  );

  return (
    <Link
      className={cn(
        "flex shrink-0 items-center gap-3 transition-opacity duration-200 hover:opacity-100 lg:opacity-95",
        className
      )}
      href={href}
    >
      {content}
    </Link>
  );
}
