// The Shop Nobi page lives at /shop and every path under it. index.html runs
// the same check inline to decide how the assistant bundle starts.

import { LINKEDIN_URL } from "../constants/positioning.js";

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

/** The RSS feed of search pages that Pinterest reads to publish one pin per page. */
export const ShopNobiPinFeed = { title: "Shop Nobi searches", url: `${BaseUrl}/shop/pins.xml` };

/** The /shop head values in the form the build writes. Crawlers follow its links; store links carry rel="nofollow". */
export const ShopNobiPageHead = { ...ShopNobiPageSeo, robots: "index, follow", feed: ShopNobiPinFeed };

/**
 * Returns whether a path belongs to the Shop Nobi page.
 *
 * @param {string} pathname The path part of a page address, such as "/shop".
 * @returns {boolean} True for /shop and every path under it.
 */
export function isShopNobiPath(pathname) {
  return pathname === "/shop" || pathname.startsWith("/shop/");
}
