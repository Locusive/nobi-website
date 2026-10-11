// Picks a search page's preview picture. Google Discover shows large previews only for pictures at least 1,200
// pixels wide, so pictures on Shopify's image servers are asked for at that width.

/** The width Google Discover needs for a large preview. */
export const LargePreviewWidth = 1200;

/** The robots tag for pages search engines may index, which also lets them show large picture previews. */
export const IndexableRobots = "index, follow, max-image-preview:large";

const ShopifyImageHost = "cdn.shopify.com";
const ShopifyStoreImagePathPrefix = "/cdn/shop/";
const WidthParameter = "width";

/**
 * Returns the first https picture among a page's products, at 1,200 pixels wide when Shopify serves it.
 *
 * @param {{imageUrl?: string | null}[]} products The page's products, best first.
 * @returns {string | null} The picture's address, or null when no product has an https picture.
 */
export function findLargePreviewImage(products) {
  const imageUrl = products.map((product) => product.imageUrl).find((url) => url?.startsWith("https://"));
  if (!imageUrl) {
    return null;
  }

  return widenShopifyImage(imageUrl);
}

/**
 * Asks Shopify's image servers for a 1,200 pixel wide version. Other addresses come back unchanged.
 *
 * @param {string} imageUrl The picture's address.
 * @returns {string} The widened address, or the original one.
 */
function widenShopifyImage(imageUrl) {
  let address;
  try {
    address = new URL(imageUrl);
  } catch {
    return imageUrl;
  }

  const isShopifyImage = address.hostname === ShopifyImageHost || address.pathname.startsWith(ShopifyStoreImagePathPrefix);
  if (!isShopifyImage) {
    return imageUrl;
  }

  address.searchParams.set(WidthParameter, String(LargePreviewWidth));
  return address.toString();
}
