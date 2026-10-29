// Manufacturer descriptions reviewed October 29, 2026; exact identity gates keep facts tied to their reviewed variants.
const ReviewedModels = [
  {
    "identity": {
      "name": "Bedell Mid Brown Waxed Suede Chelsea Boot",
      "brand": "To Boot New York",
      "productVariantId": "f3177de2-2e6e-4c0f-a703-15d6b1ae4638",
      "owningMerchantId": "1c310dcd-3b74-4e97-9274-b2d2b3eb5c4f",
      "url": "https://toboot.com/products/bedell-mid-brown?variant=12152477974564"
    },
    "model": "To Boot New York Bedell, Mid Brown",
    "setup": "Chelsea boot; hand-waxed Italian mezzo vitello suede.",
    "adjustment": "Elastic side gore panels and pull tab.",
    "fit": "Blake-stitched leather sole; stacked leather heel.",
    "source": "https://toboot.com/products/bedell-mid-brown?variant=12152477974564"
  },
  {
    "identity": {
      "name": "Javier Dark Brown Suede Desert Boot",
      "brand": "To Boot New York",
      "productVariantId": "13a0189a-bff2-49f1-8ed0-8eff920b5a18",
      "owningMerchantId": "1c310dcd-3b74-4e97-9274-b2d2b3eb5c4f",
      "url": "https://toboot.com/products/javier-dark-brown-suede?variant=42113847427249"
    },
    "model": "To Boot New York Javier, Dark Brown Suede",
    "setup": "Desert boot; Italian calf suede.",
    "adjustment": "Padded collar and contrast-stitch welt.",
    "fit": "Air-injected rubber lug sole.",
    "source": "https://toboot.com/products/javier-dark-brown-suede?variant=42113847427249"
  },
  {
    "identity": {
      "name": "Remy Brown Suede Lug Boot",
      "brand": "Loeffler Randall",
      "productVariantId": "78738004-94cd-4596-9919-95eee5b44254",
      "owningMerchantId": "aff9c674-10c5-4d24-9c8a-b1f2b9a369bf",
      "url": "https://loefflerrandall.com/products/remy-brown-suede-weather-boot?variant=47157259337780"
    },
    "model": "Loeffler Randall Remy, Brown",
    "setup": "Lace-up lug boot; split suede, 100% bovine-leather upper.",
    "adjustment": "Lace-up entry and padded shaft.",
    "fit": "100% rubber outsole; maker-stated 0.5-inch heel.",
    "source": "https://loefflerrandall.com/products/remy-brown-suede-weather-boot?variant=47157259337780"
  }
];

/** Selects exact reviewed models without changing card order or product data. */
function matchingModels(page) {
  if (page.publicationFilteredProducts) return [];
  return ReviewedModels.filter(({ identity }) => page.products.some(product =>
    Object.entries(identity).every(([field, value]) => product[field] === value)));
}

/** Adds a sourced comparison of distinct brown-suede boot styles for matching listings. */
export function withBrownSuedeComparison(page) {
  const models = matchingModels(page);
  const { comparison, guideSources, ...rest } = page;
  return {
    ...rest,
    title: "Brown Suede Boots: Compare Styles, Materials & Soles",
    description: "Compare brown suede boots by Chelsea, desert and lace-up styling, upper material, entry details and sole construction. Check each maker's sizing before choosing.",
    guide: [
      "Choose the boot silhouette before comparing details. Chelsea, desert and lace-up lug boots have different shapes and entry designs. Decide whether you want elastic side panels or an adjustable lace-up opening, then compare shaft shape and how the boot works with the trousers or skirt you plan to wear.",
      "Read upper and sole descriptions separately. Waxed suede and split suede identify different upper treatments or construction, while leather soles and rubber lug soles describe the bottom of the boot. Compare the maker's exact material and construction information instead of treating every brown suede boot as the same design.",
      "Use each brand's size system and intended-wearer size chart. Do not transfer a size number between different intended-wearer ranges or assume two brands use the same fit. Check foot measurements, width guidance and return terms for your selected option, and allow for the socks you intend to wear.",
      "Enter the model name, brown shade, silhouette, size and budget in Shop Nobi search to narrow the choices. Check the exact retailer option before buying. Follow the maker's care instructions for that upper and finish, including whether a cleaning or protective product is appropriate; a suede label or lug sole alone does not establish weather protection or grip.",
    ],
    faq: [
      { question: "How do I choose between Chelsea, desert and lace-up boots?", answer: "Start with the shape and opening you want. Compare elastic panels, pull tabs, laces and collar details on the specific model, then check shaft shape and how it pairs with your clothing. A style name does not replace the maker's fit guidance." },
      { question: "Which materials should I compare on brown suede boots?", answer: "Check the upper, lining and outsole separately. Note any stated wax treatment or split-suede construction, then compare the actual sole material and attachment details. Use each maker's care directions for the selected finish." },
      { question: "Can I compare the size numbers across brands directly?", answer: "Use the size system and intended-wearer chart for each listing, then compare foot measurements and width guidance. A matching number across brands, or a larger number in another range, does not establish equivalent fit." },
      { question: "What should I check about leather and rubber lug soles?", answer: "Compare the stated material, tread shape, heel height where provided and construction method. Check the maker's guidance for intended use and care rather than assuming one sole lasts longer or is suitable for wet conditions." },
    ],
    ...(models.length ? {
      comparison: {
        caption: "Brown suede boot model comparison",
        note: "Manufacturer descriptions reviewed October 29, 2026. These are distinct silhouettes and size ranges, not interchangeable fits or a ranking. Check the selected size with each maker.",
        columns: ["Model & brown shade", "Style & upper", "Entry & construction", "Sole & heel"],
        rows: models.map(({ model, setup, adjustment, fit }) => ({ model, setup, adjustment, fit })),
      },
      guideSources: models.map(({ model, source }) => ({ label: `${model}: manufacturer details`, url: source })),
    } : {}),
  };
}
