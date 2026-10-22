import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { buildCategoryPages, buildPopularSearches } from "../scripts/shop-nobi-category-page-view.js";
import { selectClothingDiscoveries } from "../src/utils/shopNobiClothingDiscovery.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";
import { makeDistCopy, prerenderWith, readBody, readScriptJson } from "./shop-nobi-test-build.js";

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

test("built shop and clothing pages expose six descriptive navigation links and matching browser data, but search pages do not", async () => {
  const folder = makeDistCopy();
  try {
    await prerenderWith({ body: clothingFixture() }, folder);
    for (const path of ["shop.html", "shop/c/clothing.html"]) {
      const html = readFileSync(join(folder, path), "utf8");
      const navigation = readBody(html).match(/<nav aria-labelledby="clothing-discovery-heading"[\s\S]*?<\/nav>/)?.[0];
      assert.ok(navigation, path);
      for (const slug of Slugs) assert.ok(navigation.includes(`href="/shop/s/${slug}"`), slug);
      assert.equal((navigation.match(/<a /g) || []).length, 6);
      assert.equal(readScriptJson(html, "shop-nobi-prebuilt-content").data.clothingDiscoveries.length, 6);
      assert.ok(html.indexOf('clothing-discovery-heading') < html.lastIndexOf('<footer'));
    }
    const search = readFileSync(join(folder, `shop/s/${Slugs[0]}.html`), "utf8");
    assert.ok(!readBody(search).includes('aria-labelledby="clothing-discovery-heading"'));
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
