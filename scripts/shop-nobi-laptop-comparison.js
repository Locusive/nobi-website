// Manufacturer specifications reviewed October 28, 2026 for these exact catalog variants.
// Prices and availability remain in the existing, refreshed product cards.
const ReviewedModels = [
  {
    identity: { name: "Fold Laptop Stand", brand: "Native Union", productVariantId: "494a2b20-be55-4e1e-ab8e-ec2e193a00e5", owningMerchantId: "8b76e973-941b-4bb3-8ec7-e50c6a5b6d36", url: "https://nativeunion.com/products/fold-laptop-stand?variant=43159401988235" },
    model: "Native Union Fold",
    setup: "Separate aluminum cross-frame; folds flat with a carry pouch.",
    adjustment: "15° tilt.",
    fit: "Maker specifies 13–16-inch laptops and a 3 kg load limit. Extend the frame fully before use.",
    source: "https://www.nativeunion.com/products/fold-laptop-stand?variant=43159401988235",
  },
  {
    identity: { name: "Desk Laptop Stand", brand: "Native Union", productVariantId: "674ef6b2-50dc-498b-ab04-4ba20a6fe062", owningMerchantId: "8b76e973-941b-4bb3-8ec7-e50c6a5b6d36", url: "https://nativeunion.com/products/desk-laptop-stand?variant=42909316874379" },
    model: "Native Union Desk",
    setup: "Weighted desktop base with a tray/pen holder; folds for storage.",
    adjustment: "Hinges adjust height and angle.",
    fit: "Maker specifies up to 5 kg and names the 16-inch MacBook Pro and 17-inch Alienware as examples. Check your model's dimensions.",
    source: "https://www.nativeunion.com/products/desk-laptop-stand?variant=42909316874379",
  },
  {
    identity: { name: "Rise Laptop Stand", brand: "Native Union", productVariantId: "1d36b88a-0d38-475f-b729-2c4348049996", owningMerchantId: "8b76e973-941b-4bb3-8ec7-e50c6a5b6d36", url: "https://nativeunion.com/products/rise-laptop-stand?variant=39381466579083" },
    model: "Native Union Rise",
    setup: "Attaches with adhesive gel and folds against the laptop.",
    adjustment: "Up to a 20° angle.",
    fit: "Maker specifies 13–16-inch laptops, up to 3 kg. Excludes laptops with ventilation slots or fans on the underside.",
    source: "https://www.nativeunion.com/products/rise-laptop-stand?variant=39381466579083",
  },
  {
    identity: { name: "Invisible Stand", brand: "NEW MS002", productVariantId: "40526b4e-75d2-4f68-a469-7a2f83223cf9", owningMerchantId: "22ef37de-70c0-4608-9b2c-c6175bb82ed4", url: "https://moft.com/products/invisible-stand?variant=41489878712407" },
    model: "MOFT Invisible, Large / Jet Black",
    setup: "Separate, non-adhesive folding stand; this row is for the Large variant.",
    adjustment: "15° and 25° modes.",
    fit: "Large is specified for laptops 15 inches and up, with an 11 lb load limit. MOFT also recommends Large for the 14-inch MacBook Pro because of its underside feet.",
    source: "https://www.moft.com/products/invisible-stand?variant=41489878712407",
  },
  {
    identity: { name: "Sit-stand Laptop Desk", brand: "MS015", productVariantId: "0c4f52f6-5d2b-4ed6-9b2f-ba3baf4ca54f", owningMerchantId: "22ef37de-70c0-4608-9b2c-c6175bb82ed4", url: "https://moft.com/products/moft-z-5-in-1-sit-stand-desk?variant=32287445155927" },
    model: "MOFT Z Sit-stand Laptop Desk",
    setup: "Folding desktop platform; folds to 1.3 cm thick.",
    adjustment: "25°, 45° and 60° seated settings; 25 cm standing-platform height.",
    fit: "Manufacturer FAQ specifies laptops up to 16 inches. Small securing flap: device thickness up to 10 mm and load up to 5 kg; large flap: up to 20 mm and 10 kg.",
    source: "https://www.moft.com/products/moft-z-5-in-1-sit-stand-desk?variant=32287445155927",
  },
];

/** Selects specifications only while all reviewed model, merchant and variant identity fields still match. */
function matchingModels(page) {
  // The shared publication rule withholds guidance sources when any source product was filtered.
  if (page.publicationFilteredProducts) return [];
  return [...new Set(page.products.map(product => ReviewedModels.find(({ identity }) =>
    Object.entries(identity).every(([field, value]) => product[field] === value))).filter(Boolean))];
}

/** Builds a small, source-backed comparison without changing catalog records or their order. */
export function withLaptopStandComparison(page) {
  const models = matchingModels(page);
  // Discard any previously generated table/sources before rebuilding from the present listings.
  const { comparison, guideSources, ...rest } = page;
  return {
    ...rest,
    title: "Laptop Stand Comparison: Attachment, Adjustment & Fit",
    description: "Compare laptop stand designs by attachment, adjustment and device fit. Check model-specific manufacturer specifications, then search for your laptop size and setup.",
    guide: [
      "Start a laptop stand comparison with how you will use it: a separate folding stand for moving between computers, an attached stand that travels with one laptop, or a desktop platform with height adjustment. These designs solve different setup needs; the highest angle or largest frame is not automatically the right choice.",
      "Compare the adjustment mechanism as well as its range. A fixed tilt, a hinged platform and a folding sit-stand desk offer different positions. Measure the space for the base and your keyboard or mouse, then check the stand's deployed and packed dimensions separately.",
      "Device fit involves more than screen size. Match your laptop's weight, underside feet, ventilation layout and thickness to the selected model's support surface, retaining lip and stated limits. A specification for one size or variant does not apply automatically to the others.",
      "Use the Shop Nobi search box below to describe your laptop size, whether you want adhesive attachment, how often you will carry the stand and your budget. Keep prices and retailer availability checks with the product listings; the comparison covers construction and fit rather than a tested ranking.",
    ],
    faq: [
      { question: "How do I choose between an attached and a separate laptop stand?", answer: "An attached design stays with one laptop, so check its attachment instructions and underside clearance. A separate stand can be moved between devices; compare its packed size and the support surface needed for each device." },
      { question: "Is a laptop's screen size enough to check stand compatibility?", answer: "No. Compare the exact model's size guidance with the laptop's weight, thickness, underside feet and vent locations. Check how its retaining lip or securing flap accommodates your device before choosing a variant." },
      { question: "Does adjustable mean both height and angle can change?", answer: "Not necessarily. Some stands offer a choice of tilt angles, while others use hinges or folded configurations to change elevation. Read which positions the specific model supports and measure the workspace it needs." },
      { question: "Are these hands-on rankings of the best laptop stands?", answer: "No. The comparison summarizes manufacturer specifications for matching listings. It separates attachment, adjustment and fit so you can narrow the options for your own setup; it does not establish cooling, comfort or stability results." },
    ],
    ...(models.length ? {
      comparison: {
        caption: "Laptop stand comparison",
        note: "Manufacturer sources reviewed October 28, 2026. Each row describes the named variant, not every model from that brand.",
        rows: models.map(({ model, setup, adjustment, fit }) => ({ model, setup, adjustment, fit })),
      },
      guideSources: models.map(({ model, source }) => ({ label: `${model}: manufacturer specifications`, url: source })),
    } : {}),
  };
}
