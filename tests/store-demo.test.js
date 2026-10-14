import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildDemoStoresUrl,
  DefaultStore,
  DemoEntryPoint,
  DemoLookupStatus,
  findDemoStores,
  lookUpDemoStore,
  openStoreDemo,
  prepareStoreDemo,
  readDemoStoreId,
  readDemoStores,
  readStoreSearches,
} from "../src/utils/storeDemo.js";

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
  assert.equal(buildDemoStoresUrl("[::1]"), "http://localhost:7080/v1/shop/stores?refreshedWithinDays=7");
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

test("picking a store gets the assistant ready", () => {
  const browser = buildBrowser();

  prepareStoreDemo(LuccheseId, browser);

  assert.deepEqual(browser.calls, [["prepareStoreDemo", { storeId: LuccheseId }]]);
});

test("before the assistant has loaded, the demo's calls wait in the assistant's queue in its own format", () => {
  const browser = {};

  prepareStoreDemo(LuccheseId, browser);
  const opened = openStoreDemo("boots", LuccheseId, browser);

  assert.equal(opened, true);
  assert.deepEqual(browser.Nobi.pendingApiCalls, [
    { type: "prepareStoreDemo", options: { storeId: LuccheseId } },
    { type: "open", options: { message: "boots", storeId: LuccheseId, entryPoint: DemoEntryPoint } },
  ]);
});

test("the demo starts on Lucchese with hand-picked searches, and other stores show their own", () => {
  assert.equal(DefaultStore.id, LuccheseId);
  assert.equal(readStoreSearches(DefaultStore).length, 3);
  assert.deepEqual(readStoreSearches({ id: "other", exampleSearches: ["Wool scarf"] }), ["Wool scarf"]);
});

/** A stand-in fetch that records the request and answers with the given status and body. */
function buildFetch(status, body, requests = []) {
  return async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) });
    if (body instanceof Error) {
      throw body;
    }
    return { ok: status >= 200 && status < 300, json: async () => body };
  };
}

test("a store we can demo now comes back ready, in the same shape as the store list", async () => {
  const requests = [];
  const store = { id: "s1", name: " Acme ", url: "https://acme.com", exampleSearches: ["Red mug"] };
  const fetchImplementation = buildFetch(200, { status: "ready", store }, requests);

  const answer = await lookUpDemoStore(" www.acme.com ", { hostname: "nobi.ai", fetchImplementation });

  assert.deepEqual(answer, { status: DemoLookupStatus.Ready, store: { id: "s1", name: "Acme", logoUrl: null, exampleSearches: ["Red mug"] } });
  assert.deepEqual(requests, [{ url: "https://api.nobi.ai/v1/shop/demo-stores/lookup", body: { storeUrl: "www.acme.com" } }]);
});

test("a store we cannot demo yet comes back not ready, and errors or broken answers come back failed", async () => {
  const lookUp = (status, body) => lookUpDemoStore("acme.com", { hostname: "localhost", fetchImplementation: buildFetch(status, body) });

  assert.deepEqual(await lookUp(200, { status: "not_ready" }), { status: DemoLookupStatus.NotReady });
  assert.deepEqual(await lookUp(200, { status: "ready", store: { name: "No id" } }), { status: DemoLookupStatus.Failed });
  assert.deepEqual(await lookUp(429, { error: "rate_limited" }), { status: DemoLookupStatus.Failed });
  assert.deepEqual(await lookUp(200, new Error("offline")), { status: DemoLookupStatus.Failed });
});

test("a demo link names the store to open, and a page without one names none", () => {
  assert.equal(readDemoStoreId("?demoStore=b4e64f15&utm_source=email"), "b4e64f15");
  assert.equal(readDemoStoreId("?utm_source=email"), "");
  assert.equal(readDemoStoreId(""), "");
});
