import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCategoryPages,
  FewestSearchPagesPerCategory,
  linkCategoryPages,
} from "../scripts/shop-nobi-category-page-view.js";
import { buildShopNobiSitemap } from "../scripts/shop-nobi-search-page-listings.js";

const NoLimit = 100;

/** Builds search pages in one category, named after their first breadcrumb, with slugs from the given prefix. */
function buildPages(count, categoryName, categoryPath, slugPrefix) {
  return Array.from({ length: count }, (_, index) => ({
    slug: `${slugPrefix}-${index}`,
    title: `${categoryName} ${index}`,
    categoryPath,
    breadcrumbs: [{ name: categoryName, slug: null }],
  }));
}

/** Lists each category page's slug with the slugs of the search pages on it. */
function listCategorySlugs(categoryPages) {
  return categoryPages.map((category) => [category.slug, category.pages.map((page) => page.slug)]);
}

test("a category with enough search pages gets its own page, and a thinner one goes on its top category's page", () => {
  const chairs = buildPages(FewestSearchPagesPerCategory, "Chairs", "furniture.chairs", "chair");
  const ottomans = buildPages(FewestSearchPagesPerCategory - 1, "Ottomans", "furniture.ottomans", "ottoman");
  const benches = buildPages(1, "Benches", "furniture.benches", "bench");

  const categoryPages = buildCategoryPages([...chairs, ...ottomans, ...benches], NoLimit);

  assert.deepEqual(listCategorySlugs(categoryPages), [
    ["chairs", ["chair-0", "chair-1", "chair-2"]],
    ["furniture", ["ottoman-0", "ottoman-1", "bench-0"]],
  ]);
  assert.equal(categoryPages[1].name, "Furniture");
  assert.deepEqual(categoryPages[1].subcategories, [{ slug: "chairs", name: "Chairs" }], "The top category links the pages under it");
  assert.deepEqual(categoryPages[0].subcategories, []);
});

test("a category too thin, or with an unknown top category, gets no page while its search pages stay in the sitemap", () => {
  const signs = buildPages(FewestSearchPagesPerCategory - 1, "Signage", "business_industrial.signage", "sign");
  const neon = buildPages(1, "Neon Signs", "constructor.neon", "neon");
  const chairs = buildPages(FewestSearchPagesPerCategory, "Chairs", "furniture.chairs", "chair");
  const searchPages = [...chairs, ...signs, ...neon];

  const categoryPages = buildCategoryPages(searchPages, NoLimit);
  const listed = searchPages.map((page) => ({ ...page, products: [{ imageUrl: "https://example.com/boot.jpg" }] }));
  const sitemap = buildShopNobiSitemap(categoryPages, listed, [], "2026-10-11T08:10:00Z");

  assert.deepEqual(listCategorySlugs(categoryPages), [["chairs", ["chair-0", "chair-1", "chair-2"]]]);
  assert.ok(!sitemap.includes("/shop/c/signage") && !sitemap.includes("/shop/c/business-industrial"));
  assert.ok(sitemap.includes("/shop/c/chairs"));
  const uncategorized = ["sign-0", "sign-1", "neon-0"];
  assert.ok(uncategorized.every((slug) => sitemap.includes(`/shop/s/${slug}`)), "Pages off every category page stay crawlable");
});

test("category navigation retains ordering and custom titles while shortening generic labels", () => {
  const boots = buildPages(51, "Shoes", "apparel_accessories.shoes", "boots").map((page, index) => ({
    ...page, title: index === 0 ? "Shoes: Compare Fit & Use" : `Best Shoes ${index}${index % 3 === 0 ? " From Top Stores" : index % 2 ? " from Top Stores" : ""}`,
    query: `original shoes query ${index}`, refreshedAt: "2026-10-28T21:04:02Z",
  }));
  const giftIdeas = { slug: "gift-ideas", title: "Best Gifts & Games from Top Stores", query: "gift ideas", breadcrumbs: [] };
  const rings = buildPages(1, "Jewelry", "apparel_accessories.jewelry", "rings").map(page => ({ ...page, title: "Rings: Compare Metals" }));
  const searchPages = [...boots, giftIdeas, ...rings];
  const original = structuredClone(searchPages);
  const categoryPages = buildCategoryPages(searchPages, NoLimit);

  assert.deepEqual(categoryPages.map((category) => category.slug), ["shoes"]);
  assert.equal(categoryPages[0].refreshedAt, boots[0].refreshedAt);
  const expectedBootLinks = boots.map((page, index) => ({ slug: page.slug, title: index === 0 ? page.title : `Shoes ${index}` }));
  assert.deepEqual(categoryPages[0].pages, expectedBootLinks);
  assert.deepEqual(searchPages, original, "Titles, queries and all source records remain untouched");
});

test("a search page's first breadcrumb names and links the category page it is on, or links nowhere", () => {
  const chairs = buildPages(FewestSearchPagesPerCategory, "Chairs", "furniture.chairs", "chair");
  const ottomans = buildPages(FewestSearchPagesPerCategory - 1, "Ottomans", "furniture.ottomans", "ottoman");
  const benches = buildPages(1, "Benches", "furniture.benches", "bench");
  const signs = buildPages(1, "Signage", "business_industrial.signage", "sign");
  const searchPages = [...chairs, ...ottomans, ...benches, ...signs];
  const categoryPages = buildCategoryPages(searchPages, NoLimit);

  const linkedPages = new Map(linkCategoryPages(searchPages, categoryPages).map((page) => [page.slug, page]));

  assert.equal(linkedPages.get("chair-0").categoryPageSlug, "chairs");
  assert.deepEqual(linkedPages.get("chair-0").breadcrumbs, [{ name: "Chairs", slug: null }]);
  assert.equal(linkedPages.get("bench-0").categoryPageSlug, "furniture");
  assert.deepEqual(linkedPages.get("bench-0").breadcrumbs, [{ name: "Furniture", slug: null }, { name: "Benches", slug: null }]);
  assert.equal(linkedPages.get("sign-0").categoryPageSlug, null);
  assert.deepEqual(linkedPages.get("sign-0").breadcrumbs, [{ name: "Signage", slug: null }]);
});
