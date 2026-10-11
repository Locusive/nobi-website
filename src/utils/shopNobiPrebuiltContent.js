// The build embeds each prebuilt Shop Nobi page's data in its HTML as {kind, path, data}, so ShopPage can
// show and describe the same content in the browser until the live search takes over.

import { ShopNobiPageSeo } from "./shopNobiPage.js";
import { buildSearchPageSeo } from "./shopNobiSearchPage.js";
import { buildCategoryPageSeo } from "./shopNobiCategoryPage.js";

/** The id of the script element that holds the embedded data. index.html reads it too. */
export const PrebuiltContentElementId = "shop-nobi-prebuilt-content";

/** The kinds of prebuilt content. index.html checks for "search-page". */
export const PrebuiltContentKind = {
  SearchPage: "search-page",
  CategoryPage: "category-page",
  PopularSearches: "popular-searches",
};

/**
 * Reads the embedded content when it belongs to the current path.
 *
 * @param {string} pathname The current path.
 * @returns {{kind: string, path: string, data: object} | null} The content, or null when there is none for this path.
 */
export function readEmbeddedPrebuiltContent(pathname) {
  if (typeof document === "undefined") {
    return null;
  }

  const element = document.getElementById(PrebuiltContentElementId);
  if (!element) {
    return null;
  }

  const content = JSON.parse(element.textContent);
  const currentPath = pathname.replace(/(.)\/+$/, "$1");
  return content.path === currentPath ? content : null;
}

/**
 * Builds the head values for prebuilt content.
 *
 * @param {{kind: string, data: object}} content The prebuilt content.
 * @returns {object} The values for useSEO.
 */
export function buildPrebuiltContentSeo(content) {
  if (content.kind === PrebuiltContentKind.SearchPage) {
    return buildSearchPageSeo(content.data);
  }
  if (content.kind === PrebuiltContentKind.CategoryPage) {
    return buildCategoryPageSeo(content.data);
  }
  return ShopNobiPageSeo;
}
