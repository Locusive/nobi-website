// Builds the Shop Nobi search pages (/shop/s/<slug>) with their products in the HTML, plus their sitemap,
// redirects and llms.txt section. A failed fetch from the API fails the build, so the last good deploy stays live.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { renderPage, toScriptJson } from "./page-html.js";
import { loadPageRenderer } from "./page-renderer.js";
import { fetchSearchPagesData, readApiBaseUrl } from "./shop-nobi-search-pages-api.js";
import { buildSearchPages } from "./shop-nobi-search-page-view.js";
import { appendLlmsTxtSection, appendRedirects, buildRetiredRedirects, buildShopNobiSitemap } from "./shop-nobi-search-page-listings.js";
import { buildSearchPageSeo, SearchPageDataElementId } from "../src/utils/shopNobiSearchPage.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const Dist = join(__dirname, "..", "dist");
const SearchPageRobots = "index, follow";
// Cloudflare's Free plan allows 20,000 files per Pages site and 2,000 static redirects; these leave room.
const DistFileLimit = 19000;
const RedirectRuleLimit = 1900;
const ShopNobiSitemapFile = "sitemap-shop.xml";

/**
 * Downloads the page data and writes the search pages and listing files into the build output, keeping the
 * output within the file and redirect limits.
 *
 * @param {{apiBaseUrl: string, distDir: string, fileLimit?: number, redirectRuleLimit?: number}} options The settings.
 * @returns {Promise<number>} How many pages were written.
 */
export async function prerenderShopNobiSearchPages({
  apiBaseUrl,
  distDir,
  fileLimit = DistFileLimit,
  redirectRuleLimit = RedirectRuleLimit,
}) {
  const { pages: fetchedPages, retired } = await fetchSearchPagesData(apiBaseUrl);
  const { pages, leftOutCount } = buildSearchPages(fetchedPages, countPageRoom(distDir, fileLimit));
  if (leftOutCount > 0) {
    console.warn(`prerender-shop: left out ${leftOutCount} page(s) to stay within ${fileLimit} files.`);
  }

  await writeSearchPages(pages, distDir);

  const redirectLines = buildRetiredRedirects(retired, pages);
  writeFileSync(join(distDir, ShopNobiSitemapFile), buildShopNobiSitemap(pages));
  updateFile(join(distDir, "_redirects"), (text) => appendRedirects(text, redirectLines, redirectRuleLimit));
  updateFile(join(distDir, "llms.txt"), (text) => appendLlmsTxtSection(text, pages));
  return pages.length;
}

/** Returns how many pages fit: one file each, after the files already built and the Shop Nobi sitemap. */
function countPageRoom(distDir, fileLimit) {
  const sitemapFileCount = existsSync(join(distDir, ShopNobiSitemapFile)) ? 0 : 1;
  return fileLimit - countFiles(distDir) - sitemapFileCount;
}

/** Counts every file in a folder and the folders inside it. */
function countFiles(folder) {
  return readdirSync(folder, { withFileTypes: true })
    .map((entry) => (entry.isDirectory() ? countFiles(join(folder, entry.name)) : 1))
    .reduce((total, count) => total + count, 0);
}

/**
 * Writes each search page to <slug>.html only. Cloudflare serves /shop/s/<slug> from that file and redirects
 * /shop/s/<slug>/ to it, so a second copy would only use up the file limit.
 */
async function writeSearchPages(pages, distDir) {
  if (pages.length === 0) {
    return;
  }

  const shellPath = join(distDir, "index.html");
  if (!existsSync(shellPath)) {
    throw new Error("prerender-shop: dist/index.html not found; run vite build first.");
  }

  const shell = readFileSync(shellPath, "utf8");
  const { renderSearchPageBody } = await loadPageRenderer();
  mkdirSync(join(distDir, "shop", "s"), { recursive: true });
  for (const page of pages) {
    const html = renderSearchPage(page, shell, renderSearchPageBody(page));
    writeFileSync(join(distDir, `${buildSearchPageSeo(page).path}.html`), html);
  }
}

/**
 * Builds one page's HTML. The page data goes first in the head so the assistant bundle's start-up code, which
 * reads the page's search from it, always finds it.
 */
function renderSearchPage(page, shell, body) {
  const head = { ...buildSearchPageSeo(page), robots: SearchPageRobots };
  const html = renderPage(head, shell, body);
  const dataElement = `<script type="application/json" id="${SearchPageDataElementId}">${toScriptJson(page)}</script>`;
  return html.replace("<head>", () => `<head>\n    ${dataElement}`);
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
