const slugCleanupPattern = /[^a-z0-9]+/g;

export function generateSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(slugCleanupPattern, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 96);
}

export function ensureUniqueSlug(baseSlug: string, takenSlugs: string[]) {
  if (!takenSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let attempt = 2;
  let nextSlug = `${baseSlug}-${attempt}`;

  while (takenSlugs.includes(nextSlug)) {
    attempt += 1;
    nextSlug = `${baseSlug}-${attempt}`;
  }

  return nextSlug;
}
