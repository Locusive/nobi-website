// The Shop Nobi page lives at /shop and every path under it. index.html runs
// the same check inline to decide how the assistant bundle starts.

/**
 * Returns whether a path belongs to the Shop Nobi page.
 *
 * @param {string} pathname The path part of a page address, such as "/shop".
 * @returns {boolean} True for /shop and every path under it.
 */
export function isShopNobiPath(pathname) {
  return pathname === "/shop" || pathname.startsWith("/shop/");
}
