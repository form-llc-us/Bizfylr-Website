import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { SITE } from "@/data/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function formatCurrency(
  amount: number,
  currency: "USD" | "INR" = "USD",
  locale = "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function absoluteUrl(pathname = "/") {
  try {
    const url = new URL(pathname);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    // Relative paths are resolved against the configured public site URL below.
  }

  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE.url}${normalized}`;
}

export function isSameSiteUrl(value: string) {
  try {
    const target = new URL(value, SITE.url);
    const site = new URL(SITE.url);
    return target.origin === site.origin;
  } catch {
    return false;
  }
}
