function countSyllables(word: string) {
  const normalized = word.toLowerCase().replace(/[^a-z]/g, "");

  if (!normalized) {
    return 0;
  }

  if (normalized.length <= 3) {
    return 1;
  }

  const vowels = normalized.match(/[aeiouy]{1,2}/g)?.length ?? 1;
  const silentEnding = /(?:[^laeiouy]es|ed|[^laeiouy]e)$/.test(normalized) ? 1 : 0;
  return Math.max(1, vowels - silentEnding);
}

export function analyzeReadability(plainText: string) {
  const sentences = plainText
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const words = plainText.split(/\s+/).filter(Boolean);
  const paragraphs = plainText.split(/\n{2,}/).filter((paragraph) => paragraph.trim().length > 0);

  const sentenceCount = Math.max(sentences.length, 1);
  const wordCount = Math.max(words.length, 1);
  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const fleschReadingEase =
    206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
  const score = Math.max(0, Math.min(100, Math.round(fleschReadingEase)));

  return {
    score,
    fleschReadingEase,
    sentenceCount,
    wordCount,
    paragraphCount: Math.max(paragraphs.length, 1)
  };
}
