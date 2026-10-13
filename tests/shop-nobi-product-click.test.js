import assert from "node:assert/strict";
import { test } from "node:test";
import { handleProductLinkClick } from "../src/utils/shopNobiProductClick.js";
import { encodePaidLink } from "../src/utils/shopNobiPaidLink.js";

const EventsUrl = "https://api.nobi.ai/v1/merchants/9282b7cb-66ce-4d53-8c37-c291352ef03d/events";
const PageUrl = "https://nobi.ai/shop/s/black-leather-boots?utm_source=pinterest";
const Product = { name: "Roper Boot", storeName: "Lucchese", url: "https://lucchese.com/products/roper?variant=123", price: 495, currency: "USD" };
const TaggedProductUrl = `${Product.url}&utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi`;
/** The conversation index.html made for the page view, which the bundle's opening search runs under too. */
const PageConversationId = "6f1c2a4e-8b3d-4c5e-9f70-1a2b3c4d5e6f";
const LinkWithConversation = `${TaggedProductUrl}&nobi-conversation-id=${PageConversationId}`;
const ChromeAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";
const GooglebotAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const MouseButton = { Main: 0, Middle: 1, Right: 2 };
const PaidLinkStart = "https://sovrn.co?key=web&u=https%3A%2F%2Flucchese.com%2Fproducts%2Froper";
const PaidProduct = { ...Product, paidLink: true, encodedStoreLink: encodePaidLink(`${PaidLinkStart}&cuid=shop_nobi`) };

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

test("a click on a prebuilt product sends one click event with the product, page, shopper and conversation, and still follows the tagged link", () => {
  const browser = makeBrowser();

  const { link, defaultPrevented } = clickProduct(browser);

  assert.equal(link.href, LinkWithConversation);
  assert.equal(defaultPrevented, false, "The browser opens the store page itself");
  assert.equal(browser.fetches.length, 0);
  assert.deepEqual(browser.beacons, [{
    url: EventsUrl,
    event: {
      name: "Click On Search Result",
      source: "assistant",
      shopperId: "shopper-1",
      details: {
        entryPoint: "AI Search Bar",
        conversationId: PageConversationId,
        query: "black leather boots",
        productName: "Roper Boot",
        storeName: "Lucchese",
        productPrice: 495,
        positionInGrid: 2,
        linkUrl: LinkWithConversation,
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
  assert.equal(link.href, LinkWithConversation);
  assert.equal(rightClickBrowser.beacons.length, 0);
});

test("crawlers, automated browsers and local copies of the site send no click event; only a bot's link lacks the conversation", () => {
  const uncountedBrowsers = [
    { browser: makeBrowser({ userAgent: GooglebotAgent }), expectedLink: TaggedProductUrl },
    { browser: makeBrowser({ webdriver: true }), expectedLink: TaggedProductUrl },
    { browser: makeBrowser({ pageUrl: "http://localhost:5173/shop/s/black-leather-boots" }), expectedLink: LinkWithConversation },
    { browser: makeBrowser({ pageUrl: "http://127.0.0.1:5174/shop/s/black-leather-boots" }), expectedLink: LinkWithConversation },
  ];

  for (const { browser, expectedLink } of uncountedBrowsers) {
    const { link } = clickProduct(browser);
    assert.equal(link.href, expectedLink);
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

test("a page view with no conversation still counts the click and tags the link, without a conversation", () => {
  const browser = makeBrowser({ pageConversationId: null });

  const { link } = clickProduct(browser);

  assert.equal(link.href, TaggedProductUrl);
  assert.equal(browser.beacons[0].event.details.conversationId, undefined);
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

test("a person's click on a paid product opens the paid link with the conversation as its sub-ID, and counts that link", () => {
  const browser = makeBrowser();

  const { link } = clickProduct(browser, MouseButton.Main, PaidProduct);

  assert.equal(link.href, `${PaidLinkStart}&cuid=${PageConversationId}`);
  assert.equal(browser.beacons[0].event.details.linkUrl, link.href);
});

test("without a conversation, a paid link's sub-ID is the slug and one visit id for the page view; a crawler gets the plain link", () => {
  const browser = makeBrowser({ pageConversationId: null });

  const firstLink = clickProduct(browser, MouseButton.Main, PaidProduct).link.href;
  const secondLink = clickProduct(browser, MouseButton.Main, PaidProduct).link.href;

  assert.match(firstLink, /&cuid=black-leather-boots\.[a-z0-9]{8}$/);
  assert.equal(secondLink, firstLink, "Every click in the page view carries the same visit id");
  const crawlerLink = clickProduct(makeBrowser({ userAgent: GooglebotAgent }), MouseButton.Main, PaidProduct).link.href;
  assert.equal(crawlerLink, TaggedProductUrl);
});
