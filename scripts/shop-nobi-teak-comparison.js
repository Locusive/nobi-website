// Manufacturer model facts reviewed October 28, 2026; selected cushion colors are not asserted.
const ReviewedModels = [
  {
    identity: { name: "Teak Outdoor Armchair Conversation Set", brand: "Outer", productVariantId: "00622ffd-bf2f-4088-a079-498be0d2abe6", owningMerchantId: "46687be9-7a25-4e4e-8d14-80b72ea33e4d", url: "https://liveouter.com/products/teak-outdoor-armchair-conversation-set?variant=38246537920687" },
    model: "Outer Teak Armchair Conversation Set",
    setup: "Two armchairs. Do not infer an included sofa or table from a lifestyle photograph.",
    adjustment: "Separate chair positions for a conversation arrangement; check each chair's dimensions against your space.",
    fit: "Verify the selected cushion option and package contents. Measure space for any table you plan to add separately.",
    source: "https://liveouter.com/products/teak-outdoor-armchair-conversation-set",
  },
  {
    identity: { name: "Teak Sofa + Coffee Table Set", brand: "Outer", productVariantId: "3bf34d26-ceeb-4fd2-8f92-d101f0ba0131", owningMerchantId: "46687be9-7a25-4e4e-8d14-80b72ea33e4d", url: "https://liveouter.com/products/teak-sofa-coffee-table-set?variant=47162037698735" },
    model: "Outer Teak Sofa + Coffee Table Set",
    setup: "Maker describes a five-seat sofa with armchairs and a matching square coffee table.",
    adjustment: "Lounge seating with a coffee table. Check the full arrangement's dimensions and footprint with the maker.",
    fit: "Confirm the exact seating configuration, cushion option and table dimensions; this is a different arrangement from a dining set.",
    source: "https://liveouter.com/products/teak-sofa-coffee-table-set",
  },
  {
    identity: { name: "Teak + Aluminum Outdoor Extendable Dining Table + 8 595 Armless Chairs", brand: "Outer", productVariantId: "74d1e385-0625-44ee-b03a-a9a4a28c01cd", owningMerchantId: "46687be9-7a25-4e4e-8d14-80b72ea33e4d", url: "https://liveouter.com/products/teak-aluminum-outdoor-expandable-dining-table-8-595-armless-chairs?variant=45095746404527" },
    model: "Outer Extendable Dining Table + 8 Armless Chairs",
    setup: "Teak-and-aluminum extendable table with eight 595 armless chairs. Chair cushions are listed separately.",
    adjustment: "Table length: 87.6 inches closed, 134 inches extended. Maker states capacity for 8–12 people; this bundle includes eight chairs.",
    fit: "Measure the extended table footprint and room to move the chairs. A table's capacity does not add chairs or cushions to the bundle.",
    source: "https://liveouter.com/products/teak-aluminum-outdoor-expandable-dining-table-8-595-armless-chairs",
  },
];

/** Matches reviewed catalog identities without changing product cards or their ordering. */
function matchingModels(page) {
  if (page.publicationFilteredProducts) return [];
  return [...new Set(page.products.map(product => ReviewedModels.find(({ identity }) =>
    Object.entries(identity).every(([field, value]) => product[field] === value))).filter(Boolean))];
}

/** Adds model-specific set comparisons while retaining the original catalog and search context. */
export function withTeakSetComparison(page) {
  const models = matchingModels(page);
  const { comparison, guideSources, ...rest } = page;
  return {
    ...rest,
    title: "Teak Outdoor Furniture Sets: Compare Seating & Dining Bundles",
    description: "Compare teak outdoor furniture sets by included chairs, sofa and table configuration, footprint and optional cushions. Check the exact bundle before choosing.",
    guide: [
      "Start with how you will use the space: seated conversation, lounging around a coffee table or dining at a table. A conversation set, sofa bundle and dining set solve different layout needs. Read the included-items list before comparing prices; photos can show accessories or extra pieces outside the selected bundle.",
      "Compare the number of chairs supplied separately from the table's stated seating capacity. For an extendable table, measure its closed and extended footprint, then allow room for chairs to move and for your usual route through the space. A capacity figure alone does not tell you how many chairs are included.",
      "Check the materials and options component by component. A teak-and-aluminum dining set is not an all-teak construction, and chair cushions may be separate purchases. Verify the selected cushion option, covers and other accessories in the exact package. Follow the maker's care guidance for each component rather than applying one wood treatment to every surface.",
      "Use the Shop Nobi search box below with your intended arrangement, desired seat count, available space and budget. Open the retailer's selected listing to confirm dimensions, included pieces, delivery access and assembly details. The comparison summarizes manufacturer model descriptions; it is not a hands-on ranking or a promise of stock or delivery.",
    ],
    faq: [
      { question: "Does a conversation set always include a table?", answer: "No. Check the explicit package contents rather than the scene in a product photo. Two chairs, a sofa-and-table bundle and a dining set are different purchases even when all appear under outdoor furniture sets." },
      { question: "Does a table that seats twelve come with twelve chairs?", answer: "Not necessarily. Seating capacity describes the table, while the bundle's included-items list establishes the chair count. Check both, and confirm whether any cushions are separate purchases." },
      { question: "What should I measure for an extendable dining set?", answer: "Compare the table's closed and extended dimensions with your space, then account for chair movement, walking routes and delivery access. Do not plan the layout from the closed table length alone." },
      { question: "Are all parts of a teak outdoor furniture set made from teak?", answer: "Read each component's material description. A set may combine teak, aluminum and fabric, with different care instructions for each. Verify the exact package and optional accessories rather than treating the category name as a full materials specification." },
    ],
    ...(models.length ? {
      comparison: {
        caption: "Teak outdoor furniture set comparison",
        note: "Manufacturer model descriptions reviewed October 28, 2026. Confirm the selected package, cushion option and dimensions with the retailer.",
        columns: ["Model", "Included pieces", "Arrangement & footprint", "Before ordering"],
        rows: models.map(({ model, setup, adjustment, fit }) => ({ model, setup, adjustment, fit })),
      },
      guideSources: models.map(({ model, source }) => ({ label: `${model}: manufacturer specifications`, url: source })),
    } : {}),
  };
}
