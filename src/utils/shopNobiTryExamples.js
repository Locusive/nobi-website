// The homepage's "try Shop Nobi" section shows real results for a few example searches. The build picks the examples
// from Shop Nobi's prebuilt search pages and writes their products to a small file the homepage reads.

import { searchPagePath } from "./shopNobiSearchPage.js";

/** The file the build writes next to the site, and the homepage reads. */
export const TryExamplesFile = "shop-nobi-try.json";
/** How many example searches the section shows. */
export const ExampleCount = 6;
/** How many products each example shows. */
export const ProductsPerExample = 8;
/** An example needs products from at least this many stores, so it shows a search across stores. */
const MinimumStoreCount = 2;
/** The searches the build tries, best first. It keeps the first ones whose pages are healthy that night. */
export const PreferredExampleSlugs = [
  "cream-sweaters",
  "purse",
  "denim-jackets",
  "gray-silver-sunglasses",
  "green-vases",
  "candles",
  "gray-throw-blankets",
  "blue-navy-sweaters",
  "acetate-sunglasses",
  "scarf",
];

/**
 * Picks the example searches and keeps only what the section shows for each product.
 *
 * @param {object[]} pages The prebuilt search pages, each with a slug, query and products.
 * @returns {{examples: {slug: string, query: string, path: string, products: object[]}[]}} The examples, best first.
 */
export function buildTryExamples(pages) {
  const pagesBySlug = new Map(pages.map((page) => [page.slug, page]));
  const examples = PreferredExampleSlugs
    .map((slug) => pagesBySlug.get(slug))
    .filter((page) => page && isHealthyExample(page))
    .slice(0, ExampleCount)
    .map(buildExample);
  return { examples };
}

/** Returns whether a page has enough pictured, priced products from enough stores to show. */
function isHealthyExample(page) {
  const products = keepShowableProducts(page.products).slice(0, ProductsPerExample);
  const storeCount = new Set(products.map((product) => product.storeName)).size;
  return products.length === ProductsPerExample && storeCount >= MinimumStoreCount;
}

/** Keeps the products with a name, a picture, a store and a price. */
function keepShowableProducts(products) {
  return (products || []).filter((product) => product?.name && product.imageUrl && product.storeName && typeof product.price === "number");
}

/** Shapes one page as an example: its search, its page path and its first products. */
function buildExample(page) {
  const products = keepShowableProducts(page.products).slice(0, ProductsPerExample).map((product) => ({
    name: product.name,
    storeName: product.storeName,
    price: product.price,
    currency: product.currency,
    imageUrl: product.imageUrl,
  }));
  return { slug: page.slug, query: page.query, path: searchPagePath(page.slug), products };
}

/**
 * Returns the Shop Nobi address that runs a visitor's own search.
 *
 * @param {string} query The visitor's words.
 * @returns {string} The address, such as "/shop?q=red%20dress".
 */
export function liveSearchPath(query) {
  return `/shop?q=${encodeURIComponent(query.trim())}`;
}
