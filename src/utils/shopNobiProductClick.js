import { handleShopNobiOutboundClick } from "./shopNobiOutboundClick.js";

/**
 * Preserve the existing standalone product click contract, including optional real variant enrichment.
 * Shared delivery mechanics also support non-product offers under a separate event name.
 */
export function handleProductLinkClick(event, { product, position, query, slug, entryPoint = "AI Search Bar" }, browser = globalThis) {
  const details = {
    entryPoint, query, productName: product.name, storeName: product.storeName,
    productPrice: product.price, positionInGrid: position,
  };
  if (product.productVariantId) {
    details.productVariantId = product.productVariantId;
  }
  handleShopNobiOutboundClick(event, { link: product, slug, eventName: "Click On Search Result", details }, browser);
}
