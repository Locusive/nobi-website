import assert from "node:assert/strict";
import { test } from "node:test";
import { handleProductLinkClick } from "../src/utils/shopNobiProductClick.js";

const EventsUrl = "https://api.nobi.ai/v1/merchants/9282b7cb-66ce-4d53-8c37-c291352ef03d/events";
const PageUrl = "https://nobi.ai/shop/s/black-leather-boots?utm_source=pinterest";
const Product = { name: "Roper Boot", storeName: "Lucchese", url: "https://lucchese.com/products/roper?variant=123", price: 495, currency: "USD" };
const TaggedProductUrl = `${Product.url}&utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi`;
const ChromeAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";
const GooglebotAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const MouseButton = { Main: 0, Middle: 1, Right: 2 };

/** A stand-in window that records every beacon and fetch, with a saved shopper id unless storage says otherwise. */
function makeBrowser({ pageUrl = PageUrl, userAgent = ChromeAgent, webdriver = false, acceptsBeacons = true, readStorage } = {}) {
  const address = new URL(pageUrl);
  const browser = { beacons: [], fetches: [] };
  browser.location = { href: address.href, hostname: address.hostname };
  browser.document = { referrer: "https://www.google.com/" };
  browser.localStorage = { getItem: readStorage ?? (() => JSON.stringify({ "nobi-shopper-id": "shopper-1" })) };
  browser.navigator = {
    userAgent,
    webdriver,
    sendBeacon: (url, body) => {
      browser.beacons.push({ url, event: JSON.parse(body) });
      return acceptsBeacons;
    },
  };
  browser.fetch = (url, request) => {
    browser.fetches.push({ url, request, event: JSON.parse(request.body) });
    return Promise.resolve();
  };
  return browser;
}

/** Clicks the second product link on a page with the given mouse button. */
function clickProduct(browser, button = MouseButton.Main) {
  const link = { href: Product.url };
  const click = { button, currentTarget: link, defaultPrevented: false, preventDefault: () => { click.defaultPrevented = true; } };
  handleProductLinkClick(click, { product: Product, position: 2, query: "black leather boots" }, browser);
  return { link, defaultPrevented: click.defaultPrevented };
}

test("a click on a prebuilt product sends one click event with the product, page and shopper, and still follows the tagged link", () => {
  const browser = makeBrowser();

  const { link, defaultPrevented } = clickProduct(browser);

  assert.equal(link.href, TaggedProductUrl);
  assert.equal(defaultPrevented, false, "The browser opens the store page itself");
  assert.equal(browser.fetches.length, 0);
  assert.deepEqual(browser.beacons, [{
    url: EventsUrl,
    event: {
      name: "Click On Search Result",
      source: "assistant",
      shopperId: "shopper-1",
      details: {
        entryPoint: "Shop Nobi Page",
        query: "black leather boots",
        productName: "Roper Boot",
        storeName: "Lucchese",
        productPrice: 495,
        positionInGrid: 2,
        linkUrl: TaggedProductUrl,
        pageUrl: PageUrl,
        utm_source: "pinterest",
        referrer: "https://www.google.com/",
        shopperId: "shopper-1",
      },
    },
  }]);
});

test("a middle click counts as a click, and a right click only tags the link", () => {
  const middleClickBrowser = makeBrowser();
  clickProduct(middleClickBrowser, MouseButton.Middle);
  assert.equal(middleClickBrowser.beacons.length, 1);

  const rightClickBrowser = makeBrowser();
  const { link } = clickProduct(rightClickBrowser, MouseButton.Right);
  assert.equal(link.href, TaggedProductUrl);
  assert.equal(rightClickBrowser.beacons.length, 0);
});

test("crawlers, automated browsers and local copies of the site send no click event, but the link is still tagged", () => {
  const uncountedBrowsers = [
    makeBrowser({ userAgent: GooglebotAgent }),
    makeBrowser({ webdriver: true }),
    makeBrowser({ pageUrl: "http://localhost:5173/shop/s/black-leather-boots" }),
    makeBrowser({ pageUrl: "http://127.0.0.1:5174/shop/s/black-leather-boots" }),
  ];

  for (const browser of uncountedBrowsers) {
    const { link } = clickProduct(browser);
    assert.equal(link.href, TaggedProductUrl);
    assert.equal(browser.beacons.length + browser.fetches.length, 0, browser.navigator.userAgent + browser.location.href);
  }
});

test("when the browser refuses the beacon, the event goes by a fetch that outlives the page", () => {
  const browser = makeBrowser({ acceptsBeacons: false });

  clickProduct(browser);

  assert.equal(browser.fetches.length, 1);
  const [{ url, request, event }] = browser.fetches;
  assert.equal(url, EventsUrl);
  assert.equal(request.method, "POST");
  assert.equal(request.keepalive, true);
  assert.equal(event.name, "Click On Search Result");
});

test("a visitor with no saved shopper id, or with storage blocked, still sends the click without one", () => {
  const blockedStorage = () => {
    throw new Error("The browser blocks storage");
  };

  for (const readStorage of [() => null, blockedStorage]) {
    const browser = makeBrowser({ readStorage });
    clickProduct(browser);
    const [{ event }] = browser.beacons;
    assert.equal(event.shopperId, undefined);
    assert.equal(event.details.shopperId, undefined);
    assert.equal(event.details.productName, "Roper Boot");
  }
});
