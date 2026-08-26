import DOMPurify from "isomorphic-dompurify";
import type { JSONContent } from "@tiptap/core";

import { buildTableOfContents } from "@/lib/blog/toc";
import { isSameSiteUrl } from "@/lib/utils";
import type { TocItem } from "@/types/blog";

const headingPattern = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
const paragraphPattern = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
const linkPattern = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
const imagePattern = /<img\b[^>]*alt="([^"]*)"[^>]*>/gi;

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function stripHtml(value: string) {
  return decodeEntities(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

export function isAllowedCmsUrl(value: string, kind: "link" | "media") {
  const url = value.trim();
  if (!url || /[\u0000-\u001f\u007f\\]/.test(url) || url.startsWith("//")) {
    return false;
  }
  if (url.startsWith("https://")) {
    return true;
  }
  if (kind === "link" && /^(?:mailto:|tel:)/i.test(url)) {
    return true;
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(url)) {
    return false;
  }
  return url.startsWith("/") || url.startsWith("#") || url.startsWith("./") || url.startsWith("../");
}

export function sanitizeBlogHtml(html: string) {
  const youtubeHosts = new Set(["www.youtube.com", "www.youtube-nocookie.com"]);
  const iframeHook = (node: Node) => {
    if (node.nodeName !== "IFRAME") {
      return;
    }
    const element = node as Element;

    try {
      const src = new URL(element.getAttribute("src") ?? "");
      if (src.protocol !== "https:" || !youtubeHosts.has(src.hostname) || !src.pathname.startsWith("/embed/")) {
        element.remove();
        return;
      }
      for (const attribute of Array.from(element.attributes)) {
        element.removeAttribute(attribute.name);
      }
      element.setAttribute("src", src.toString());
    } catch {
      element.remove();
      return;
    }
  };

  const sanitizeIframeAttributes = (node: Node) => {
    if (node.nodeName !== "IFRAME" || !node.isConnected) {
      return;
    }
    const element = node as Element;
    element.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    element.setAttribute("allowfullscreen", "");
    element.setAttribute("loading", "lazy");
    element.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    element.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation");
    element.setAttribute("title", "YouTube video player");
  };

  const sanitizeUrlAttributes = (node: Node) => {
    if (node.nodeType !== 1) {
      return;
    }
    const element = node as Element;
    const href = element.getAttribute("href");
    if (href !== null && !isAllowedCmsUrl(href, "link")) {
      element.removeAttribute("href");
    }
    const src = element.getAttribute("src");
    if (src !== null && !isAllowedCmsUrl(src, "media")) {
      element.removeAttribute("src");
    }
  };

  DOMPurify.addHook("uponSanitizeElement", iframeHook);
  DOMPurify.addHook("afterSanitizeAttributes", sanitizeUrlAttributes);
  DOMPurify.addHook("afterSanitizeAttributes", sanitizeIframeAttributes);
  try {
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ["iframe"],
      ALLOWED_URI_REGEXP: /^(?:(?:https|mailto|tel):|\/|#|\.\.\/|\.\/)/i,
      ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "src",
      "alt",
      "title",
      "class",
      "id",
      "colspan",
      "rowspan",
        "data-youtube-video-id",
        "allow",
        "allowfullscreen",
        "frameborder",
        "loading",
        "referrerpolicy",
        "sandbox",
        "width",
        "height"
      ]
    });
  } finally {
    DOMPurify.removeAllHooks();
  }
}

export function extractPlainTextFromHtml(html: string) {
  return stripHtml(html);
}

export function extractHeadings(html: string) {
  return Array.from(html.matchAll(headingPattern)).map((match) => ({
    level: Number(match[1]),
    text: stripHtml(match[2])
  }));
}

export function extractParagraphs(html: string) {
  return Array.from(html.matchAll(paragraphPattern))
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);
}

export function extractLinkData(html: string) {
  const links = Array.from(html.matchAll(linkPattern)).map((match) => ({
    href: match[1],
    text: stripHtml(match[2])
  }));

  const internalLinks = links.filter((link) => link.href.startsWith("/"));
  const externalLinks = links.filter((link) => /^https?:\/\//i.test(link.href) && !isSameSiteUrl(link.href));

  return {
    links,
    internalLinks,
    externalLinks
  };
}

export function extractImageAltTexts(html: string) {
  return Array.from(html.matchAll(imagePattern)).map((match) => match[1].trim());
}

export function estimateReadingTimeMinutes(plainText: string) {
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function buildExcerpt(plainText: string, explicitExcerpt?: string) {
  if (explicitExcerpt?.trim()) {
    return explicitExcerpt.trim();
  }

  if (plainText.length <= 180) {
    return plainText;
  }

  return `${plainText.slice(0, 177).trimEnd()}...`;
}

export function normalizeEditorJson(value: JSONContent | null | undefined) {
  return value ?? {
    type: "doc",
    content: [{ type: "paragraph" }]
  };
}

export function buildBlogArtifacts(input: {
  html: string;
  contentJson: JSONContent;
  excerpt?: string;
}) {
  const sanitizedHtml = sanitizeBlogHtml(input.html);
  const { html: htmlWithTocIds, toc } = buildTableOfContents(sanitizedHtml);
  const plainText = extractPlainTextFromHtml(htmlWithTocIds);
  const excerpt = buildExcerpt(plainText, input.excerpt);
  const headings = extractHeadings(htmlWithTocIds);
  const paragraphs = extractParagraphs(htmlWithTocIds);
  const { internalLinks, externalLinks } = extractLinkData(htmlWithTocIds);
  const imageAltTexts = extractImageAltTexts(htmlWithTocIds);

  return {
    contentJson: normalizeEditorJson(input.contentJson),
    renderedHtml: htmlWithTocIds,
    plainText,
    excerpt,
    toc,
    headings,
    paragraphs,
    internalLinks,
    externalLinks,
    imageAltTexts
  };
}

export function parseStoredToc(value: unknown): TocItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is TocItem => {
    return (
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      "level" in item &&
      "text" in item &&
      typeof (item as TocItem).id === "string" &&
      typeof (item as TocItem).level === "number" &&
      typeof (item as TocItem).text === "string"
    );
  });
}
