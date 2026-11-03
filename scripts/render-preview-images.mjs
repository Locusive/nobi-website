// Draws every page's link preview picture into public/media/og, the way the other owned previews there are made.
// Run `node scripts/render-preview-images.mjs` after changing previewCards.js, and commit the pictures.

// NOBI_SHARP_MODULE may point to an installed Sharp module.
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { PREVIEW_CARDS, previewCardSlug } from "../src/content/previewCards.js";
import { buildPreviewCard, PreviewCardFolder } from "./preview-card.js";

const sharp = createRequire(import.meta.url)(process.env.NOBI_SHARP_MODULE || "sharp");
const outputFolder = fileURLToPath(new URL(`../public/${PreviewCardFolder}`, import.meta.url));
const markFile = fileURLToPath(new URL("../public/apple-touch-icon-180.png", import.meta.url));

// The real Nobi mark, drawn beside the wordmark. preview-card.js leaves room for it at this size and position.
const MarkSize = 56;
const MarkLeft = 88;
const MarkTop = 74;
const mark = await sharp(markFile).resize(MarkSize, MarkSize).png().toBuffer();

await mkdir(outputFolder, { recursive: true });

const only = process.argv.slice(2);
const paths = Object.keys(PREVIEW_CARDS).filter((path) => only.length === 0 || only.includes(path));
if (only.length > 0 && paths.length !== only.length) {
  throw new Error(`No preview card for: ${only.filter((path) => !PREVIEW_CARDS[path]).join(", ")}`);
}

for (const path of paths) {
  const slug = previewCardSlug(path);
  const svg = buildPreviewCard({ ...PREVIEW_CARDS[path], path });
  await writeFile(`${outputFolder}/${slug}.svg`, svg);
  await sharp(Buffer.from(svg))
    .composite([{ input: mark, left: MarkLeft, top: MarkTop }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${outputFolder}/${slug}.png`);
}

console.log(`render-preview-images: drew ${paths.length} card(s) at 1200 × 630 into public/${PreviewCardFolder}`);
