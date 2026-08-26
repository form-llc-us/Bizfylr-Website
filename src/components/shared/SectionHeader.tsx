import { cn } from "@/lib/utils";
import { Badge } from "@/components/shared/Badge";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  headingLevel?: "h1" | "h2" | "h3";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  headingLevel = "h2"
}: SectionHeaderProps) {
  const Heading = headingLevel;

  return (
    <div
      className={cn(
        "max-w-[46rem] space-y-3.5 md:space-y-5",
        align === "center"
          ? "mx-auto flex flex-col items-center text-center"
          : "max-w-[50rem] text-left",
        className
      )}
    >
      {eyebrow ? <Badge className={cn(align === "center" && "justify-center")}>{eyebrow}</Badge> : null}
      <div className="space-y-3 md:space-y-4">
        <Heading className="font-heading text-[2rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-foreground sm:text-[2.45rem] md:text-[3.15rem]">
          {title}
        </Heading>
        {description ? (
          <p
            className={cn(
              "max-w-[42rem] text-[0.98rem] leading-7 text-muted/95 md:text-lg md:leading-8",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
