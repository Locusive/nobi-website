// Builds the link preview picture one page shows when someone shares it. Every card carries the Nobi mark, the
// page's own eyebrow, headline and summary, and its address, so a shared link says which page it is.

import { htmlEscape } from "./prerender-blog.js";

/** The size Open Graph and Twitter ask for in a large preview. */
export const PreviewCardSize = Object.freeze({ width: 1200, height: 630 });

/** The folder the cards are written to, under public. */
export const PreviewCardFolder = "media/og";

/** The font the cards are drawn in. The measurer has to draw its samples in the same one. */
export const PreviewCardFont = "'Avenir Next','Avenir','Helvetica Neue',Helvetica,Arial,sans-serif";

/** The width a line of text has to stay inside. */
export const PreviewTextWidth = 1024;

const Navy = "#0f172a";
const Slate = "#475569";
const Violet = "#7c3aed";

const LeftMargin = 88;
const HeadlineSize = 62;
const HeadlineWeight = 750;
const HeadlineLineHeight = 76;
const SummarySize = 27;
const SummaryWeight = 500;
const SummaryLineHeight = 40;
const HeadlineTop = 268;
const MaxHeadlineLines = 3;
const MaxSummaryLines = 3;

/**
 * Breaks text into lines that fit the card, and drops whatever runs past the last line.
 *
 * @param {string} text The text to break.
 * @param {(text: string) => Promise<number>} measure Returns how wide a piece of text is when drawn.
 * @param {number} maxLines The most lines to keep.
 * @returns {Promise<string[]>} The lines, the last one ending in an ellipsis when text was dropped.
 */
export async function wrapText(text, measure, maxLines) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && (await measure(candidate)) > PreviewTextWidth) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = candidate;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);

  const kept = lines.slice(0, maxLines);
  if (kept.length === maxLines && kept.join(" ") !== words.join(" ")) {
    kept[kept.length - 1] = `${kept[kept.length - 1].replace(/[.,;:]$/, "")}…`;
  }
  return kept;
}

/** Draws one block of lines, top down from a baseline. */
function drawLines(lines, { baseline, lineHeight, size, weight, fill }) {
  return lines
    .map((line, index) => {
      const y = baseline + index * lineHeight;
      const position = `x="${LeftMargin}" y="${y}"`;
      return `<text ${position} font-size="${size}" font-weight="${weight}" fill="${fill}">${htmlEscape(line)}</text>`;
    })
    .join("\n  ");
}

/**
 * Builds one page's link preview card.
 *
 * @param {object} card The card's content: eyebrow, headline, summary and the page's path.
 * @param {Function} measure Returns how wide a piece of text is, given the text, its size and its weight.
 * @returns {Promise<object>} The card's SVG, and every line of text in it so the caller can check each one fits.
 */
export async function buildPreviewCard({ eyebrow, headline, summary, path }, measure) {
  const measureHeadline = (text) => measure(text, HeadlineSize, HeadlineWeight);
  const measureSummary = (text) => measure(text, SummarySize, SummaryWeight);
  const headlineLines = await wrapText(headline, measureHeadline, MaxHeadlineLines);
  const summaryLines = await wrapText(summary, measureSummary, MaxSummaryLines);

  const summaryTop = HeadlineTop + headlineLines.length * HeadlineLineHeight + 26;
  const { width, height } = PreviewCardSize;
  const headlineBlock = { baseline: HeadlineTop, lineHeight: HeadlineLineHeight, size: HeadlineSize };
  const summaryBlock = { baseline: summaryTop, lineHeight: SummaryLineHeight, size: SummarySize };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="cardTitle cardSummary">
  <title id="cardTitle">${htmlEscape(headline)}</title>
  <desc id="cardSummary">${htmlEscape(summary)}</desc>
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.55" stop-color="#f8fafc"/>
      <stop offset="1" stop-color="#eef2ff"/>
    </linearGradient>
    <linearGradient id="rail" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ec4899"/>
      <stop offset="0.5" stop-color="#8b5cf6"/>
      <stop offset="1" stop-color="#38bdf8"/>
    </linearGradient>
  </defs>
  <style>text{font-family:${PreviewCardFont}}</style>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect x="0" y="0" width="14" height="${height}" fill="url(#rail)"/>
  <text x="${LeftMargin + 76}" y="118" font-size="34" font-weight="800" fill="${Navy}" letter-spacing="1.5">NOBI</text>
  <text x="${LeftMargin}" y="214" font-size="23" font-weight="700" fill="${Violet}" letter-spacing="3.4">${htmlEscape(eyebrow.toUpperCase())}</text>
  ${drawLines(headlineLines, { ...headlineBlock, weight: HeadlineWeight, fill: Navy })}
  ${drawLines(summaryLines, { ...summaryBlock, weight: SummaryWeight, fill: Slate })}
  <text x="${LeftMargin}" y="572" font-size="24" font-weight="600" fill="${Slate}">nobi.ai${htmlEscape(path === "/" ? "" : path)}</text>
</svg>
`;

  const headlineOut = headlineLines.map((text) => ({ text, size: HeadlineSize, weight: HeadlineWeight }));
  const summaryOut = summaryLines.map((text) => ({ text, size: SummarySize, weight: SummaryWeight }));
  return { svg, lines: [...headlineOut, ...summaryOut] };
}
