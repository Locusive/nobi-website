// Fetches the Shop Nobi search page data from the API, shaped as
// {generatedAt, pages: [...], retired: [...]}.

import { BannedTopLevel, readTopLevel } from "../src/utils/shopNobiPinBoard.js";

const DefaultApiBaseUrl = "https://api.nobi.ai";
const SearchPagesRoute = "/v1/shop/pages";
const FetchTimeoutMs = 60000;

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
 * Fetches and checks the page data. Any failure throws, so the build fails and the last good deploy stays live.
 *
 * @param {string} apiBaseUrl The API base address.
 * @returns {Promise<{generatedAt: unknown, pages: object[], retired: object[]}>} When the API built the data, the live
 *     pages and the retired slugs.
 */
export async function fetchSearchPagesData(apiBaseUrl) {
  const routeUrl = `${apiBaseUrl.replace(/\/+$/, "")}${SearchPagesRoute}`;
  const response = await fetch(routeUrl, { signal: AbortSignal.timeout(FetchTimeoutMs) });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Fetching ${routeUrl} returned status ${response.status}.`);
  }

  const data = await response.json();
  if (!Array.isArray(data?.pages) || !Array.isArray(data?.retired)) {
    throw new Error(`${routeUrl} has no "pages" and "retired" lists.`);
  }
  return { generatedAt: data.generatedAt, pages: keepAllowedPages(data.pages), retired: data.retired };
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
