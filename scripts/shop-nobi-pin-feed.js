// Builds the RSS feeds Pinterest reads: shop/pins.xml with selected search-page heroes, one feed per category
// board, and their list. The Pinterest-only selection keeps available product heroes and avoids repeated photos.

import { htmlEscape } from "./prerender-blog.js";
import { BaseUrl, ShopNobiPageSeo, ShopNobiPinFeed } from "../src/utils/shopNobiPage.js";
import { listPinBoards, readTopLevel } from "../src/utils/shopNobiPinBoard.js";
import { searchPageUrl } from "../src/utils/shopNobiSearchPage.js";
import { selectPinItems } from "./shop-nobi-pin-selection.js";

const PinLimit = 1000;
const PinFeedFile = "shop/pins.xml";
const PinBoardIndexFile = "shop/pins/index.json";
const PinBoardTitlePrefix = "Shop Nobi: ";

/**
 * Lists the build output paths of every feed file, so the build can count them against its file limit.
 *
 * @returns {string[]} The paths, relative to the build output folder.
 */
export function listPinFeedFiles() {
  return [PinFeedFile, ...listPinBoards().map(boardFeedFile), PinBoardIndexFile];
}

/**
 * Builds every feed file: the combined feed, one feed per board, and the list of board feeds. A board feed is
 * built even when it has no items, so its address never goes away.
 *
 * @param {object[]} searchPages The built search pages.
 * @param {number} [pinLimit] The most items each feed holds.
 * @returns {{path: string, content: string}[]} The files, with paths relative to the build output folder.
 */
export function buildPinFeedFiles(searchPages, pinLimit = PinLimit) {
  const selectedItems = selectPinItems(searchPages);
  const allPinItems = buildPinItems(selectedItems, pinLimit);
  const boardFeeds = listPinBoards().map((board) => buildBoardFeed(board, selectedItems, pinLimit));
  return [
    { path: PinFeedFile, content: renderFeed(ShopNobiPinFeed, allPinItems) },
    ...boardFeeds.map(({ board, items }) => ({ path: boardFeedFile(board), content: renderFeed(boardChannel(board), items) })),
    { path: PinBoardIndexFile, content: renderBoardIndex(boardFeeds) },
  ];
}

/** Builds one board's items from the pages under its top level. */
function buildBoardFeed(board, selectedItems, pinLimit) {
  const boardItems = selectedItems.filter(({ page }) => readTopLevel(page.categoryPath) === board.topLevel);
  return { board, items: buildPinItems(boardItems, pinLimit) };
}

/** Returns a board feed's path in the build output. */
function boardFeedFile(board) {
  return board.feedPath.replace(/^\//, "");
}

/** Returns a board feed's channel title and self address. */
function boardChannel(board) {
  return { title: `${PinBoardTitlePrefix}${board.name}`, url: board.feedUrl };
}

/** Lists each board feed with its item count, as JSON. */
function renderBoardIndex(boardFeeds) {
  const entries = boardFeeds.map(({ board, items }) => ({
    slug: board.slug,
    boardName: board.name,
    feedUrl: board.feedUrl,
    itemCount: items.length,
  }));
  return `${JSON.stringify(entries, null, 2)}\n`;
}

/** Builds the items: the newest refreshed pages first, at most the limit, never a page Pinterest bans. */
function buildPinItems(selectedItems, pinLimit) {
  return sortNewestFirst(selectedItems).slice(0, Math.max(0, pinLimit)).map(buildPinItem);
}

/** Wraps the items in an RSS channel with the given title and self address. */
function renderFeed(channel, items) {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">`,
    `  <channel>`,
    `    <title>${htmlEscape(channel.title)}</title>`,
    `    <link>${BaseUrl}${ShopNobiPageSeo.path}</link>`,
    `    <description>${htmlEscape(ShopNobiPageSeo.description)}</description>`,
    `    <atom:link href="${htmlEscape(channel.url)}" rel="self" type="application/rss+xml"/>`,
    ...items,
    `  </channel>`,
    `</rss>`,
  ].join("\n") + "\n";
}

/** Sorts pages by refresh time, newest first. Pages without one go last, in their original order. */
function sortNewestFirst(selectedItems) {
  const readTime = ({ page }) => Date.parse(page.refreshedAt ?? "") || 0;
  return [...selectedItems].sort((first, second) => readTime(second) - readTime(first) || first.page.slug.localeCompare(second.page.slug, "en"));
}

/** Renders one reviewed candidate without changing the landing page's canonical publication identity. */
function buildPinItem({ page, imageUrl, title, description }) {
  // No pubDate: a nightly refresh does not mean the page changed, so its refresh time is not a publish date.
  const link = searchPageUrl(page.slug);
  return [
    `    <item>`,
    `      <title>${htmlEscape(title)}</title>`,
    `      <link>${htmlEscape(link)}</link>`,
    `      <description>${htmlEscape(description)}</description>`,
    `      <guid isPermaLink="true">${htmlEscape(link)}</guid>`,
    `      <media:content url="${htmlEscape(imageUrl)}" medium="image"/>`,
    `    </item>`,
  ].join("\n");
}
