import { analyzeReadability } from "@/lib/seo/readability";
import {
  calculateKeywordDensity,
  keywordAppearsInHeadings,
  keywordAppearsInIntro,
  normalizeMetaLength
} from "@/lib/seo/keyword";
import type { BlogAnalysisResult, BlogSeoCheck } from "@/types/blog";

type BlogScoreInput = {
  title: string;
  slug: string;
  plainText: string;
  paragraphs: string[];
  headings: Array<{ level: number; text: string }>;
  metaDescription?: string;
  focusKeyword?: string;
  imageAltTexts: string[];
  internalLinkCount: number;
  externalLinkCount: number;
};

function createCheck(input: Omit<BlogSeoCheck, "status"> & { passed: boolean; warning?: boolean }) {
  return {
    id: input.id,
    label: input.label,
    description: input.description,
    status: input.passed ? "passed" : input.warning ? "warning" : "failed",
    points: input.passed ? input.points : 0
  } satisfies BlogSeoCheck;
}

export function scoreBlogPost(input: BlogScoreInput): BlogAnalysisResult {
  const readability = analyzeReadability(input.plainText);
  const keyword = input.focusKeyword?.trim() ?? "";
  const wordCount = readability.wordCount;
  const imageCount = input.imageAltTexts.length;
  const keywordDensity = calculateKeywordDensity(input.plainText, keyword);
  const introHasKeyword = keyword ? keywordAppearsInIntro(input.paragraphs, keyword) : false;
  const headingHasKeyword = keyword ? keywordAppearsInHeadings(input.headings, keyword) : false;
  const keywordInTitle = keyword ? input.title.toLowerCase().includes(keyword.toLowerCase()) : false;
  const keywordInSlug = keyword ? input.slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, "-")) : false;
  const descriptionValid = normalizeMetaLength(input.metaDescription, 120, 160);
  const imageAltCovered =
    imageCount === 0 || input.imageAltTexts.every((alt) => alt.trim().length >= 4);

  const checks: BlogSeoCheck[] = [
    createCheck({
      id: "keyword-title",
      label: "Keyword in title",
      description: keywordInTitle
        ? "The focus keyword appears in the title."
        : "Add the focus keyword naturally to the title.",
      points: 15,
      passed: keywordInTitle
    }),
    createCheck({
      id: "keyword-slug",
      label: "Keyword in slug",
      description: keywordInSlug
        ? "The slug includes the focus keyword."
        : "Use the focus keyword in the slug if it fits naturally.",
      points: 10,
      passed: keywordInSlug
    }),
    createCheck({
      id: "keyword-intro",
      label: "Keyword in intro",
      description: introHasKeyword
        ? "The introduction reinforces the focus keyword."
        : "Mention the focus keyword in the opening paragraphs.",
      points: 10,
      passed: introHasKeyword
    }),
    createCheck({
      id: "keyword-density",
      label: "Keyword density",
      description:
        keywordDensity >= 0.6 && keywordDensity <= 2.5
          ? `Keyword density is balanced at ${keywordDensity}%.`
          : `Adjust keyword density closer to 0.6%-2.5%. Current density is ${keywordDensity}%.`,
      points: 10,
      passed: keywordDensity >= 0.6 && keywordDensity <= 2.5
    }),
    createCheck({
      id: "meta-description",
      label: "Meta description",
      description: descriptionValid
        ? "The meta description length is within a healthy range."
        : "Keep the meta description between 120 and 160 characters.",
      points: 10,
      passed: descriptionValid
    }),
    createCheck({
      id: "heading-optimization",
      label: "Heading optimization",
      description:
        headingHasKeyword && input.headings.length >= 2
          ? "Headings support the focus topic."
          : "Use descriptive headings and include the focus keyword in at least one heading.",
      points: 10,
      passed: headingHasKeyword && input.headings.length >= 2
    }),
    createCheck({
      id: "internal-links",
      label: "Internal links",
      description:
        input.internalLinkCount >= 2
          ? "Internal links strengthen topical connections."
          : "Add at least two internal links to relevant service or content pages.",
      points: 10,
      passed: input.internalLinkCount >= 2
    }),
    createCheck({
      id: "external-links",
      label: "External links",
      description:
        input.externalLinkCount >= 1
          ? "External links can help support authority when relevant."
          : "Consider one supporting external link when it adds trust or clarity.",
      points: 5,
      passed: input.externalLinkCount >= 1,
      warning: true
    }),
    createCheck({
      id: "content-length",
      label: "Content length",
      description:
        wordCount >= 700
          ? `The article length is strong at ${wordCount} words.`
          : `Increase the article closer to 700 words or more. Current count: ${wordCount}.`,
      points: 10,
      passed: wordCount >= 700
    }),
    createCheck({
      id: "readability",
      label: "Readability",
      description:
        readability.score >= 55
          ? "Readability is in a practical range for online readers."
          : "Simplify sentence length and phrasing to improve readability.",
      points: 5,
      passed: readability.score >= 55,
      warning: readability.score >= 45 && readability.score < 55
    }),
    createCheck({
      id: "image-alt-text",
      label: "Image alt text",
      description:
        imageAltCovered
          ? "Image alt text coverage looks healthy."
          : "Add descriptive alt text to all images in the post.",
      points: 5,
      passed: imageAltCovered
    })
  ];

  const score = Math.max(0, Math.min(100, checks.reduce((sum, check) => sum + check.points, 0)));

  return {
    score,
    readabilityScore: readability.score,
    checks,
    passedChecks: checks.filter((check) => check.status === "passed"),
    warningChecks: checks.filter((check) => check.status === "warning"),
    failedChecks: checks.filter((check) => check.status === "failed"),
    stats: {
      wordCount,
      sentenceCount: readability.sentenceCount,
      paragraphCount: readability.paragraphCount,
      internalLinkCount: input.internalLinkCount,
      externalLinkCount: input.externalLinkCount,
      imageCount,
      keywordDensity,
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 220))
    }
  };
}
