import { handleShopNobiOutboundClick } from "./shopNobiOutboundClick.js";

/**
 * Count an authored non-product offer separately from physical product clicks and preferences.
 * Owner identity is authored analytics metadata, not server-resolved product enrichment.
 * Calculator inputs stay local; only the fixed offering and actual outbound/acquisition context are sent.
 */
export function handleOfferLinkClick(event, { offer, slug, entryPoint }, browser = globalThis) {
  const details = {
    entryPoint, offerId: offer.id, offerName: offer.name, offerKind: offer.kind,
    priceBasis: offer.priceBasis, owningMerchantId: offer.owningMerchantId,
    storeName: offer.storeName, query: offer.query,
  };
  handleShopNobiOutboundClick(event, { link: offer, slug, eventName: "Click On Offer", details }, browser);
}
