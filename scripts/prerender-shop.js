// Builds the prebuilt Shop Nobi pages and their sitemap, Pinterest feeds, redirects and llms.txt section from the
// API's page data. A failed fetch fails the build, so the last good deploy stays live.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchSearchPagesData, readApiBaseUrl } from "./shop-nobi-search-pages-api.js";
import { buildSearchPages, selectUsablePages } from "./shop-nobi-search-page-view.js";
import { buildCategoryPages, buildPopularSearches, countCategories, linkCategoryPages } from "./shop-nobi-category-page-view.js";
import { writePrebuiltPages } from "./shop-nobi-page-files.js";
import { buildPinFeedFiles, listPinFeedFiles } from "./shop-nobi-pin-feed.js";
import { appendLlmsTxtSection, appendRedirects, buildRetiredRedirects, buildShopNobiSitemap } from "./shop-nobi-search-page-listings.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const Dist = join(__dirname, "..", "dist");
// Cloudflare's Free plan allows 20,000 files per Pages site and 2,000 static redirects; these leave room.
const DistFileLimit = 19000;
const RedirectRuleLimit = 1900;
const ShopNobiSitemapFile = "sitemap-shop.xml";

/**
 * Fetches the page data and writes the prebuilt pages and listing files into the build output, keeping the
 * output within the file and redirect limits.
 *
 * @param {{apiBaseUrl: string, distDir: string, fileLimit?: number, redirectRuleLimit?: number}} options The settings.
 * @returns {Promise<number>} How many search pages were written.
 */
export async function prerenderShopNobiSearchPages({
  apiBaseUrl,
  distDir,
  fileLimit = DistFileLimit,
  redirectRuleLimit = RedirectRuleLimit,
}) {
  const { pages: fetchedPages, retired } = await fetchSearchPagesData(apiBaseUrl);
  const plan = planPages(fetchedPages, countFileRoom(distDir, fileLimit));
  if (plan.leftOutCount > 0) {
    console.warn(`prerender-shop: left out ${plan.leftOutCount} page(s) to stay within ${fileLimit} files.`);
  }

  await writePrebuiltPages(plan, distDir);

  const redirectLines = buildRetiredRedirects(retired, plan.searchPages);
  const sitemap = buildShopNobiSitemap(plan.categoryPages, plan.searchPages);
  writeFileSync(join(distDir, ShopNobiSitemapFile), sitemap);
  writePinFeeds(distDir, plan.searchPages);
  updateFile(join(distDir, "_redirects"), (text) => appendRedirects(text, redirectLines, redirectRuleLimit));
  updateFile(join(distDir, "llms.txt"), (text) => appendLlmsTxtSection(text, plan.searchPages));
  return plan.searchPages.length;
}

/** Decides which pages to build: category pages take the file room first, then search pages in data order. */
function planPages(fetchedPages, fileRoom) {
  const usablePages = selectUsablePages(fetchedPages);
  const categoryLimit = Math.min(countCategories(usablePages), Math.max(0, fileRoom));
  const { pages: unlinkedPages, leftOutCount } = buildSearchPages(usablePages, fileRoom - categoryLimit);
  const categoryPages = buildCategoryPages(unlinkedPages, categoryLimit);
  const searchPages = linkCategoryPages(unlinkedPages, categoryPages);
  const popularSearches = buildPopularSearches(searchPages, categoryPages);
  return { searchPages, categoryPages, popularSearches, leftOutCount };
}

/** Returns how many page files fit after the files already built, the Shop Nobi sitemap and the pin feeds. */
function countFileRoom(distDir, fileLimit) {
  const listingFiles = [ShopNobiSitemapFile, ...listPinFeedFiles()];
  const newListingFiles = listingFiles.filter((file) => !existsSync(join(distDir, file)));
  return fileLimit - countFiles(distDir) - newListingFiles.length;
}

/** Writes the Pinterest feeds of search pages and their list. */
function writePinFeeds(distDir, searchPages) {
  for (const file of buildPinFeedFiles(searchPages)) {
    const filePath = join(distDir, file.path);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, file.content);
  }
}

/** Counts every file in a folder and the folders inside it. */
function countFiles(folder) {
  return readdirSync(folder, { withFileTypes: true })
    .map((entry) => (entry.isDirectory() ? countFiles(join(folder, entry.name)) : 1))
    .reduce((total, count) => total + count, 0);
}

/** Rewrites a build output file through the given change. */
function updateFile(path, change) {
  writeFileSync(path, change(readFileSync(path, "utf8")));
}

/** Runs the build step and fails the build on any error. */
async function main() {
  const apiBaseUrl = readApiBaseUrl(process.env);
  try {
    const count = await prerenderShopNobiSearchPages({ apiBaseUrl, distDir: Dist });
    console.log(`prerender-shop: wrote ${count} Shop Nobi search page(s) from ${apiBaseUrl}`);
  } catch (error) {
    console.error(`prerender-shop: failed, so the build stops: ${error.message}`);
    process.exitCode = 1;
  }
}

// Run only when executed directly, not when the tests import this file.
if (process.argv[1] && process.argv[1].endsWith("prerender-shop.js")) {
  await main();
}
