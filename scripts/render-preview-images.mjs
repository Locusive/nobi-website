// Draws every page's link preview picture into public/media/og, the way the other owned previews there are made.
// Run `node scripts/render-preview-images.mjs` after changing previewCards.js, and commit the pictures.

// NOBI_SHARP_MODULE may point to an installed Sharp module.
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { PREVIEW_CARDS, previewCardSlug } from "../src/content/previewCards.js";
import { buildPreviewCard, PreviewCardFolder, PreviewCardFont, PreviewTextWidth } from "./preview-card.js";

const sharp = createRequire(import.meta.url)(process.env.NOBI_SHARP_MODULE || "sharp");
const outputFolder = fileURLToPath(new URL(`../public/${PreviewCardFolder}`, import.meta.url));
const markFile = fileURLToPath(new URL("../public/apple-touch-icon-180.png", import.meta.url));

// The real Nobi mark, drawn beside the wordmark. preview-card.js leaves room for it at this size and position.
const MarkSize = 56;
const MarkLeft = 88;
const MarkTop = 74;
const mark = await sharp(markFile).resize(MarkSize, MarkSize).png().toBuffer();

// A customer story shows that brand's own logo beside the Nobi mark, scaled to fit this box.
const LogoBox = Object.freeze({ width: 300, height: 64 });
const LogoRight = 1200 - 88;

// The canvas a sample of text is drawn on to measure it. Wider than the card so a long line is never clipped.
const SampleSize = Object.freeze({ width: 4000, height: 300 });
const SampleBaseline = 220;

const measured = new Map();

/**
 * Measures how wide a piece of text really is, by drawing it in the card's own font and trimming the blank space
 * around it. Guessing glyph widths let a headline run off the edge of a card, so this draws it instead.
 *
 * @param {string} text The text to measure.
 * @param {number} fontSize The size it is drawn at.
 * @param {number} fontWeight The weight it is drawn at.
 * @returns {Promise<number>} Its width in pixels.
 */
async function measureText(text, fontSize, fontWeight) {
  const key = `${fontWeight}/${fontSize}/${text}`;
  const remembered = measured.get(key);
  if (remembered !== undefined) {
    return remembered;
  }

  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const style = `font-family:${PreviewCardFont};font-size:${fontSize}px;font-weight:${fontWeight}`;
  const sample = `<svg xmlns="http://www.w3.org/2000/svg" width="${SampleSize.width}" height="${SampleSize.height}">
    <rect width="${SampleSize.width}" height="${SampleSize.height}" fill="#ffffff"/>
    <text x="0" y="${SampleBaseline}" style="${style}" fill="#000000">${escaped}</text>
  </svg>`;

  const { info } = await sharp(Buffer.from(sample)).trim().toBuffer({ resolveWithObject: true });
  measured.set(key, info.width);
  return info.width;
}

/** Renders one brand logo, right aligned against the card's margin. */
async function composeLogo(logoPath) {
  const file = fileURLToPath(new URL(`../public/${logoPath}`, import.meta.url));
  const resized = sharp(file).resize({ ...LogoBox, fit: "inside" });
  const { data, info } = await resized.png().toBuffer({ resolveWithObject: true });
  const top = MarkTop + Math.round((MarkSize - info.height) / 2);
  return { input: data, left: LogoRight - info.width, top: Math.max(top, 0) };
}

/** Fails the run when a line of text would be drawn past the card's margin. */
async function checkLinesFit(path, lines) {
  for (const line of lines) {
    const width = await measureText(line.text, line.size, line.weight);
    if (width > PreviewTextWidth) {
      throw new Error(`${path}: "${line.text}" is ${width}px wide, past the ${PreviewTextWidth}px the card allows.`);
    }
  }
}

await mkdir(outputFolder, { recursive: true });

const only = process.argv.slice(2);
const paths = Object.keys(PREVIEW_CARDS).filter((path) => only.length === 0 || only.includes(path));
if (only.length > 0 && paths.length !== only.length) {
  throw new Error(`No preview card for: ${only.filter((path) => !PREVIEW_CARDS[path]).join(", ")}`);
}

let drawn = 0;
for (const path of paths) {
  const card = PREVIEW_CARDS[path];
  // A page that shares its own hero picture needs no card drawn for it.
  if (card.heroImage) continue;

  const slug = previewCardSlug(path);
  const { svg, lines } = await buildPreviewCard({ ...card, path }, measureText);
  await checkLinesFit(path, lines);

  const layers = [{ input: mark, left: MarkLeft, top: MarkTop }];
  if (card.logo) layers.push(await composeLogo(card.logo));

  await writeFile(`${outputFolder}/${slug}.svg`, svg);
  await sharp(Buffer.from(svg))
    .composite(layers)
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${outputFolder}/${slug}.png`);
  drawn++;
}

console.log(`render-preview-images: drew ${drawn} card(s) at 1200 × 630 into public/${PreviewCardFolder}`);
