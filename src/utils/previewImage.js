// Picks a search page's preview picture. Google Discover shows large previews only for pictures at least 1,200
// pixels wide, so pictures on Shopify's image servers are asked for at that width. Web Story posters are cut to
// the 3:4 portrait size Google asks for.

/** The width Google Discover needs for a large preview. */
export const LargePreviewWidth = 1200;

/** The robots tag for pages search engines may index, which also lets them show large picture previews. */
export const IndexableRobots = "index, follow, max-image-preview:large";

const ShopifyImageHost = "cdn.shopify.com";
const ShopifyStoreImagePathPrefix = "/cdn/shop/";
const WidthParameter = "width";
const HeightParameter = "height";
const CropParameter = "crop";
const CenterCrop = "center";
// Google's smallest Web Story poster. Shopify never enlarges a picture, so asking for more fails on small ones.
const PortraitPosterWidth = 640;
const PortraitPosterHeight = 853;

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
export function widenShopifyImage(imageUrl) {
  const address = readShopifyImageAddress(imageUrl);
  if (!address) {
    return imageUrl;
  }

  address.searchParams.set(WidthParameter, String(LargePreviewWidth));
  return address.toString();
}

/**
 * Asks Shopify's image servers for a 640 by 853 pixel portrait cut from the middle of the picture, the size
 * Google asks for in a Web Story poster.
 *
 * @param {string} imageUrl The picture's address.
 * @returns {string | null} The portrait's address, or null when Shopify does not serve the picture.
 */
export function cropShopifyImageToPortrait(imageUrl) {
  const address = readShopifyImageAddress(imageUrl);
  if (!address) {
    return null;
  }

  address.searchParams.set(WidthParameter, String(PortraitPosterWidth));
  address.searchParams.set(HeightParameter, String(PortraitPosterHeight));
  address.searchParams.set(CropParameter, CenterCrop);
  return address.toString();
}

/** Returns the picture's address when Shopify's image servers serve it, else null. */
function readShopifyImageAddress(imageUrl) {
  let address;
  try {
    address = new URL(imageUrl);
  } catch {
    return null;
  }

  const isShopifyImage = address.hostname === ShopifyImageHost || address.pathname.startsWith(ShopifyStoreImagePathPrefix);
  return isShopifyImage ? address : null;
}
