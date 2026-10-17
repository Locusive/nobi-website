// Shopping pages live at /shop and below it, except the MCP setup document.
// index.html runs the same check inline to decide how the assistant starts.

import { LINKEDIN_URL } from "../constants/positioning.js";
import { IndexableRobots } from "./previewImage.js";

/** The site address every Shop Nobi page address starts with. */
export const BaseUrl = "https://nobi.ai";

/** The link preview picture for every Shop Nobi page. */
export const ShopNobiImage = `${BaseUrl}/shop-nobi-og-image.png`;

/** The /shop head values. ShopPage and the build both use them, so React keeps what the build wrote. */
export const ShopNobiPageSeo = {
  title: "Shop Nobi | Nobi",
  description:
    "The best products from the best stores online, in one search. Shop Nobi is a search engine: you buy directly from the store.",
  path: "/shop",
  image: ShopNobiImage,
  schema: [
    { "@context": "https://schema.org", "@type": "Organization", name: "Nobi", url: BaseUrl, logo: `${BaseUrl}/og-image.png`, sameAs: [LINKEDIN_URL] },
    { "@context": "https://schema.org", "@type": "WebSite", name: "Shop Nobi", url: `${BaseUrl}/shop` },
  ],
};

/** The start of every tracking tag's name. */
const TrackingTagPrefix = "utm_";

/** The utm_medium and utm_campaign tags on every link Shop Nobi places. The utm_source tag names the channel. */
export const ShopNobiLinkTags = { utm_medium: "referral", utm_campaign: "shop_nobi" };

/** The notice shown under a store link that earns Shop Nobi a commission. */
export const CommissionNotice = "We may earn a commission";

/** The rel of a store link. Google asks for "sponsored" on links that earn a commission. */
const StoreLinkRel = "nofollow noopener";
const PaidStoreLinkRel = "sponsored nofollow noopener";

/** The RSS feed of search pages that Pinterest reads to publish one pin per page. */
export const ShopNobiPinFeed = { title: "Shop Nobi searches", url: `${BaseUrl}/shop/pins.xml` };

/** The /shop head values in the form the build writes. Crawlers follow its links; store links carry rel="nofollow". */
export const ShopNobiPageHead = { ...ShopNobiPageSeo, robots: IndexableRobots, feed: ShopNobiPinFeed };

/**
 * Returns the rel of a store link.
 *
 * @param {boolean} paidLink True when the link earns Shop Nobi a commission.
 * @returns {string} The rel value, with "sponsored" for a paid link.
 */
export function readStoreLinkRel(paidLink) {
  return paidLink ? PaidStoreLinkRel : StoreLinkRel;
}

/**
 * Removes every utm_ tag from a link, keeping its other parts.
 *
 * @param {string} url The link.
 * @returns {string} The link without utm_ tags.
 */
export function removeTrackingTags(url) {
  const address = new URL(url);
  const trackingTags = [...address.searchParams.keys()].filter((key) => key.startsWith(TrackingTagPrefix));
  trackingTags.forEach((key) => address.searchParams.delete(key));
  return address.toString();
}

/**
 * Tags a Shop Nobi page link with the channel it is placed on, replacing every utm_ tag it had.
 * A visit from a channel that sends no referrer is then still known. The page's canonical link stays plain.
 *
 * @param {string} pageUrl A Shop Nobi page address, such as "https://nobi.ai/shop/s/linen-dress".
 * @param {string} channel The channel the link is placed on, such as "mcp".
 * @returns {string} The tagged address.
 */
export function tagShopNobiPageLink(pageUrl, channel) {
  const address = new URL(removeTrackingTags(pageUrl));
  const channelTags = { utm_source: channel, ...ShopNobiLinkTags };
  Object.entries(channelTags).forEach(([key, value]) => address.searchParams.set(key, value));
  return address.toString();
}

/**
 * Returns whether a path belongs to the Shop Nobi page.
 *
 * @param {string} pathname The path part of a page address, such as "/shop".
 * @returns {boolean} True for shopping paths, excluding the MCP setup document.
 */
export function isShopNobiPath(pathname) {
  const path = pathname.replace(/\/$/, "");
  return path !== "/shop/mcp" && (path === "/shop" || path.startsWith("/shop/"));
}
