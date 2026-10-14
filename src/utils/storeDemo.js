// The homepage store demo: the stores a visitor can pick, and the calls that open Nobi's modal on the picked store.

/** The entry point the demo's searches and chats carry, so they are counted as demo chats, never against a store. */
export const DemoEntryPoint = "Homepage demo";
/** Only stores whose catalog was refreshed this recently are offered. */
export const FreshnessDays = 7;
/** The local API the dev setup runs; every other host uses production. */
const LocalApiBaseUrl = "http://localhost:7080";
const ProductionApiBaseUrl = "https://api.nobi.ai";
const LocalHosts = ["localhost", "127.0.0.1", "[::1]"];
/** The route that says whether a visitor's own store can be demoed now. */
const DemoLookupPath = "/v1/shop/demo-stores/lookup";
/** The link parameter that opens the demo on one store, such as nobi.ai/?demoStore=<id>. */
export const DemoStoreParameter = "demoStore";
/** The status the API answers an address it cannot read with. */
const BadRequestStatus = 400;
/** What the own-store lookup found: a store to demo now, one we cannot demo yet, an address it cannot read, or no answer. */
export const DemoLookupStatus = { Ready: "ready", NotReady: "not_ready", InvalidAddress: "invalid_address", Failed: "failed" };
/** The store the demo starts on, so a visitor can search right away. */
export const DefaultStore = { id: "b4e64f15-4a40-4546-a204-e1c088e104e0", name: "Lucchese", logoUrl: null, exampleSearches: [] };
/** Hand-picked searches for Nobi's paying customers on Shop Nobi, named from products each one really sells. */
const HandPickedSearches = {
  "b4e64f15-4a40-4546-a204-e1c088e104e0": ["Black leather boots for men", "Women's cowboy boots", "Leather belt"],
  "2743be59-9aee-44a5-b080-78b396ff78b5": ["Wrinkle-free dress shirt", "Performance polo", "Women's button-down shirt"],
  "35019f05-f0cd-4ee3-ba16-c1fe938888d1": ["Cozy cardigan", "Colorful top for spring", "Quarter-zip sweater"],
};

/**
 * Returns the address of the list of stores to demo.
 *
 * @param {string} hostname The page's host, such as "nobi.ai".
 * @returns {string} The address, on the local API when the page runs locally.
 */
export function buildDemoStoresUrl(hostname) {
  return `${readApiBaseUrl(hostname)}/v1/shop/stores?refreshedWithinDays=${FreshnessDays}`;
}

/**
 * Asks the API whether a visitor's own store can be demoed now. The API answers the same way for a store we do not
 * carry and for one whose catalog is too old, so the answer never shows which stores we carry.
 *
 * @param {string} storeUrl The address the visitor typed, such as "www.mystore.com".
 * @param {{hostname?: string, fetchImplementation?: typeof fetch}} [options] Tests pass a host and a fetch.
 * @returns {Promise<{status: string, store?: object}>} The status, and the store when it is ready.
 */
export async function lookUpDemoStore(storeUrl, options = {}) {
  const { hostname = globalThis.location?.hostname, fetchImplementation = globalThis.fetch } = options;
  try {
    const response = await fetchImplementation(`${readApiBaseUrl(hostname)}${DemoLookupPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeUrl: storeUrl.trim() }),
    });
    if (response.status === BadRequestStatus) {
      return { status: DemoLookupStatus.InvalidAddress };
    }

    const data = response.ok ? await response.json() : null;
    return readLookupAnswer(data);
  } catch (error) {
    return { status: DemoLookupStatus.Failed };
  }
}

/**
 * Reads the store id from a demo link, such as "?demoStore=<id>".
 *
 * @param {string} search The page's query string.
 * @returns {string} The store id, or an empty string when the link has none.
 */
export function readDemoStoreId(search) {
  const storeId = new URLSearchParams(search).get(DemoStoreParameter);
  return storeId ? storeId.trim() : "";
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
 * Returns the example searches to show for a store: hand-picked ones for Nobi's customers, else the store's own.
 *
 * @param {{id: string, exampleSearches: string[]}} store The picked store.
 * @returns {string[]} Up to three searches.
 */
export function readStoreSearches(store) {
  return HandPickedSearches[store.id] || store.exampleSearches;
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

/** Returns the API base address: the local API when the page runs locally, else production. */
function readApiBaseUrl(hostname) {
  return LocalHosts.includes(hostname) ? LocalApiBaseUrl : ProductionApiBaseUrl;
}

/** Turns the lookup's response body into a status, keeping the store only when it is a valid demo store. */
function readLookupAnswer(data) {
  if (data?.status === DemoLookupStatus.NotReady) {
    return { status: DemoLookupStatus.NotReady };
  }

  const [store] = data?.status === DemoLookupStatus.Ready ? readDemoStores({ stores: [data.store] }) : [];
  return store ? { status: DemoLookupStatus.Ready, store } : { status: DemoLookupStatus.Failed };
}

/** Returns whether a value is text with something in it. */
function isText(value) {
  return typeof value === "string" && value.trim().length > 0;
}
