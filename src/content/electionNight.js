import { encodePaidLink } from "../utils/shopNobiPaidLink.js";
import { ElectionNightLinkArtifact } from "./electionNightLink.js";
import { MarleySpoonPath } from "./marleySpoonCost.js";

export const ElectionNightPath = "/election-night-survival-kit";
export const ElectionNightSlug = "election-night-survival-kit";
export const ElectionNightQuery = "Election Night checklist";
export const ElectionNightEntryPoint = "Shop Nobi Utility";
export const ElectionNightCheckedDate = "October 17, 2026";
export const ElectionNightElectionSource = "https://www.fec.gov/introduction-campaign-finance/election-results-and-voting-information/";

/** Preserve only acquisition tags when the reader moves to the existing calculator. */
export function buildElectionNightMealUrl(search = "") {
  const incoming = new URLSearchParams(search);
  const tags = new URLSearchParams();
  for (const name of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    if (incoming.has(name)) tags.set(name, incoming.get(name));
  }
  const query = tags.toString();
  return query ? `${MarleySpoonPath}?${query}` : MarleySpoonPath;
}

const product = ElectionNightLinkArtifact.product;

/** Uses an actual Java builder record and the existing standalone product-exit handler. */
export const ElectionNightProduct = Object.freeze({
  name: product.product_name, storeName: product.merchant_name,
  productId: product.product_id, productVariantId: product.variant_id,
  owningMerchantId: product.merchant_id, price: product.price,
  sourceUrl: product.generatedSource, url: product.plain,
  encodedStoreLink: encodePaidLink(product.paid), paidLink: product.paidLink,
});

export const ElectionNightSeo = {
  path: ElectionNightPath,
  title: "Election Night Survival Kit: A Simple Checklist | Shop Nobi",
  description: "A nonpartisan November 3 checklist: charge your devices, plan dinner and take a screen break. Use what you own, with optional disclosed shopping links.",
  image: "https://nobi.ai/media/election-night-preview.png",
  schema: [{
    "@context": "https://schema.org", "@type": "WebPage",
    name: "Election Night Survival Kit", url: `https://nobi.ai${ElectionNightPath}`,
    description: "A nonpartisan checklist for an evening at home on November 3, 2026.",
    dateModified: "2026-10-17",
  }],
};
