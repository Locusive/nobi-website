// Runs last in the build: tells IndexNow about the Shop Nobi pages that are new or changed since the sitemap
// the live site serves. It never fails the build and saves a public URL/status receipt.

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildIndexNowBodies, IndexNowBatchSize, isCanonicalSiteUrl, isUtilityUrl, readSitemapEntries, readSkipReason, selectChangedUrls } from "./shop-nobi-indexnow.js";
import { readUtilityRevisions, UtilityRevisionFile } from "./utility-content-revision.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const Dist = join(__dirname, "..", "dist");
const ShopNobiSitemapFile = "sitemap-shop.xml";
const PageSitemapFile = "sitemap-pages.xml";
const LiveSitemapUrl = "https://nobi.ai/sitemap-shop.xml";
const LivePageSitemapUrl = "https://nobi.ai/sitemap-pages.xml";
const LiveUtilityRevisionUrl = `https://nobi.ai/${UtilityRevisionFile}`;
const IndexNowEndpoint = "https://api.indexnow.org/indexnow";
const RequestTimeoutMs = 15000;

/**
 * Submits new authored addresses and new or changed Shop Nobi and utility addresses to IndexNow, in batches. The live site serves the last
 * deploy while this build runs, so its sitemap is the one to compare against.
 *
 * @param {{env: object, distDir: string, liveSitemapUrl?: string, livePageSitemapUrl?: string, liveUtilityRevisionUrl?: string, endpointUrl?: string, batchSize?: number}} options The settings.
 * @returns {Promise<object>} Counts, stream skips and actual per-batch URL/status outcomes.
 */
export async function submitChangedShopNobiPages(options) {
  try {
    const result = await selectAndSubmitPages(options);
    saveReceipt(options.distDir, result);
    return result;
  } catch (error) {
    saveReceipt(options.distDir, { ...skippedResult("build input or submission step error"), errorCode: error.code ?? "INVALID_BUILD_INPUT" });
    throw error;
  }
}

/** Saves outcomes without response bodies, request keys or authentication values. */
function saveReceipt(distDir, result) {
  writeFileSync(join(distDir, "indexnow-submission-receipt.json"), JSON.stringify({
    engine: "IndexNow", recordedAt: new Date().toISOString(), ...result,
    indexingConfirmed: false,
  }, null, 2) + "\n");
}

/** Selects each independent notification stream before submitting deduplicated batches. */
async function selectAndSubmitPages({
  env,
  distDir,
  liveSitemapUrl = LiveSitemapUrl,
  livePageSitemapUrl = LivePageSitemapUrl,
  liveUtilityRevisionUrl = LiveUtilityRevisionUrl,
  endpointUrl = IndexNowEndpoint,
  batchSize = IndexNowBatchSize,
}) {
  const skipReason = readSkipReason(env);
  if (skipReason) {
    return skippedResult(skipReason);
  }
  const previousEntries = await readLiveSitemapEntries(liveSitemapUrl);
  const shopSkipReason = previousEntries.size ? null : "the live Shop sitemap could not be read";
  const currentEntries = readBuiltSitemapEntries(distDir, ShopNobiSitemapFile, isCanonicalSiteUrl);
  const currentPageEntries = readBuiltSitemapEntries(distDir, PageSitemapFile, isCanonicalSiteUrl);
  const previousPages = await readLiveSitemapEntries(livePageSitemapUrl);
  const authoredSkipReason = previousPages.size ? null : "the live authored-page sitemap could not be read";
  const newAuthoredUrls = authoredSkipReason ? [] : [...currentPageEntries.keys()].filter((url) => !isUtilityUrl(url) && !previousPages.has(url));
  const utilities = new Map([...currentPageEntries].filter(([url]) => isUtilityUrl(url)));
  const utilityChanges = await selectUtilityChanges(distDir, utilities, previousPages, liveUtilityRevisionUrl);
  const changedUrls = [...new Set([
    ...(shopSkipReason ? [] : selectChangedUrls(previousEntries, currentEntries)),
    ...newAuthoredUrls,
    ...utilityChanges.urls,
  ])];
  const bodies = buildIndexNowBodies(changedUrls, batchSize);
  const batches = [];
  for (const body of bodies) {
    batches.push({ urls: body.urlList, ...await postBatch(endpointUrl, body) });
  }
  return { skipReason: shopSkipReason && authoredSkipReason ? "the live sitemaps could not be read" : null, ...(shopSkipReason ? { shopSkipReason } : {}), changedCount: changedUrls.length, batchCount: bodies.length, failedBatchCount: batches.filter((batch) => batch.status === "failed").length, batches,
    ...(authoredSkipReason ? { authoredSkipReason } : {}),
    ...(utilityChanges.skipReason ? { utilitySkipReason: utilityChanges.skipReason } : {}) };
}

/** Compares actual delivered utility revisions; unknown live metadata skips this stream without replaying it. */
async function selectUtilityChanges(distDir, currentPages, previousPages, liveUtilityRevisionUrl) {
  const currentRevisions = readUtilityRevisions(readFileSync(join(distDir, UtilityRevisionFile), "utf8"));
  if ([...currentPages.keys()].some((url) => !currentRevisions.has(url))) throw new Error("Built utility revision metadata is incomplete.");
  if (previousPages.size === 0) return { urls: [], skipReason: "the live authored-page sitemap could not be read" };
  try {
    const response = await fetch(liveUtilityRevisionUrl, { signal: AbortSignal.timeout(RequestTimeoutMs) });
    if (!response.ok) throw new Error("Unreadable utility revisions.");
    const previousRevisions = readUtilityRevisions(await response.text());
    if ([...previousPages.keys()].filter(isUtilityUrl).some((url) => !previousRevisions.has(url))) {
      throw new Error("Incomplete utility revisions.");
    }
    return { urls: [...currentPages.keys()].filter((url) => currentRevisions.get(url) !== previousRevisions.get(url)), skipReason: null };
  } catch {
    return { urls: [], skipReason: "the live utility revision metadata could not be read or validated" };
  }
}

/** Reads built destinations within the allowed sitemap scope; a missing file remains an explicit build-step error. */
function readBuiltSitemapEntries(distDir, filename, acceptsUrl) {
  const entries = readSitemapEntries(readFileSync(join(distDir, filename), "utf8"));
  return new Map([...entries].filter(([address]) => acceptsUrl(address)));
}

/** Reads the live sitemap's entries, or none when it cannot be fetched. */
async function readLiveSitemapEntries(liveSitemapUrl) {
  try {
    const response = await fetch(liveSitemapUrl, { signal: AbortSignal.timeout(RequestTimeoutMs) });
    if (response.status < 200 || response.status >= 300) {
      return new Map();
    }
    return readSitemapEntries(await response.text());
  } catch {
    return new Map();
  }
}

/** Sends one batch and records whether IndexNow took it. 202 means it took it and checks the key later. */
async function postBatch(endpointUrl, body) {
  try {
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(RequestTimeoutMs),
    });
    if (![200, 202].includes(response.status)) {
      console.warn(`indexnow: a batch of ${body.urlList.length} URL(s) returned status ${response.status}.`);
      return { status: "failed", httpStatus: response.status, reason: "HTTP_ERROR" };
    }
    return { status: "accepted", httpStatus: response.status, reason: null };
  } catch (error) {
    console.warn(`indexnow: a batch of ${body.urlList.length} URL(s) failed: ${error.cause?.code ?? error.name}.`);
    return { status: "failed", httpStatus: null, reason: "REQUEST_FAILED" };
  }
}

/** Builds the result for a build that submits nothing. */
function skippedResult(skipReason) {
  return { skipReason, changedCount: 0, batchCount: 0, failedBatchCount: 0, batches: [] };
}

/** Writes one line that says what the step did. */
function logResult(result) {
  if (result.skipReason) {
    console.log(`indexnow: skipped, ${result.skipReason}.`);
    return;
  }
  if (result.shopSkipReason) console.warn(`indexnow: Shop notifications skipped, ${result.shopSkipReason}.`);
  if (result.authoredSkipReason) console.warn(`indexnow: authored notifications skipped, ${result.authoredSkipReason}.`);
  if (result.utilitySkipReason) console.warn(`indexnow: utility notifications skipped, ${result.utilitySkipReason}.`);
  const sentCount = result.batchCount - result.failedBatchCount;
  console.log(`indexnow: ${result.changedCount} new or changed Shop Nobi or authored URL(s); ${sentCount} of ${result.batchCount} batch(es) accepted.`);
}

/** Runs the step. Any error is logged and the build goes on. */
async function main() {
  try {
    logResult(await submitChangedShopNobiPages({ env: process.env, distDir: Dist }));
  } catch (error) {
    console.warn(`indexnow: skipped after an error: ${error.message}`);
  }
}

// Run only when executed directly, not when the tests import this file.
if (process.argv[1] && process.argv[1].endsWith("submit-indexnow.js")) {
  await main();
}
