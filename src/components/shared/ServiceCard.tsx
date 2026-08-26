import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Laptop2,
  Megaphone,
  Package,
  Palette,
  ShieldCheck,
  ShoppingCart,
  Store,
  Workflow
} from "lucide-react";

import type { ServiceItem } from "@/data/services";
import { GlassCard } from "@/components/shared/GlassCard";

type ServiceCardProps = {
  service: ServiceItem;
};

const serviceIcons: Record<ServiceItem["slug"], LucideIcon> = {
  "business-expansion": BriefcaseBusiness,
  "business-compliance": ShieldCheck,
  "website-development": Laptop2,
  "ecommerce-setup": ShoppingCart,
  "ecommerce-management": Package,
  "marketplace-setup": Store,
  "marketplace-operations": Workflow,
  "digital-marketing": Megaphone,
  "graphic-design-video-editing": Palette
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = serviceIcons[service.slug];

  return (
    <GlassCard className="group interactive-surface flex h-full min-h-[320px] flex-col gap-5 p-6 md:p-7">
      <div className="space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary-light">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-lg font-semibold text-foreground">
          {service.title}
        </div>
        <p className="min-h-[84px] text-sm leading-7 text-muted">{service.shortDescription}</p>
      </div>
      <ul className="space-y-2 text-sm text-foreground/90">
        {service.bullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <Link
        className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary-light transition-colors duration-200 group-hover:text-foreground"
        href={`/services/${service.slug}`}
      >
        View service
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </GlassCard>
  );
}
