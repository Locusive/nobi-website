// The build embeds each prebuilt Shop Nobi page's data in its HTML as {kind, path, data}, so ShopPage can
// show and describe the same content in the browser until live products take its place.

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

/** Where ShopPage shows the prebuilt content: above the live search, below it, or not at all. */
export const PrebuiltContentPlace = {
  AboveSearch: "above-search",
  BelowSearch: "below-search",
  Hidden: "hidden",
};

/** The window event the assistant bundle fires each time it draws a group of live products. */
export const LiveResultsDrawnEvent = "nobi-displayed-product-collection";

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
 * Chooses where the prebuilt content shows. Search pages keep it above the live search and category pages below the
 * search box until live products are drawn. Other content leaves when the assistant arrives.
 *
 * @param {string | undefined} kind The prebuilt content's kind, or undefined when the page has none.
 * @param {{assistantHasMounted: boolean, liveResultsHaveDrawn: boolean}} progress How far the live search has got.
 * @returns {string} A PrebuiltContentPlace value.
 */
export function choosePrebuiltContentPlace(kind, { assistantHasMounted, liveResultsHaveDrawn }) {
  if (liveResultsHaveDrawn) {
    return PrebuiltContentPlace.Hidden;
  }
  if (kind === PrebuiltContentKind.CategoryPage) {
    return PrebuiltContentPlace.BelowSearch;
  }

  const isSearchPage = kind === PrebuiltContentKind.SearchPage;
  return isSearchPage || !assistantHasMounted ? PrebuiltContentPlace.AboveSearch : PrebuiltContentPlace.Hidden;
}

/**
 * Calls onDrawn the first time the assistant bundle draws live products. A refused or failed search draws none.
 *
 * @param {EventTarget} target The window, where the bundle fires its events.
 * @param {() => void} onDrawn Called once.
 * @returns {() => void} Stops watching.
 */
export function watchForLiveResults(target, onDrawn) {
  target.addEventListener(LiveResultsDrawnEvent, onDrawn, { once: true });
  return () => target.removeEventListener(LiveResultsDrawnEvent, onDrawn);
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
