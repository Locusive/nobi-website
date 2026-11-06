// Builds the prebuilt Shop Nobi pages, their web stories, and their sitemap, Pinterest feeds, redirects and
// llms.txt section from the API's page data. A failed fetch fails the build, so the last good deploy stays live.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchSearchPagesData, readApiBaseUrl } from "./shop-nobi-search-pages-api.js";
import { buildSearchPages, selectUsablePages } from "./shop-nobi-search-page-view.js";
import { buildCategoryPages, countCategories, linkCategoryPages } from "./shop-nobi-category-page-view.js";
import { buildBodumProductPage } from "./shop-nobi-bodum-product.js";
import { BodumPath } from "../src/utils/shopNobiProductPage.js";
import { writePrebuiltPages } from "./shop-nobi-page-files.js";
import { writeFlatPageFile } from "./page-html.js";
import { renderPage, toScriptJson } from "./page-html.js";
import { loadPageRenderer } from "./page-renderer.js";
import { buildGiftGuides } from "./shop-gift-guide-plan.js";
import { GiftGuideTopics } from "../src/content/shopGiftGuideTopics.js";
import { giftGuideSeo, GiftGuideDataId } from "../src/utils/shopGiftGuide.js";
import { linkWebStories, planWebStories } from "./shop-nobi-web-story-plan.js";
import { renderWebStory } from "./shop-nobi-web-story.js";
import { planEditorialGuideStories } from "./shop-nobi-editorial-stories.js";
import { buildEditorialFeed } from "./shop-nobi-editorial-feed.js";
import { webStoryPath } from "../src/utils/shopNobiWebStory.js";
import { fetchImageSize as fetchImageSizeOnline } from "./image-size.js";
import { buildPinFeedFiles, listPinFeedFiles } from "./shop-nobi-pin-feed.js";
import { appendLlmsTxtSection, appendRedirects, buildRetiredRedirects, buildShopNobiSitemap, readValidTime } from "./shop-nobi-search-page-listings.js";

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
 * @param {{apiBaseUrl: string, distDir: string, fileLimit?: number, redirectRuleLimit?: number, fetchImageSize?: Function}} options The settings.
 * @returns {Promise<number>} How many search pages were written.
 */
export async function prerenderShopNobiSearchPages({
  apiBaseUrl,
  distDir,
  fileLimit = DistFileLimit,
  redirectRuleLimit = RedirectRuleLimit,
  fetchImageSize = fetchImageSizeOnline,
  fetchOffer = fetch,
  now = Date.now,
  privateDocumentPath,
}) {
  const { generatedAt, pages: fetchedPages, retired } = await fetchSearchPagesData(apiBaseUrl);
  const fileRoom = countFileRoom(distDir, fileLimit);
  if (fileRoom < 1) throw new Error("No file room for the known product fallback");
  // Preserve the legacy small-file build behavior; production reserves space only when core pages still have room.
  const editorialCount = GiftGuideTopics.filter((topic) => topic.editorial).length;
  const guideRoom = fileRoom > 1 + GiftGuideTopics.length + editorialCount + 20 ? GiftGuideTopics.length : 0;
  const editorialStoryRoom = guideRoom ? editorialCount : 0;
  const plan = await planPages(fetchedPages, Math.max(0, fileRoom - 1 - guideRoom - editorialStoryRoom), fetchImageSize);
  plan.productPage = await buildBodumProductPage(plan.searchPages, { fetchOffer, now, rawPages: fetchedPages });
  if (plan.productPage.products.length) {
    plan.searchPages = plan.searchPages.map(page => page.slug === 'french-presses'
      ? { ...page, productComparisonPath: BodumPath } : page);
  }
  if (plan.leftOutCount > 0) {
    console.warn(`prerender-shop: left out ${plan.leftOutCount} page(s) to stay within ${fileLimit} files.`);
  }
  if (plan.leftOutStoryCount > 0) {
    console.warn(`prerender-shop: left out ${plan.leftOutStoryCount} web story(ies) to stay within ${fileLimit} files.`);
  }
  if (plan.smallPosterCount > 0) {
    console.warn(`prerender-shop: skipped ${plan.smallPosterCount} web story(ies) whose pictures are too small for a poster.`);
  }

  const publishedSearchPages = await writePrebuiltPages(plan, distDir, { privateDocumentPath });
  const giftGuides = buildGiftGuides(publishedSearchPages, generatedAt).slice(0, guideRoom);
  const editorialStories = await planEditorialGuideStories(giftGuides, fetchImageSize);
  const storySlugs = new Set(editorialStories.map(({ guide }) => guide.slug));
  const linkedGuides = giftGuides.map((guide) => storySlugs.has(guide.slug)
    ? { ...guide, storyPath: webStoryPath(`guide-${guide.slug}`) } : guide);
  await writeGiftGuides(distDir, linkedGuides);
  const editorialFeed = buildEditorialFeed(linkedGuides, editorialStories);
  if (editorialFeed) writeFileSync(join(distDir, "shop-nobi-editorial.xml"), editorialFeed);
  writeWebStories(distDir, plan.stories);
  writeEditorialStories(distDir, editorialStories);

  const redirectLines = buildRetiredRedirects(retired, plan.searchPages);
  // The data's own time keeps a fallback lastmod the same across rebuilds of the same data.
  const fallbackLastModified = readValidTime(generatedAt) ?? new Date().toISOString();
  const sitemap = buildShopNobiSitemap(plan.categoryPages, publishedSearchPages, plan.stories, fallbackLastModified, plan.productPage, linkedGuides, editorialStories);
  writeFileSync(join(distDir, ShopNobiSitemapFile), sitemap);
  writePinFeeds(distDir, plan.searchPages);
  updateFile(join(distDir, "_redirects"), (text) => appendRedirects(text, redirectLines, redirectRuleLimit));
  updateFile(join(distDir, "llms.txt"), (text) => appendLlmsTxtSection(text, plan.searchPages));
  return plan.searchPages.length;
}

/** Publish only guides with current eligible products, using the same server-rendered body a visitor sees. */
async function writeGiftGuides(distDir, giftGuides) {
  if (!giftGuides.length) return;
  const shell = readFileSync(join(distDir, "index.html"), "utf8");
  const { renderGiftGuideBody } = await loadPageRenderer();
  for (const guide of giftGuides) {
    const seo = giftGuideSeo(guide);
    const html = renderPage(seo, shell, renderGiftGuideBody(guide));
    const data = `<script type="application/json" id="${GiftGuideDataId}">${toScriptJson(guide)}</script>`;
    writeFlatPageFile(distDir, guide.path, html.replace("<head>", `<head>\n    ${data}`));
  }
  console.log(`prerender-shop: wrote ${giftGuides.length} gift guide(s) with current catalog products.`);
}

/**
 * Decides which pages to build: category pages take the file room first, then search pages in data order, then
 * web stories for the first search pages with enough to show.
 */
async function planPages(fetchedPages, fileRoom, fetchImageSize) {
  const usablePages = selectUsablePages(fetchedPages);
  const categoryLimit = Math.min(countCategories(usablePages), Math.max(0, fileRoom));
  const { pages: unlinkedPages, leftOutCount } = buildSearchPages(usablePages, fileRoom - categoryLimit);
  const categoryPages = buildCategoryPages(unlinkedPages, categoryLimit);

  const storyRoom = fileRoom - categoryPages.length - unlinkedPages.length;
  const storyPlan = await planWebStories(unlinkedPages, storyRoom, fetchImageSize);
  const { stories, leftOutCount: leftOutStoryCount, smallPosterCount } = storyPlan;
  const categoryLinkedPages = linkCategoryPages(unlinkedPages, categoryPages);
  const searchPages = linkWebStories(categoryLinkedPages, stories);
  return { searchPages, categoryPages, stories, leftOutCount, leftOutStoryCount, smallPosterCount };
}

/** Returns how many page files fit after the files already built, the Shop Nobi sitemap and the pin feeds. */
function countFileRoom(distDir, fileLimit) {
  const listingFiles = [ShopNobiSitemapFile, ...listPinFeedFiles()];
  const newListingFiles = listingFiles.filter((file) => !existsSync(join(distDir, file)));
  return fileLimit - countFiles(distDir) - newListingFiles.length;
}

/** Writes each web story as one file at its path. */
function writeWebStories(distDir, stories) {
  for (const { page, plan } of stories) {
    writeFlatPageFile(distDir, webStoryPath(page.slug), renderWebStory(page, plan));
  }
  console.log(`prerender-shop: wrote ${stories.length} web story(ies).`);
}

/** Keeps each preview on its own story URL and sends its final swipe to the full guide. */
function writeEditorialStories(distDir, stories) {
  for (const { page, plan, guide } of stories) {
    writeFlatPageFile(distDir, webStoryPath(page.slug), renderWebStory(page, plan, { endUrl: guide.path }));
  }
  console.log(`prerender-shop: wrote ${stories.length} editorial guide web story(ies).`);
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
    const count = await prerenderShopNobiSearchPages({ apiBaseUrl, distDir: Dist, privateDocumentPath: new URL("../generated/bodum-document.js", import.meta.url) });
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
