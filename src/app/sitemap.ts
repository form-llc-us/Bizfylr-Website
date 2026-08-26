import type { MetadataRoute } from "next";

import { getPublishedBlogSummaries } from "@/lib/blog/repository";
import { resources } from "@/data/resources";
import { ROUTES, routeMap } from "@/data/routes";
import { SITE } from "@/data/site";

const STATIC_LAST_MODIFIED = new Date("2026-05-19T00:00:00.000Z");
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getPublishedBlogSummaries();

  const staticEntries: MetadataRoute.Sitemap = routeMap
    .filter((route) => route !== ROUTES.thankYou)
    .map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency:
      route === ROUTES.home
        ? "weekly"
        : route === ROUTES.blog || route === ROUTES.resources
          ? "weekly"
          : "monthly",
    priority:
      route === ROUTES.home
        ? 1
        : route.startsWith("/services/")
          ? 0.8
          : route === ROUTES.blog || route === ROUTES.resources
            ? 0.76
            : route === ROUTES.payment
              ? 0.45
            : 0.7
  }));

  const resourceEntries: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `${SITE.url}${ROUTES.resources}/${resource.slug}`,
    lastModified: new Date(resource.updatedAt),
    changeFrequency: "monthly",
    priority: 0.72
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE.url}${ROUTES.blog}/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt ?? STATIC_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.72
  }));

  return [...staticEntries, ...resourceEntries, ...blogEntries];
}
