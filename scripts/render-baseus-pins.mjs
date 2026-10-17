/** Original diagrams only. Set NOBI_SHARP_MODULE to an installed Sharp module when it is not local. */
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const sharp = createRequire(import.meta.url)(process.env.NOBI_SHARP_MODULE || "sharp");
const outputDirectory = fileURLToPath(new URL("../public/media/", import.meta.url));
const reviewDirectory = fileURLToPath(new URL("../build/baseus_pin_assets/", import.meta.url));
const palette = { cloud: "#f4f7ff", ink: "#202b4a", blue: "#3f4edb", muted: "#4b5974", line: "#d7dfee", mint: "#a8decf", lilac: "#ccd0fb", white: "#ffffff" };
const recordedText = [];

/** Escapes literal copy in XML text, attributes and accessibility metadata. */
function escapeXml(literalText) {
  return String(literalText).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

/** Records deliberate line breaks and enforces the minimum visible type size. */
function drawText(x, y, textContent, size = 40, weight = 500, fill = palette.ink, anchor = "start") {
  assert.ok(size >= 40, `Unreadable type: ${textContent}`);
  assert.ok(x >= 80 && x <= 920 && y - size >= 80 && y + size * 0.22 <= 1420, `Unsafe text origin: ${textContent}`);
  recordedText.push({ x, y, textContent, size, weight, anchor });
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${escapeXml(textContent)}</text>`;
}

/** Draws a simple rounded panel, with no product imagery or external resource. */
function drawPanel(x, y, width, height, fill = palette.white, radius = 26) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}"/>`;
}

/** Draws an illustrative monitor; letters and modes describe content rather than a tested device. */
function drawMonitor(x, y, width, height, screenLabels, fill = palette.mint, size = 72) {
  const lineHeight = size + 8;
  const firstBaseline = y + height / 2 - (screenLabels.length - 1) * lineHeight / 2 + size * 0.32;
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="15" fill="${fill}" stroke="${palette.ink}" stroke-width="5"/>
    <path d="M${x + width / 2} ${y + height}v24m-35 0h70" fill="none" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round"/>
    ${screenLabels.map((label, index) => drawText(x + width / 2, firstBaseline + index * lineHeight, label, size, 700, palette.ink, "middle")).join("")}`;
}

/** Draws a laptop icon without suggesting physical dimensions or a hardware model. */
function drawLaptop(x, y, width, height, label, fill = palette.mint, size = 72) {
  return `<rect x="${x + 15}" y="${y}" width="${width - 30}" height="${height}" rx="14" fill="${fill}" stroke="${palette.ink}" stroke-width="5"/>
    <path d="M${x} ${y + height + 12}h${width}l-14 15h-${width - 28}z" fill="${palette.ink}"/>
    ${drawText(x + width / 2, y + height / 2 + size * 0.32, label, size, 700, palette.ink, "middle")}`;
}

/** Uses one recognisable masthead while leaving each buyer question its own layout. */
function buildHeader(kicker, firstLine, secondLine) {
  return drawText(80, 120, "SHOP NOBI", 40, 800, palette.blue)
    + drawText(80, 178, kicker, 40, 600, palette.muted)
    + drawText(80, 268, firstLine, 72, 800)
    + drawText(80, 348, secondLine, 72, 800);
}

/** Keeps qualifications and the commission disclosure readable on every standalone image. */
function buildFooter(source) {
  return `<path d="M80 1145h840" stroke="${palette.line}" stroke-width="3"/>`
    + drawText(80, 1190, source, 40, 600)
    + drawText(80, 1245, "Specs checked: Oct 17, 2026.", 40, 500, palette.muted)
    + drawText(80, 1300, "Not hardware-tested.", 40, 500, palette.muted)
    + drawText(80, 1355, "Manual revision not matched.", 40, 500, palette.muted)
    + drawText(80, 1410, "We may earn a commission.", 40, 700, palette.blue);
}

/** Contrasts the exact RD1 Mac limitation with a clearly labelled conceptual alternative. */
function buildMacMirrorGraphic() {
  return buildHeader("RD1 PRO WIN · macOS", "Two HDMI ports.", "Same second screen?")
    + drawText(80, 412, "RD1’s external outputs mirror on macOS.")
    + drawPanel(80, 450, 840, 280)
    + drawText(110, 505, "RD1 on macOS", 42, 700)
    + drawLaptop(105, 550, 180, 115, "A", palette.mint)
    + drawMonitor(355, 540, 240, 130, ["B"], palette.lilac)
    + drawMonitor(650, 540, 240, 130, ["B"], palette.lilac)
    + drawText(80, 795, "Independent content, for illustration:", 40, 600)
    + drawLaptop(105, 845, 180, 115, "A", palette.mint)
    + drawMonitor(355, 835, 240, 130, ["B"])
    + drawMonitor(650, 835, 240, 130, ["C"])
    + drawText(80, 1095, "Check your exact dock + laptop.", 44, 700, palette.blue)
    + buildFooter("Source: Baseus RD1 Mac FAQ");
}

/** Separates the sourced single-screen and simultaneous-screen claims without pixel extrapolation. */
function buildNu1ModeGraphic() {
  return buildHeader("NU1 AIR MAC · DISPLAY MODES", "One 4K screen", "≠ two 4K screens")
    + drawText(80, 412, "Use the simultaneous-mode table.")
    + drawPanel(80, 450, 840, 245)
    + drawText(110, 510, "ONE SCREEN", 42, 700, palette.blue)
    + drawText(110, 580, "3840 × 2160", 48, 700)
    + drawText(110, 638, "at 60Hz", 42)
    + drawMonitor(555, 480, 325, 160, ["4K60"])
    + drawPanel(80, 725, 840, 245)
    + drawText(110, 785, "TWO SCREENS", 42, 700, palette.blue)
    + drawText(110, 855, "2560 × 1440", 48, 700)
    + drawText(110, 913, "each at 60Hz", 42)
    + drawMonitor(525, 770, 160, 145, ["1440p", "60Hz"], palette.mint, 40)
    + drawMonitor(725, 770, 160, 145, ["1440p", "60Hz"], palette.mint, 40)
    + drawText(80, 1045, "Dual-4K marketing conflicts.", 44, 700)
    + drawText(80, 1100, "DisplayLink + host/cable checks still apply.")
    + buildFooter("Source: Baseus NU1 mode table");
}

/** Shows only three documented Windows matched-mode cases, never a mixed-mode promise. */
function buildRd1DscGraphic() {
  return buildHeader("RD1 PRO WIN · WINDOWS", "Two 4K60 screens?", "First, check DSC.")
    + drawText(80, 412, "Your host path changes the listed mode.")
    + buildModeRow(450, ["DP1.4 + DSC"], "4K60 EACH")
    + buildModeRow(660, ["DP1.4", "without DSC"], "4K30 EACH")
    + buildModeRow(870, ["DP1.2"], "1080p60 EACH")
    + drawText(80, 1090, "Full-featured host + cables required.")
    + drawText(80, 1135, "Unknown/mixed modes need checking.")
    + buildFooter("Source: Baseus RD1 resolution guide");
}

/** Draws a host-path arrow to two abstract external screens and one shared mode label. */
function buildModeRow(y, hostLabels, mode) {
  const firstBaseline = y + (hostLabels.length === 1 ? 100 : 70);
  return drawPanel(80, y, 840, 180)
    + hostLabels.map((label, index) => drawText(110, firstBaseline + index * 55, label, 44, 700)).join("")
    + `<path d="M425 ${y + 85}h100m-18-18 18 18-18 18" fill="none" stroke="${palette.blue}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`
    + drawMonitor(580, y + 25, 135, 70, [])
    + drawMonitor(755, y + 25, 135, 70, [])
    + drawText(735, y + 160, mode, 42, 700, palette.ink, "middle");
}

/** Depicts the two manufacturer allocation examples as alternatives, not simultaneous or universal limits. */
function buildNu1PowerGraphic() {
  return buildHeader("NU1 AIR MAC · LAPTOP POWER", "100W in ≠ 100W", "to your laptop.")
    + drawText(80, 412, "Two alternative, stated allocations:")
    + buildPowerRow(450, "ONE USB PORT IN USE", "90W")
    + drawText(500, 755, "OR", 48, 800, palette.blue, "middle")
    + buildPowerRow(785, "ALL USB PORTS IN USE", "75W")
    + drawText(80, 1085, "Charger + cables separate; PD host needed.")
    + drawText(80, 1130, "Other USB loads are unlisted here.")
    + buildFooter("Source: Baseus NU1 power diagram");
}

/** Uses the same 100W input in each separately labelled USB-load scenario. */
function buildPowerRow(y, loadLabel, laptopWatts) {
  return drawPanel(80, y, 840, 245)
    + drawText(110, y + 55, loadLabel, 42, 700, palette.blue)
    + drawPanel(120, y + 90, 155, 90, palette.lilac, 16)
    + drawText(197, y + 150, "100W", 44, 700, palette.ink, "middle")
    + drawText(115, y + 220, "INPUT", 40, 600, palette.muted)
    + `<path d="M320 ${y + 140}h130m-18-18 18 18-18 18" fill="none" stroke="${palette.blue}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`
    + drawPanel(555, y + 90, 325, 100, palette.mint, 16)
    + drawText(717, y + 160, laptopWatts, 72, 700, palette.ink, "middle")
    + drawText(717, y + 225, "TO LAPTOP", 40, 600, palette.muted, "middle");
}

/** Provides accessible metadata and a self-contained original SVG canvas. */
function buildSvg(title, description, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)}</title><desc id="description">${escapeXml(description)}</desc>
  <style>text{font-family:'Avenir Next',Avenir,Arial,sans-serif;}</style>
  <rect width="1000" height="1500" fill="${palette.cloud}"/>
  ${body}
  </svg>\n`;
}

/** Renders all four original drafts and mobile review copies without a network or model call. */
async function renderAssets() {
  const pinDefinitions = [
    ["01-mac-mirror", "Two HDMI ports can mirror on RD1 Pro WIN for Mac", "RD1 on macOS shows A/B/B; a separately labelled illustration shows A/B/C. Manufacturer specifications, not hardware testing. Manual revision not matched. Shop Nobi may earn a commission.", buildMacMirrorGraphic],
    ["02-nu1-resolution", "NU1 single 4K60 and simultaneous dual 1440p60 are different claims", "The sourced NU1 table lists one 4K60 or two 1440p60 screens. Dual-4K marketing conflicts. Software, host and cables need checking. Manufacturer specifications, not hardware testing. Manual revision not matched. Shop Nobi may earn a commission.", buildNu1ModeGraphic],
    ["03-rd1-dsc", "RD1 Windows simultaneous modes depend on the host DP and DSC path", "DP1.4 with DSC lists dual 4K60, DP1.4 without DSC lists dual 4K30 and DP1.2 lists dual 1080p60. Unlisted mixed paths need checking. Manufacturer specifications, not hardware testing. Manual revision not matched. Shop Nobi may earn a commission.", buildRd1DscGraphic],
    ["04-nu1-power", "NU1 100W input and stated laptop allocation are different", "Alternative 100W-input cases show 90W laptop allocation with one USB port and 75W with all USB ports. Other loads are not specified here. Charger/cables are separate and host PD support matters. Manufacturer specifications, not hardware testing. Manual revision not matched. Shop Nobi may earn a commission.", buildNu1PowerGraphic],
  ];
  await Promise.all([mkdir(outputDirectory, { recursive: true }), mkdir(reviewDirectory, { recursive: true })]);
  for (const [slug, title, description, drawGraphic] of pinDefinitions) {
    const svg = buildSvg(title, description, drawGraphic());
    const stem = `baseus-screens-${slug}`;
    await writeFile(`${outputDirectory}${stem}.svg`, svg);
    await sharp(Buffer.from(svg)).png().toFile(`${outputDirectory}${stem}.png`);
    await sharp(Buffer.from(svg)).resize(370, 555).png().toFile(`${reviewDirectory}${stem}-mobile.png`);
    const imageMetadata = await sharp(`${outputDirectory}${stem}.png`).metadata();
    assert.equal(imageMetadata.width, 1000);
    assert.equal(imageMetadata.height, 1500);
    console.log(`${stem}: 1000×1500 PNG + original SVG`);
  }
  await writeFile(`${reviewDirectory}text-layout.json`, `${JSON.stringify(recordedText, null, 2)}\n`);
}

await renderAssets();
