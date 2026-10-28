// Maker facts reviewed October 28, 2026. The exact catalog identity controls whether each row can appear.
const ReviewedModels = [
  {
    identity: { name: "Women's Tall Quick-Dry Hiking Cargo Pants", brand: "Baleaf Sports", productVariantId: "bf5d2bc1-4736-4391-b3ec-9652299e0d72", owningMerchantId: "ddb8e266-8e8d-4a85-abcb-241ee0eec19d", url: "https://www.baleaf.com/products/straight-leg-hiking-cargo-pants?variant=51331782967477" },
    model: "Baleaf Tall Hiking Cargo, Khaki",
    setup: "Hiking design with elastic drawstring waist, four zip pockets and adjustable cuff cords.",
    adjustment: "Maker specifies a 31-inch inseam for its tall version.",
    fit: "91.4% polyester, 8.6% spandex. Compare the selected size's waist and hip measurements; tall is this maker's length designation.",
    source: "https://www.baleaf.com/products/straight-leg-hiking-cargo-pants?variant=51331782967477",
  },
  {
    identity: { name: "Laureate UPF50+ DWR Hiking Pants (Petite)", brand: "Baleaf Sports", productVariantId: "d2832b9c-9fea-4e58-baa6-16771b78d8e0", owningMerchantId: "ddb8e266-8e8d-4a85-abcb-241ee0eec19d", url: "https://www.baleaf.com/products/womens-petite-quick-dry-hiking-cargo-pants?variant=51331681812661" },
    model: "Baleaf Laureate Petite Hiking, Khaki",
    setup: "Hiking design with articulated knees, four zip pockets and an elastic drawstring waist.",
    adjustment: "Maker specifies a 27-inch inseam with a drawstring hem.",
    fit: "91.4% polyester, 8.6% spandex. Compare waist, hips and desired finished length; a petite label does not establish your size.",
    source: "https://www.baleaf.com/products/womens-petite-quick-dry-hiking-cargo-pants?variant=51331681812661",
  },
  {
    identity: { name: "Cotton Twill Leigh Pant - Khaki", brand: "ATM", productVariantId: "02453467-3bba-4311-a0bd-0f630b23edd7", owningMerchantId: "1ba020c1-343c-4ff6-b7c0-3331b989c795", url: "https://atmcollection.com/products/cotton-twill-wide-leg-pant-khaki?variant=43449931759695" },
    model: "ATM Cotton Twill Leigh, Khaki",
    setup: "Wide leg, flat front and medium rise; zip fly, belt loops and hook-and-bar closure.",
    adjustment: "Check the selected size chart for inseam and finished length.",
    fit: "100% cotton twill. Compare the waist, hips and rise for the selected size rather than transferring a size from the hiking styles.",
    source: "https://atmcollection.com/collections/womens-view-all/products/cotton-twill-wide-leg-pant-khaki",
  },
  {
    identity: { name: "Women's Field Double-Front Pants - Antique Khaki", brand: "Filson", productVariantId: "de26e25d-6dfe-411e-bcca-d2019430fe12", owningMerchantId: "e7bbac36-9069-4b11-a1ff-47e019dd1cde", url: "https://filson.com/products/womens-reverse-sateen-double-front-pants-antique-khaki?variant=47947640799384" },
    model: "Filson Field Double-Front, Antique Khaki",
    setup: "Straight leg, double-layer leg fronts and darted waistband; patch pockets and side tool pockets.",
    adjustment: "Maker lists a 30-inch inseam. Confirm the selected size's measurements.",
    fit: "8-oz. 100% cotton reverse sateen. Compare its reinforced construction with the trouser and hiking designs.",
    source: "https://www.filson.com/products/womens-reverse-sateen-double-front-pants-antique-khaki",
  },
];

/** Uses only exact reviewed identities and deduplicates table rows without altering product cards. */
function matchingModels(page) {
  if (page.publicationFilteredProducts) return [];
  return [...new Set(page.products.map(product => ReviewedModels.find(({ identity }) =>
    Object.entries(identity).every(([field, value]) => product[field] === value))).filter(Boolean))];
}

/** Publishes useful fit distinctions without changing the catalog or asserting a universal best pair. */
export function withKhakiPantsComparison(page) {
  const models = matchingModels(page);
  const { comparison, guideSources, ...rest } = page;
  return {
    ...rest,
    title: "Women's Khaki Pants: Compare Petite, Tall & Wide-Leg Fits",
    description: "Compare women's khaki pants by cut, maker-stated inseam and fabric. Distinguish petite and tall hiking designs from wide-leg trousers and reinforced cotton pants.",
    guide: [
      "Start with the type of pants you need. Khaki can describe a color, while shoppers may use it to mean chino-style trousers. These search results can include hiking, golf, yoga and tailored designs. Check the selected color and construction rather than treating every result as the same kind of office pant.",
      "For petite or tall shopping, compare inseam separately from waist, hips and rise. Measure a pair whose length works for you and decide whether you want an ankle-length or full-length finish. A brand's petite or tall label helps narrow the search, but it does not replace that style's measurements.",
      "For work, look at the details your dress code requires: leg shape, front closure, waistband and visible pockets. A flat-front trouser, cargo design and double-front pant make different choices. Read the fabric composition as well; a synthetic blend and cotton twill or reverse sateen do not establish the same construction or care requirements.",
      "Use the Shop Nobi search box below to enter the cut, inseam, rise, preferred fabric and budget you want. Open the retailer's selected variant to confirm its color, size chart, current price and availability. The comparison summarizes maker specifications for matching listings, not hands-on rankings or local store stock.",
    ],
    faq: [
      { question: "Are all women's khaki pants chino-style work trousers?", answer: "No. Khaki may name a color, and these search results can include hiking, golf, yoga and tailored designs. Check leg shape, pocket layout, fabric and closure against the type of pants and dress code you need." },
      { question: "How should I compare petite and tall khaki pants?", answer: "Compare the maker's inseam for the exact style, then check waist, hips and rise separately. Choose the finished length you want; a petite or tall label alone does not establish which size fits you." },
      { question: "Which details matter when choosing khaki pants for work?", answer: "Start with your workplace's dress requirements. Compare the front closure, leg shape, waistband and visible pockets, then verify fabric and care. A product marketed for travel or hiking is not automatically suitable for every office." },
      { question: "Does this comparison show khaki pants in stock near me?", answer: "No local store availability is established here. The product cards link to online retailers; confirm the selected color, size, delivery options and any store availability with that retailer." },
    ],
    ...(models.length ? {
      comparison: {
        caption: "Women's khaki pants comparison",
        note: "Manufacturer sources reviewed October 28, 2026. Lengths are maker specifications, not our measurements. Confirm the selected size and color with the retailer.",
        columns: ["Model", "Cut & construction", "Maker-stated length", "Fabric & fit check"],
        rows: models.map(({ model, setup, adjustment, fit }) => ({ model, setup, adjustment, fit })),
      },
      guideSources: models.map(({ model, source }) => ({ label: `${model}: manufacturer specifications`, url: source })),
    } : {}),
  };
}
