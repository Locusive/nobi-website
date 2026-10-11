// Shared helpers that turn the built client shell into one page's HTML file:
// the page's head tags, its rendered body inside #root, and both file forms.

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { stripHomepageMeta, htmlEscape } from "./prerender-blog.js";

const BaseUrl = "https://nobi.ai";
const DefaultImage = `${BaseUrl}/og-image.png`;
const EmptyRoot = '<div id="root"></div>';

/**
 * Turns a value into JSON that is safe inside a script element. A "<" in the data could otherwise close the element.
 *
 * @param {unknown} value The value to write.
 * @returns {string} The JSON text with every "<" escaped.
 */
export function toScriptJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** Builds the canonical, link preview, structured data and robots tags for one page. */
function buildHead(page) {
  const url = page.path === "/" ? BaseUrl : `${BaseUrl}${page.path}`;
  // A page can bring its own link preview picture; the rest use the Nobi one.
  const image = page.image || DefaultImage;
  const tags = [
    `<link rel="canonical" href="${htmlEscape(url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${htmlEscape(url)}">`,
    `<meta property="og:title" content="${htmlEscape(page.title)}">`,
    `<meta property="og:description" content="${htmlEscape(page.description)}">`,
    `<meta property="og:image" content="${htmlEscape(image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${htmlEscape(page.title)}">`,
    `<meta name="twitter:description" content="${htmlEscape(page.description)}">`,
    `<meta name="twitter:image" content="${htmlEscape(image)}">`,
    `<script type="application/ld+json" id="page-schema">${toScriptJson(page.schema)}</script>`,
  ];
  if (page.robots) {
    tags.push(`<meta name="robots" content="${htmlEscape(page.robots)}">`);
  }
  if (page.feed) {
    tags.push(`<link rel="alternate" type="application/rss+xml" title="${htmlEscape(page.feed.title)}" href="${htmlEscape(page.feed.url)}">`);
  }
  return tags.join("\n    ");
}

/**
 * Combines a page's head values and rendered body with the built client shell.
 *
 * @param {{path: string, title: string, description: string, image?: string, robots?: string, feed?: object, schema: object[]}} page
 *     The page's head values.
 * @param {string} shell The built index.html.
 * @param {string} body The rendered HTML that goes inside #root.
 * @returns {string} The page's full HTML.
 */
export function renderPage(page, shell, body) {
  const titleTag = `<title>${htmlEscape(page.title)}</title>`;
  const headTags = `<meta name="description" content="${htmlEscape(page.description)}">\n    ${buildHead(page)}`;

  // Replacement functions keep a "$" in page text from being read as a replacement pattern.
  let html = stripHomepageMeta(shell);
  html = html.replace("<!--__PRERENDER_TITLE__-->", () => titleTag);
  html = html.replace("<!--__PRERENDER_DESC__-->", () => headTags);
  if (!html.includes(EmptyRoot)) {
    throw new Error("Expected an empty React root in the build shell.");
  }
  return html.replace(EmptyRoot, () => `<div id="root">${body}</div>`);
}

/**
 * Writes a page to both files Cloudflare serves it from: <path>.html for the address without a trailing slash,
 * and <path>/index.html for the address with one.
 *
 * @param {string} distDir The build output folder.
 * @param {string} path The page path, such as "/pricing".
 * @param {string} html The page's HTML.
 */
export function writePageFiles(distDir, path, html) {
  const relativePath = path.replace(/^\//, "");
  const folder = join(distDir, relativePath);
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, "index.html"), html);

  const flatFile = join(distDir, `${relativePath}.html`);
  mkdirSync(dirname(flatFile), { recursive: true });
  writeFileSync(flatFile, html);
}

/**
 * Writes a page to <path>.html only. Cloudflare serves the address without a trailing slash from that file and
 * redirects the trailing-slash form to it, so this saves a file where the file limit matters.
 *
 * @param {string} distDir The build output folder.
 * @param {string} path The page path, such as "/shop/s/boots".
 * @param {string} html The page's HTML.
 */
export function writeFlatPageFile(distDir, path, html) {
  const flatFile = join(distDir, `${path.replace(/^\//, "")}.html`);
  mkdirSync(dirname(flatFile), { recursive: true });
  writeFileSync(flatFile, html);
}
