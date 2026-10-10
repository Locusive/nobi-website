// Builds the files that list the Shop Nobi search pages: the Shop Nobi
// sitemap, the redirects for retired pages, and the llms.txt section.

import { htmlEscape } from "./prerender-blog.js";
import { searchPagePath, searchPageUrl } from "../src/utils/shopNobiSearchPage.js";
import { isSafeSlug } from "./shop-nobi-search-page-view.js";

const LlmsTxtPageLimit = 100;
const RedirectTargetPattern = /^\/[A-Za-z0-9\-._~/]*$/;

/**
 * Builds sitemap-shop.xml, listing every live page with the time it was last refreshed.
 *
 * @param {object[]} pages The live search pages.
 * @returns {string} The sitemap XML.
 */
export function buildShopNobiSitemap(pages) {
  const entries = pages.map((page) => {
    const lastModified = page.refreshedAt ? `\n    <lastmod>${htmlEscape(page.refreshedAt)}</lastmod>` : "";
    return `  <url>\n    <loc>${htmlEscape(searchPageUrl(page.slug))}</loc>${lastModified}\n  </url>`;
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...entries,
    `</urlset>`,
  ].join("\n") + "\n";
}

/**
 * Builds one permanent redirect line for each retired page. It skips a retired slug that is live again and any
 * entry whose slug or target is not a plain site path.
 *
 * @param {object[]} retired The retired entries, each {slug, redirectTo}.
 * @param {object[]} pages The live search pages.
 * @returns {string[]} The _redirects lines.
 */
export function buildRetiredRedirects(retired, pages) {
  const liveSlugs = new Set(pages.map((page) => page.slug));
  return retired
    .filter((entry) => isSafeRedirect(entry) && !liveSlugs.has(entry.slug))
    .map((entry) => `${searchPagePath(entry.slug)} ${entry.redirectTo} 301`);
}

/**
 * Adds the first retired page redirects to the existing _redirects text, keeping the whole file within the rule
 * limit, and logs how many were dropped.
 *
 * @param {string} redirectsText The current _redirects file.
 * @param {string[]} redirectLines The retired page lines, newest first.
 * @param {number} ruleLimit The most rules the whole file may hold.
 * @returns {string} The new _redirects file.
 */
export function appendRedirects(redirectsText, redirectLines, ruleLimit) {
  const room = Math.max(0, ruleLimit - countRedirectRules(redirectsText));
  const keptLines = redirectLines.slice(0, room);
  if (keptLines.length < redirectLines.length) {
    console.warn(`prerender-shop: dropped ${redirectLines.length - keptLines.length} retired page redirect(s) to stay within ${ruleLimit} rules.`);
  }
  if (keptLines.length === 0) {
    return redirectsText;
  }
  return `${redirectsText.trimEnd()}\n\n# Retired Shop Nobi search pages.\n${keptLines.join("\n")}\n`;
}

/**
 * Counts the rules in a _redirects file: every line that is not blank or a comment.
 *
 * @param {string} redirectsText The _redirects file.
 * @returns {number} The number of rules.
 */
export function countRedirectRules(redirectsText) {
  return redirectsText.split("\n").filter((line) => line.trim() && !line.trim().startsWith("#")).length;
}

/**
 * Adds a Shop Nobi section to llms.txt that links to the first pages in the data.
 *
 * @param {string} llmsText The current llms.txt.
 * @param {object[]} pages The live search pages.
 * @returns {string} The new llms.txt.
 */
export function appendLlmsTxtSection(llmsText, pages) {
  if (pages.length === 0) {
    return llmsText;
  }

  const links = pages
    .slice(0, LlmsTxtPageLimit)
    .map((page) => `- [${escapeLinkText(page.title)}](${searchPageUrl(page.slug)})`);
  const section = [
    "## Shop Nobi",
    "",
    "Shop Nobi (https://nobi.ai/shop) finds the best products from the best stores online, in one search. It is a search engine: shoppers buy directly from the store.",
    "",
    "### Popular searches",
    "",
    ...links,
  ];
  return `${llmsText.trimEnd()}\n\n${section.join("\n")}\n`;
}

/** Returns whether a retired entry has a safe slug and a target that is a plain path on this site. */
function isSafeRedirect(entry) {
  return isSafeSlug(entry?.slug) && typeof entry.redirectTo === "string" && RedirectTargetPattern.test(entry.redirectTo);
}

/** Keeps a title from breaking the Markdown link it sits in. */
function escapeLinkText(title) {
  return title.replace(/\s+/g, " ").replace(/([\\[\]])/g, "\\$1");
}
