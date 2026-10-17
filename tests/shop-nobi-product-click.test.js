import assert from "node:assert/strict";
import { test } from "node:test";
import { handleProductLinkClick } from "../src/utils/shopNobiProductClick.js";
import { encodePaidLink } from "../src/utils/shopNobiPaidLink.js";

const EventsUrl = "https://api.nobi.ai/v1/merchants/9282b7cb-66ce-4d53-8c37-c291352ef03d/events";
const PageUrl = "https://nobi.ai/shop/s/black-leather-boots?utm_source=pinterest";
const Product = { name: "Roper Boot", storeName: "Lucchese", url: "https://lucchese.com/products/roper?variant=123", price: 495, currency: "USD" };
const TaggedProductUrl = `${Product.url}&utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi`;
/** The live assistant's conversation ID must not be reused by prebuilt cards. */
const PageConversationId = "6f1c2a4e-8b3d-4c5e-9f70-1a2b3c4d5e6f";
const ChromeAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";
const GooglebotAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const MouseButton = { Main: 0, Middle: 1, Right: 2 };
const PaidLinks = [
  { url: "https://sovrn.co?key=web&u=https%3A%2F%2Flucchese.com%2Fproducts%2Froper&cuid=shop_nobi", reference: "cuid" },
  { url: "https://www.awin1.com/cread.php?awinmid=1&clickref=shop_nobi&ued=https%3A%2F%2Flucchese.com%2Fproducts%2Froper", reference: "clickref" },
];

/** A stand-in window that records every beacon and fetch, with a saved shopper id and the page's conversation. */
function makeBrowser({
  pageUrl = PageUrl,
  userAgent = ChromeAgent,
  webdriver = false,
  acceptsBeacons = true,
  readStorage,
  pageConversationId = PageConversationId,
  smokeTestToken = null,
} = {}) {
  const address = new URL(pageUrl);
  const browser = { beacons: [], fetches: [], shopNobiPageConversationId: pageConversationId };
  browser.location = { href: address.href, hostname: address.hostname };
  browser.document = { referrer: "https://www.google.com/" };
  browser.localStorage = { getItem: readStorage ?? (() => JSON.stringify({ "nobi-shopper-id": "shopper-1" })) };
  browser.sessionStorage = { getItem: (key) => (key === "nobi_smoke_test_token" ? smokeTestToken : null) };
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
function clickProduct(browser, button = MouseButton.Main, product = Product) {
  const link = { href: product.url };
  const click = { button, currentTarget: link, defaultPrevented: false, preventDefault: () => { click.defaultPrevented = true; } };
  handleProductLinkClick(click, { product, position: 2, query: "black leather boots", slug: "black-leather-boots" }, browser);
  return { link, defaultPrevented: click.defaultPrevented };
}

test("a prebuilt click counts the product, page, shopper and acquisition without requiring the assistant conversation", () => {
  for (const pageConversationId of [PageConversationId, null]) {
    const browser = makeBrowser({ pageConversationId });

    const { link, defaultPrevented } = clickProduct(browser);

    assert.equal(link.href, TaggedProductUrl);
    assert.equal(defaultPrevented, false, "The browser opens the store page itself");
    assert.equal(browser.fetches.length, 0);
    assert.equal(browser.shopNobiPageConversationId, pageConversationId, "The live assistant keeps its conversation ID");
    assert.deepEqual(browser.beacons, [{
      url: EventsUrl,
      event: {
        name: "Click On Search Result",
        source: "assistant",
        shopperId: "shopper-1",
        details: {
          entryPoint: "AI Search Bar",
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
  }
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

test("crawlers, automated browsers and local copies of the site send no click event", () => {
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

test("a click in a smoke test's tab carries the bundle's smoke-test marker, so the API drops it", () => {
  const smokeTestBrowser = makeBrowser({ smokeTestToken: "smoke-test-token" });
  clickProduct(smokeTestBrowser);
  assert.equal(smokeTestBrowser.beacons[0].url, `${EventsUrl}?nobi_smoke_test=smoke-test-token`);

  const refusedBeaconBrowser = makeBrowser({ smokeTestToken: "smoke-test-token", acceptsBeacons: false });
  clickProduct(refusedBeaconBrowser);
  assert.equal(refusedBeaconBrowser.fetches[0].url, `${EventsUrl}?nobi_smoke_test=smoke-test-token`);
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

test("paid prebuilt clicks use one visit reference per page, preserve the destination, and record the same link without a conversation", () => {
  for (const { url, reference } of PaidLinks) {
    const product = { ...Product, paidLink: true, encodedStoreLink: encodePaidLink(url) };
    for (const pageConversationId of [PageConversationId, null]) {
      const browser = makeBrowser({ pageConversationId });

      const firstLink = clickProduct(browser, MouseButton.Main, product).link.href;
      const secondLink = clickProduct(browser, MouseButton.Main, product).link.href;
      const clickId = new URL(firstLink).searchParams.get(reference);

      assert.match(clickId, /^black-leather-boots\.[a-z0-9]{8}$/);
      assert.equal(firstLink, url.replace(`${reference}=shop_nobi`, `${reference}=${clickId}`), "Only the outer affiliate reference changes");
      assert.equal(secondLink, firstLink, "Every click in the page view carries the same visit reference");
      for (const { event } of browser.beacons) {
        assert.equal(event.details.linkUrl, firstLink);
        assert.equal(event.details.conversationId, undefined);
        assert.equal(event.details.utm_source, "pinterest");
        assert.equal(event.details.referrer, "https://www.google.com/");
      }

      const nextPage = makeBrowser({ pageConversationId });
      const nextLink = clickProduct(nextPage, MouseButton.Main, product).link.href;
      assert.notEqual(new URL(nextLink).searchParams.get(reference), clickId, "A separate page view gets its own reference");
    }

    const crawler = makeBrowser({ userAgent: GooglebotAgent });
    assert.equal(clickProduct(crawler, MouseButton.Main, product).link.href, TaggedProductUrl);
    assert.equal(crawler.beacons.length + crawler.fetches.length, 0);
  }
});
