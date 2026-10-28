// Manufacturer descriptions reviewed October 28, 2026; no clinical or inventory claims.
const ReviewedModels = [
  {
    identity: { name: "The Hand Lotion", brand: "Nécessaire", productVariantId: "1d385102-fb45-40be-af91-929c0b0ab092", owningMerchantId: "ca18a75e-fd99-460f-9521-f5fa8988a0a2", url: "https://necessaire.com/products/the-hand-lotion-santal?variant=43171659415665" },
    model: "Nécessaire The Hand Lotion, Santal",
    setup: "500 mL / 16.9 fl oz. The reviewed model is a hand lotion.",
    adjustment: "Maker describes sandalwood, black pepper, iris and jasmine fragrance notes.",
    fit: "Compare this larger volume for your hand-care spot. Check the selected Santal label rather than assuming another scent or a fragrance-free formula.",
    source: "https://necessaire.com/products/the-hand-lotion-santal",
  },
  {
    identity: { name: "Kérylos Hand + Body Lotion - 350ml / 11.8fl.oz", brand: "L'OBJET", productVariantId: "c7d3db4b-8493-4e70-85cd-b092b4772f1e", owningMerchantId: "70816b0f-8493-4508-ba9c-5697174d4225", url: "https://l-objet.com/products/kerylos-hand-body-lotion-350ml-11-8fl-oz?variant=44640776945820" },
    model: "L'OBJET Kérylos Hand + Body Lotion",
    setup: "350 mL / 11.8 fl oz. Maker labels this model for hands and body.",
    adjustment: "Maker describes citrus notes of yuzu, mandarin and grapefruit alongside white musk, sandalwood and herbs.",
    fit: "A labeled hand-and-body option if you want one lotion for both uses. Distinguish the lotion from the similarly named Kérylos soap and perfume.",
    source: "https://www.l-objet.com/products/kerylos-hand-body-lotion-350ml-11-8fl-oz",
  },
];

/** Keeps specifications only for the exact reviewed listings; never changes product cards. */
function matchingModels(page) {
  if (page.publicationFilteredProducts) return [];
  return [...new Set(page.products.map(product => ReviewedModels.find(({ identity }) =>
    Object.entries(identity).every(([field, value]) => product[field] === value))).filter(Boolean))];
}

/** Replaces unsupported benefit claims with concrete scent, volume and intended-use comparisons. */
export function withHandLotionComparison(page) {
  const models = matchingModels(page);
  const { comparison, guideSources, ...rest } = page;
  return {
    ...rest,
    title: "Hand Lotions: Compare Scents, Bottle Sizes & Uses",
    description: "Compare hand lotions by selected scent, labeled volume and stated hand or hand-and-body use. Check the exact formula and container before choosing.",
    guide: [
      "Start with the product's intended use and exact scent. A hand lotion, hand-and-body lotion and similarly named hand soap are different purchases. Check the selected product type before comparing a brand's fragrance collections; a shared scent name does not make the products interchangeable.",
      "Compare the labeled volume in the same units, then check the container and where you plan to keep it. A larger bottle may suit a sink or desk, while a bag purchase needs a size and closure you can carry. Volume alone does not establish the bottle's dimensions, pump design or suitability for travel.",
      "Read the selected scent description separately from the ingredient list. A fragrance note is a description of the smell, not proof that the named plant is an ingredient or provides a skin benefit. Check the current packaging for formula details; price and premium wording do not establish how rich, fast-absorbing or suitable a lotion will be for you.",
      "Use the Shop Nobi search box below with your preferred scent or fragrance-free requirement, bottle size, intended use and budget. Open shortlisted listings to confirm the exact formula, container and current purchase details. The comparison summarizes manufacturer descriptions, not hands-on testing, a skin-care recommendation or a ranking.",
    ],
    faq: [
      { question: "Does a higher price mean a richer hand lotion?", answer: "Price alone does not establish texture or richness. Compare the exact formula description and labeled volume instead of assuming that a more expensive bottle will feel richer or absorb differently." },
      { question: "Are fragrance notes the same as ingredients?", answer: "No. Scent notes describe a fragrance profile; use the current ingredient list to identify what the formula contains. Do not infer a botanical skin benefit from a fragrance name." },
      { question: "Is hand-and-body lotion the same product as hand soap?", answer: "No. Check the full product type when a brand sells lotion, soap and perfume under the same scent name. Choose the lotion's stated intended use, not just the matching fragrance." },
      { question: "What should I compare for a sink bottle versus a bag?", answer: "Compare labeled volume, container dimensions and closure. Check whether the selected item is a pump, tube or another format and how it closes; a small volume alone does not establish that it is suitable to carry." },
    ],
    ...(models.length ? {
      comparison: {
        caption: "Hand lotion scent, size and use comparison",
        note: "Manufacturer descriptions reviewed October 28, 2026. Confirm the selected formula, scent, volume and container with the retailer.",
        columns: ["Model", "Labeled volume & use", "Scent description", "Choosing between them"],
        rows: models.map(({ model, setup, adjustment, fit }) => ({ model, setup, adjustment, fit })),
      },
      guideSources: models.map(({ model, source }) => ({ label: `${model}: manufacturer description`, url: source })),
    } : {}),
  };
}
