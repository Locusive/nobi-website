// Manufacturer facts reviewed October 29, 2026. Only exact retained variant identities expose model facts.
const ReviewedModels = [
  {
    identity: { name: "Corporal Stainless Steel - All Black", brand: "Nixon US", productVariantId: "f3799bef-e258-49c2-b30c-4d8c7c1fa00e", owningMerchantId: "df414edb-f63d-45e6-b4a3-d11e5dc72a0f", url: "https://nixon.com/products/corporal-stainless-steel-all-black?variant=40562711560385" },
    model: "Nixon Corporal Stainless Steel, All Black",
    setup: "48 mm case diameter; 12 mm case thickness.",
    adjustment: "Japanese quartz three-hand movement; Miyota 2036.",
    fit: "Compare the stated diameter and thickness with a watch you already wear; dimensions alone do not establish wrist fit.",
    source: "https://www.nixon.com/products/corporal-stainless-steel-all-black?variant=40562711560385",
  },
  {
    identity: { name: "Time Teller - Gunmetal / Black Sunray", brand: "Nixon US", productVariantId: "630c1aee-c174-43de-9cfb-4a25e972c123", owningMerchantId: "df414edb-f63d-45e6-b4a3-d11e5dc72a0f", url: "https://nixon.com/products/time-teller-gunmetal-black-sunray?variant=41411473375425" },
    model: "Nixon Time Teller, Gunmetal / Black Sunray",
    setup: "37 mm case diameter; 9 mm case thickness.",
    adjustment: "Japanese quartz three-hand movement; Miyota 2035.",
    fit: "Compare case size and the selected dial finish separately; a smaller case does not guarantee comfort or legibility.",
    source: "https://www.nixon.com/products/time-teller-gunmetal-black-sunray?variant=41411473375425",
  },
  {
    identity: { name: "Sentry Stainless Steel - All Black / Black", brand: "Nixon US", productVariantId: "ae5b1576-9626-42c4-a5e2-3df7af6fef82", owningMerchantId: "df414edb-f63d-45e6-b4a3-d11e5dc72a0f", url: "https://nixon.com/products/sentry-stainless-steel-all-black-black?variant=40562716541121" },
    model: "Nixon Sentry Stainless Steel, All Black / Black",
    setup: "42 mm case diameter; 12 mm case thickness.",
    adjustment: "Japanese quartz three-hand movement with day and date; Miyota 2305.",
    fit: "Consider whether you want day and date information alongside the hands, then check the selected dial's layout and bracelet sizing.",
    source: "https://www.nixon.com/products/sentry-stainless-steel-all-black-black?variant=40562716541121",
  },
];

/** Matches reviewed variants and deduplicates comparison rows without changing the product cards. */
function matchingModels(page) {
  if (page.publicationFilteredProducts) return [];
  return [...new Set(page.products.map(product => ReviewedModels.find(({ identity }) =>
    Object.entries(identity).every(([field, value]) => product[field] === value))).filter(Boolean))];
}

/** Adds sourced watch dimensions and movement distinctions only for supported catalog identities. */
export function withSteelWatchComparison(page) {
  const models = matchingModels(page);
  const { comparison, guideSources, ...rest } = page;
  return {
    ...rest,
    title: "Steel Analog Watches: Compare Case Size & Movement",
    description: "Compare steel analog watches by case diameter, thickness, movement and dial features. Check exact variants, bracelet sizing and manufacturer specifications.",
    guide: [
      "Start with case diameter and thickness as separate measurements. Compare them with a watch you already wear, then check the bracelet's sizing and adjustment options. A case diameter alone does not tell you how the complete watch will sit on your wrist or fit beneath a sleeve.",
      "Decide which information you want on the dial. A three-hand display and a display with day and date provide different features. Read the selected model's movement and dial description rather than assuming every analog watch has the same functions or battery and servicing requirements.",
      "Check the exact color and band material. A steel case does not establish a steel bracelet, and similar model names may identify different straps or finishes. Inspect the selected dial's hands, markers and layout for your preferences without treating all-black styling as a guarantee of easy reading.",
      "Use Shop Nobi search to enter your preferred case size, dial features, band type and budget. The comparison summarizes manufacturer specifications for matching variants, not hands-on rankings. Confirm current purchase terms, bracelet sizing and exact care instructions with the retailer; a material label alone does not establish scratch resistance or suitability for swimming.",
    ],
    faq: [
      { question: "How should I compare analog watch sizes?", answer: "Compare case diameter and thickness separately, then check bracelet sizing and adjustment options. Use a watch you already wear as a reference; the case dimensions alone do not establish fit or comfort." },
      { question: "What is the difference between three-hand and day/date displays?", answer: "Compare which information the selected dial provides. Day and date are additional features to check in the exact model's description; do not assume every analog watch includes them." },
      { question: "Does a steel watch always have a steel bracelet?", answer: "Read case and band materials separately. Similar model names can identify different straps or finishes, so confirm the exact selected variant and any replacement-band requirements." },
      { question: "Can I infer water or scratch resistance from stainless steel?", answer: "No. Check the exact model's stated water rating, permitted activities and care instructions. The case material alone does not establish swimming suitability, scratch resistance or a universal cleaning method." },
    ],
    ...(models.length ? {
      comparison: {
        caption: "Steel analog watch comparison",
        note: "Manufacturer specifications reviewed October 29, 2026 for the exact variants shown. Case measurements are maker specifications, not our measurements or a guarantee of fit.",
        columns: ["Model & selected finish", "Case dimensions", "Movement & dial features", "What to compare"],
        rows: models.map(({ model, setup, adjustment, fit }) => ({ model, setup, adjustment, fit })),
      },
      guideSources: models.map(({ model, source }) => ({ label: `${model}: manufacturer specifications`, url: source })),
    } : {}),
  };
}
