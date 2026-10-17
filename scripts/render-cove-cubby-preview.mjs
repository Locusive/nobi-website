/** Render an owned landscape link preview. NOBI_SHARP_MODULE may point to an installed Sharp module. */
import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { CoveCubbyProducts } from "../src/content/coveCubbyComparison.js";

const sharp = createRequire(import.meta.url)(process.env.NOBI_SHARP_MODULE || "sharp");
const output = fileURLToPath(new URL("../public/media/cove-cubby-social-preview", import.meta.url));
const scale = 12;
const centers = [735, 1045];

/** Draw the two exterior rectangles at one scale using the page's manufacturer dimensions. */
function drawFootprint(product, center) {
  const width = product.width * scale;
  const height = product.depth * scale;
  return `<text x="${center}" y="148" text-anchor="middle" font-size="32" font-weight="700">${product.name}</text>
    <rect x="${center - width / 2}" y="185" width="${width}" height="${height}" fill="${product.color}" stroke="#202b4a" stroke-width="3"/>
    <text x="${center}" y="546" text-anchor="middle" font-size="28" font-weight="600">${product.width} × ${product.depth} in</text>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">Cove vs Cubby: which litter box fits your space?</title>
  <desc id="description">Exterior rectangles at one scale: Cubby is 15.2 by 21.2 inches and Cove is 16 by 26 inches. Allow extra room for access and cleaning. Manufacturer specifications, not a hands-on test. Shop Nobi may earn a commission.</desc>
  <style>text{font-family:'Avenir Next',Avenir,Arial,sans-serif;fill:#202b4a}</style>
  <rect width="1200" height="630" fill="#f5f8ff"/>
  <text x="54" y="50" font-size="24">#ad · Nobi may earn a commission.</text>
  <text x="54" y="176" font-size="58" font-weight="750">Cove vs Cubby</text>
  <text x="54" y="254" font-size="46" font-weight="650">Which litter box</text>
  <text x="54" y="310" font-size="46" font-weight="650">fits your space?</text>
  <text x="54" y="396" font-size="25">Exterior bounds at one scale.</text>
  <text x="54" y="434" font-size="25">Allow room for access and cleaning.</text>
  ${CoveCubbyProducts.map((product, index) => drawFootprint(product, centers[index])).join("\n")}
  <text x="54" y="574" font-size="30" font-weight="750">Shop Nobi</text>
  <text x="54" y="606" font-size="21">nobi.ai/tools/cove-vs-cubby</text>
</svg>\n`;

await writeFile(`${output}.svg`, svg);
await sharp(Buffer.from(svg)).png().toFile(`${output}.png`);
console.log("Rendered owned Cove/Cubby preview: 1200 × 630.");
