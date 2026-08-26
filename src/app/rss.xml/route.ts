import { getPublishedBlogPosts } from "@/lib/blog/repository";
import { SITE } from "@/data/site";
import { absoluteUrl } from "@/lib/utils";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedBlogPosts();

  const items = posts
    .map((post) => {
      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${absoluteUrl(`/blog/${post.slug}`)}</link>
  <guid>${absoluteUrl(`/blog/${post.slug}`)}</guid>
  <description>${escapeXml(post.excerpt)}</description>
  <pubDate>${(post.publishedAt ?? post.updatedAt).toUTCString()}</pubDate>
</item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE.name)} Blog</title>
  <link>${absoluteUrl("/blog")}</link>
  <description>${escapeXml(SITE.description)}</description>
  <language>en-us</language>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
