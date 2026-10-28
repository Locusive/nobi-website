// A Shop Nobi search page is a prebuilt page for one search at /shop/s/<slug>. The build and the
// browser both use these helpers, so the page looks and is described the same way in each.

import { BaseUrl, ShopNobiImage, ShopNobiLinkTags, removeTrackingTags } from "./shopNobiPage.js";
import { categoryPagePath } from "./shopNobiCategoryPage.js";
import { buildBreadcrumbSchema, buildFaqSchema, buildProductListSchema } from "./shopNobiStructuredData.js";
import { findLargePreviewImage } from "./previewImage.js";
import { decodePaidLink } from "./shopNobiPaidLink.js";
import { fillClickId } from "./shopNobiClickId.js";

const SearchPagePathPrefix = "/shop/s/";
/** The channel name of search pages: the utm_source tag, and what the API puts in a paid link's sub-ID slot. */
const SearchPageChannel = "shop_nobi";
const ShopNobiTags = { utm_source: SearchPageChannel, ...ShopNobiLinkTags };
/** A prebuilt card must not carry a stale live-assistant conversation to a store. */
const ConversationIdParameter = "nobi-conversation-id";

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
 * Opens a built related page, or searches its original query when the build did not include that page.
 * Older embedded page data has only a title, which remains a usable search fallback.
 *
 * @param {{slug?: string | null, title?: string, query?: string}} page The related search.
 * @returns {string | null} The internal destination, or null when there is no visible search label.
 */
export function readRelatedSearchPath(page) {
  if (typeof page?.title !== "string" || !page.title.trim()) {
    return null;
  }
  if (typeof page.slug === "string" && page.slug.trim()) {
    return searchPagePath(page.slug);
  }
  const query = typeof page.query === "string" && page.query.trim() ? page.query.trim() : page.title.trim();
  return `/shop?${new URLSearchParams({ q: query })}`;
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
    noindex: page.products.length === 0,
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
 * Sets a clicked product link just before the browser follows it. A person gets the paid link, with the click id as its
 * sub-ID, when there is one; anyone else gets the plain link with Shop Nobi's tags and no conversation.
 *
 * @param {{currentTarget: {href: string}}} event The click event.
 * @param {{url: string, encodedStoreLink?: string}} product The product the link belongs to.
 * @param {{isPerson: boolean, clickId: string | null}} visit Who clicked, from readVisit.
 */
export function tagProductLinkOnClick(event, product, visit) {
  const paidStoreLink = visit.isPerson ? decodePaidLink(product.encodedStoreLink) : null;
  if (paidStoreLink === null) {
    event.currentTarget.href = readMatchingDirectLink(product) ?? tagPlainStoreLink(product.url);
    return;
  }

  event.currentTarget.href = fillClickId(paidStoreLink, SearchPageChannel, visit.clickId);
}

/** Adds Shop Nobi's tags and removes any stale conversation from a plain prebuilt store link. */
function tagPlainStoreLink(storeUrl) {
  const address = new URL(addShopNobiTags(storeUrl));
  address.searchParams.delete(ConversationIdParameter);
  return address.toString();
}

/** Accepts a preserved direct catalog link only when removing its tags yields this exact product URL. */
function readMatchingDirectLink(product) {
  if (!product.taggedStoreLink) return null;
  try {
    const address = new URL(product.taggedStoreLink);
    for (const key of [...address.searchParams.keys()]) if (key.startsWith('utm_')) address.searchParams.delete(key);
    return address.href === product.url ? product.taggedStoreLink : null;
  } catch { return null; }
}
