// A click on a prebuilt Shop Nobi product card sends the API the same "Click On Search Result" event the
// assistant bundle sends for its live cards, so clicks on prebuilt pages are counted too.

import { tagProductLinkOnClick } from "./shopNobiSearchPage.js";

/** The Shop Nobi merchant, which every Shop Nobi event is posted under. index.html starts the bundle with it too. */
const ShopNobiMerchantId = "9282b7cb-66ce-4d53-8c37-c291352ef03d";
const EventsUrl = `https://api.nobi.ai/v1/merchants/${ShopNobiMerchantId}/events`;
const ClickEventName = "Click On Search Result";
/** The source the bundle's events carry. The reports count only events with it. */
const AssistantSource = "assistant";
/** The entry point that names a click on a prebuilt Shop Nobi page. */
const PrebuiltPageEntryPoint = "Shop Nobi Page";
/** Clicks on a copy of the site served from these hosts are not counted. */
const LocalHosts = ["localhost", "127.0.0.1"];
/** Crawler and automated browser names, the same pattern the bundle uses to skip their clicks. */
const AutomatedVisitorPattern = /(bot|crawler|spider)[/;-]|bot\.html|slurp|headless/i;
/** The mouse buttons that open a link: the main button and the middle button. */
const LinkOpeningButtons = [0, 1];
/** Where the bundle keeps the shopper's id in local storage. */
const BundleStorageKey = "Nobi";
const ShopperIdKey = "nobi-shopper-id";
/** The traffic tags the bundle copies from the page address onto its events. */
const TrafficTags = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

/**
 * Click handler for a prebuilt product link. It tags the link, then sends the click event when the click opens the
 * store page. The browser still follows the link as usual.
 *
 * @param {{button: number, currentTarget: {href: string}}} event The click, or a middle or right click.
 * @param {{product: object, position: number, query: string}} click The product, its place on the page from 1, and the page's search.
 * @param {object} [browser] The window. Tests pass a stand-in.
 */
export function handleProductLinkClick(event, click, browser = globalThis) {
  tagProductLinkOnClick(event);
  if (!LinkOpeningButtons.includes(event.button) || !shouldCountClicks(browser)) {
    return;
  }

  const clickEvent = buildClickEvent(click, event.currentTarget.href, browser);
  sendEvent(clickEvent, browser);
}

/** Returns whether this visit's clicks count: not a local copy of the site, and not a crawler or automated browser. */
function shouldCountClicks(browser) {
  const isLocalCopy = LocalHosts.includes(browser.location.hostname);
  return !isLocalCopy && !isAutomatedVisitor(browser.navigator);
}

/** Returns whether a crawler or a browser driven by automation is viewing the page, going by what it says about itself. */
function isAutomatedVisitor(browserNavigator) {
  return browserNavigator.webdriver === true || AutomatedVisitorPattern.test(browserNavigator.userAgent || "");
}

/** Builds the event with the field names the bundle uses for its live product clicks. */
function buildClickEvent({ product, position, query }, linkUrl, browser) {
  const details = {
    entryPoint: PrebuiltPageEntryPoint,
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

/** Sends the event as a beacon, which survives the page closing, or with a fetch that does when the beacon is refused. */
function sendEvent(clickEvent, browser) {
  const body = JSON.stringify(clickEvent);
  if (browser.navigator.sendBeacon?.(EventsUrl, body)) {
    return;
  }

  const request = { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true };
  // A lost click event must never get in the way of the link, so a failed send is dropped.
  browser.fetch(EventsUrl, request).catch(() => {});
}
