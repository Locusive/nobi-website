// Manufacturer model facts reviewed October 28, 2026; exact catalog identities govern each row.
const ReviewedModels = [
  {
    identity: { name: "2.5mm Volt Link Cable Chain Necklace, Sterling Silver", brand: "Miansai", productVariantId: "9685ffaa-af00-4220-8c00-ad736cae1308", owningMerchantId: "e64b6f2f-5280-41e8-9bc6-8422ac644a6e", url: "https://miansai.com/products/2-5mm-volt-link-cable-chain-necklace-sterling-silver?variant=31967374147699" },
    model: "Miansai 2.5mm Volt Link Cable Chain",
    setup: "Sterling silver base with rhodium plating; elongated cable links.",
    adjustment: "2.5mm gauge; maker specifies a 24-inch chain length.",
    fit: "Lobster clasp. Check the clasp and pendant opening together before adding a pendant; the style name does not establish a supported pendant weight.",
    source: "https://www.miansai.com/products/2-5mm-volt-link-cable-chain-necklace-sterling-silver",
  },
  {
    identity: { name: "2.4mm Rope Chain Necklace, Sterling Silver", brand: "Miansai", productVariantId: "4d0d0a40-1225-41c2-b916-1188dc898abd", owningMerchantId: "e64b6f2f-5280-41e8-9bc6-8422ac644a6e", url: "https://miansai.com/products/2-4mm-rope-chain-necklace-sterling-silver?variant=39404243484787" },
    model: "Miansai 2.4mm Rope Chain",
    setup: "Sterling silver base with polished rhodium plating; twisted rope links.",
    adjustment: "2.4mm gauge; model offers 22- and 24-inch lengths. Confirm the selected option.",
    fit: "Compare the rope construction with a cable chain separately from length. Check closure details and care instructions for the plated finish on the exact item.",
    source: "https://www.miansai.com/products/2-4mm-rope-chain-necklace-sterling-silver",
  },
  {
    identity: { name: "Rope Chain Necklace, 2.5MM - Silver", brand: "Vincero", productVariantId: "9f80cd81-40d4-4e3e-b440-037e763b894e", owningMerchantId: "054f933b-7f32-4318-be0d-c67ef072d586", url: "https://vincerocollective.com/products/rope-chain-necklace-2-5mm-silver?variant=42473226862682" },
    model: "Vincero 2.5mm Rope Chain, Silver",
    setup: "316L stainless steel base with rhodium plating. Silver is the color option, not a sterling-silver composition claim.",
    adjustment: "2.5mm thickness; model offers 21-, 23- and 25-inch lengths. Confirm the selected option.",
    fit: "Custom parrot clasp. Compare this steel-based rope chain separately from sterling-silver models, even when their color and width look similar.",
    source: "https://vincerocollective.com/products/rope-chain-necklace-2-5mm-silver",
  },
];

/** Retains exact reviewed model identities without changing or deduplicating catalog product cards. */
function matchingModels(page) {
  if (page.publicationFilteredProducts) return [];
  return [...new Set(page.products.map(product => ReviewedModels.find(({ identity }) =>
    Object.entries(identity).every(([field, value]) => product[field] === value))).filter(Boolean))];
}

/** Adds material and dimension comparisons while retaining the catalog and visitor search context. */
export function withSilverChainComparison(page) {
  const models = matchingModels(page);
  const { comparison, guideSources, ...rest } = page;
  return {
    ...rest,
    title: "Men's Silver Chain Necklaces: Compare Metals, Widths & Lengths",
    description: "Compare men's silver chain necklaces by base metal, plating, rope or cable links, width and length. Distinguish sterling silver from silver-colored steel.",
    guide: [
      "Decide whether you want silver-colored jewelry or a sterling-silver base metal. Read base metal and plating as separate specifications: a rhodium finish can appear on either sterling silver or stainless steel. A Silver color label alone does not establish the metal underneath.",
      "Compare link construction and dimensions separately. Rope, cable, curb and Venetian describe different chain designs; millimeter width and inch length answer different sizing questions. Check the exact length option rather than treating a model's list of available lengths as the selected chain's measurement.",
      "Inspect the closure and any pendant you plan to add. Check whether the pendant opening accommodates the chain and its end fittings, then ask the maker about suitability for that pendant. Thickness alone does not prove greater durability, a secure closure or a safe pendant weight.",
      "Use the Shop Nobi search box below with your preferred base metal, chain style, width, length and budget. Open the selected listing to confirm its option and follow that item's care instructions, including any plated finish. The comparison lists manufacturer specifications rather than tested strength or wear performance.",
    ],
    faq: [
      { question: "Does a silver chain necklace always contain sterling silver?", answer: "No. Silver can describe the color. Check the base metal separately from plating: a silver-colored rhodium-plated steel chain and a rhodium-plated sterling-silver chain have different underlying materials." },
      { question: "What is the difference between chain width and length?", answer: "Width or gauge describes the chain's thickness, typically listed in millimeters here; length describes the necklace's overall length, listed in inches. Compare both and confirm the selected length option rather than assuming every model uses the same measurement." },
      { question: "Is a thicker chain always more durable or suitable for a pendant?", answer: "Thickness alone does not establish either. Check construction, the pendant opening and end fittings, and the maker's guidance for the particular chain and pendant. Do not assume every link chain supports the same pendant weight." },
      { question: "Can I use the same polish on every silver-colored chain?", answer: "Follow the maker's care instructions for the exact base metal and finish before using a polish or cloth. A silver-colored appearance does not mean every chain has the same composition or surface treatment." },
    ],
    ...(models.length ? {
      comparison: {
        caption: "Silver chain material and size comparison",
        note: "Manufacturer model details reviewed October 28, 2026. Confirm the selected length, base metal, plating and closure with the retailer.",
        columns: ["Model", "Metal & construction", "Width & length", "Closure & selection"],
        rows: models.map(({ model, setup, adjustment, fit }) => ({ model, setup, adjustment, fit })),
      },
      guideSources: models.map(({ model, source }) => ({ label: `${model}: manufacturer specifications`, url: source })),
    } : {}),
  };
}
