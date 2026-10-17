import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizePinImage, selectPinItems } from "../scripts/shop-nobi-pin-selection.js";
import { PinHeroReviews } from "../scripts/shop-nobi-pin-editorial.js";

/** Builds a real-shaped available product, with optional field overrides. */
function product(name, overrides = {}) {
  return {
    name, url: `https://store.example/products/${name}`, imageUrl: `https://cdn.example/${name}.jpg`,
    price: 60, currency: "USD", isInStock: true, paidLink: false, ...overrides,
  };
}

/** Builds an existing relevant result page. */
function page(slug, products, overrides = {}) {
  return { slug, title: `Best ${slug.replaceAll("-", " ")} from Top Stores`, products, ...overrides };
}

test("a relevant earning hero is preferred; the search result order and native photo are untouched", () => {
  const unpaid = product("Cloud-bed");
  const paid = product("Kip-bed", { paidLink: true });
  const original = page("cat-beds", [unpaid, paid]);
  const selected = selectPinItems([original]);

  assert.equal(selected[0].product, paid);
  assert.equal(selected[0].imageUrl, paid.imageUrl);
  assert.deepEqual(original.products, [unpaid, paid]);
  assert.ok(selected[0].description.startsWith("#ad We may earn a commission"));
});

test("unavailable, unpriced, unsafe and placeholder heroes cannot displace an eligible non-affiliate product", () => {
  const changes = [
    { isInStock: false }, { isInStock: "true" }, { price: null }, { price: 0 }, { price: -1 }, { price: "60" },
    { currency: null }, { currency: "EUR" }, { imageUrl: "http://cdn.example/photo.jpg" },
    { imageUrl: "https://" }, { imageUrl: "https://user:password@cdn.example/photo.jpg" },
    { imageUrl: "https://cdn.example/noimage.gif" }, { url: "javascript:alert(1)" },
  ];
  const invalid = changes.map((change, index) => product(`invalid-${index}`, { paidLink: true, ...change }));
  const usable = product("recognizable-camera");
  const result = selectPinItems([page("pet-cameras", [...invalid, usable])]);

  assert.equal(result.length, 1);
  assert.equal(result[0].product, usable);
  assert.ok(result[0].description.includes("We may earn a commission"), "The mixed landing page still requires disclosure");
  assert.deepEqual(selectPinItems([page("unavailable", invalid)]), []);
});

test("a reviewed hero uses the exact real tool instead of a toy fallback, and becomes ineligible if its photo or stock changes", () => {
  const rejected = product("white-brush-set", { imageUrl: `${PinHeroReviews[0].imageUrl}&width=1200`, paidLink: true });
  const toy = product("Hair Dresser Set", { url: "https://plantoys.com/products/hair-dresser-set" });
  const alternative = product("Aire 360 Ceramic Air Styler", { url: `${PinHeroReviews[0].preferredProductUrl}?variant=123`, imageUrl: PinHeroReviews[0].preferredImageUrl });
  const result = selectPinItems([page("hair-styling-tool-sets", [rejected, toy, alternative])]);
  assert.equal(result[0].product, alternative);
  for (const change of [{ isInStock: false }, { imageUrl: "https://cdn.example/unreviewed-new-photo.jpg" }, { url: "https://store.example/products/different-tool" }]) {
    assert.deepEqual(selectPinItems([page("hair-styling-tool-sets", [toy, { ...alternative, ...change }])]), []);
  }
  assert.equal(selectPinItems([page("specific-hair-kit", [rejected])])[0].product, rejected, "A reviewed broad-context rejection is not a global photo or product ban");
});

test("a refresh cannot swap duplicate ownership, while a distinct alternative keeps a useful category represented", () => {
  const shared = product("dog-toy");
  const alternate = product("plush-toy");
  const broad = page("dog-toys", [shared], { refreshedAt: "2026-10-01" });
  const color = page("multicolor-dog-toys", [shared, alternate], { refreshedAt: "2026-10-17" });
  const before = selectPinItems([color, broad]);
  broad.refreshedAt = "2026-10-18";
  const after = selectPinItems([broad, color]);

  assert.deepEqual(before.map(({ page, product }) => [page.slug, product.name]), [
    ["dog-toys", "dog-toy"], ["multicolor-dog-toys", "plush-toy"],
  ]);
  assert.deepEqual(after.map(({ page, product }) => [page.slug, product.name]), before.map(({ page, product }) => [page.slug, product.name]));
});

test("render variants of one photo and repeated product variants do not create cross-board spam", () => {
  const hero = product("speaker", { url: "https://store.example/products/speaker?variant=1&utm_source=nobi" });
  const repeatedPhoto = product("different-product", { imageUrl: `${hero.imageUrl}?width=300&height=300` });
  const repeatedProduct = product("speaker-alt", { url: "https://store.example/products/speaker?variant=2&utm_source=Pinterest" });
  const selected = selectPinItems([
    page("speaker", [hero], { categoryPath: "electronics.audio" }),
    page("white-speaker", [repeatedPhoto], { categoryPath: "home_garden.decor" }),
    page("wireless-speaker", [repeatedProduct]),
  ]);
  assert.deepEqual(selected.map(({ page }) => page.slug), ["speaker"]);
});

test("different product images on the same CDN keep their identity and parameter order is normalized", () => {
  assert.equal(normalizePinImage("https://cdn.example/a.jpg?width=300&v=2&foo=x"), "https://cdn.example/a.jpg?foo=x&v=2");
  assert.notEqual(normalizePinImage("https://cdn.example/a.jpg?v=1"), normalizePinImage("https://cdn.example/a.jpg?v=2"));
  assert.equal(selectPinItems([page("chairs", [product("chair")]), page("lamps", [product("lamp")])]).length, 2);
});

test("specific copy names the pictured item, drops SEO boilerplate, and invents no product benefits or live price", () => {
  const selected = selectPinItems([page("cat-beds", [product("Kip Cat Bed", { storeName: "Tuft & Paw" })])])[0];
  assert.equal(selected.title, "Kip Cat Bed | cat beds");
  assert.equal(selected.description, "Explore cat beds. Pictured: Kip Cat Bed from Tuft & Paw. Compare listed options on Shop Nobi and buy directly from the store.");
  assert.ok(!selected.title.includes("Best") && !selected.title.includes("Top Stores"));
  assert.ok(!selected.description.includes("$60") && !selected.description.includes("in stock"));
});

test("long product identities fit the platform title limit without changing source product data", () => {
  const originalName = "Detailed product model with a particularly long factual name ".repeat(3).trim();
  const selected = selectPinItems([page("chairs", [product(originalName)])])[0];
  assert.ok(selected.title.length <= 100);
  assert.equal(selected.product.name, originalName);
});

test("a categorized earning page keeps the shared hero instead of losing its board to an uncategorized synonym", () => {
  const hero = product("bed");
  const selected = selectPinItems([
    page("bed", [hero]),
    page("cat-beds", [{ ...hero, paidLink: true }], { categoryPath: "animals_pet_supplies.cat_supplies" }),
  ]);
  assert.deepEqual(selected.map(({ page }) => page.slug), ["cat-beds"]);
});

test("repeated input pages cannot create alternate items with the same canonical GUID", () => {
  const selected = selectPinItems([page("chairs", [product("chair-one")]), page("chairs", [product("chair-two")])]);
  assert.equal(selected.length, 1);
});

test("Pinterest curation leaves search data and other consumer ordering intact", () => {
  const original = [page("pet-beds", [product("Cloud"), product("Kip", { paidLink: true })])];
  const snapshot = structuredClone(original);
  selectPinItems(original);
  assert.deepEqual(original, snapshot);
});
