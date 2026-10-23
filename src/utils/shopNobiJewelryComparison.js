/** Reviewed listing-name examples; these labels do not certify the selected retailer variant. */
const ReviewedExamples = [
  {
    "slug": "sterling-silver-rings",
    "name": "Cirque Ring, Sterling Silver",
    "variant": "b1d1c7d6-15c1-4850-a8b0-fcfd5412ac23",
    "nativeUrl": "https://miansai.com/products/cirque-ring-sterling-silver?variant=31932463317107",
    "piece": "Ring",
    "stone": "Not named",
    "metal": "Sterling silver"
  },
  {
    "slug": "amethyst-jewelry",
    "name": "14Kt Gold Amethyst Earring",
    "variant": "a8512cc8-2166-4d3f-aaba-95149c3cf791",
    "nativeUrl": "https://aimeleondore.com/products/14kt-gold-amethyst-earring?variant=42007967563873",
    "piece": "Earring",
    "stone": "Amethyst",
    "metal": "14Kt gold; colour not named"
  },
  {
    "slug": "black-stud-earrings",
    "name": "Valor Onyx Stud Earring, Sterling Silver",
    "variant": "eeb30098-1057-445f-ab96-a5a481aac82b",
    "nativeUrl": "https://miansai.com/products/valor-onyx-stud-earring-sterling-silver-single-m?variant=40650219651187",
    "piece": "Stud earring",
    "stone": "Onyx",
    "metal": "Sterling silver"
  },
  {
    "slug": "emerald-jewelry",
    "name": "Adina Reyter Emerald & Diamond Clover Hinged Charm",
    "variant": "7d3b56be-e365-410b-a63c-66cf09e738c4",
    "nativeUrl": "https://www.saintbernard.com/products/adina-reyter-emerald-diamond-clover-hinged-charm?variant=46436782342198",
    "piece": "Charm",
    "stone": "Emerald and diamond",
    "metal": "Not named"
  },
  {
    "slug": "yellow-gold-diamond-earrings",
    "name": "EF Collection Diamond Mini Huggie Earrings",
    "variant": "f88a1a66-e510-4b2c-aa14-c7cf1c3053dd",
    "nativeUrl": "https://www.saintbernard.com/products/ef-collection-diamond-mini-huggie-earrings?variant=42560723517494",
    "piece": "Huggie earrings",
    "stone": "Diamond",
    "metal": "Not named"
  },
  {
    "slug": "14k-white-gold-statement-rings",
    "name": "Fanned Diamond Statement Ring",
    "variant": "55dd523f-9415-4ac3-bd86-71ef0531fca6",
    "nativeUrl": "https://ringconcierge.com/products/fanned-diamond-statement-ring?variant=39862140108888",
    "piece": "Statement ring",
    "stone": "Diamond",
    "metal": "Not named"
  }
];

/**
 * Selects only examples whose exact product name, variant and native address remain in the built collection.
 * Returned rows hold internal collection links and literal name readings, never merchant offers or prices.
 *
 * @param {object[]} pages The normalized search pages in the current build.
 * @returns {object[]} The still-supported comparison rows.
 */
export function selectJewelryComparisons(pages) {
  const pageBySlug = new Map(pages.map((page) => [page.slug, page]));
  return ReviewedExamples.filter((example) => {
    const products = pageBySlug.get(example.slug)?.products ?? [];
    return products.some((product) => product.name === example.name
      && product.productVariantId === example.variant && product.url === example.nativeUrl);
  }).map(({ slug, name, piece, stone, metal }) => ({ slug, name, piece, stone, metal }));
}
