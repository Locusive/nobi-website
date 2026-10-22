/** Fixed demand-led entry points, offered only when the destination is in the built page plan. */
const ClothingChoices = [
  { slug: "blue-navy-blouses", label: "Blue & navy blouses" },
  { slug: "red-blouses", label: "Red blouses" },
  { slug: "green-henleys", label: "Green Henley shirts" },
  { slug: "pink-hoodies", label: "Pink hoodies" },
  { slug: "mens-brown-sweaters", label: "Men’s brown sweaters" },
  { slug: "womens-multicolor-sweaters", label: "Women’s multicolour sweaters" },
];

/** Selects existing built destinations without inventing a fallback search or changing their order. */
export function selectClothingDiscoveries(pages) {
  const builtSlugs = new Set(pages.map((page) => page.slug));
  return ClothingChoices.filter((choice) => builtSlugs.has(choice.slug));
}
