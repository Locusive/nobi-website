// A click on a prebuilt Shop Nobi product card sends the API the same "Click On Search Result" event the
// assistant bundle sends for its live cards, so clicks on prebuilt pages are counted too.

import { tagProductLinkOnClick } from "./shopNobiSearchPage.js";
import { isAutomatedVisitor } from "./automatedVisitor.js";
import { buildClickId, createVisitId } from "./shopNobiClickId.js";

/** The Shop Nobi merchant, which every Shop Nobi event is posted under. index.html starts the bundle with it too. */
const ShopNobiMerchantId = "9282b7cb-66ce-4d53-8c37-c291352ef03d";
const EventsUrl = `https://api.nobi.ai/v1/merchants/${ShopNobiMerchantId}/events`;
const ClickEventName = "Click On Search Result";
/** The source the bundle's events carry. The reports count only events with it. */
const AssistantSource = "assistant";
/** The entry point the bundle sends for a click on a live Shop Nobi result. A prebuilt card's click sends it too. */
const SearchBarEntryPoint = "AI Search Bar";
/** Clicks on a copy of the site served from these hosts are not counted. */
const LocalHosts = ["localhost", "127.0.0.1"];
/** The mouse buttons that open a link: the main button and the middle button. */
const LinkOpeningButtons = [0, 1];
/** Where the bundle keeps the shopper's id in local storage. */
const BundleStorageKey = "Nobi";
const ShopperIdKey = "nobi-shopper-id";
/** The traffic tags the bundle copies from the page address onto its events. */
const TrafficTags = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
/** Where index.html keeps the page view's conversation, which the bundle's opening search runs under too. */
const PageConversationIdKey = "shopNobiPageConversationId";
/** Where the page view's visit id is kept once a click makes it. It stands in for a missing conversation. */
const PageVisitIdKey = "shopNobiPageVisitId";
/** The internal smoke-test marker the bundle adds to its API requests, so the API drops a smoke test's events. */
const SmokeTestQueryParameter = "nobi_smoke_test";
const SmokeTestSessionStorageKey = "nobi_smoke_test_token";

/**
 * Click handler for a prebuilt product link. It sets the link to open, then sends the click event under the page's
 * conversation when the click opens the store page. The browser still follows the link as usual.
 *
 * @param {{button: number, currentTarget: {href: string}}} event The click, or a middle or right click.
 * @param {{product: object, position: number, query: string, slug: string}} click The product, its place, the search, the slug.
 * @param {object} [browser] The window. Tests pass a stand-in.
 */
export function handleProductLinkClick(event, click, browser = globalThis) {
  const visit = readVisit(click.slug, browser);
  tagProductLinkOnClick(event, click.product, visit);
  if (!LinkOpeningButtons.includes(event.button) || !shouldCountClicks(browser)) {
    return;
  }

  const clickEvent = buildClickEvent({ ...click, conversationId: visit.conversationId }, event.currentTarget.href, browser);
  sendEvent(clickEvent, browser);
}

/**
 * Reads who is clicking. A crawler or automated browser gets no conversation and no click id, as in the bundle. A
 * person's click id is the page's conversation, or "<slug>.<visit id>" when the page view has none.
 */
function readVisit(slug, browser) {
  if (isAutomatedVisitor(browser.navigator)) {
    return { isPerson: false, conversationId: null, clickId: null };
  }

  const conversationId = browser[PageConversationIdKey] || null;
  return { isPerson: true, conversationId, clickId: conversationId ?? buildClickId(slug, readVisitId(browser)) };
}

/** Reads the page view's visit id, making it at the first click so the build never makes one. */
function readVisitId(browser) {
  browser[PageVisitIdKey] ??= createVisitId();
  return browser[PageVisitIdKey];
}

/** Returns whether this visit's clicks count: not a local copy of the site, and not a crawler or automated browser. */
function shouldCountClicks(browser) {
  const isLocalCopy = LocalHosts.includes(browser.location.hostname);
  return !isLocalCopy && !isAutomatedVisitor(browser.navigator);
}

/** Builds the event with the field names the bundle uses for its live product clicks. */
function buildClickEvent({ product, position, query, conversationId }, linkUrl, browser) {
  const details = {
    entryPoint: SearchBarEntryPoint,
    ...(conversationId ? { conversationId } : {}),
    query,
    productName: product.name,
    storeName: product.storeName,
    productPrice: product.price,
    positionInGrid: position,
    linkUrl,
    pageUrl: browser.location.href,
    ...readTrafficTags(browser.location.href),
  };
  if (browser.document.referrer) {
    details.referrer = browser.document.referrer;
  }

  const shopperId = readShopperId(browser);
  if (!shopperId) {
    return { name: ClickEventName, source: AssistantSource, details };
  }
  return { name: ClickEventName, source: AssistantSource, shopperId, details: { ...details, shopperId } };
}

/** Reads the traffic tags in the page address, such as utm_source. */
function readTrafficTags(pageUrl) {
  const pageParameters = new URL(pageUrl).searchParams;
  const presentTags = TrafficTags.filter((tag) => pageParameters.has(tag));
  return Object.fromEntries(presentTags.map((tag) => [tag, pageParameters.get(tag)]));
}

/** Reads the shopper id the bundle saved, or returns null when there is none or storage is blocked. */
function readShopperId(browser) {
  try {
    const bundleData = JSON.parse(browser.localStorage.getItem(BundleStorageKey) || "{}");
    return bundleData[ShopperIdKey] || null;
  } catch {
    return null;
  }
}

/** Returns the address events go to, with the bundle's smoke-test marker when a smoke test runs in this tab. */
function buildEventsUrl(browser) {
  const smokeTestToken = readSmokeTestToken(browser);
  if (!smokeTestToken) {
    return EventsUrl;
  }

  const eventsUrl = new URL(EventsUrl);
  eventsUrl.searchParams.set(SmokeTestQueryParameter, smokeTestToken);
  return eventsUrl.toString();
}

/** Reads the token a smoke test runner saves in the tab's session storage, or returns null when there is none. */
function readSmokeTestToken(browser) {
  try {
    return browser.sessionStorage?.getItem(SmokeTestSessionStorageKey) || null;
  } catch {
    return null;
  }
}

/** Sends the event as a beacon, which survives the page closing, or with a fetch that does when the beacon is refused. */
function sendEvent(clickEvent, browser) {
  const eventsUrl = buildEventsUrl(browser);
  const body = JSON.stringify(clickEvent);
  if (browser.navigator.sendBeacon?.(eventsUrl, body)) {
    return;
  }

  const request = { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true };
  // A lost click event must never get in the way of the link, so a failed send is dropped.
  browser.fetch(eventsUrl, request).catch(() => {});
}
