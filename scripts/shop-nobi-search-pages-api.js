// Fetches the Shop Nobi search page data from the API, shaped as
// {generatedAt, pages: [...], retired: [...]}.

import { BannedTopLevel, readTopLevel } from "../src/utils/shopNobiPinBoard.js";
import { setTimeout as wait } from "node:timers/promises";

const DefaultApiBaseUrl = "https://api.nobi.ai";
const SearchPagesRoute = "/v1/shop/pages";
const FetchTimeoutMs = 60000;
// The API caches its listing for ten minutes; allow another five for an ordinary rebuild.
const MaximumListingAgeMs = 15 * 60 * 1000;
const MaximumClockSkewMs = 60000;
const FreshnessReadAttempts = 4;
const FreshnessWaitMs = 2000;
const GenerationTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

/**
 * Returns the API base address. SHOP_PAGES_API_URL overrides it, for tests and local builds.
 *
 * @param {Record<string, string | undefined>} env The environment variables.
 * @returns {string} The API base address, such as "https://api.nobi.ai".
 */
export function readApiBaseUrl(env) {
  return env.SHOP_PAGES_API_URL || DefaultApiBaseUrl;
}

/**
 * Fetches current page data, allowing legitimate cached listings. Only an old, valid listing is retried, on the
 * same route, while the API finishes its background rebuild. All reads and waits share one minute.
 *
 * @param {string} apiBaseUrl The API base address.
 * @returns {Promise<{generatedAt: unknown, pages: object[], retired: object[]}>} When the API built the data, the live
 *     pages and the retired slugs.
 */
export async function fetchSearchPagesData(apiBaseUrl) {
  const routeUrl = `${apiBaseUrl.replace(/\/+$/, "")}${SearchPagesRoute}`;
  const signal = AbortSignal.timeout(FetchTimeoutMs);
  for (let attempt = 1; attempt <= FreshnessReadAttempts; attempt += 1) {
    const data = await readPageData(routeUrl, signal);
    const generatedAtMillis = readGenerationTime(data.generatedAt);
    if (Date.now() - generatedAtMillis <= MaximumListingAgeMs) {
      return { generatedAt: data.generatedAt, pages: keepAllowedPages(data.pages), retired: data.retired };
    }
    if (attempt < FreshnessReadAttempts) {
      console.warn(`prerender-shop: old API listing (${data.generatedAt}); waiting for its background rebuild.`);
      await wait(FreshnessWaitMs, undefined, { signal });
    }
  }
  throw new Error(`The API page listing is older than 15 minutes after ${FreshnessReadAttempts} reads; the build stops.`);
}

/** Reads one response, preserving HTTP and shape failures instead of retrying them. */
async function readPageData(routeUrl, signal) {
  const response = await fetch(routeUrl, { signal });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Fetching ${routeUrl} returned status ${response.status}.`);
  }

  const data = await response.json();
  if (!Array.isArray(data?.pages) || !Array.isArray(data?.retired)) {
    throw new Error(`${routeUrl} has no "pages" and "retired" lists.`);
  }
  return data;
}

/** Rejects invalid or implausibly future timestamps rather than letting them defeat the freshness bound. */
function readGenerationTime(generatedAt) {
  const timestamp = typeof generatedAt === "string" && GenerationTimePattern.test(generatedAt) ? Date.parse(generatedAt) : NaN;
  if (!Number.isFinite(timestamp) || timestamp > Date.now() + MaximumClockSkewMs) {
    throw new Error("The API page listing has an invalid generatedAt timestamp; the build stops.");
  }
  const canonicalTime = generatedAt.replace(/(?:\.(\d{1,3}))?Z$/, (_, fraction = "") => `.${fraction.padEnd(3, "0")}Z`);
  if (new Date(timestamp).toISOString() !== canonicalTime) {
    throw new Error("The API page listing has an invalid generatedAt timestamp; the build stops.");
  }
  return timestamp;
}

/**
 * Drops pages in the banned top-level category, so no page, sitemap or feed ever shows them.
 *
 * @param {object[]} pages The pages from the API.
 * @returns {object[]} The pages outside the banned category, in their original order.
 */
export function keepAllowedPages(pages) {
  return pages.filter((page) => readTopLevel(page?.categoryPath) !== BannedTopLevel);
}
