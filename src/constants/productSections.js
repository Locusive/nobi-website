/**
 * The capability sections of the Product page, in page order. Each id is the section's anchor,
 * so a link to /product#<id> lands on that section. The nav's Product menu is built from this list.
 */
export const PRODUCT_SECTIONS = [
  { id: "search", name: "Search" },
  { id: "support", name: "Automated support" },
  { id: "lead-capture", name: "Lead capture" },
  { id: "insights", name: "Insights" },
  { id: "merchandising", name: "Merchandising" },
];

/** Looks up one section by id, so each section component reads its anchor and name from the shared list. */
export function findProductSection(id) {
  return PRODUCT_SECTIONS.find((section) => section.id === id);
}
