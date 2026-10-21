import assert from "node:assert/strict";
import { test } from "node:test";
import { isShopNobiPath, ShopNobiImage } from "../src/utils/shopNobiPage.js";
import { buildSearchPageSeo, readRelatedSearchPath } from "../src/utils/shopNobiSearchPage.js";
import { keepAllowedPages } from "../scripts/shop-nobi-search-pages-api.js";

test("shopping pages include /shop and its search paths", () => {
  for (const path of ["/shop", "/shop/", "/shop/anything"]) {
    assert.equal(isShopNobiPath(path), true, path);
  }
});

test("other pages, including ones that only start with the same letters, are not the Shop Nobi page", () => {
  for (const path of ["/", "/pricing", "/shopping", "/shops", "/blog/shop", "/shop/mcp", "/shop/mcp/"]) {
    assert.equal(isShopNobiPath(path), false, path);
  }
});

test("older related searches can still open their title, while missing labels create no empty link", () => {
  const url = new URL(readRelatedSearchPath({ title: "  Camera bags  " }), "https://nobi.ai");
  assert.equal(url.pathname, "/shop");
  assert.equal(url.searchParams.get("q"), "Camera bags");
  for (const related of [null, {}, { title: "  " }, { title: null, query: "camera bags" }]) {
    assert.equal(readRelatedSearchPath(related), null);
  }
});

test("a search page previews its first https product picture, 1,200 pixels wide from Shopify, else the Shop Nobi picture", () => {
  const makePage = (imageUrls) => ({
    slug: "boots", title: "Boots", description: null, breadcrumbs: [], faq: [],
    products: imageUrls.map((imageUrl) => ({ name: "Boot", url: "https://store.example/boot", imageUrl, price: 10, currency: "USD" })),
  });
  assert.equal(buildSearchPageSeo(makePage(["http://a.example/x.jpg", "https://cdn.shopify.com/s/files/1/x.jpg?v=2"])).image,
    "https://cdn.shopify.com/s/files/1/x.jpg?v=2&width=1200");
  assert.equal(buildSearchPageSeo(makePage(["https://cdn.example.com/roper.jpg"])).image, "https://cdn.example.com/roper.jpg");
  assert.equal(buildSearchPageSeo(makePage([null])).image, ShopNobiImage);
});

test("pages in the mature category never reach the build, whatever the API sends", () => {
  const pages = [
    { slug: "combat-knives", categoryPath: "mature.weapons.combat_knives" },
    { slug: "boots", categoryPath: "apparel_accessories.footwear.boots" },
    { slug: "no-category", categoryPath: null },
    null,
  ];
  assert.deepEqual(keepAllowedPages(pages).map((page) => page?.slug ?? null), ["boots", "no-category", null], "A malformed entry is left for the later checks");
});
