import { handleShopNobiOutboundClick } from "./shopNobiOutboundClick.js";
import { readProductPlacement } from "./shopNobiProductPlacement.js";
import { decodePaidLink } from "./shopNobiPaidLink.js";
import { landingEventDetails } from "./shopNobiLandingExperiment.js";

/**
 * Preserve the existing standalone product click contract, with the real variant and store when the page knows them.
 * Shared delivery mechanics also support non-product offers under a separate event name.
 */
export function handleProductLinkClick(event, { product, position, query, slug, landingExperiment = false, entryPoint = "AI Search Bar" }, browser = globalThis) {
  const details = {
    entryPoint, query, productName: product.name, storeName: product.storeName,
    productPrice: product.price, positionInGrid: position,
    isPaidLink: product.paidLink === true && Boolean(decodePaidLink(product.encodedStoreLink)),
    ...readProductPlacement(product),
    ...(landingExperiment ? landingEventDetails(slug, browser) : {}),
  };
  if (product.productVariantId) {
    details.productVariantId = product.productVariantId;
  }
  if (product.owningMerchantId) {
    details.owningMerchantId = product.owningMerchantId;
  }
  handleShopNobiOutboundClick(event, { link: product, slug, eventName: "Click On Search Result", details }, browser);
}
