import test from "node:test";
import assert from "node:assert/strict";
import { buildGiftGuides } from "../scripts/shop-gift-guide-plan.js";
import { giftGuideSeo } from "../src/utils/shopGiftGuide.js";

const product = (id, storeName, extra = {}) => ({ productVariantId: id, name: `Product ${id}`,
  url: `https://merchant.example/${id}`, imageUrl: `https://merchant.example/${id}.jpg`,
  storeName, isInStock: true, paidLink: false, ...extra });

test("gift guide uses current eligible catalog products, preserves earning links, and omits sparse topics", () => {
  const pages = [
    { slug: "copper-cookware", query: "copper cookware", refreshedAt: "2026-11-04T00:00:00Z", products: [
      product("paid", "A", { paidLink: true, encodedStoreLink: "abc" }),
      product("no-image", "A", { imageUrl: null }),
      product("old", "A", { isInStock: false }),
      product("refurb", "A", { name: "Refurbished saucepan" }),
      product("plain", "B"),
    ] },
    { slug: "rice-cookers", query: "rice cookers", refreshedAt: "2026-11-05T00:00:00Z", products: [
      product("rice-one", "C"), product("rice-two", "D"), product("rice-three", "E"), product("paid", "A"),
    ] },
  ];
  const guides = buildGiftGuides(pages, "2026-11-05T01:00:00Z");
  const cook = guides.find((guide) => guide.slug === "gifts-for-home-cooks");
  assert.ok(cook);
  assert.equal(cook.products.length, 5);
  assert.equal(cook.paidCount, 1);
  assert.equal(cook.refreshedAt, "2026-11-05T00:00:00Z");
  assert.equal(cook.lastModifiedAt, "2026-11-05T00:00:00Z");
  assert.equal(cook.products.filter((item) => item.productVariantId === "paid").length, 1);
  assert.ok(!cook.products.some((item) => ["no-image", "old", "refurb"].includes(item.productVariantId)));
  assert.equal(guides.length, 1);
  assert.ok(!guides.some((guide) => guide.slug === "gifts-for-painters"));
  const seo = giftGuideSeo(cook);
  assert.equal(seo.path, "/gift-guides/gifts-for-home-cooks");
  assert.equal(seo.schema[0].mainEntity.itemListElement.length, 5);
});

test("gift guides drop stale or undated sources instead of displaying old picks", () => {
  const fresh = { slug: "rice-cookers", query: "rice cookers", refreshedAt: "2026-11-04T00:00:00Z",
    products: [1, 2, 3, 4, 5].map((id) => product(`fresh-${id}`, `Store ${id}`)) };
  const stale = { slug: "copper-cookware", query: "copper cookware", refreshedAt: "2026-09-01T00:00:00Z",
    products: [1, 2, 3, 4, 5].map((id) => product(`old-${id}`, `Store ${id}`)) };
  const guide = buildGiftGuides([stale, fresh], "2026-11-05T01:00:00Z")
    .find((item) => item.slug === "gifts-for-home-cooks");
  assert.ok(guide);
  assert.equal(guide.products.length, 5);
  assert.ok(guide.products.every((item) => item.productVariantId.startsWith("fresh-")));
  assert.equal(buildGiftGuides([stale], "2026-11-05T01:00:00Z").length, 0);
});
