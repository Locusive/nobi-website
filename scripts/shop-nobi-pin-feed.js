// Builds dist/shop/pins.xml, an RSS 2.0 feed with one item per search page, which Pinterest reads to
// publish a pin for each page. Each item needs a picture, so pages without an https product picture are left out.

import { htmlEscape } from "./prerender-blog.js";
import { BaseUrl, ShopNobiPageSeo, ShopNobiPinFeed } from "../src/utils/shopNobiPage.js";
import { buildSearchPageSeo, searchPageUrl } from "../src/utils/shopNobiSearchPage.js";

const PinLimit = 1000;

/**
 * Builds the feed: the newest refreshed pages first, at most the limit, each with its first https product picture.
 *
 * @param {object[]} searchPages The built search pages.
 * @param {number} [pinLimit] The most items the feed holds.
 * @returns {string} The RSS XML.
 */
export function buildPinFeed(searchPages, pinLimit = PinLimit) {
  const items = sortNewestFirst(searchPages)
    .map(buildPinItem)
    .filter(Boolean)
    .slice(0, pinLimit);

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">`,
    `  <channel>`,
    `    <title>${htmlEscape(ShopNobiPinFeed.title)}</title>`,
    `    <link>${BaseUrl}${ShopNobiPageSeo.path}</link>`,
    `    <description>${htmlEscape(ShopNobiPageSeo.description)}</description>`,
    `    <atom:link href="${htmlEscape(ShopNobiPinFeed.url)}" rel="self" type="application/rss+xml"/>`,
    ...items,
    `  </channel>`,
    `</rss>`,
  ].join("\n") + "\n";
}

/** Sorts pages by refresh time, newest first. Pages without one go last, in their original order. */
function sortNewestFirst(searchPages) {
  const readTime = (page) => Date.parse(page.refreshedAt ?? "") || 0;
  return [...searchPages].sort((first, second) => readTime(second) - readTime(first));
}

/** Builds one feed item, or returns null when the page has no https product picture. */
function buildPinItem(page) {
  const imageUrl = page.products.map((product) => product.imageUrl).find((url) => url?.startsWith("https://"));
  if (!imageUrl) {
    return null;
  }

  // No pubDate: a nightly refresh does not mean the page changed, so its refresh time is not a publish date.
  const link = searchPageUrl(page.slug);
  return [
    `    <item>`,
    `      <title>${htmlEscape(page.title)}</title>`,
    `      <link>${htmlEscape(link)}</link>`,
    `      <description>${htmlEscape(buildSearchPageSeo(page).description)}</description>`,
    `      <guid isPermaLink="true">${htmlEscape(link)}</guid>`,
    `      <media:content url="${htmlEscape(imageUrl)}" medium="image"/>`,
    `    </item>`,
  ].join("\n");
}
