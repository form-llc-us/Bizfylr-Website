import { generateSlug } from "@/lib/blog/slug";
import type { TocItem } from "@/types/blog";

const headingPattern = /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi;

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function buildTableOfContents(html: string) {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  const decoratedHtml = html.replace(headingPattern, (_, level: string, attrs: string, inner: string) => {
    const text = stripTags(inner);
    const baseId = generateSlug(text) || "section";
    const count = seen.get(baseId) ?? 0;
    seen.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    toc.push({
      id,
      level: Number(level),
      text
    });

    const cleanedAttrs = attrs.replace(/\sid="[^"]*"/i, "");
    return `<h${level}${cleanedAttrs} id="${id}">${inner}</h${level}>`;
  });

  return {
    toc,
    html: decoratedHtml
  };
}
