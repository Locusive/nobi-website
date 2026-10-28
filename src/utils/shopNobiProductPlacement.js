/** The placement decisions recorded by the API, independently of whether a link earns a commission. */
const PlacementReasons = new Set(["affiliate", "paid_merchant", "organic"]);

/** Keeps a known ranking decision; older pages and unrecognized values stay unknown. */
export function readProductPlacement(product) {
  return PlacementReasons.has(product?.placementReason) ? { placementReason: product.placementReason } : {};
}
