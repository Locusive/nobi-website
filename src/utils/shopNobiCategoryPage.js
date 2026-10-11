// A Shop Nobi category page lists the search pages of one top category at /shop/c/<slug>.

import { BaseUrl, ShopNobiImage } from "./shopNobiPage.js";
import { buildBreadcrumbSchema } from "./shopNobiStructuredData.js";

const CategoryPagePathPrefix = "/shop/c/";

/**
 * Returns the path of a category page.
 *
 * @param {string} slug The category's slug, such as "shoes".
 * @returns {string} The path, such as "/shop/c/shoes".
 */
export function categoryPagePath(slug) {
  return `${CategoryPagePathPrefix}${slug}`;
}

/**
 * Returns the full address of a category page.
 *
 * @param {string} slug The category's slug.
 * @returns {string} The page's address on nobi.ai.
 */
export function categoryPageUrl(slug) {
  return `${BaseUrl}${categoryPagePath(slug)}`;
}

/**
 * Returns a category page's description. It never mentions store counts, paid stores or ranking.
 *
 * @param {string} name The category name, such as "Shoes".
 * @returns {string} The meta description.
 */
export function describeCategoryPage(name) {
  return `Popular ${name} searches on Shop Nobi, the best products from the best stores online. You buy directly from the store.`;
}

/**
 * Builds the values useSEO and the build both write into a category page's head.
 *
 * @param {{slug: string, name: string}} category The category page data.
 * @returns {{title: string, description: string, path: string, image: string, schema: object[]}} The head values.
 */
export function buildCategoryPageSeo(category) {
  return {
    title: `${category.name} | Shop Nobi`,
    description: describeCategoryPage(category.name),
    path: categoryPagePath(category.slug),
    image: ShopNobiImage,
    schema: [buildBreadcrumbSchema([{ name: category.name, url: categoryPageUrl(category.slug) }])],
  };
}
