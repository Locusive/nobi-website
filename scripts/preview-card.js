// Builds the link preview picture one page shows when someone shares it. Every card carries the Nobi mark, the
// page's own eyebrow, headline and summary, and its address, so a shared link says which page it is.

import { htmlEscape } from "./prerender-blog.js";

/** The size Open Graph and Twitter ask for in a large preview. */
export const PreviewCardSize = Object.freeze({ width: 1200, height: 630 });

/** The folder the cards are written to, under public. */
export const PreviewCardFolder = "media/og";

const Navy = "#0f172a";
const Slate = "#475569";
const Violet = "#7c3aed";
const Font = "'Avenir Next','Avenir','Helvetica Neue',Helvetica,Arial,sans-serif";

const LeftMargin = 88;
const TextWidth = 1024;
const HeadlineSize = 62;
const HeadlineLineHeight = 76;
const SummarySize = 27;
const SummaryLineHeight = 40;
const HeadlineTop = 268;
const MaxHeadlineLines = 3;
const MaxSummaryLines = 3;

// Rough widths, as a fraction of the font size, for the characters our copy uses. Pango measures the real font
// when it draws; these only have to be close enough to break lines inside the card's margins.
const NarrowCharacters = "iljtfIr.,:;'!|()[]/ ";
const WideCharacters = "mwMW@%";
const NarrowWidth = 0.30;
const WideWidth = 0.92;
const CapitalWidth = 0.66;
const OrdinaryWidth = 0.53;

/**
 * Estimates how wide a piece of text is when drawn.
 *
 * @param {string} text The text to measure.
 * @param {number} fontSize The size it is drawn at.
 * @returns {number} The estimated width in pixels.
 */
function measureText(text, fontSize) {
  let total = 0;
  for (const character of text) {
    if (NarrowCharacters.includes(character)) {
      total += NarrowWidth;
    } else if (WideCharacters.includes(character)) {
      total += WideWidth;
    } else if (character >= "A" && character <= "Z") {
      total += CapitalWidth;
    } else {
      total += OrdinaryWidth;
    }
  }
  return total * fontSize;
}

/**
 * Breaks text into lines that fit the card, and drops whatever runs past the last line.
 *
 * @param {string} text The text to break.
 * @param {number} fontSize The size it is drawn at.
 * @param {number} maxLines The most lines to keep.
 * @returns {string[]} The lines, the last one ending in an ellipsis when text was dropped.
 */
export function wrapText(text, fontSize, maxLines) {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && measureText(candidate, fontSize) > TextWidth) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = candidate;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);

  const kept = lines.slice(0, maxLines);
  const usedEveryLine = kept.length === maxLines;
  const wroteEverything = kept.join(" ") === text.split(/\s+/).filter(Boolean).join(" ");
  if (usedEveryLine && !wroteEverything) {
    kept[kept.length - 1] = `${kept[kept.length - 1].replace(/[.,;:]$/, "")}…`;
  }
  return kept;
}

/** Draws one block of lines, top down from a baseline. */
function drawLines(lines, { x, baseline, lineHeight, size, weight, fill }) {
  return lines
    .map((line, index) => {
      const y = baseline + index * lineHeight;
      return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}">${htmlEscape(line)}</text>`;
    })
    .join("\n  ");
}

/**
 * Builds one page's link preview card.
 *
 * @param {object} card The card's content.
 * @param {string} card.eyebrow The small label above the headline, such as "Customer story".
 * @param {string} card.headline The page's own headline.
 * @param {string} card.summary A sentence describing the page.
 * @param {string} card.path The page's path, shown as its address.
 * @returns {string} The card's SVG.
 */
export function buildPreviewCard({ eyebrow, headline, summary, path }) {
  const headlineLines = wrapText(headline, HeadlineSize, MaxHeadlineLines);
  const summaryTop = HeadlineTop + headlineLines.length * HeadlineLineHeight + 26;
  const summaryLines = wrapText(summary, SummarySize, MaxSummaryLines);
  const { width, height } = PreviewCardSize;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="cardTitle cardSummary">
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
  <style>text{font-family:${Font}}</style>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect x="0" y="0" width="14" height="${height}" fill="url(#rail)"/>
  <text x="${LeftMargin + 76}" y="118" font-size="34" font-weight="800" fill="${Navy}" letter-spacing="1.5">NOBI</text>
  <text x="${LeftMargin}" y="214" font-size="23" font-weight="700" fill="${Violet}" letter-spacing="3.4">${htmlEscape(eyebrow.toUpperCase())}</text>
  ${drawLines(headlineLines, { x: LeftMargin, baseline: HeadlineTop, lineHeight: HeadlineLineHeight, size: HeadlineSize, weight: 750, fill: Navy })}
  ${drawLines(summaryLines, { x: LeftMargin, baseline: summaryTop, lineHeight: SummaryLineHeight, size: SummarySize, weight: 500, fill: Slate })}
  <text x="${LeftMargin}" y="572" font-size="24" font-weight="600" fill="${Slate}">nobi.ai${htmlEscape(path === "/" ? "" : path)}</text>
</svg>
`;
}
