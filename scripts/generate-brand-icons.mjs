import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const pngSource = resolve(root, "public/images/logo.png");
const svgSource = resolve(root, "public/images/logo.svg");
const source = existsSync(pngSource) ? pngSource : svgSource;
const targets = [
  ["public/favicon-16x16.png", 16],
  ["public/favicon-32x32.png", 32],
  ["public/apple-touch-icon.png", 180],
  ["public/android-chrome-192x192.png", 192],
  ["public/android-chrome-512x512.png", 512]
];

for (const [target, size] of targets) {
  const outputPath = resolve(root, target);
  mkdirSync(dirname(outputPath), { recursive: true });
  await sharp(source).resize(size, size).png().toFile(outputPath);
}

const faviconPng = await sharp(source).resize(32, 32).png().toBuffer();
const iconDir = Buffer.alloc(6);
iconDir.writeUInt16LE(0, 0);
iconDir.writeUInt16LE(1, 2);
iconDir.writeUInt16LE(1, 4);

const iconEntry = Buffer.alloc(16);
iconEntry.writeUInt8(32, 0);
iconEntry.writeUInt8(32, 1);
iconEntry.writeUInt8(0, 2);
iconEntry.writeUInt8(0, 3);
iconEntry.writeUInt16LE(1, 4);
iconEntry.writeUInt16LE(32, 6);
iconEntry.writeUInt32LE(faviconPng.length, 8);
iconEntry.writeUInt32LE(22, 12);

writeFileSync(resolve(root, "public/favicon.ico"), Buffer.concat([iconDir, iconEntry, faviconPng]));
