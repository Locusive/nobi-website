// Builds the RSS feeds Pinterest reads to pin each search page: shop/pins.xml with every page, one feed per category
// board, and their list. Each item needs a picture, so pages without an https product picture are left out.

import { htmlEscape } from "./prerender-blog.js";
import { BaseUrl, CommissionNotice, ShopNobiPageSeo, ShopNobiPinFeed } from "../src/utils/shopNobiPage.js";
import { BannedTopLevel, listPinBoards, readTopLevel } from "../src/utils/shopNobiPinBoard.js";
import { buildSearchPageSeo, searchPageUrl } from "../src/utils/shopNobiSearchPage.js";
import { findLargePreviewImage } from "../src/utils/previewImage.js";

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
 * Builds every feed file: the feed of all pages, one feed per board, and the list of board feeds. A board feed is
 * built even when it has no items, so its address never goes away.
 *
 * @param {object[]} searchPages The built search pages.
 * @param {number} [pinLimit] The most items each feed holds.
 * @returns {{path: string, content: string}[]} The files, with paths relative to the build output folder.
 */
export function buildPinFeedFiles(searchPages, pinLimit = PinLimit) {
  const allPinItems = buildPinItems(searchPages, pinLimit);
  const boardFeeds = listPinBoards().map((board) => buildBoardFeed(board, searchPages, pinLimit));
  return [
    { path: PinFeedFile, content: renderFeed(ShopNobiPinFeed, allPinItems) },
    ...boardFeeds.map(({ board, items }) => ({ path: boardFeedFile(board), content: renderFeed(boardChannel(board), items) })),
    { path: PinBoardIndexFile, content: renderBoardIndex(boardFeeds) },
  ];
}

/** Builds one board's items from the pages under its top level. */
function buildBoardFeed(board, searchPages, pinLimit) {
  const boardPages = searchPages.filter((page) => readTopLevel(page.categoryPath) === board.topLevel);
  return { board, items: buildPinItems(boardPages, pinLimit) };
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
function buildPinItems(searchPages, pinLimit) {
  const allowedPages = searchPages.filter((page) => readTopLevel(page.categoryPath) !== BannedTopLevel);
  return sortNewestFirst(allowedPages)
    .map(buildPinItem)
    .filter(Boolean)
    .slice(0, pinLimit);
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
function sortNewestFirst(searchPages) {
  const readTime = (page) => Date.parse(page.refreshedAt ?? "") || 0;
  return [...searchPages].sort((first, second) => readTime(second) - readTime(first));
}

/** Builds one feed item, or returns null when the page has no https product picture. */
function buildPinItem(page) {
  const imageUrl = findLargePreviewImage(page.products);
  if (!imageUrl) {
    return null;
  }

  // No pubDate: a nightly refresh does not mean the page changed, so its refresh time is not a publish date.
  const link = searchPageUrl(page.slug);
  const description = buildSearchPageSeo(page).description;
  const pinDescription = page.products.some((product) => product.paidLink === true)
    ? `${CommissionNotice} from some links on this page. ${description}`
    : description;
  return [
    `    <item>`,
    `      <title>${htmlEscape(page.title)}</title>`,
    `      <link>${htmlEscape(link)}</link>`,
    `      <description>${htmlEscape(pinDescription)}</description>`,
    `      <guid isPermaLink="true">${htmlEscape(link)}</guid>`,
    `      <media:content url="${htmlEscape(imageUrl)}" medium="image"/>`,
    `    </item>`,
  ].join("\n");
}
