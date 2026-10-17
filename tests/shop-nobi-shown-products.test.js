import assert from "node:assert/strict";
import { test } from "node:test";
import { sendSearchPageShownProducts } from "../src/utils/shopNobiShownProducts.js";
import { handleProductLinkClick } from "../src/utils/shopNobiProductClick.js";
import { makeBrowser } from "./fixtures/shop-nobi-click-browser.js";

const EventsUrl = "https://api.nobi.ai/v1/merchants/9282b7cb-66ce-4d53-8c37-c291352ef03d/events";
const PageUrl = "https://nobi.ai/shop/s/black-leather-boots?utm_source=pinterest";
const GooglebotAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const RoperVariantId = "8e4a3b21-1d55-4c2b-9b86-3a7f2a6e0003";
const HarnessVariantId = "f9e26080-b6a4-4af2-b32c-b6e751e976c6";
const LuccheseId = "35019f05-f0cd-4ee3-ba16-c1fe938888d1";
const FryeId = "1b3c6e2a-7d4f-4a8b-9c0d-2e5f7a9b1c3d";

/** A built search page: a paid product, one from before the API sent ids, and an unpaid one. */
const Page = {
  slug: "black-leather-boots",
  query: "black leather boots",
  products: [
    { name: "Roper Boot", url: "https://lucchese.com/products/roper", paidLink: true, productVariantId: RoperVariantId, owningMerchantId: LuccheseId },
    { name: "Cowboy Boot", url: "https://example.com/products/cowboy", paidLink: false },
    { name: "Harness Boot", url: "https://frye.example/products/harness", paidLink: false, productVariantId: HarnessVariantId, owningMerchantId: FryeId },
  ],
};

test("a person's page view records the products shown in order, and a click on one joins it by product and place", () => {
  const browser = makeBrowser();

  sendSearchPageShownProducts(Page, browser);
  const link = { href: Page.products[2].url };
  handleProductLinkClick(
    { button: 0, currentTarget: link, preventDefault: () => {} },
    { product: Page.products[2], position: 3, query: Page.query, slug: Page.slug },
    browser);

  const [shown, click] = browser.beacons;
  assert.equal(shown.url, EventsUrl);
  assert.deepEqual(shown.event, {
    name: "Displayed Product Collection",
    source: "assistant",
    shopperId: "shopper-1",
    details: {
      entryPoint: "AI Search Bar",
      query: "black leather boots",
      pageSlug: "black-leather-boots",
      collectionName: "Prebuilt search page",
      collectionSize: 3,
      shownProducts: [
        { productVariantId: RoperVariantId, owningMerchantId: LuccheseId, position: 1, isPaidLink: true },
        { productVariantId: HarnessVariantId, owningMerchantId: FryeId, position: 3, isPaidLink: false },
      ],
      pageUrl: PageUrl,
      utm_source: "pinterest",
      referrer: "https://www.google.com/",
      shopperId: "shopper-1",
    },
  });
  assert.deepEqual(
    [click.event.details.productVariantId, click.event.details.owningMerchantId, click.event.details.positionInGrid],
    [HarnessVariantId, FryeId, 3]);
});

test("crawlers, automated browsers, local copies and pages without product ids record nothing", () => {
  const uncountedViews = [
    { browser: makeBrowser({ userAgent: GooglebotAgent }), page: Page },
    { browser: makeBrowser({ webdriver: true }), page: Page },
    { browser: makeBrowser({ pageUrl: "http://localhost:5173/shop/s/black-leather-boots" }), page: Page },
    { browser: makeBrowser(), page: { ...Page, products: [Page.products[1]] } },
  ];

  for (const { browser, page } of uncountedViews) {
    sendSearchPageShownProducts(page, browser);
    assert.equal(browser.beacons.length + browser.fetches.length, 0, browser.navigator.userAgent + browser.location.href);
  }
});
