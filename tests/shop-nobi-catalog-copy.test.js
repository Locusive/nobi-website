import assert from "node:assert/strict";
import { test } from "node:test";
import { withCatalogSearchCopy } from "../scripts/shop-nobi-catalog-copy.js";
import { withAuthoredSearchPageCopy } from "../scripts/shop-nobi-editorial-copy.js";

/** A normalized listing supplies facts without implying availability or a hands-on ranking. */
function pageWith(products) {
  return { slug: "scarves", title: "Best Scarves from Top Stores", description: "The best scarves for everyone.",
    guide: ["Existing guide."], faq: [], products };
}

test("catalog copy describes actual listings and deduplicates store names without changing shopping data", () => {
  const page = pageWith([
    { name: "Silk scarf", storeName: " Store A ", price: 50, currency: "USD" },
    { name: "Wool scarf", storeName: "store a", price: 80, currency: "USD" },
    { name: "Cotton scarf", storeName: "Store B", price: null },
  ]);
  const original = structuredClone(page);
  const published = withCatalogSearchCopy(page);
  assert.equal(published.title, "Scarves: Compare Listings & Prices");
  assert.equal(published.description, "Browse 3 listings for Scarves, including options from Store A and Store B. Compare product details and listed prices.");
  assert.strictEqual(published.products, page.products);
  assert.strictEqual(published.guide, page.guide);
  assert.deepEqual(page, original);
});

for (const [name, products, title, description] of [
  ["empty", [], "Scarves: Search Products", "No product listings are displayed"],
  ["single", [{ storeName: "Store A", price: 10, currency: "USD" }], "Scarves: View Product Details", "Browse 1 listing for Scarves, including options from Store A."],
  ["missing prices", [{ storeName: "" }, { storeName: null }], "Scarves: Compare Product Details", "Browse 2 listings for Scarves. Check product details with the retailer."],
  ["invalid prices", [{ price: -1, currency: "USD" }, { price: NaN, currency: "USD" }, { price: 12 }], "Scarves: Compare Product Details", "Browse 3 listings"],
]) {
  test(`catalog copy handles ${name} without inventing coverage`, () => {
    const result = withCatalogSearchCopy(pageWith(products));
    assert.equal(result.title, title);
    assert.ok(result.description.includes(description));
    assert.doesNotMatch(result.description, /in stock|best|lowest|discount|top stores/i);
  });
}

test("long store labels are omitted rather than truncating a seller name", () => {
  const result = withCatalogSearchCopy(pageWith([{ storeName: "Long retailer name ".repeat(20) }]));
  assert.equal(result.description, "Browse 1 listing for Scarves. Check product details with the retailer.");
});

test("specific authored titles and reviewed editorial overrides retain their copy", () => {
  assert.equal(withCatalogSearchCopy({ ...pageWith([]), title: "Best Scarves" }).title, "Scarves: Search Products");
  const authored = { ...pageWith([{ name: "Scarf" }]), title: "Scarves: Choose Fabric & Length" };
  assert.strictEqual(withCatalogSearchCopy(authored), authored);
  const reviewed = withAuthoredSearchPageCopy({ ...pageWith([{ name: "Skirt" }]), slug: "pencil-skirts", title: "Best Pencil Skirts from Top Stores" });
  assert.equal(reviewed.title, "Pencil Skirts: Compare Stores, Fabrics & Fit");
  assert.match(reviewed.description, /Compare fabric, length, size guidance/);
});
