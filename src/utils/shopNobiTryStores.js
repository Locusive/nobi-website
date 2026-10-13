// The homepage's "try it" box: the stores a visitor can pick, each with example searches it does well, and the
// Shop Nobi link that runs the visitor's search on the picked store.

/** Searching every Shop Nobi store. Its examples are Shop Nobi's own homepage suggestions. */
export const AllStores = {
  id: "",
  name: "All brands",
  examples: ["Warm jacket for winter", "Pearl necklace", "Ceramic vase", "Wool scarf"],
};

/** Stores a visitor can try one at a time, with searches each one ranks well for on Shop Nobi. */
export const FeaturedStores = [
  {
    id: "b4e64f15-4a40-4546-a204-e1c088e104e0",
    name: "Lucchese",
    examples: ["Brown leather boots for men", "Women's cowboy boots", "Leather belt", "Silk scarf"],
  },
  {
    id: "2743be59-9aee-44a5-b080-78b396ff78b5",
    name: "UNTUCKit",
    examples: ["Performance shirt for travel", "White button-down for work", "Women's button-down shirt"],
  },
  {
    id: "35019f05-f0cd-4ee3-ba16-c1fe938888d1",
    name: "Kilte Collection",
    examples: ["Cozy cardigan", "Colorful top for spring"],
  },
  {
    id: "53bb16f4-790d-4a62-9dd8-22f8022dc642",
    name: "Rowing Blazers",
    examples: ["Cream sweater", "Green baseball cap", "Patterned blazer"],
  },
];

/** Every choice in the store picker, all stores first. */
export const StoreChoices = [AllStores, ...FeaturedStores];

/**
 * Returns the Shop Nobi link that runs a search, on one store when one is picked.
 *
 * @param {string} query The visitor's words.
 * @param {string} storeId The picked store's id, or "" for every store.
 * @returns {string} The link, such as "/shop?q=leather%20belt&stores=b4e64f15-…".
 */
export function buildTrySearchPath(query, storeId) {
  const parameters = new URLSearchParams({ q: query.trim() });
  if (storeId) {
    parameters.set("stores", storeId);
  }
  return `/shop?${parameters.toString().replaceAll("+", "%20")}`;
}
