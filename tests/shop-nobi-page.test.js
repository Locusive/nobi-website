import assert from "node:assert/strict";
import { test } from "node:test";
import { isShopNobiPath } from "../src/utils/shopNobiPage.js";

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
