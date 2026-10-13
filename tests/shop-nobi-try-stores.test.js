import assert from "node:assert/strict";
import { test } from "node:test";
import { buildTrySearchPath, FeaturedStores, StoreChoices } from "../src/utils/shopNobiTryStores.js";

const StoreIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

test("a search on every store opens Shop Nobi with only the visitor's words in the link", () => {
  assert.equal(buildTrySearchPath("  red dress & heels under $200 ", ""), "/shop?q=red%20dress%20%26%20heels%20under%20%24200");
});

test("a search on a picked store opens Shop Nobi with that store already chosen", () => {
  const lucchese = FeaturedStores.find((store) => store.name === "Lucchese");

  assert.equal(buildTrySearchPath("leather belt", lucchese.id), `/shop?q=leather%20belt&stores=${lucchese.id}`);
});

test("every featured store has a Shop Nobi store id and at least two examples, and every choice has a unique name", () => {
  for (const store of FeaturedStores) {
    assert.match(store.id, StoreIdPattern, store.name);
    assert.ok(store.examples.length >= 2, `${store.name} needs examples`);
  }
  const names = StoreChoices.map((choice) => choice.name);
  assert.equal(new Set(names).size, names.length);
});
