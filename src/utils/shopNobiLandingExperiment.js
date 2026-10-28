import { readPageVisitId, sendShopNobiEvent } from "./shopNobiOutboundClick.js";

export const LandingExperimentId = "shop-landing-products-v1";
export const ProductsFirstVariant = "products-first";
export const GuideFirstVariant = "guide-first";
export const LiveSearchAnchor = "shop-nobi-live-search";

/** Stable page-level allocation, identical for crawlers, HTML and browser renders. */
export function landingVariant(slug) {
  let hash = 0;
  for (const character of slug) hash = (Math.imul(hash, 31) + character.charCodeAt(0)) | 0;
  return (hash >>> 0) % 2 === 0 ? ProductsFirstVariant : GuideFirstVariant;
}

/** Empty pages are not exposures: there is no product layout to compare. */
export function participatesInLandingExperiment(page) {
  return Boolean(page?.slug && page.products?.some(product => product.productVariantId));
}

/** Join this document's exposures and outcomes without requiring an assistant conversation or storage. */
export function landingEventDetails(slug, browser = globalThis) {
  return {
    experimentId: LandingExperimentId,
    experimentVariant: landingVariant(slug),
    landingVisitId: readPageVisitId(browser),
    pageSlug: slug,
  };
}

/** Focus the existing search input without navigating away, changing acquisition tags or running a search. */
export function focusLandingSearch(event, slug, browser = globalThis) {
  if (focusSearchInput(event, browser)) {
    sendShopNobiEvent("Shop Nobi Refine Search", landingEventDetails(slug, browser), browser);
  }
}

/** Focuses the visitor's search box without submitting or assigning an experiment event. */
export function focusSearchInput(event, browser = globalThis) {
  const input = browser.document.querySelector(`#${LiveSearchAnchor} [data-testid="message-input"]`);
  if (!input) return false; // Native anchor works while the assistant loads.
  event.preventDefault();
  input.focus({ preventScroll: true });
  input.scrollIntoView({ behavior: "auto", block: "center" });
  return true;
}

/**
 * Keep live outcomes attached to the landing after live results replace the prebuilt grid.
 * Separate outcome events avoid counting a second legacy product click or search.
 */
export function watchLandingOutcomes(page, browser = globalThis) {
  if (!participatesInLandingExperiment(page)) return () => {};
  const onAnalytics = ({ detail }) => {
    if (detail?.source !== "nobi" || detail.data?.entryPoint !== "AI Search Bar") return;
    const outcome = detail.event === "Click On Search Result" ? "product-click"
      : detail.event === "Send Message" ? "message-submitted" : null;
    if (!outcome) return;
    sendShopNobiEvent("Shop Nobi Landing Outcome", {
      ...landingEventDetails(page.slug, browser), outcome, outcomeSurface: "live",
      outcomeConversationId: detail.data.conversationId,
      outcomeProductVariantId: detail.data.productVariantId,
      outcomeProductVariantInternalId: detail.data.productVariantInternalId,
      outcomeShopperId: detail.data.shopperId,
      outcomeTimestamp: detail.timestamp,
    }, browser);
  };
  browser.addEventListener("nobi-analytics", onAnalytics);
  return () => browser.removeEventListener("nobi-analytics", onAnalytics);
}
