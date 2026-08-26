import path from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import sharp, { type Metadata } from "sharp";

import { generateSlug } from "@/lib/blog/slug";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 8000;
const MAX_IMAGE_HEIGHT = 8000;
const MAX_IMAGE_PIXELS = 40_000_000;
const mimeByFormat: Record<string, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif"
};

export class UploadValidationError extends Error {}

export async function persistBlogImage(file: File) {
  // Local uploads keep the current CMS workflow working, but production hosting
  // should confirm that public/uploads/blog persists across redeploys.
  if (!allowedMimeTypes.has(file.type)) {
    throw new UploadValidationError("Unsupported file type. Please upload a JPG, PNG, WebP, or AVIF image.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError("Image is too large. Please upload a file smaller than 8 MB.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  let metadata: Metadata;
  try {
    metadata = await sharp(bytes, { failOn: "error", limitInputPixels: MAX_IMAGE_PIXELS }).metadata();
  } catch {
    throw new UploadValidationError("The uploaded file is not a valid supported image.");
  }

  if (!metadata.format || mimeByFormat[metadata.format] !== file.type) {
    throw new UploadValidationError("The image content does not match its declared file type.");
  }
  if (!metadata.width || !metadata.height || metadata.width > MAX_IMAGE_WIDTH || metadata.height > MAX_IMAGE_HEIGHT || metadata.width * metadata.height > MAX_IMAGE_PIXELS) {
    throw new UploadValidationError("Image dimensions are too large.");
  }
  if ((metadata.pages ?? 1) > 1) {
    throw new UploadValidationError("Animated images are not supported.");
  }

  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const safeName = generateSlug(file.name.replace(/\.[^.]+$/, "")) || "blog-image";
  const fileName = `${safeName}-${randomUUID()}.webp`;
  const relativeDir = path.join("uploads", "blog", year, month);
  const publicDir = path.join(process.cwd(), "public", relativeDir);
  const outputPath = path.join(publicDir, fileName);

  await mkdir(publicDir, { recursive: true });

  const processed = await sharp(bytes, { failOn: "error", limitInputPixels: MAX_IMAGE_PIXELS })
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  await writeFile(outputPath, processed);

  return {
    url: `/${relativeDir.replace(/\\/g, "/")}/${fileName}`,
    alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim()
  };
}
