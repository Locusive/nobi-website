import { encodePaidLink } from "../utils/shopNobiPaidLink.js";
import { BaseusScreenLinkArtifact } from "./baseusScreenLinks.js";

export const BaseusScreenPath = "/tools/baseus-two-screens";
export const BaseusScreenSlug = "baseus-two-screens";
export const BaseusScreenQuery = "Baseus two independent screens";
export const BaseusScreenEntryPoint = "Shop Nobi Utility";
export const BaseusScreenCheckedDate = "October 17, 2026";

/** Primary product diagrams and software guidance; mirrored manuals retain their provenance caveat. */
export const BaseusScreenSources = Object.freeze({
  nu1: { label: "Baseus NU1 Air Mac: US specifications", url: "https://www.baseus.com/products/nomos-nu1-air-mac-12-in-1-docking-station" },
  nu1Modes: { label: "Baseus NU1 simultaneous-display diagram", url: "https://cdn.shopify.com/s/files/1/0555/8432/5709/files/Baseus_Nomos_NU1_Air_Mac_12_in_1_Docking_Station_A_3_2.jpg?v=1761297722" },
  nu1Power: { label: "Baseus NU1 laptop-power allocation diagram", url: "https://cdn.shopify.com/s/files/1/0555/8432/5709/files/Baseus_Nomos_NU1_Air_Mac_12_in_1_Docking_Station_A_5_1.jpg?v=1761297720" },
  rd1: { label: "Baseus RD1 Pro WIN: US specifications and Mac mirroring FAQ", url: "https://www.baseus.com/products/spacemate-rd1-pro-15-in-1-win-docking-station" },
  rd1Modes: { label: "Baseus RD1 Windows DP/DSC resolution diagram", url: "https://cdn.shopify.com/s/files/1/0555/8432/5709/files/Baseus_Spacemate_RD1_Pro_15_in_1__WIN__Docking_Station_A_9.jpg?v=1773994204" },
  manuals: { label: "Baseus official manual selector", url: "https://support.baseus.com/manual-download/manuals" },
  nu1Manual: { label: "Manufacturer B01144 manual, mirrored PDF", url: "https://manuals.plus/m/9de477c353c38dad9485e01c99763ca2fe9cef73898b0e766a4b8fb5442a52dc.pdf" },
  rd1Manual: { label: "Manufacturer B01146 manual, mirrored PDF", url: "https://manuals.plus/m/e9ee74b0212f4427e05334dc321493333fbaf5be9e0cde672285fe00bdeadb5e.pdf" },
  macSoftware: { label: "Synaptics DisplayLink: supported macOS versions", url: "https://www.synaptics.com/products/displaylink-graphics/downloads/macos" },
  windowsSoftware: { label: "Synaptics DisplayLink: Windows support", url: "https://www.synaptics.com/products/displaylink-graphics/downloads/windows" },
  permission: { label: "DisplayLink: Mac permission and background setup", url: "https://support.displaylink.com/knowledgebase/articles/2024872-displaylink-manager-first-time-configuration" },
  protected: { label: "DisplayLink: protected-video limitation", url: "https://support.displaylink.com/knowledgebase/articles/830301-content-protected-video-does-not-play-on-mac-while" },
  apple: { label: "Apple: check your Mac's exact external-display limits", url: "https://support.apple.com/en-ca/122212" },
});

/** Independent anchors from the reviewed catalog ledger; builder artifacts must retain these exact identities. */
const ReviewedBaseusMerchantId = "b9131d78-57d2-471a-a1b6-ea53bac35575";
const ReviewedCatalogIdentityByModel = Object.freeze({
  "nu1-air-mac": {
    productId: "70af7de2-1e24-43e1-8b7a-5078134dac0b", productVariantId: "781f8333-bcea-4def-b9ed-cf325950f47a",
    productVariantInternalId: "42284962283597",
    sourceUrl: "https://www.baseus.com/products/nomos-nu1-air-mac-12-in-1-docking-station?variant=42284962283597",
  },
  "rd1-pro": {
    productId: "d8b411b9-71e2-4b67-9b12-36a3c129a6da", productVariantId: "4ba9ef25-133d-4360-86b5-2a2dc2b6c194",
    productVariantInternalId: "42798222934093",
    sourceUrl: "https://www.baseus.com/products/spacemate-rd1-pro-15-in-1-win-docking-station?variant=42798222934093",
  },
});

/** Fail the build if an authored record loses its real catalog identity or complete builder destination. */
export function validateBaseusScreenLink(record) {
  const reviewedIdentity = ReviewedCatalogIdentityByModel[record.id];
  const source = new URL(record.sourceUrl);
  const plain = new URL(record.plain);
  const paid = new URL(record.paid);
  if (!Object.hasOwn(ProductFacts, record.id) || !Object.hasOwn(ReviewedCatalogIdentityByModel, record.id)
    || [source.protocol, plain.protocol, paid.protocol].some(protocol => protocol !== "https:")
    || record.owningMerchantId !== ReviewedBaseusMerchantId
    || Object.entries(reviewedIdentity).some(([fieldName, reviewedValue]) => record[fieldName] !== reviewedValue)
    || source.hostname !== "www.baseus.com" || plain.hostname !== source.hostname || source.pathname !== plain.pathname
    || !source.searchParams.get("variant") || source.searchParams.get("variant") !== plain.searchParams.get("variant")
    || paid.hostname !== "www.awin1.com" || paid.pathname !== "/cread.php"
    || paid.searchParams.get("awinmid") !== "38962" || paid.searchParams.get("awinaffid") !== "3122300"
    || paid.searchParams.get("ued") !== record.plain
    || record.paidLink !== true) throw new Error("Incomplete reviewed Baseus product link");
  return record;
}

const ProductFacts = {
  "nu1-air-mac": { name: "NU1 Air Mac", model: "B0114400 · manufacturer B01144", price: 199.99, highlight: "DisplayLink path for Mac or Windows", fact: "Single 4K60 or two 1440p60 displays. Two video groups, not four independent outputs." },
  "rd1-pro": { name: "RD1 Pro WIN", model: "B0114600 · manufacturer B01146", price: 299.99, highlight: "Native Windows DP/MST path", fact: "Two different Windows desktops with the right host. On a Mac, its two outputs mirror." },
};

export const BaseusScreenProducts = Object.freeze(BaseusScreenLinkArtifact.products.map(validateBaseusScreenLink).map(record => Object.freeze({
  ...ProductFacts[record.id], id: record.id, storeName: "Baseus", currency: "USD", productId: record.productId,
  productVariantId: record.productVariantId, owningMerchantId: record.owningMerchantId,
  sourceUrl: record.sourceUrl, url: record.plain, encodedStoreLink: encodePaidLink(record.paid), paidLink: record.paidLink,
})));

export const BaseusScreenSeo = {
  path: BaseusScreenPath,
  title: "Baseus NU1 vs RD1: Two Independent Screens? | Shop Nobi",
  description: "Check Baseus NU1 Air Mac and RD1 Pro display, DisplayLink, DSC and charging limits. A source-backed selector for independent screens, with honest unknowns.",
  image: "https://nobi.ai/media/baseus-independent-screens.png",
  schema: [{ "@context": "https://schema.org", "@type": "WebPage", name: "Will these Baseus docks show two different screens?", url: `https://nobi.ai${BaseusScreenPath}`, dateModified: "2026-10-17" }],
};
