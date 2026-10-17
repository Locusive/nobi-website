// Shared standalone outbound mechanics for authored Shop Nobi products and non-product offerings.

import { tagProductLinkOnClick } from "./shopNobiSearchPage.js";
import { isAutomatedVisitor } from "./automatedVisitor.js";
import { buildClickId, createVisitId } from "./shopNobiClickId.js";

/** The Shop Nobi merchant, which every Shop Nobi event is posted under. index.html starts the bundle with it too. */
const ShopNobiMerchantId = "9282b7cb-66ce-4d53-8c37-c291352ef03d";
const EventsUrl = `https://api.nobi.ai/v1/merchants/${ShopNobiMerchantId}/events`;
/** The source the bundle's events carry. The reports count only events with it. */
const AssistantSource = "assistant";
/** Clicks on a copy of the site served from these hosts are not counted. */
const LocalHosts = ["localhost", "127.0.0.1"];
/** The mouse buttons that open a link: the main button and the middle button. */
const LinkOpeningButtons = [0, 1];
/** Where the bundle keeps the shopper's id in local storage. */
const BundleStorageKey = "Nobi";
const ShopperIdKey = "nobi-shopper-id";
/** The traffic tags the bundle copies from the page address onto its events. */
const TrafficTags = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
/** Where prebuilt cards keep their page view's visit id once a click makes it. */
const PageVisitIdKey = "shopNobiPageVisitId";
/** The internal smoke-test marker the bundle adds to its API requests, so the API drops a smoke test's events. */
const SmokeTestQueryParameter = "nobi_smoke_test";
const SmokeTestSessionStorageKey = "nobi_smoke_test_token";

/** Tag a standalone outbound exit and emit its specific event using the existing person/visit rules. */
export function handleShopNobiOutboundClick(event, { link, slug, eventName, details }, browser = globalThis) {
  const visit = readVisit(slug, browser);
  tagProductLinkOnClick(event, link, visit);
  if (!LinkOpeningButtons.includes(event.button)) {
    return;
  }
  sendShopNobiEvent(eventName, { ...details, linkUrl: event.currentTarget.href }, browser);
}

/**
 * Sends a Shop Nobi event under the Shop Nobi merchant, with the page, its traffic tags, the referrer and the shopper.
 * A crawler, an automated browser or a local copy of the site sends nothing.
 *
 * @param {string} eventName The event's name, such as "Click On Search Result".
 * @param {object} details The event's own details.
 * @param {object} browser The window.
 */
export function sendShopNobiEvent(eventName, details, browser = globalThis) {
  if (!shouldCountVisit(browser)) {
    return;
  }
  sendEvent(buildEvent(eventName, details, browser), browser);
}

/**
 * Reads who is clicking. A person's prebuilt click uses "<slug>.<visit id>" independently of the live assistant's
 * conversation, which may never be saved. A crawler or automated browser gets no click id.
 */
function readVisit(slug, browser) {
  if (isAutomatedVisitor(browser.navigator)) {
    return { isPerson: false, conversationId: null, clickId: null };
  }

  return { isPerson: true, conversationId: null, clickId: buildClickId(slug, readVisitId(browser)) };
}

/** Reads the page view's visit id, making it at the first click so the build never makes one. */
function readVisitId(browser) {
  browser[PageVisitIdKey] ??= createVisitId();
  return browser[PageVisitIdKey];
}

/** Returns whether this visit's events count: not a local copy of the site, and not a crawler or automated browser. */
function shouldCountVisit(browser) {
  const isLocalCopy = LocalHosts.includes(browser.location.hostname);
  return !isLocalCopy && !isAutomatedVisitor(browser.navigator);
}

/** Adds the page, acquisition and shopper fields to an event's own details. */
function buildEvent(eventName, authoredDetails, browser) {
  const details = {
    ...authoredDetails,
    pageUrl: browser.location.href,
    ...readTrafficTags(browser.location.href),
  };
  if (browser.document.referrer) {
    details.referrer = browser.document.referrer;
  }
  const shopperId = readShopperId(browser);
  if (!shopperId) {
    return { name: eventName, source: AssistantSource, details };
  }
  return { name: eventName, source: AssistantSource, shopperId, details: { ...details, shopperId } };
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
function sendEvent(shopNobiEvent, browser) {
  const eventsUrl = buildEventsUrl(browser);
  const body = JSON.stringify(shopNobiEvent);
  if (browser.navigator.sendBeacon?.(eventsUrl, body)) {
    return;
  }

  const request = { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true };
  // A lost event must never get in the way of the page or its links, so a failed send is dropped.
  browser.fetch(eventsUrl, request).catch(() => {});
}
