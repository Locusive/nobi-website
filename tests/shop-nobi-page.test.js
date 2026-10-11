import assert from "node:assert/strict";
import { test } from "node:test";
import { isShopNobiPath, ShopNobiImage } from "../src/utils/shopNobiPage.js";
import { buildSearchPageSeo } from "../src/utils/shopNobiSearchPage.js";

test("the Shop Nobi page is /shop and every path under it", () => {
  for (const path of ["/shop", "/shop/", "/shop/anything"]) {
    assert.equal(isShopNobiPath(path), true, path);
  }
});

test("other pages, including ones that only start with the same letters, are not the Shop Nobi page", () => {
  for (const path of ["/", "/pricing", "/shopping", "/shops", "/blog/shop"]) {
    assert.equal(isShopNobiPath(path), false, path);
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
