import assert from "node:assert/strict";
import { test } from "node:test";
import { buildCategoryPages, buildPopularSearches } from "../scripts/shop-nobi-category-page-view.js";
import { selectClothingDiscoveries } from "../src/utils/shopNobiClothingDiscovery.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";

const Slugs = ["blue-navy-blouses", "red-blouses", "green-henleys", "pink-hoodies", "mens-brown-sweaters", "womens-multicolor-sweaters"];

/** Supplies usable local pages; the actual build, rather than the selection list, decides which links exist. */
function clothingFixture() {
  const body = readFixturePageData();
  const template = body.pages[0];
  const pages = Slugs.map((slug) => ({ ...template, slug, title: slug, categoryPath: "apparel_accessories.clothing", breadcrumbs: [{ name: "Clothing", slug: null }] }));
  return { ...body, pages };
}

test("clothing discovery selects built destinations in editorial order, omits missing targets and leaves other categories alone", () => {
  const pages = clothingFixture().pages;
  assert.deepEqual(selectClothingDiscoveries([...pages].reverse()).map(({ slug }) => slug), Slugs);
  assert.deepEqual(selectClothingDiscoveries([pages[2], { slug: "unknown" }]).map(({ slug }) => slug), [Slugs[2]]);
  assert.deepEqual(selectClothingDiscoveries([]), []);
  const categories = buildCategoryPages(pages, 10);
  assert.equal(categories[0].clothingDiscoveries.length, 6);
  assert.equal(buildPopularSearches(pages, categories).clothingDiscoveries.length, 6);
  const furniture = pages.map((page) => ({ ...page, breadcrumbs: [{ name: "Chairs" }], categoryPath: "furniture.chairs" }));
  assert.ok(!Object.hasOwn(buildCategoryPages(furniture, 10)[0], "clothingDiscoveries"));
});
