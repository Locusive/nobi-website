// Renders the prebuilt Shop Nobi pages and writes them into the build output: each search page and category
// page as one file, and /shop again with its popular searches.

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { renderPage, toScriptJson, writeFlatPageFile, writePageFiles } from "./page-html.js";
import { loadPageRenderer } from "./page-renderer.js";
import { ShopNobiPageHead, ShopNobiPinFeed } from "../src/utils/shopNobiPage.js";
import { searchPagePath } from "../src/utils/shopNobiSearchPage.js";
import { categoryPagePath } from "../src/utils/shopNobiCategoryPage.js";
import { buildPrebuiltContentSeo, PrebuiltContentElementId, PrebuiltContentKind } from "../src/utils/shopNobiPrebuiltContent.js";
import { BodumPath, withoutProductPrices } from "../src/utils/shopNobiProductPage.js";
import { IndexableRobots } from "../src/utils/previewImage.js";
import { withAuthoredSearchPageCopy } from "./shop-nobi-editorial-copy.js";

/**
 * Writes planned search/category pages and the known-product fallback, when present.
 *
 * @param {{searchPages: object[], categoryPages: object[], popularSearches: object}} plan What to build.
 * @param {string} distDir The build output folder.
 * @returns {Promise<object[]>} The actual published search pages, shared with the search sitemap.
 */
export async function writePrebuiltPages(plan, distDir, { privateDocumentPath = null } = {}) {
  const documentPath = privateDocumentPath instanceof URL ? fileURLToPath(privateDocumentPath) : privateDocumentPath;
  if (documentPath) {
    mkdirSync(dirname(documentPath), { recursive: true });
    writeFileSync(documentPath, "export default null;\n");
  }
  if (plan.searchPages.length === 0 && !plan.productPage) {
    return [];
  }

  const shell = readShell(distDir);
  const { renderPrebuiltPageBody } = await loadPageRenderer();
  const renderContent = (content) => {
    const body = renderPrebuiltPageBody(content);
    return renderPrebuiltPage(content, shell, body);
  };

  const publishedSearchPages = plan.searchPages.map(withAuthoredSearchPageCopy);
  for (const page of publishedSearchPages) {
    const content = {
      kind: PrebuiltContentKind.SearchPage,
      path: searchPagePath(page.slug),
      data: page,
    };
    const html = renderContent(content);
    writeFlatPageFile(distDir, content.path, html);
  }
  for (const category of plan.categoryPages) {
    const content = { kind: PrebuiltContentKind.CategoryPage, path: categoryPagePath(category.slug), data: category };
    const html = renderContent(content);
    writeFlatPageFile(distDir, content.path, html);
  }

  if (plan.productPage) {
    const content = { kind: PrebuiltContentKind.ProductPage, path: BodumPath, data: plan.productPage };
    const fallback = { ...content, data: withoutProductPrices(content.data) };
    // Only the unpriced document is publicly addressable as a static asset. Fresh HTML is bundled into the Function.
    writeFlatPageFile(distDir, BodumPath, renderContent(fallback));
    const privateDocument = { html: renderContent(content), offersCheckedAt: content.data.offersCheckedAt,
      offersExpireAt: content.data.offersExpireAt };
    if (documentPath) writeFileSync(documentPath, `export default ${JSON.stringify(privateDocument)};\n`);
  }

  if (plan.searchPages.length === 0) return [];

  const shopNobiContent = { kind: PrebuiltContentKind.PopularSearches, path: ShopNobiPageHead.path, data: plan.popularSearches };
  const shopNobiHtml = renderContent(shopNobiContent);
  writePageFiles(distDir, shopNobiContent.path, shopNobiHtml);
  return publishedSearchPages;
}

/** Reads the built client shell. */
function readShell(distDir) {
  const shellPath = join(distDir, "index.html");
  if (!existsSync(shellPath)) {
    throw new Error("prerender-shop: dist/index.html not found; run vite build first.");
  }
  return readFileSync(shellPath, "utf8");
}

/**
 * Builds one page's HTML. The embedded content goes first in the head so the assistant bundle's start-up code,
 * which reads a search page's search from it, always finds it.
 */
function renderPrebuiltPage(content, shell, body) {
  const seo = buildPrebuiltContentSeo(content);
  const head = content.kind === PrebuiltContentKind.PopularSearches
    ? ShopNobiPageHead
    : { ...seo, robots: seo.noindex ? "noindex, nofollow" : IndexableRobots, feed: ShopNobiPinFeed };
  const html = renderPage(head, shell, body);
  const contentElement = `<script type="application/json" id="${PrebuiltContentElementId}">${toScriptJson(content)}</script>`;
  return html.replace("<head>", () => `<head>\n    ${contentElement}`);
}
