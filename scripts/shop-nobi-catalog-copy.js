// Publication copy for the API's generic search-page titles, derived only from displayed records.

const GenericTitlePattern = /^Best (.+?)(?: from Top Stores)?$/;
const NamedStoreLimit = 2;
const DescriptionLengthTarget = 200;

/**
 * Replaces generic ranking claims with the page's actual listing and store coverage.
 * Authored titles are left intact. Products, guides and the source plan are never mutated.
 *
 * @param {object} page A normalized search page after merchant publication exclusions.
 * @returns {object} Publication copy, or the original page when its title is not generic.
 */
export function withCatalogSearchCopy(page) {
  const match = GenericTitlePattern.exec(page.title);
  if (!match) return page;

  const topic = match[1].trim();
  const products = page.products ?? [];
  if (products.length === 0) {
    return {
      ...page,
      title: `${topic}: Buying Guide & Search`,
      description: `Explore the buying guide for ${topic}. No product listings are displayed on this page; enter your preferences in Shop Nobi to search.`,
    };
  }

  const stores = uniqueStoreNames(products);
  const hasComparablePrices = products.filter(product => Number.isFinite(product.price) && product.price > 0 && product.currency).length > 1;
  const action = products.length === 1 ? "View Product Details"
    : hasComparablePrices ? "Compare Listings & Prices" : "Compare Product Details";
  const listingLabel = products.length === 1 ? "listing" : "listings";
  const opening = `Browse ${products.length} ${listingLabel} for ${topic}`;
  const details = hasComparablePrices ? "Compare product details and listed prices." : "Check product details with the retailer.";
  const coverage = stores.length ? `, including options from ${stores.slice(0, NamedStoreLimit).join(" and ")}` : "";
  const namedDescription = `${opening}${coverage}. ${details}`;
  const description = namedDescription.length <= DescriptionLengthTarget
    ? namedDescription : `${opening}. ${details}`;
  return { ...page, title: `${topic}: ${action}`, description };
}

/** Keeps distinct displayed store labels in result order, without counting spelling-case duplicates. */
function uniqueStoreNames(products) {
  const names = new Map();
  for (const product of products) {
    const name = typeof product.storeName === "string" ? product.storeName.replace(/\s+/g, " ").trim() : "";
    if (name && !names.has(name.toLocaleLowerCase("en-US"))) names.set(name.toLocaleLowerCase("en-US"), name);
  }
  return [...names.values()];
}
