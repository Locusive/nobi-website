import { encodePaidLink } from "../utils/shopNobiPaidLink.js";
import { MindTheColorLinkArtifact } from "./mindTheColorLink.js";

export const MindTheColorSlug = "mindthecolor-fit";
export const MindTheColorPath = `/tools/${MindTheColorSlug}`;
export const MindTheColorEntryPoint = "Shop Nobi Utility";
export const MindTheColorCheckedDate = "October 17, 2026";
const OwnerId = "60d421ce-9781-4b68-bb71-5856eae571f3";
const SourceUrl = "https://carlodiamanti.gumroad.com/l/Mindthecolor3";
const Topic = "MindTheColor Photoshop requirements";

/** Primary sources for one dated software license, not an installed-software review. */
export const MindTheColorSources = Object.freeze({
  creator: { name: "Creator’s price and product overview", url: "https://www.mindthecolor.com/" },
  product: { name: "Gumroad product, current checkout price and refund notice", url: SourceUrl },
  manual: { name: "Official v3 manual: installation and activation, pages 19–27", url: "https://www.mindthecolor.com/_files/ugd/2c2887_1acc02b8042c4b4494728d12f27a40db.pdf" },
  license: { name: "Creator’s license: users, permitted work, restrictions and refunds", url: "https://www.mindthecolor.com/license-terms-2" },
  adobe: { name: "Adobe’s version-specific Photoshop system requirements", url: "https://helpx.adobe.com/photoshop/system-requirements.html" },
});

/** Refuse publication if supplied builder output loses the exact reviewed identity, tags or affiliate parameter. */
export function validateMindTheColorLink(artifact) {
  const offer = artifact?.offer;
  const reject = () => { throw new Error("MindTheColor needs a valid reviewed Java-built offer link before publication."); };
  if (artifact?.builderClass !== "ai.nobi.api.shop_nobi_store_links.ShopNobiStoreLinkBuilder"
      || artifact.channel !== "WEBSITE" || artifact.conversationId !== null
      || artifact.defaultOuterReference !== null || artifact.searchText !== Topic
      || !Number.isFinite(Date.parse(artifact.generatedAtUtc))
      || !/^[a-f0-9]{40}$/.test(artifact.provenance?.sourceCommit || "")
      || ["builderClassSha256", "configurationSha256", "outputSha256"].some(key => !/^[a-f0-9]{64}$/.test(artifact.provenance?.[key] || ""))
      || artifact.networkGuardSelfTestBlocked !== true || artifact.networkAttemptsByExercisedCode !== 0
      || offer?.id !== "mindthecolor-v3-personal-license" || offer.name !== "MindTheColor v3 personal license"
      || offer.kind !== "DIGITAL_SOFTWARE" || offer.priceBasis !== "PER_LICENSE"
      || offer.owningMerchantId !== OwnerId || offer.sourceUrl !== SourceUrl || offer.paidLink !== true
      || ["productId", "productVariantId", "productName", "productPrice", "conversationId"].some(key => key in offer)) reject();
  try {
    const tags = { utm_source: "shop_nobi", utm_medium: "referral", utm_campaign: "shop_nobi", utm_term: Topic };
    for (const [value, expected] of [[offer.plain, tags], [offer.paid, { ...tags, a: "480165219" }]]) {
      const url = new URL(value);
      if (url.origin + url.pathname !== SourceUrl || url.username || url.password || url.hash
          || [...url.searchParams].length !== Object.keys(expected).length
          || Object.entries(expected).some(([key, entry]) => url.searchParams.get(key) !== entry)) reject();
    }
  } catch {
    reject();
  }
  return offer;
}

const VerifiedLink = validateMindTheColorLink(MindTheColorLinkArtifact);

/** One authored digital license. The marketplace owner has no physical product catalog or catalog currency. */
export const MindTheColorOffer = Object.freeze({
  id: VerifiedLink.id, name: VerifiedLink.name, kind: VerifiedLink.kind, priceBasis: VerifiedLink.priceBasis,
  storeName: "MindTheColor on Gumroad", owningMerchantId: VerifiedLink.owningMerchantId,
  sourceUrl: SourceUrl, currency: "EUR", sourcePrice: 179, query: Topic,
  url: VerifiedLink.plain, encodedStoreLink: encodePaidLink(VerifiedLink.paid), paidLink: VerifiedLink.paidLink,
});

/** A requirements checklist uses WebPage metadata, without a fabricated product rating or USD offer. */
export const MindTheColorSeo = {
  path: MindTheColorPath,
  title: "MindTheColor 3: Photoshop Requirements & License Fit | Shop Nobi",
  description: "Check MindTheColor 3’s Photoshop, Internet and single-user license requirements before buying. Source price €179 plus VAT; Adobe Photoshop is separate.",
  image: "https://nobi.ai/media/mindthecolor-requirements.png",
  schema: [
    { "@context": "https://schema.org", "@type": "WebPage", name: "MindTheColor 3 requirements and license fit", url: `https://nobi.ai${MindTheColorPath}`, dateModified: "2026-10-17" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop Nobi", item: "https://nobi.ai/shop" },
      { "@type": "ListItem", position: 2, name: "MindTheColor requirements", item: `https://nobi.ai${MindTheColorPath}` },
    ] },
  ],
};
