// Small, explicit visual review record for automatic Pinterest selection. These are page/hero decisions, not
// merchant/product bans. Each chosen native hero must still exist and pass stock/price/link checks.
// If it changes or becomes unavailable, omit this particular Pin until another hero is reviewed; the feeds continue.
// Review: agents/affiliate_brainstorm/research/traffic_execution/pinterest-quality-20261017 in the operations worktree.

/** Actually inspected page/hero pairs that did not communicate the shopping choice at Pinterest grid size. */
export const PinHeroReviews = Object.freeze([
  {
    pageSlug: "hair-styling-tool-sets",
    imageUrl: "https://cdn.shopify.com/s/files/1/0283/0185/2747/files/global_images-883349003983-1.jpg?v=1754539195",
    preferredProductUrl: "https://bluemercury.com/products/t3-aire-360-ceramic-air-styler-blowout-kit-1",
    preferredImageUrl: "https://cdn.shopify.com/s/files/1/0283/0185/2747/files/variant_images-size-SatinBlush-883349007615-1.jpg?v=1785955095",
    reason: "Thin white brush and comb disappear against white at grid size; two current Pins repeat the photo.",
    observedPin: "https://www.pinterest.com/pin/1128855462885914500/",
    reviewedOn: "2026-10-17",
  },
  {
    pageSlug: "beige-pet-supplies",
    imageUrl: "https://cdn.shopify.com/s/files/1/0522/6712/2861/files/L_R9009-2532_Hero.jpg",
    preferredProductUrl: "https://bollandbranch.com/products/the-piped-edge-pet-bed-biscuit_",
    preferredImageUrl: "https://cdn.shopify.com/s/files/1/1154/7838/files/Biscuit_PipedEdge_PetBed_Stack_ADAMS_09022025_FINAL.jpg?v=1759772370",
    reason: "Dog/lifestyle photo is a vague beige-pet-supplies hero; it may work for a specific bed page with clear product identity.",
    observedPin: "https://www.pinterest.com/pin/1128855462885914544/",
    reviewedOn: "2026-10-17",
  },
  {
    pageSlug: "food-storage",
    imageUrl: "https://cdn.shopify.com/s/files/1/0808/0329/9656/files/17072079.jpg?v=1770127236",
    preferredProductUrl: "https://guzzini.com/products/set-3-containers-with-lid-everywhere-bio-food-storage",
    preferredImageUrl: "https://cdn.shopify.com/s/files/1/0808/0329/9656/files/29268652_1_7012afbd-24f4-4c25-a7bd-d3535435fdb7.jpg?v=1764774229",
    reason: "Low-contrast bowl with excess blank space is a weak broad food-storage hero; a specific container context may still be useful.",
    observedPin: "https://www.pinterest.com/pin/1128855462885914518/",
    reviewedOn: "2026-10-17",
  },
]);
