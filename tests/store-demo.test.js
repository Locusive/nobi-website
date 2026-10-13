import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDemoStoresUrl, DemoEntryPoint, findDemoStores, openStoreDemo, prepareStoreDemo, readDemoStores } from "../src/utils/storeDemo.js";

const LuccheseId = "b4e64f15-4a40-4546-a204-e1c088e104e0";

/** A stand-in window whose assistant records what the demo asked it to do. */
function buildBrowser() {
  const calls = [];
  return {
    calls,
    Nobi: {
      openChat: (options) => calls.push(["openChat", options]),
      prepareStoreDemo: (options) => calls.push(["prepareStoreDemo", options]),
    },
  };
}

test("the store list comes from the local API on a local copy of the site and from production everywhere else", () => {
  assert.equal(buildDemoStoresUrl("nobi.ai"), "https://api.nobi.ai/v1/shop/stores?refreshedWithinDays=7");
  assert.equal(buildDemoStoresUrl("localhost"), "http://localhost:7080/v1/shop/stores?refreshedWithinDays=7");
});

test("the demo keeps named stores, sorted by name, with at most three example searches", () => {
  const stores = readDemoStores({
    stores: [
      { id: "b", name: " UNTUCKit ", logoUrl: "https://cdn.example.com/u.png", exampleSearches: ["Shirts", "", "Polos", "Flannels", "Jackets"] },
      { id: LuccheseId, name: "Lucchese" },
      { id: "c", name: "  " },
      { name: "No id" },
    ],
  });

  assert.deepEqual(stores, [
    { id: LuccheseId, name: "Lucchese", logoUrl: null, exampleSearches: [] },
    { id: "b", name: "UNTUCKit", logoUrl: "https://cdn.example.com/u.png", exampleSearches: ["Shirts", "Polos", "Flannels"] },
  ]);
  assert.deepEqual(readDemoStores({ error: "origin_not_allowed" }), []);
});

test("the store field finds stores by any part of their name, ignoring case", () => {
  const stores = [{ name: "Lucchese" }, { name: "Rowing Blazers" }];

  assert.deepEqual(findDemoStores(stores, "  BLAZ "), [{ name: "Rowing Blazers" }]);
  assert.deepEqual(findDemoStores(stores, ""), stores);
});

test("a search opens Nobi's modal on the picked store as a demo, and an empty search opens nothing", () => {
  const browser = buildBrowser();

  assert.equal(openStoreDemo("  black boots for a wedding ", LuccheseId, browser), true);
  assert.equal(openStoreDemo("   ", LuccheseId, browser), false);

  assert.deepEqual(browser.calls, [["openChat", { message: "black boots for a wedding", storeId: LuccheseId, entryPoint: DemoEntryPoint }]]);
});

test("picking a store gets the assistant ready, and nothing breaks before the assistant has loaded", () => {
  const browser = buildBrowser();

  prepareStoreDemo(LuccheseId, browser);

  assert.deepEqual(browser.calls, [["prepareStoreDemo", { storeId: LuccheseId }]]);
  assert.equal(openStoreDemo("boots", LuccheseId, {}), false);
  assert.doesNotThrow(() => prepareStoreDemo(LuccheseId, {}));
});
