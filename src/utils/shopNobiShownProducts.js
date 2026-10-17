import { sendShopNobiEvent, ShopNobiMerchantId } from "./shopNobiOutboundClick.js";

/** The event the assistant bundle sends for each group of products it shows; the reports read them all under it. */
const DisplayedProductCollectionEvent = "Displayed Product Collection";
/** The entry point of the prebuilt search pages, the same one their clicks carry. */
const SearchPageEntryPoint = "AI Search Bar";
/** Names the prebuilt products, so a report can tell them from the live search the page runs below them. */
const PrebuiltCollectionName = "Prebuilt search page";
/** The place of a page's first product, which its click sends as positionInGrid. */
export const FirstProductPosition = 1;

/**
 * Records which products a prebuilt search page shows, in order, once per page view. The product at list index i is
 * at place FirstProductPosition + i, its click's positionInGrid. Crawlers, bots and local copies send nothing.
 *
 * @param {{slug: string, query: string, products: object[]}} page The built search page.
 * @param {object} browser The window.
 */
export function sendSearchPageShownProducts(page, browser = globalThis) {
  if (!page.products.some((product) => product.productVariantId)) {
    return;
  }

  sendShopNobiEvent(DisplayedProductCollectionEvent, {
    entryPoint: SearchPageEntryPoint,
    query: page.query,
    pageSlug: page.slug,
    collectionName: PrebuiltCollectionName,
    collectionSize: page.products.length,
    shownProductsStartPosition: FirstProductPosition,
    shownProducts: page.products.map(buildShownProduct),
  }, browser);
}

/**
 * Builds one product's entry: its id, its store only when that is not Shop Nobi, which every event is posted under,
 * and its paid link. A product built before the API sent ids keeps its place with a null id.
 */
function buildShownProduct(product) {
  const namesOtherStore = Boolean(product.productVariantId)
    && Boolean(product.owningMerchantId)
    && product.owningMerchantId !== ShopNobiMerchantId;
  return {
    productVariantId: product.productVariantId ?? null,
    ...(namesOtherStore ? { owningMerchantId: product.owningMerchantId } : {}),
    isPaidLink: product.paidLink === true,
  };
}
