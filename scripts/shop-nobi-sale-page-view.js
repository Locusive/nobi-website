// Turns the fetched sale pages into the page data the HTML is built from: one page per category, each product with
// the store's own earlier price above its price now, and the hub that lists them.

import { buildProduct, formatUpdatedDate, isSafeSlug, isText } from "./shop-nobi-search-page-view.js";
import { makeSlug } from "./shop-nobi-category-page-view.js";
import { buildSalePageTitle, describeSalePage, SaleHubDescription, SaleHubTitle } from "../src/utils/shopNobiSalePage.js";

/** Ends a sale page's search, which its clicks carry, such as "Dresses on sale". */
const SaleQueryEnding = " on sale";

/** The hub is written to shop/sale/index.html, so no sale page may take that name. */
const ReservedSaleSlug = "index";

/**
 * Builds the sale pages, in data order. A page with no category name, an unsafe slug, a repeated slug or no product
 * with a real markdown is left out.
 *
 * @param {{generatedAt: string | null, pages: object[]}} saleData The fetched sale pages.
 * @returns {object[]} The sale pages.
 */
export function buildSalePages(saleData) {
  const pageBySlug = new Map();
  for (const fetchedPage of saleData.pages) {
    const salePage = buildSalePage(fetchedPage, saleData.generatedAt);
    if (salePage && !pageBySlug.has(salePage.slug)) {
      pageBySlug.set(salePage.slug, salePage);
    }
  }
  return [...pageBySlug.values()];
}

/**
 * Builds the hub that lists the sale pages, or returns null when there are none.
 *
 * @param {object[]} salePages The built sale pages.
 * @returns {object | null} The hub.
 */
export function buildSaleHub(salePages) {
  if (salePages.length === 0) {
    return null;
  }

  const refreshedAt = salePages[0].refreshedAt;
  return {
    title: SaleHubTitle,
    description: SaleHubDescription,
    refreshedAt,
    updatedDate: formatUpdatedDate(refreshedAt),
    pages: salePages.map((page) => ({ slug: page.slug, name: page.name, productCount: page.products.length })),
  };
}

/** Builds one sale page, or returns null when it cannot be shown. */
function buildSalePage(fetchedPage, generatedAt) {
  if (!isText(fetchedPage?.categoryName)) {
    return null;
  }

  const name = fetchedPage.categoryName.trim();
  const slug = makeSlug(name);
  const products = (Array.isArray(fetchedPage.products) ? fetchedPage.products : []).map(buildSaleProduct).filter(Boolean);
  if (!isSafeSlug(slug) || slug === ReservedSaleSlug || products.length === 0) {
    console.warn(`prerender-shop: skipped a sale page with an unsafe name or no marked-down products: ${JSON.stringify(name)}`);
    return null;
  }

  return {
    slug,
    name,
    title: buildSalePageTitle(name),
    query: `${name}${SaleQueryEnding}`,
    description: describeSalePage(name),
    categoryPath: isText(fetchedPage.categoryPath) ? fetchedPage.categoryPath.trim() : null,
    refreshedAt: generatedAt,
    updatedDate: formatUpdatedDate(generatedAt),
    products,
  };
}

/** Builds one in-stock product with its earlier price, or returns null when that price is not above its price now. */
function buildSaleProduct(fetchedProduct) {
  const product = buildProduct(fetchedProduct);
  const wasPrice = fetchedProduct?.wasPrice;
  const isMarkedDown = Number.isFinite(wasPrice) && Number.isFinite(product?.price) && wasPrice > product.price;
  return isMarkedDown && product.isInStock ? { ...product, wasPrice } : null;
}
