// The homepage store demo: the stores a visitor can pick, and the calls that open Nobi's modal on the picked store.

/** The entry point the demo's searches and chats carry, so they are counted as demo chats, never against a store. */
export const DemoEntryPoint = "Homepage demo";
/** Only stores whose catalog was refreshed this recently are offered. */
export const FreshnessDays = 7;
/** The local API the dev setup runs; every other host uses production. */
const LocalApiBaseUrl = "http://localhost:7080";
const ProductionApiBaseUrl = "https://api.nobi.ai";
const LocalHosts = ["localhost", "127.0.0.1", "[::1]"];

/**
 * Returns the address of the list of stores to demo.
 *
 * @param {string} hostname The page's host, such as "nobi.ai".
 * @returns {string} The address, on the local API when the page runs locally.
 */
export function buildDemoStoresUrl(hostname) {
  const apiBaseUrl = LocalHosts.includes(hostname) ? LocalApiBaseUrl : ProductionApiBaseUrl;
  return `${apiBaseUrl}/v1/shop/stores?refreshedWithinDays=${FreshnessDays}`;
}

/**
 * Keeps the stores the demo can show: each needs an id and a name, and keeps at most three example searches.
 *
 * @param {unknown} data The response body of the stores list.
 * @returns {{id: string, name: string, logoUrl: string | null, exampleSearches: string[]}[]} The stores, by name.
 */
export function readDemoStores(data) {
  const stores = Array.isArray(data?.stores) ? data.stores : [];
  return stores
    .filter((store) => typeof store?.id === "string" && typeof store?.name === "string" && store.name.trim())
    .map((store) => ({
      id: store.id,
      name: store.name.trim(),
      logoUrl: typeof store.logoUrl === "string" ? store.logoUrl : null,
      exampleSearches: (Array.isArray(store.exampleSearches) ? store.exampleSearches : []).filter(isText).slice(0, 3),
    }))
    .sort((first, second) => first.name.localeCompare(second.name));
}

/**
 * Keeps the stores whose name holds the visitor's words, ignoring case.
 *
 * @param {{name: string}[]} stores The stores to demo.
 * @param {string} words What the visitor typed in the store field.
 * @returns {{name: string}[]} The matching stores, in the same order.
 */
export function findDemoStores(stores, words) {
  const wanted = words.trim().toLowerCase();
  return wanted ? stores.filter((store) => store.name.toLowerCase().includes(wanted)) : stores;
}

/**
 * Asks the assistant to get ready for a store's demo, so the first search opens without waiting.
 *
 * @param {string} storeId The picked store.
 * @param {object} [browser] The window. Tests pass a stand-in.
 */
export function prepareStoreDemo(storeId, browser = globalThis) {
  callAssistant(browser, "prepareStoreDemo", { type: "prepareStoreDemo", options: { storeId } });
}

/**
 * Opens Nobi's modal with a search on the picked store. Before the assistant has loaded, the call waits in its queue.
 *
 * @param {string} message The visitor's words or a tapped example.
 * @param {string} storeId The picked store.
 * @param {object} [browser] The window. Tests pass a stand-in.
 * @returns {boolean} Whether there was a search to open.
 */
export function openStoreDemo(message, storeId, browser = globalThis) {
  if (!message.trim()) {
    return false;
  }

  const options = { message: message.trim(), storeId, entryPoint: DemoEntryPoint };
  callAssistant(browser, "openChat", { type: "open", options });
  return true;
}

/**
 * Calls the assistant, or queues the call in window.Nobi.pendingApiCalls, which the assistant runs once it loads.
 *
 * @param {object} browser The window.
 * @param {string} methodName The assistant method, such as "openChat".
 * @param {{type: string, options: object}} queuedCall The same call in the assistant's queue format.
 */
function callAssistant(browser, methodName, queuedCall) {
  const assistant = browser.Nobi;
  if (typeof assistant?.[methodName] === "function") {
    assistant[methodName](queuedCall.options);
    return;
  }

  browser.Nobi = assistant || {};
  browser.Nobi.pendingApiCalls = Array.isArray(browser.Nobi.pendingApiCalls) ? browser.Nobi.pendingApiCalls : [];
  browser.Nobi.pendingApiCalls.push(queuedCall);
}

/** Returns whether a value is text with something in it. */
function isText(value) {
  return typeof value === "string" && value.trim().length > 0;
}
