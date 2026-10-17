// Runs last in the build: tells IndexNow about the Shop Nobi pages that are new or changed since the sitemap
// the live site serves. It never fails the build and logs counts only.

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildIndexNowBodies, IndexNowBatchSize, isCanonicalSiteUrl, isUtilityUrl, readSitemapEntries, readSkipReason, selectChangedUrls } from "./shop-nobi-indexnow.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const Dist = join(__dirname, "..", "dist");
const ShopNobiSitemapFile = "sitemap-shop.xml";
const PageSitemapFile = "sitemap-pages.xml";
const LiveSitemapUrl = "https://nobi.ai/sitemap-shop.xml";
const LivePageSitemapUrl = "https://nobi.ai/sitemap-pages.xml";
const IndexNowEndpoint = "https://api.indexnow.org/indexnow";
const RequestTimeoutMs = 15000;

/**
 * Submits new or changed Shop Nobi and authored utility addresses to IndexNow, in batches. The live site serves the last
 * deploy while this build runs, so its sitemap is the one to compare against.
 *
 * @param {{env: object, distDir: string, liveSitemapUrl?: string, livePageSitemapUrl?: string, endpointUrl?: string, batchSize?: number}} options The settings.
 * @returns {Promise<{skipReason: string | null, changedCount: number, batchCount: number, failedBatchCount: number}>} What happened.
 */
export async function submitChangedShopNobiPages({
  env,
  distDir,
  liveSitemapUrl = LiveSitemapUrl,
  livePageSitemapUrl = LivePageSitemapUrl,
  endpointUrl = IndexNowEndpoint,
  batchSize = IndexNowBatchSize,
}) {
  const skipReason = readSkipReason(env);
  if (skipReason) {
    return skippedResult(skipReason);
  }
  const previousEntries = await readLiveSitemapEntries(liveSitemapUrl);
  if (previousEntries.size === 0) {
    return skippedResult("the live sitemap could not be read");
  }
  const previousPageEntries = await readLiveSitemapEntries(livePageSitemapUrl);
  if (previousPageEntries.size === 0) {
    return skippedResult("the live authored-page sitemap could not be read");
  }

  const currentEntries = readBuiltSitemapEntries(distDir, ShopNobiSitemapFile, isCanonicalSiteUrl);
  const currentPageEntries = readBuiltSitemapEntries(distDir, PageSitemapFile, isUtilityUrl);
  const changedUrls = [...new Set([
    ...selectChangedUrls(previousEntries, currentEntries),
    ...selectChangedUrls(previousPageEntries, currentPageEntries),
  ])];
  const bodies = buildIndexNowBodies(changedUrls, batchSize);
  let failedBatchCount = 0;
  for (const body of bodies) {
    failedBatchCount += (await postBatch(endpointUrl, body)) ? 0 : 1;
  }
  return { skipReason: null, changedCount: changedUrls.length, batchCount: bodies.length, failedBatchCount };
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

/** Sends one batch and returns whether IndexNow took it. 202 means it took it and checks the key later. */
async function postBatch(endpointUrl, body) {
  try {
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(RequestTimeoutMs),
    });
    if (response.status < 200 || response.status >= 300) {
      console.warn(`indexnow: a batch of ${body.urlList.length} URL(s) returned status ${response.status}.`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn(`indexnow: a batch of ${body.urlList.length} URL(s) failed: ${error.cause?.code ?? error.name}.`);
    return false;
  }
}

/** Builds the result for a build that submits nothing. */
function skippedResult(skipReason) {
  return { skipReason, changedCount: 0, batchCount: 0, failedBatchCount: 0 };
}

/** Writes one line that says what the step did. */
function logResult(result) {
  if (result.skipReason) {
    console.log(`indexnow: skipped, ${result.skipReason}.`);
    return;
  }
  const sentCount = result.batchCount - result.failedBatchCount;
  console.log(`indexnow: ${result.changedCount} new or changed Shop Nobi or utility URL(s); ${sentCount} of ${result.batchCount} batch(es) accepted.`);
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
