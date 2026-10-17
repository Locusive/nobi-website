import { MarleySpoonLinkArtifact } from "./marleySpoonLink.js";
import { encodePaidLink } from "../utils/shopNobiPaidLink.js";

export const MarleySpoonPath = "/tools/marley-spoon-cost";
export const MarleySpoonSlug = "marley-spoon-cost";
export const MarleySpoonEntryPoint = "Shop Nobi Utility";
export const MarleySpoonCheckedDate = "October 17, 2026";
export const MarleySpoonSourceUrl = "https://marleyspoon.com/select-plan?v=USMSAFFAWIN363M26";
export const MarleySpoonTermsUrl = "https://marleyspoon.com/terms";
const MarleySpoonOwnerId = "7decef8b-9aef-4d97-a7f4-6eea83ede096";
const ApprovedCode = "USMSAFFAWIN363M26";

/** Exact two-person, three-meal plan visible at the approved-code destination on the checked date. */
export const MarleySpoonPlan = Object.freeze({
  people: 2,
  mealsPerDelivery: 3,
  servingsPerDelivery: 6,
  foodCents: 8094,
  shippingCents: 1299,
  foodDiscountPercentages: Object.freeze([40, 35, 10, 10, 15]),
});

/**
 * Stop the build/publication if the authored configuration is missing or differs from the reviewed builder output.
 * This checks supplied output; it neither constructs a paid URL nor claims live merchant/network validation.
 */
export function validateMarleySpoonLink(artifact) {
  const offer = artifact?.offer;
  const reject = () => { throw new Error("Marley Spoon needs a valid reviewed server-built offer link before publication."); };
  if (artifact?.builderClass !== "ai.nobi.api.shop_nobi_store_links.ShopNobiStoreLinkBuilder"
      || artifact.channel !== "WEBSITE" || artifact.conversationId !== null
      || artifact.defaultOuterReference !== "shop_nobi"
      || !/^[a-f0-9]{40}$/.test(artifact.provenance?.sourceCommit || "")
      || !/^[a-f0-9]{64}$/.test(artifact.provenance?.builderClassSha256 || "")
      || !Number.isFinite(Date.parse(artifact.generatedAtUtc))
      || offer?.id !== "marley-spoon-two-people-three-meals"
      || offer.kind !== "SUBSCRIPTION" || offer.priceBasis !== "PER_DELIVERY"
      || offer.owningMerchantId !== MarleySpoonOwnerId || offer.sourceUrl !== MarleySpoonSourceUrl
      || offer.paidLink !== true
      || ["productId", "productVariantId", "productPrice"].some(field => field in offer)) reject();

  try {
    const plain = new URL(offer.plain);
    const paid = new URL(offer.paid);
    const source = new URL(MarleySpoonSourceUrl);
    if (plain.origin !== source.origin || plain.pathname !== source.pathname
        || plain.searchParams.get("v") !== ApprovedCode
        || plain.searchParams.get("utm_source") !== "shop_nobi"
        || plain.searchParams.get("utm_medium") !== "referral"
        || plain.searchParams.get("utm_term") !== artifact.searchText
        || plain.searchParams.has("nobi-conversation-id")
        || paid.origin !== "https://www.awin1.com" || paid.pathname !== "/cread.php"
        || paid.searchParams.get("awinmid") !== "6988" || paid.searchParams.get("awinaffid") !== "3122300"
        || paid.searchParams.get("clickref") !== artifact.defaultOuterReference
        || paid.searchParams.get("ued") !== offer.plain) reject();
  } catch {
    reject();
  }
  return offer;
}

const VerifiedLink = validateMarleySpoonLink(MarleySpoonLinkArtifact);

/** An authored subscription offering, separate from all physical product catalogs and product-price filters. */
export const MarleySpoonOffer = Object.freeze({
  id: VerifiedLink.id,
  name: VerifiedLink.name,
  storeName: "Marley Spoon",
  kind: VerifiedLink.kind,
  priceBasis: VerifiedLink.priceBasis,
  currency: "USD",
  owningMerchantId: VerifiedLink.owningMerchantId,
  query: MarleySpoonLinkArtifact.searchText,
  code: ApprovedCode,
  url: VerifiedLink.plain,
  encodedStoreLink: encodePaidLink(VerifiedLink.paid),
  paidLink: VerifiedLink.paidLink,
});

/** Shared canonical metadata; a subscription calculator is not a one-time physical Product offer. */
export const MarleySpoonSeo = {
  path: MarleySpoonPath,
  image: "https://nobi.ai/media/marley-cost-01-intro-to-full.png",
  title: "Marley Spoon Cost Calculator: First Five Deliveries & Full Price | Shop Nobi",
  description: "See food, shipping and the next full-price delivery for Marley Spoon’s two-person, three-meal plan. Calculate a dated introductory offer in delivered boxes.",
  schema: [
    {
      "@context": "https://schema.org", "@type": "WebPage",
      name: "Marley Spoon delivery-cost calculator", url: `https://nobi.ai${MarleySpoonPath}`, dateModified: "2026-10-17",
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Shop Nobi", item: "https://nobi.ai/shop" },
        { "@type": "ListItem", position: 2, name: "Marley Spoon cost", item: `https://nobi.ai${MarleySpoonPath}` },
      ],
    },
  ],
};
