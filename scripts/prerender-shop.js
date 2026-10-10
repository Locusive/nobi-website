// Builds the Shop Nobi search pages (nobi.ai/shop/s/<slug>) after
// prerender-pages.js. Each page carries its products in the HTML, so
// crawlers that do not run JavaScript still see them. It also writes
// sitemap-shop.xml, redirects for retired pages and a llms.txt section.
//
// The page data comes from one public JSON file (see
// shop-nobi-search-pages-data.js). If the download fails, the build fails, so
// Cloudflare keeps the last good deploy live.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { renderPage, toScriptJson, writePageFiles } from "./page-html.js";
import { loadPageRenderer } from "./page-renderer.js";
import { downloadSearchPagesData, readSearchPagesDataUrl } from "./shop-nobi-search-pages-data.js";
import { buildSearchPages } from "./shop-nobi-search-page-view.js";
import { appendLlmsTxtSection, appendRedirects, buildRetiredRedirects, buildShopNobiSitemap } from "./shop-nobi-search-page-listings.js";
import { buildSearchPageSeo, SearchPageDataElementId } from "../src/utils/shopNobiSearchPage.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const Dist = join(__dirname, "..", "dist");
const SearchPageRobots = "index, follow";

/**
 * Downloads the page data and writes every search page and listing file into the build output.
 *
 * @param {{dataUrl: string, distDir: string}} options Where the data comes from and where the build output is.
 * @returns {Promise<number>} How many pages were written.
 */
export async function prerenderShopNobiSearchPages({ dataUrl, distDir }) {
  const { pages: downloadedPages, retired } = await downloadSearchPagesData(dataUrl);
  const pages = buildSearchPages(downloadedPages);

  await writeSearchPages(pages, distDir);

  writeFileSync(join(distDir, "sitemap-shop.xml"), buildShopNobiSitemap(pages));
  updateFile(join(distDir, "_redirects"), (text) => appendRedirects(text, buildRetiredRedirects(retired, pages)));
  updateFile(join(distDir, "llms.txt"), (text) => appendLlmsTxtSection(text, pages));
  return pages.length;
}

/** Writes both file forms of every search page. */
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
  for (const page of pages) {
    const html = renderSearchPage(page, shell, renderSearchPageBody(page));
    writePageFiles(distDir, buildSearchPageSeo(page).path, html);
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
  const dataUrl = readSearchPagesDataUrl(process.env);
  try {
    const count = await prerenderShopNobiSearchPages({ dataUrl, distDir: Dist });
    console.log(`prerender-shop: wrote ${count} Shop Nobi search page(s) from ${dataUrl}`);
  } catch (error) {
    console.error(`prerender-shop: failed, so the build stops: ${error.message}`);
    process.exitCode = 1;
  }
}

// Run only when executed directly, not when the tests import this file.
if (process.argv[1] && process.argv[1].endsWith("prerender-shop.js")) {
  await main();
}
