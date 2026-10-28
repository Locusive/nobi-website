// Manufacturer model facts reviewed October 28, 2026; exact catalog identities govern each row.
const ReviewedModels = [
  {
    identity: { name: "Ondulato Dinner Napkins", brand: "NAPKINS", productVariantId: "142cd079-6e4c-456f-94fd-5a58a31722bb", owningMerchantId: "f31da6c8-e8b1-49c8-9831-b5ba5bc8deda", url: "https://sferra.com/products/ondulato-dinner-napkins?variant=41969994137663" },
    model: "SFERRA Ondulato Dinner Napkins",
    setup: "Dinner napkins, set of four, with a contrasting border.",
    adjustment: "20 × 20 inches; 100% linen in a plain weave. Check the selected color separately.",
    fit: "Maker permits cold gentle machine washing, then line drying or low tumble drying; remove while damp. Do not use bleach or fabric softener.",
    source: "https://www.sferra.com/products/ondulato-dinner-napkins",
  },
  {
    identity: { name: "Napa Napkins, Set of 4 - Blue", brand: "Sharland", productVariantId: "143c4d76-2bc8-468f-905d-6e9a1dc281fe", owningMerchantId: "3f4bfa3b-9d2d-442b-8a90-52c18f04e837", url: "https://hawkinsnewyork.com/products/napa-napkins-set-of-4-blue?variant=44041459728472" },
    model: "Sharland England Napa Napkins",
    setup: "Set of four embroidered linen napkins, offered here through Hawkins New York.",
    adjustment: "Maker specifies 50 × 50 cm and 100% hand-loomed linen. Compare the unfolded size with your intended place setting.",
    fit: "Maker and retailer specify cold hand washing and no tumble drying. Iron on the reverse; do not transfer another linen napkin's machine-wash instructions to this set.",
    source: "https://sharland-england.com/collections/napa/products/napa-napkin",
  },
  {
    identity: { name: "Matouk Wave Cocktail Napkins - Provence", brand: "Matouk", productVariantId: "0fca83ac-12e9-4b82-8bdd-d969936ab27d", owningMerchantId: "c81fe899-3fa2-41f4-93b6-c8058bd5db15", url: "https://flandb.com/products/matouk-wave-cocktail-napkins-provence?variant=41139484819504" },
    model: "Matouk Wave Cocktail Napkins",
    setup: "Cocktail napkins, set of six. Compare this serving format separately from dinner napkins.",
    adjustment: "100% linen. Confirm the exact dimensions and shape of the selected set with the retailer.",
    fit: "Check the selected item's care label and embroidery instructions before washing. A shared linen composition does not establish identical care across these models.",
    source: "https://www.matouk.com/products/wave-cocktail-napkin-set-of-6?color=Provence",
  },
];

/** Retains only exact reviewed model identities, without deduplicating or changing product cards. */
function matchingModels(page) {
  if (page.publicationFilteredProducts) return [];
  return [...new Set(page.products.map(product => ReviewedModels.find(({ identity }) =>
    Object.entries(identity).every(([field, value]) => product[field] === value))).filter(Boolean))];
}

/** Adds useful format and care comparisons while preserving the catalog and search context. */
export function withClothNapkinComparison(page) {
  const models = matchingModels(page);
  const { comparison, guideSources, ...rest } = page;
  return {
    ...rest,
    title: "Cloth Napkins: Compare Dinner Sizes, Set Counts & Care",
    description: "Compare cloth napkins by dinner or cocktail format, unfolded size, pieces per set and model-specific care. Check linen and embroidered options before choosing.",
    guide: [
      "Choose the serving format first. Dinner napkins and cocktail napkins are different options, even when both use linen or decorative embroidery. Compare the unfolded dimensions and intended use in the exact listing rather than judging size from a styled table photograph.",
      "Count the pieces in the selected package before planning place settings. A single napkin, a four-pack and a six-pack cover different quantities. Check whether a displayed amount is for one piece or the complete set, and confirm the selected option before comparing offers.",
      "Read care instructions for the specific model and its embroidery or finish. Linen content alone does not tell you whether machine washing or tumble drying is permitted. If an item requires hand washing or forbids tumble drying, treat that as a purchase consideration rather than replacing it with a general linen-care rule.",
      "Use the Shop Nobi search box below with dinner or cocktail use, desired dimensions, number of pieces, preferred fabric and budget. Open the selected retailer listing to verify package contents, care instructions and available options. The comparison summarizes documented model details rather than tested absorbency, stain resistance or shrinkage.",
    ],
    faq: [
      { question: "Are cocktail napkins interchangeable with dinner napkins?", answer: "Check the dimensions and serving purpose before substituting one for the other. Cocktail and dinner labels describe different formats; compare the unfolded size of the selected item with your intended use." },
      { question: "How many cloth napkins should I buy?", answer: "Start with the number of place settings or serving uses you want to cover, then check the pieces in each selected package. A four-pack and a six-pack are different quantities; do not assume every listing or displayed price represents the same set size." },
      { question: "Can every linen napkin go in the washing machine and dryer?", answer: "No. Follow the exact model's care label, including instructions for embroidery and finishes. Some models permit gentle machine washing, while others specify hand washing and prohibit tumble drying. Linen composition alone does not settle the choice." },
      { question: "Does heavier linen guarantee better absorbency or less shrinkage?", answer: "Do not infer those outcomes from material name, weight or price alone. Check any documented product-specific testing or claims and the exact care instructions; this comparison does not rank tested absorbency or predict shrinkage." },
    ],
    ...(models.length ? {
      comparison: {
        caption: "Cloth napkin format and care comparison",
        note: "Manufacturer model details reviewed October 28, 2026. Confirm the selected set's dimensions, piece count, options and care label with the retailer.",
        columns: ["Model", "Format & set", "Size & material", "Care to check"],
        rows: models.map(({ model, setup, adjustment, fit }) => ({ model, setup, adjustment, fit })),
      },
      guideSources: models.map(({ model, source }) => ({ label: `${model}: manufacturer specifications`, url: source })),
    } : {}),
  };
}
