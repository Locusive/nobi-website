// A Shop Nobi search page is a prebuilt page for one search at /shop/s/<slug>. The build and the
// browser both use these helpers, so the page looks and is described the same way in each.

import { BaseUrl, ShopNobiImage, ShopNobiLinkTags } from "./shopNobiPage.js";
import { categoryPagePath } from "./shopNobiCategoryPage.js";
import { buildBreadcrumbSchema, buildFaqSchema, buildProductListSchema } from "./shopNobiStructuredData.js";
import { findLargePreviewImage } from "./previewImage.js";

const SearchPagePathPrefix = "/shop/s/";
const ShopNobiTags = { utm_source: "shop_nobi", ...ShopNobiLinkTags };
const TrackingTagPrefix = "utm_";

/**
 * Returns the path of a search page.
 *
 * @param {string} slug The page's slug, such as "black-leather-boots".
 * @returns {string} The path, such as "/shop/s/black-leather-boots".
 */
export function searchPagePath(slug) {
  return `${SearchPagePathPrefix}${slug}`;
}

/**
 * Returns the full address of a search page.
 *
 * @param {string} slug The page's slug.
 * @returns {string} The page's address on nobi.ai.
 */
export function searchPageUrl(slug) {
  return `${BaseUrl}${searchPagePath(slug)}`;
}

/**
 * Returns the description used when a page has none of its own. It never mentions store counts, paid stores or ranking.
 *
 * @param {string} title The page title, such as "Black Leather Boots".
 * @returns {string} The meta description.
 */
export function describeSearchPage(title) {
  return `${title} from the best stores online, in one search. Shop Nobi is a search engine: you buy directly from the store.`;
}

/**
 * Builds the values useSEO and the build both write into the page head.
 *
 * @param {object} page The search page data.
 * @returns {{title: string, description: string, path: string, image: string, schema: object[]}} The head values.
 */
export function buildSearchPageSeo(page) {
  const pageUrl = searchPageUrl(page.slug);
  const categoryCrumbs = page.breadcrumbs
    .map((crumb, index) => ({ name: crumb.name, path: readCrumbPath(page, crumb, index) }))
    .filter((crumb) => crumb.path)
    .map((crumb) => ({ name: crumb.name, url: `${BaseUrl}${crumb.path}` }));
  const schema = [buildProductListSchema(page, pageUrl), buildBreadcrumbSchema([...categoryCrumbs, { name: page.title, url: pageUrl }])];
  if (page.faq.length > 0) {
    schema.push(buildFaqSchema(page.faq));
  }

  return {
    title: `${page.title} | Shop Nobi`,
    description: page.description || describeSearchPage(page.title),
    path: searchPagePath(page.slug),
    image: findLargePreviewImage(page.products) ?? ShopNobiImage,
    schema,
  };
}

/**
 * Returns where a breadcrumb links: the first one to the category page when it was built, any one to its search page.
 *
 * @param {object} page The search page data.
 * @param {{name: string, slug: string | null}} crumb The breadcrumb.
 * @param {number} index The breadcrumb's position, starting at 0.
 * @returns {string | null} The path, or null when the crumb has no page.
 */
export function readCrumbPath(page, crumb, index) {
  if (index === 0 && page.categoryPageSlug) {
    return categoryPagePath(page.categoryPageSlug);
  }
  return crumb.slug ? searchPagePath(crumb.slug) : null;
}

/**
 * Formats a price for display, such as "$495.00".
 *
 * @param {number | null} price The price.
 * @param {string | null} currency The three-letter currency code.
 * @returns {string} The formatted price, or an empty string when there is no price.
 */
export function formatPrice(price, currency) {
  if (typeof price !== "number") {
    return "";
  }
  if (!currency) {
    return price.toFixed(2);
  }

  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}

/**
 * Removes every utm_ tag from a link, keeping its other parts.
 *
 * @param {string} storeUrl The store link.
 * @returns {string} The link without utm_ tags.
 */
export function removeTrackingTags(storeUrl) {
  const address = new URL(storeUrl);
  const trackingTags = [...address.searchParams.keys()].filter((key) => key.startsWith(TrackingTagPrefix));
  trackingTags.forEach((key) => address.searchParams.delete(key));
  return address.toString();
}

/**
 * Adds Shop Nobi's utm_ tags to a store link, replacing any utm_ tags it had and keeping its other parts.
 *
 * @param {string} storeUrl The store link.
 * @returns {string} The link with Shop Nobi's tags.
 */
export function addShopNobiTags(storeUrl) {
  const address = new URL(removeTrackingTags(storeUrl));
  Object.entries(ShopNobiTags).forEach(([key, value]) => address.searchParams.set(key, value));
  return address.toString();
}

/**
 * Click handler for a product link: tags the link just before the browser follows it, so the store credits
 * Shop Nobi while the HTML crawlers read keeps the plain link.
 *
 * @param {{currentTarget: {href: string}}} event The click event.
 */
export function tagProductLinkOnClick(event) {
  event.currentTarget.href = addShopNobiTags(event.currentTarget.href);
}
