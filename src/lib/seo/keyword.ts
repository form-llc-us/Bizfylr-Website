import { stripHtml } from "@/lib/blog/parser";
import { isSameSiteUrl } from "@/lib/utils";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

export function keywordOccurrences(text: string, keyword: string) {
  if (!keyword.trim()) {
    return 0;
  }

  const matches = text.toLowerCase().match(new RegExp(`\\b${escapeRegExp(keyword.toLowerCase())}\\b`, "g"));
  return matches?.length ?? 0;
}

export function calculateKeywordDensity(plainText: string, keyword: string) {
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  if (!keyword.trim() || wordCount === 0) {
    return 0;
  }

  const keywordWords = keyword.trim().split(/\s+/).length;
  const occurrences = keywordOccurrences(plainText, keyword);
  const density = (occurrences * keywordWords * 100) / wordCount;

  return Number(density.toFixed(2));
}

export function keywordAppearsInIntro(paragraphs: string[], keyword: string) {
  const intro = paragraphs.slice(0, 2).join(" ").toLowerCase();
  return intro.includes(keyword.toLowerCase());
}

export function keywordAppearsInHeadings(headings: Array<{ text: string }>, keyword: string) {
  return headings.some((heading) => heading.text.toLowerCase().includes(keyword.toLowerCase()));
}

export function countLinksOfType(links: Array<{ href: string }>) {
  const internal = links.filter((link) => link.href.startsWith("/")).length;
  const external = links.filter((link) => /^https?:\/\//i.test(link.href) && !isSameSiteUrl(link.href)).length;

  return {
    internal,
    external
  };
}

export function normalizeMetaLength(value: string | undefined, min: number, max: number) {
  const length = value?.trim().length ?? 0;
  return length >= min && length <= max;
}

export function stripHeadingMarkup(html: string) {
  return stripHtml(html);
}
