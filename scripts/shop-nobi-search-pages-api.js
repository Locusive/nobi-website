// Fetches the Shop Nobi page data from the API: the search pages, shaped as {generatedAt, pages: [...], retired: [...]},
// and the sale pages, shaped as {generatedAt, pages: [...]}.

import { BannedTopLevel, readTopLevel } from "../src/utils/shopNobiPinBoard.js";

const DefaultApiBaseUrl = "https://api.nobi.ai";
const SearchPagesRoute = "/v1/shop/pages";
const SalePagesRoute = "/v1/shop/sale-pages";
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
 * @returns {Promise<{pages: object[], retired: object[]}>} The live pages and the retired slugs.
 */
export async function fetchSearchPagesData(apiBaseUrl) {
  const { routeUrl, data } = await fetchRoute(apiBaseUrl, SearchPagesRoute);
  if (!Array.isArray(data?.pages) || !Array.isArray(data?.retired)) {
    throw new Error(`${routeUrl} has no "pages" and "retired" lists.`);
  }
  return { pages: keepAllowedPages(data.pages), retired: data.retired };
}

/**
 * Fetches and checks the sale pages. Any failure throws, like the search pages, so the last good deploy stays live.
 *
 * @param {string} apiBaseUrl The API base address.
 * @returns {Promise<{generatedAt: string | null, pages: object[]}>} When the API built them, and the sale pages.
 */
export async function fetchSalePagesData(apiBaseUrl) {
  const { routeUrl, data } = await fetchRoute(apiBaseUrl, SalePagesRoute);
  if (!Array.isArray(data?.pages)) {
    throw new Error(`${routeUrl} has no "pages" list.`);
  }
  const generatedAt = typeof data.generatedAt === "string" ? data.generatedAt : null;
  return { generatedAt, pages: keepAllowedPages(data.pages) };
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

/** Fetches one route's JSON, throwing on a status outside 200 to 299. */
async function fetchRoute(apiBaseUrl, route) {
  const routeUrl = `${apiBaseUrl.replace(/\/+$/, "")}${route}`;
  const response = await fetch(routeUrl, { signal: AbortSignal.timeout(FetchTimeoutMs) });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Fetching ${routeUrl} returned status ${response.status}.`);
  }
  return { routeUrl, data: await response.json() };
}
