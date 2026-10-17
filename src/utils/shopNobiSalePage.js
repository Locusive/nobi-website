// A Shop Nobi sale page lists the products independent stores marked down in one category, at /shop/sale/<slug>.
// /shop/sale lists the sale pages. The build and the browser both use these helpers.

import { BaseUrl, ShopNobiImage } from "./shopNobiPage.js";
import { buildBreadcrumbSchema, buildProductListSchema } from "./shopNobiStructuredData.js";
import { findLargePreviewImage } from "./previewImage.js";

/** The path of the page that lists every sale page. */
export const SaleHubPath = "/shop/sale";

/** The heading of the sale hub, and the start of every sale page's heading. */
export const SaleHubTitle = "On sale now at independent stores";

/** The sale hub's description. It promises only what the pages hold: the stores' own prices, checked daily. */
export const SaleHubDescription = "Products independent stores have marked down themselves, by category, with each store's own "
  + "earlier price and price now. Rebuilt every day, through Black Friday and Cyber Monday. You buy directly from the store.";

/** Starts the slug a sale page's clicks carry, so a sale page's paid clicks can be told from a search page's. */
const SaleClickSlugPrefix = "sale-";

/**
 * Returns the path of a sale page.
 *
 * @param {string} slug The page's slug, such as "dresses".
 * @returns {string} The path, such as "/shop/sale/dresses".
 */
export function salePagePath(slug) {
  return `${SaleHubPath}/${slug}`;
}

/**
 * Returns the full address of a sale page.
 *
 * @param {string} slug The page's slug.
 * @returns {string} The page's address on nobi.ai.
 */
export function salePageUrl(slug) {
  return `${BaseUrl}${salePagePath(slug)}`;
}

/**
 * Returns the full address of the sale hub.
 *
 * @returns {string} The hub's address on nobi.ai.
 */
export function saleHubUrl() {
  return `${BaseUrl}${SaleHubPath}`;
}

/**
 * Returns a sale page's heading. It never claims the lowest price or a best deal.
 *
 * @param {string} name The category name, such as "Dresses".
 * @returns {string} The heading, such as "On sale now at independent stores: Dresses".
 */
export function buildSalePageTitle(name) {
  return `${SaleHubTitle}: ${name}`;
}

/**
 * Returns a sale page's description. It never claims the lowest price or a best deal.
 *
 * @param {string} name The category name, such as "Dresses".
 * @returns {string} The description.
 */
export function describeSalePage(name) {
  return `${name} that independent stores have marked down themselves, with each store's own earlier price and price now. `
    + "Rebuilt every day. You buy directly from the store.";
}

/**
 * Returns the slug a sale page's product clicks carry, such as "sale-dresses".
 *
 * @param {string} slug The sale page's slug.
 * @returns {string} The click slug.
 */
export function buildSaleClickSlug(slug) {
  return `${SaleClickSlugPrefix}${slug}`;
}

/**
 * Builds the values useSEO and the build both write into a sale page's head.
 *
 * @param {object} page The sale page data.
 * @returns {{title: string, description: string, path: string, image: string, schema: object[]}} The head values.
 */
export function buildSalePageSeo(page) {
  const pageUrl = salePageUrl(page.slug);
  const crumbs = [{ name: SaleHubTitle, url: saleHubUrl() }, { name: page.name, url: pageUrl }];
  return {
    title: `${page.title} | Shop Nobi`,
    description: page.description,
    path: salePagePath(page.slug),
    image: findLargePreviewImage(page.products) ?? ShopNobiImage,
    schema: [buildProductListSchema(page, pageUrl), buildBreadcrumbSchema(crumbs)],
  };
}

/**
 * Builds the values useSEO and the build both write into the sale hub's head.
 *
 * @returns {{title: string, description: string, path: string, image: string, schema: object[]}} The head values.
 */
export function buildSaleHubSeo() {
  return {
    title: `${SaleHubTitle} | Shop Nobi`,
    description: SaleHubDescription,
    path: SaleHubPath,
    image: ShopNobiImage,
    schema: [buildBreadcrumbSchema([{ name: SaleHubTitle, url: saleHubUrl() }])],
  };
}
