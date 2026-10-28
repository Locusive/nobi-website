// Manufacturer model facts reviewed October 28, 2026; exact catalog identities govern each row.
const ReviewedModels = [
  {
    identity: { name: "Patch Pocket Button Down - Brown", brand: "State and Liberty Clothing Company", productVariantId: "5e19b787-7371-4592-96e4-70e9e104ee37", owningMerchantId: "a375e5e8-67d3-40e5-9a25-f94e818d590d", url: "https://stateandliberty.com/products/patch-pocket-button-down-brown?variant=41659581235281" },
    model: "State and Liberty Patch Pocket Button Down, Brown",
    setup: "55% acrylic, 40% polyester and 5% spandex; brushed flannel-style fabric.",
    adjustment: "Maker describes an athletic fit with more upper-body room and a tapered waist. Semi-spread collar with a hidden button.",
    fit: "Delicate machine wash on tap cold with like colors; hang to dry. Check the selected item's care label before laundering.",
    source: "https://stateandliberty.com/products/patch-pocket-button-down-brown",
  },
  {
    identity: { name: "Franklin Relaxed Corduroy Shirt Brown", brand: "Rowing Blazers", productVariantId: "0835d39f-4a32-4585-9baf-f4049950181f", owningMerchantId: "53bb16f4-790d-4a62-9dd8-22f8022dc642", url: "https://rowingblazers.com/products/men-s-franklin-relaxed-corduroy-shirt-brown?variant=45766535086114" },
    model: "Rowing Blazers Franklin Relaxed Corduroy Shirt, Brown",
    setup: "98% cotton and 2% spandex; corduroy construction.",
    adjustment: "Maker labels the cut relaxed. Check its garment measurements and the selected size instead of equating relaxed with another brand's size.",
    fit: "Machine wash cold with like colors; maker permits low-heat tumble drying and low-heat ironing. Do not bleach.",
    source: "https://rowingblazers.com/products/men-s-franklin-relaxed-corduroy-shirt-brown",
  },
  {
    identity: { name: "Midweight Pique Button-Down Shirt", brand: "Wool&Prince", productVariantId: "17683b97-ef20-499d-bc4d-b991250a542d", owningMerchantId: "e827a2b1-16ff-4712-9bcf-40e9092d318c", url: "https://woolandprince.com/products/midweight-pique-button-down-shirt-espresso?variant=43541472313432" },
    model: "Wool&Prince Midweight Pique Button-Down, Espresso",
    setup: "61% merino wool and 39% nylon; 325 gsm pique knit with a small honeycomb texture.",
    adjustment: "Maker describes a semi-fitted cut, classic collar and buttoned cuffs. Compare the selected size chart before choosing it as a first or additional layer.",
    fit: "Machine wash cold on gentle; maker prefers laying flat to dry and also permits low tumble drying. Follow the selected item's label.",
    source: "https://woolandprince.com/products/midweight-pique-button-down-shirt-espresso",
  },
];

/** Retains exact reviewed model identities without modifying or deduplicating product cards. */
function matchingModels(page) {
  if (page.publicationFilteredProducts) return [];
  return [...new Set(page.products.map(product => ReviewedModels.find(({ identity }) =>
    Object.entries(identity).every(([field, value]) => product[field] === value))).filter(Boolean))];
}

/** Adds composition, cut and care comparisons while preserving the catalog and search context. */
export function withBrownShirtComparison(page) {
  const models = matchingModels(page);
  const { comparison, guideSources, ...rest } = page;
  return {
    ...rest,
    title: "Brown Button-Down Shirts: Compare Fabrics, Fits & Care",
    description: "Compare brown button-down shirts by fabric composition, knit or corduroy construction, cut and care. Check exact measurements and selected colors before choosing.",
    guide: [
      "Start with fabric composition and construction, not color alone. A brown shirt may use a synthetic brushed fabric, cotton-blend corduroy or a merino-blend pique knit. Read the percentages and construction for the exact model rather than treating flannel, corduroy and knit as interchangeable fiber names.",
      "Compare the intended wearer and size chart before comparing fit labels. Athletic, relaxed and semi-fitted are model descriptions, not matching measurements across brands. Check chest, shoulder, sleeve and body length where provided, allowing for any layer you plan to wear underneath.",
      "Inspect the selected color, pattern, collar and pocket details separately. A brown category can include solid shades, plaids and contrasting details; check the exact option and photographs. A button-front shirt does not by itself establish how its collar fastens or whether the hem length suits your preferred tucked or untucked styling.",
      "Use the Shop Nobi search box below with your size, preferred fabric, cut, brown shade and budget. Open shortlisted listings to confirm measurements and care requirements. Some models specify hanging or flat drying while others permit low tumble drying; do not apply a single washing recipe to every brown shirt.",
    ],
    faq: [
      { question: "Are flannel and corduroy always cotton fabrics?", answer: "Read the fiber percentages for the exact shirt. Flannel and corduroy describe fabric styles rather than a guaranteed fiber composition; do not infer cotton content from either label." },
      { question: "Do athletic, relaxed and semi-fitted shirts use the same sizing?", answer: "Do not assume they do. Compare the maker's measurements and size chart for the intended wearer, including chest, shoulder, sleeve and body length where available. The cut label does not guarantee the same fit across brands." },
      { question: "Can all brown button-down shirts go in the tumble dryer?", answer: "No. Read the selected model's drying instructions and follow any requirement to hang or lay it flat. Use tumble drying only when that item's label permits it, at the specified setting; color does not establish a drying method." },
      { question: "Does a brown button-down listing mean a solid brown shirt with a buttoned collar?", answer: "Check both details in the exact listing. Brown can describe one shade in a patterned design, and collar fastening is separate from the shirt's front buttons. Use the selected option's photos and specifications before choosing." },
    ],
    ...(models.length ? {
      comparison: {
        caption: "Brown shirt fabric, cut and care comparison",
        note: "Manufacturer model details reviewed October 28, 2026. Confirm the selected size, color, garment measurements and care label with the retailer.",
        columns: ["Model", "Fabric & construction", "Cut & details", "Care instructions"],
        rows: models.map(({ model, setup, adjustment, fit }) => ({ model, setup, adjustment, fit })),
      },
      guideSources: models.map(({ model, source }) => ({ label: `${model}: manufacturer specifications`, url: source })),
    } : {}),
  };
}
