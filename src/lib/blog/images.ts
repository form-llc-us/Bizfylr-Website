const allowedExternalImages = [
  { hostname: "bizfylr.com", pathnamePrefix: "/assets/" }
] as const;

export function isAllowedBlogImageUrl(value: string | null | undefined) {
  if (!value) {
    return true;
  }

  if (value.startsWith("/uploads/blog/") || value.startsWith("/images/blog/")) {
    return !value.includes("..") && !value.includes("\\");
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedExternalImages.some(
      (allowed) => url.hostname === allowed.hostname && url.pathname.startsWith(allowed.pathnamePrefix)
    );
  } catch {
    return false;
  }
}
