// Renders the prebuilt Shop Nobi pages and writes them into the build output: each search, category and sale page
// as one file, the sale hub, and /shop again with its popular searches.

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { renderPage, toScriptJson, writeFlatPageFile, writePageFiles } from "./page-html.js";
import { loadPageRenderer } from "./page-renderer.js";
import { ShopNobiPageHead, ShopNobiPinFeed } from "../src/utils/shopNobiPage.js";
import { searchPagePath } from "../src/utils/shopNobiSearchPage.js";
import { categoryPagePath } from "../src/utils/shopNobiCategoryPage.js";
import { salePagePath, SaleHubPath } from "../src/utils/shopNobiSalePage.js";
import { buildPrebuiltContentSeo, PrebuiltContentElementId, PrebuiltContentKind } from "../src/utils/shopNobiPrebuiltContent.js";
import { IndexableRobots } from "../src/utils/previewImage.js";

/**
 * Writes every prebuilt page in the plan. Nothing is written when there are no search pages and no sale pages.
 *
 * @param {{searchPages: object[], categoryPages: object[], popularSearches: object, salePages: object[], saleHub: object | null}} plan What to build.
 * @param {string} distDir The build output folder.
 */
export async function writePrebuiltPages(plan, distDir) {
  if (plan.searchPages.length === 0 && plan.salePages.length === 0) {
    return;
  }

  const shell = readShell(distDir);
  const { renderPrebuiltPageBody } = await loadPageRenderer();
  const renderContent = (content) => {
    const body = renderPrebuiltPageBody(content);
    return renderPrebuiltPage(content, shell, body);
  };

  for (const page of plan.searchPages) {
    const content = { kind: PrebuiltContentKind.SearchPage, path: searchPagePath(page.slug), data: page };
    const html = renderContent(content);
    writeFlatPageFile(distDir, content.path, html);
  }
  for (const category of plan.categoryPages) {
    const content = { kind: PrebuiltContentKind.CategoryPage, path: categoryPagePath(category.slug), data: category };
    const html = renderContent(content);
    writeFlatPageFile(distDir, content.path, html);
  }
  writeSalePages(plan, distDir, renderContent);

  const shopNobiContent = { kind: PrebuiltContentKind.PopularSearches, path: ShopNobiPageHead.path, data: plan.popularSearches };
  const shopNobiHtml = renderContent(shopNobiContent);
  writePageFiles(distDir, shopNobiContent.path, shopNobiHtml);
}

/** Writes each sale page as one file, and the sale hub, like /shop, as two files beside the folder of sale pages. */
function writeSalePages(plan, distDir, renderContent) {
  for (const page of plan.salePages) {
    const content = { kind: PrebuiltContentKind.SalePage, path: salePagePath(page.slug), data: page };
    writeFlatPageFile(distDir, content.path, renderContent(content));
  }
  if (plan.saleHub) {
    const content = { kind: PrebuiltContentKind.SaleHub, path: SaleHubPath, data: plan.saleHub };
    writePageFiles(distDir, content.path, renderContent(content));
  }
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
  const head = content.kind === PrebuiltContentKind.PopularSearches
    ? ShopNobiPageHead
    : { ...buildPrebuiltContentSeo(content), robots: IndexableRobots, feed: ShopNobiPinFeed };
  const html = renderPage(head, shell, body);
  const contentElement = `<script type="application/json" id="${PrebuiltContentElementId}">${toScriptJson(content)}</script>`;
  return html.replace("<head>", () => `<head>\n    ${contentElement}`);
}
