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

test("generic metadata completion preserves custom metadata, refreshed guidance and all shopping fields", () => {
  assert.equal(withCatalogSearchCopy({ ...pageWith([]), title: "Best Scarves" }).title, "Scarves: Search Products");
  for (const slug of ["scarves", "mailbox-posts", "14k-white-gold-statement-rings", "blue-suitcases"]) {
    for (const [title, expected] of [
      ["Best Scarves from Top Stores", "Scarves: View Product Details"],
      ["Best Scarves From Top Stores", "Scarves: View Product Details"],
      ...["Best From Top Stores", "Best  From Top Stores", "Best   From Top Stores"].map(title => [title, "From Top Stores: View Product Details"]),
      ["Scarves: Choose Fabric & Length", "Scarves: Choose Fabric & Length"],
      ["best Scarves From Top Stores", "best Scarves From Top Stores"],
      ["BEST Scarves From Top Stores", "BEST Scarves From Top Stores"],
      ["The Best Scarves From Top Stores", "The Best Scarves From Top Stores"],
      ["Best Scarves FROM Top Stores", "Scarves FROM Top Stores: View Product Details"],
      ["Best Scarves From top stores", "Scarves From top stores: View Product Details"],
    ]) {
      const page = { ...pageWith([{ name: "Scarf" }]), slug, title, description: "Reviewed custom description.",
        guide: ["Freshly verified material guidance."], faq: [{ question: "Which variant?", answer: "Check the maker's size chart." }],
        guideSources: [{ label: "Maker", url: "https://example.com/material" }] };
      const original = structuredClone(page);
      const published = withAuthoredSearchPageCopy(page);
      assert.equal(published.title, expected, `${slug}: ${title}`);
      if (title === expected) assert.equal(published.description, page.description);
      for (const key of ["guide", "faq", "guideSources", "products"]) assert.deepEqual(published[key], page[key]);
      assert.deepEqual(withAuthoredSearchPageCopy(published), published);
      assert.deepEqual(page, original);
    }
  }
  const reviewed = withAuthoredSearchPageCopy({ ...pageWith([{ name: "Skirt" }]), slug: "pencil-skirts", title: "Best Pencil Skirts From Top Stores" });
  assert.equal(reviewed.title, "Pencil Skirts: Compare Stores, Fabrics & Fit");
  assert.match(reviewed.description, /Compare fabric, length, size guidance/);
});

test("related labels reuse exact generic topics on empty and reviewed pages without changing queries or inputs", () => {
  const labels = [
    ["Best Boots from Top Stores", "Boots"],
    ["Best Boots From Top Stores", "Boots"],
    ["BEST Boots From Top Stores", "BEST Boots From Top Stores"],
    ["best Boots From Top Stores", "best Boots From Top Stores"],
    ["The Best Boots From Top Stores", "The Best Boots From Top Stores"],
    ["Best Boots FROM Top Stores", "Boots FROM Top Stores"],
    ["Best Boots From top stores", "Boots From top stores"],
    ["Best From Top Stores", "From Top Stores"],
    ["Best  From Top Stores", "From Top Stores"],
    ["Best   From Top Stores", "From Top Stores"],
    ["Best Linen & Cotton Shirts", "Linen & Cotton Shirts"],
    ["Best   Scarves  from Top Stores", "Scarves"],
    ["Scarves: Fabric & Length", "Scarves: Fabric & Length"],
    ["The Best Boots for Walking", "The Best Boots for Walking"],
    ["best Boots from Top Stores", "best Boots from Top Stores"],
    ["Best   ", "Best   "],
  ];
  for (const [name, slug, products] of [["empty", "scarves", []], ["reviewed", "pencil-skirts", [{ name: "Skirt" }]]]) {
    const page = { ...pageWith(products), slug, related: labels.map(([title], index) => ({
      slug: index % 2 ? null : `topic-${index}`, title, query: `original query ${index}`,
    })) };
    const original = structuredClone(page);
    const published = withAuthoredSearchPageCopy(page);
    assert.deepEqual(published.related, page.related.map((entry, index) => ({ ...entry, title: labels[index][1] })), name);
    assert.strictEqual(published.products, page.products);
    assert.deepEqual(page, original);
  }
});
