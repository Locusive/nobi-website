import { encodePaidLink } from "../utils/shopNobiPaidLink.js";

/** Dated manufacturer facts for the Cove/Cubby comparison, checked in the United States storefront. */
export const CoveCubbyCheckedDate = "October 16, 2026";
export const CoveCubbyPath = "/tools/cove-vs-cubby";
export const CoveCubbySlug = "cove-vs-cubby";
/** This new authored surface is retained by event ingestion; exact report filtering needs separate backend support. */
export const CoveCubbyEntryPoint = "Shop Nobi Utility";

/**
 * Authored manufacturer facts and exact catalog identities, read back by root on October 16, 2026.
 * Both variants belong to Tuft & Paw merchant f3c865b2-81d8-4a3d-986e-0ef74fe4b67f.
 * Links are exact ShopNobiStoreLinkBuilder outputs, channel WEBSITE, null conversation, query Cove vs Cubby.
 * Generated October 17, 2026 UTC (October 16 in New York), from source 9ddf163b2e39a7577d148dba83af77de2cac73ca.
 * Provenance: affiliate-first-commission/agents/affiliate_brainstorm/research/link_builder_artifacts/links.json.
 * The offline builder run verified link construction, not live network credit or event persistence.
 */
export const CoveCubbyProducts = Object.freeze([
  Object.freeze({
    name: "Cubby",
    storeName: "Tuft & Paw",
    productId: "ecd4650e-766c-40f4-b524-12c5955f1f0d",
    productVariantId: "8d53bb35-6fbb-42d8-9f32-ac5c3b7e9ce7",
    width: 15.2,
    depth: 21.2,
    price: 69,
    currency: "USD",
    color: "#a3decf",
    sourceUrl: "https://www.tuftandpaw.com/products/cubby-litter-box?variant=40741601116233",
    url: "https://www.tuftandpaw.com/products/cubby-litter-box?variant=40741601116233&utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi&utm_term=Cove+vs+Cubby",
    encodedStoreLink: encodePaidLink("https://www.awin1.com/cread.php?awinmid=59149&awinaffid=3122300&clickref=shop_nobi&ued=https%3A%2F%2Fwww.tuftandpaw.com%2Fproducts%2Fcubby-litter-box%3Fvariant%3D40741601116233%26utm_source%3Dshop_nobi%26utm_medium%3Dreferral%26utm_campaign%3Dshop_nobi%26utm_term%3DCove%2Bvs%2BCubby"),
    feature: "Removable walls included. Scoop sold separately.",
    paidLink: true,
  }),
  Object.freeze({
    name: "Cove",
    storeName: "Tuft & Paw",
    productId: "e31477b8-0bd4-4142-a585-66bbe268853c",
    productVariantId: "be8c0769-3522-4530-8031-c96da3275a57",
    width: 16,
    depth: 26,
    price: 199,
    currency: "USD",
    color: "#c9d0fc",
    sourceUrl: "https://www.tuftandpaw.com/products/cove-litter-box-full?variant=40277967568969",
    url: "https://www.tuftandpaw.com/products/cove-litter-box-full?variant=40277967568969&utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi&utm_term=Cove+vs+Cubby",
    encodedStoreLink: encodePaidLink("https://www.awin1.com/cread.php?awinmid=59149&awinaffid=3122300&clickref=shop_nobi&ued=https%3A%2F%2Fwww.tuftandpaw.com%2Fproducts%2Fcove-litter-box-full%3Fvariant%3D40277967568969%26utm_source%3Dshop_nobi%26utm_medium%3Dreferral%26utm_campaign%3Dshop_nobi%26utm_term%3DCove%2Bvs%2BCubby"),
    feature: "Built-in storage for the included scoop, brush and dustpan.",
    paidLink: true,
  }),
]);

/** Shared page metadata for the browser and static HTML renderer. */
export const CoveCubbySeo = {
  path: CoveCubbyPath,
  title: "Cove vs Cubby: Dimensions & Floor-Space Calculator | Shop Nobi",
  description: "Compare Cove and Cubby litter-box dimensions and dated prices. Measure your floor space with an interactive exterior-footprint calculator.",
  image: "https://nobi.ai/media/cove-cubby-social-preview.png",
  schema: [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Cove vs Cubby: exterior dimensions and floor-space calculator",
      url: `https://nobi.ai${CoveCubbyPath}`,
      dateModified: "2026-10-16",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Shop Nobi", item: "https://nobi.ai/shop" },
        { "@type": "ListItem", position: 2, name: "Cove vs Cubby", item: `https://nobi.ai${CoveCubbyPath}` },
      ],
    },
  ],
};
