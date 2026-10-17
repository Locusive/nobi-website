import { sendShopNobiEvent } from "./shopNobiOutboundClick.js";

/** The event the assistant bundle sends for each group of products it shows; the reports read them all under it. */
const DisplayedProductCollectionEvent = "Displayed Product Collection";
/** The entry point of the prebuilt search pages, the same one their clicks carry. */
const SearchPageEntryPoint = "AI Search Bar";
/** Names the prebuilt products, so a report can tell them from the live search the page runs below them. */
const PrebuiltCollectionName = "Prebuilt search page";

/**
 * Records which products a prebuilt search page shows, in order, once per page view; each place is its click's
 * positionInGrid. Products without ids are left out, and crawlers, bots and local copies send nothing.
 *
 * @param {{slug: string, query: string, products: object[]}} page The built search page.
 * @param {object} browser The window.
 */
export function sendSearchPageShownProducts(page, browser = globalThis) {
  const shownProducts = page.products
    .map((product, index) => ({
      productVariantId: product.productVariantId,
      owningMerchantId: product.owningMerchantId,
      position: index + 1,
      isPaidLink: product.paidLink === true,
    }))
    .filter((shownProduct) => shownProduct.productVariantId && shownProduct.owningMerchantId);
  if (shownProducts.length === 0) {
    return;
  }

  sendShopNobiEvent(DisplayedProductCollectionEvent, {
    entryPoint: SearchPageEntryPoint,
    query: page.query,
    pageSlug: page.slug,
    collectionName: PrebuiltCollectionName,
    collectionSize: page.products.length,
    shownProducts,
  }, browser);
}
