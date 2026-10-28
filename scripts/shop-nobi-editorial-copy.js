// Editorial corrections for selected search pages. Product facts and the shared build plan stay intact.

import { withPublicationQuality } from "./shop-nobi-publication-quality.js";
import { withMailboxClarification } from "./shop-nobi-mailbox-copy.js";
import { ClothingAccessoryCopy } from "./shop-nobi-clothing-accessory-copy.js";
import { AdditionalBuyingCopy } from "./shop-nobi-additional-buying-copy.js";
import { withCatalogSearchCopy, withEmptySearchCopy } from "./shop-nobi-catalog-copy.js";
import { CareGuideCopy } from "./shop-nobi-care-guide-copy.js";
import { MaterialGuideCopy } from "./shop-nobi-material-guide-copy.js";
import { JewelryGuideCopy } from "./shop-nobi-jewelry-guide-copy.js";
import { ApparelGuideCopy } from "./shop-nobi-apparel-guide-copy.js";
import { EquipmentGuideCopy } from "./shop-nobi-equipment-guide-copy.js";
import { ApparelSafetyGuideCopy } from "./shop-nobi-apparel-safety-guide-copy.js";
import { HouseholdSafetyGuideCopy } from "./shop-nobi-household-safety-guide-copy.js";
import { ApparelComparisonGuideCopy } from "./shop-nobi-apparel-comparison-guide-copy.js";
import { HouseholdComparisonGuideCopy } from "./shop-nobi-household-comparison-guide-copy.js";
import { ApparelFitGuideCopy } from "./shop-nobi-apparel-fit-guide-copy.js";
import { EquipmentFitGuideCopy } from "./shop-nobi-equipment-fit-guide-copy.js";

const OriginalSuitcaseGuide = "Blue suitcases on this page range from about $70 to $495. The collection includes hard-shell carry-ons, expandable checked bags, and a few novelty suitcases with built-in record players.";
const CorrectedSuitcaseGuide = "Shopping for travel luggage? Compare the carry-on and checked suitcases below. Suitcase-style record players are audio products, not bags for packing. Check each travel bag's dimensions and weight with the retailer before choosing.";
const OriginalSuitcaseQuestion = "Do built-in tech suitcases affect durability?";
const OriginalSuitcaseAnswer = "Tech features add weight and moving parts, so check reviews for long-term reliability.";
const OriginalWhiteGoldGuide = "14k white gold statement rings on this page are priced from $285 up to $2,309. They showcase bold designs such as clusters, twisted bands, signet shapes and gemstone settings, all crafted in white gold.";
const WhiteGoldQuestion = {
  question: "Does a white gemstone mean a ring is white gold?",
  answer: "No. The stone's colour and the ring's metal are separate details. Check the exact variant's stated metal and colour rather than relying on the gemstone name or product photograph.",
};

/** Distinguishes gemstone names from metal specifications without changing any product classifications. */
function withWhiteGoldClarification(page) {
  if (page.guide[0] !== OriginalWhiteGoldGuide) return page;
  const faq = page.faq.some(({ question }) => question === WhiteGoldQuestion.question)
    ? page.faq : [...page.faq, { ...WhiteGoldQuestion }];
  return {
    ...page,
    guide: ["Looking for white-gold metal? Check the exact variant's metal and colour in the retailer's details before choosing. A listing such as '14K Gold Cluster White Topaz Ring' names a white gemstone; that name alone does not establish that the ring's metal is white gold.", ...page.guide.slice(1)],
    faq,
  };
}

/** Corrects the observed luggage/audio confusion without overwriting subsequently refreshed guidance. */
function withSuitcaseClarification(page) {
  const questionIndex = page.faq.findIndex(({ question, answer }) =>
    question === OriginalSuitcaseQuestion && answer === OriginalSuitcaseAnswer);
  if (page.guide[0] !== OriginalSuitcaseGuide || questionIndex < 0) return page;

  return {
    ...page,
    guide: [CorrectedSuitcaseGuide, ...page.guide.slice(1)],
    faq: page.faq.map((entry, index) => index === questionIndex ? {
      question: "Are suitcase-style record players travel luggage?",
      answer: "No. In a suitcase record player, the case holds the audio equipment. If you need a bag for a trip, choose a carry-on or checked-luggage listing and check that exact bag's dimensions and weight with the retailer.",
    } : entry),
  };
}

const SterlingSilverRingCopy = {
  title: "Sterling Silver Rings: Compare Styles, Fit & Finish",
  description: "Compare sterling silver rings by shape, band width, fit and finish. Check each retailer's material details, sizing guidance and purchase policies before choosing.",
  guide: [
    "Start with the shape you want: a plain band, a signet or a more sculptural ring. Compare the profile and width in the retailer's measurements rather than judging size from a product photo.",
    "Check the listed ring sizes and the retailer's sizing guide. For a gift, confirm the recipient's size and check the exchange conditions before choosing a personalized or final-sale option.",
    "Read each product's material and finish description. Check whether stones, coatings or engraving have their own care requirements, and follow the retailer's instructions for that exact ring.",
    "Before buying, check current availability, the total cost including shipping, and the return or resizing options offered for the selected ring. The same style from another retailer may have different purchase conditions.",
  ],
  faq: [
    {
      question: "What should I compare when choosing a sterling silver ring?",
      answer: "Compare the shape, band width, available sizes, material description and finish. Use the retailer's measurements and product details to decide which ring suits your needs.",
    },
    {
      question: "How do I choose a ring size?",
      answer: "Use the sizing guidance for the exact ring and retailer. Confirm the size you need, and check exchange conditions before ordering a gift or a personalized piece.",
    },
    {
      question: "Can I resize or return the ring I choose?",
      answer: "Check the selected product's resizing, return and exchange terms before buying. Size selection, engraving and final-sale conditions can affect the options offered by the retailer.",
    },
    {
      question: "Which care instructions should I follow?",
      answer: "Follow the retailer's care instructions for the ring's stated materials, finish and any stones. Do not assume that instructions for a plain band apply to every coating or setting.",
    },
  ],
};

const PencilSkirtCopy = {
  title: "Pencil Skirts: Compare Stores, Fabrics & Fit",
  description: "Find pencil skirts across stores. Compare fabric, length, size guidance and care requirements, then check the selected skirt's price and return terms with the retailer.",
  guide: [
    "Looking for a place to buy a pencil skirt? Compare the retailer listings below, then open the skirt you like to check the selected size, color, current price and purchase terms. These are catalog options to compare, not a hands-on ranking.",
    "Start with how you will wear it. For a work outfit, compare the listed length, waistband and slit or closure details. For an occasion outfit, compare the finish and embellishment as well as the fit. Use the retailer's garment measurements and size guide rather than assuming the same size fits across brands.",
    "Check the exact fabric composition, lining and care label. A fabric name alone does not tell you whether the finished skirt stretches, feels comfortable or can be machine washed. Follow the instructions for the selected garment instead of a general rule for wool, leather or cotton.",
    "Want to narrow the options? Use the Shop Nobi search box below and describe your budget, preferred length, fabric and occasion. Before ordering, confirm availability, shipping costs and whether your selected item can be returned or exchanged.",
  ],
  faq: [
    {
      question: "Where can I buy pencil skirts online?",
      answer: "Compare the stores and pencil-skirt listings on this page, then follow the product link to the retailer. Confirm the exact size, color and current purchase terms there. You can also enter your budget and preferences in the Shop Nobi search box to look for a closer match.",
    },
    {
      question: "What should I compare before choosing a pencil skirt?",
      answer: "Compare garment measurements, length, waistband, slit or closure details, fabric composition, lining and care instructions. Check the retailer's size guide and return terms for the exact item.",
    },
    {
      question: "Does a pencil skirt need stretch?",
      answer: "Stretch is one detail to check alongside the cut and garment measurements. Read the exact fabric composition and fit description; a product photo or fabric name does not establish how the skirt will fit or move on you.",
    },
    {
      question: "Can I wash a pencil skirt at home?",
      answer: "Check the selected garment's care label or ask the retailer. Follow those instructions for washing, drying or professional cleaning; do not infer the method from the main fabric alone.",
    },
  ],
};

const SelectedPageCopy = {
  ...ClothingAccessoryCopy,
  ...AdditionalBuyingCopy,
  ...CareGuideCopy,
  ...MaterialGuideCopy,
  ...JewelryGuideCopy,
  ...ApparelGuideCopy,
  ...EquipmentGuideCopy,
  ...ApparelSafetyGuideCopy,
  ...HouseholdSafetyGuideCopy,
  ...ApparelComparisonGuideCopy,
  ...HouseholdComparisonGuideCopy,
  ...ApparelFitGuideCopy,
  ...EquipmentFitGuideCopy,
  "sterling-silver-rings": SterlingSilverRingCopy,
  "pencil-skirts": PencilSkirtCopy,
};

/**
 * Applies authored copy, then catalog-backed defaults for generic unreviewed search pages.
 * The original plan remains available unchanged to product, feed and Web Story generation.
 *
 * @param {object} page The normalized search page, including its existing products and links.
 * @returns {object} The publication copy, retaining reviewed overrides and unchanged product data.
 */
export function withAuthoredSearchPageCopy(page) {
  const published = applyAuthoredCopy(page);
  return published.products?.length ? withPublicationQuality(published) : published;
}

/** Selects reviewed copy before checking its price and publication consistency. */
function applyAuthoredCopy(page) {
  if ((page.products ?? []).length === 0) return withEmptySearchCopy(page);
  if (page.slug === "mailbox-posts") return withMailboxClarification(page);
  if (page.slug === "14k-white-gold-statement-rings") return withWhiteGoldClarification(page);
  if (page.slug === "blue-suitcases") return withSuitcaseClarification(page);
  const copy = Object.hasOwn(SelectedPageCopy, page.slug) ? SelectedPageCopy[page.slug] : null;
  if (!copy) return withCatalogSearchCopy(page);

  return {
    ...page,
    ...copy,
    guide: [...copy.guide],
    faq: copy.faq.map((entry) => ({ ...entry })),
  };
}
