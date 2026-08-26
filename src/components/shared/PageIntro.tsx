import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { JsonLd } from "@/components/shared/JsonLd";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageIntroProps = {
  breadcrumbs: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  align?: "left" | "center";
  currentPath: string;
};

export function PageIntro({
  breadcrumbs,
  eyebrow,
  title,
  description,
  children,
  align = "left",
  currentPath,
}: PageIntroProps) {
  const isCenter = align === "center";
  const structuredBreadcrumbs = breadcrumbs.map((item) => ({
    name: item.label,
    href: item.href ?? currentPath,
  }));

  return (
    <section className="section-space-tight pt-6 sm:pt-8 md:pt-10">
      <JsonLd data={breadcrumbSchema(structuredBreadcrumbs)} />
      <Container className="section-stack-tight">
        <div className={cn(isCenter && "flex justify-center")}>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className={cn(isCenter && "mx-auto max-w-5xl text-center")}>
          <SectionHeader
            align={align}
            description={description}
            eyebrow={eyebrow}
            headingLevel="h1"
            title={title}
          />
        </div>

        {children ? <div className={cn("w-full", isCenter && "mx-auto max-w-[1120px]")}>{children}</div> : null}
      </Container>
    </section>
  );
}
