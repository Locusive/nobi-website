/** Rasterizes the original portrait SVG with fixed PNG options and verifies repeatable output. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const sharp = createRequire(import.meta.url)(process.env.NOBI_SHARP_MODULE || "sharp");
const mediaDirectory = new URL("../public/media/", import.meta.url);
const reviewDirectory = new URL("../build/mindthecolor_pin/", import.meta.url);
const svg = await readFile(new URL("mindthecolor-requirements-pin.svg", mediaDirectory));
const pngOptions = { compressionLevel: 9, adaptiveFiltering: false, palette: false };
const png = await sharp(svg).png(pngOptions).toBuffer();
assert.deepEqual(png, await sharp(svg).png(pngOptions).toBuffer());
const metadata = await sharp(png).metadata();
assert.equal(metadata.width, 1000);
assert.equal(metadata.height, 1500);

await mkdir(reviewDirectory, { recursive: true });
await writeFile(new URL("mindthecolor-requirements-pin.png", mediaDirectory), png);
for (const width of [240, 370]) {
  await sharp(png).resize(width).png(pngOptions)
    .toFile(fileURLToPath(new URL(`preview-${width}.png`, reviewDirectory)));
}
await writeFile(new URL("render-provenance.json", reviewDirectory), `${JSON.stringify({
  svgSha256: createHash("sha256").update(svg).digest("hex"),
  pngSha256: createHash("sha256").update(png).digest("hex"),
  width: metadata.width,
  height: metadata.height,
  node: process.version,
  sharp: sharp.versions,
  pngOptions,
}, null, 2)}\n`);
console.log("MindTheColor: repeatable 1000×1500 PNG; 240px and 370px review copies.");
