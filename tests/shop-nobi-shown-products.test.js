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
const GiftCardVariantId = "5d0c9a7e-2b1f-4e3a-8c6d-9f0e1a2b3c4d";
const ShopNobiId = "9282b7cb-66ce-4d53-8c37-c291352ef03d";

/** A built search page: a paid product, one from before the API sent ids, an unpaid one, and one Shop Nobi sells. */
const Page = {
  slug: "black-leather-boots",
  query: "black leather boots",
  products: [
    { name: "Roper Boot", url: "https://lucchese.com/products/roper", paidLink: true, placementReason: "organic", productVariantId: RoperVariantId, owningMerchantId: LuccheseId },
    { name: "Cowboy Boot", url: "https://example.com/products/cowboy", paidLink: false },
    { name: "Harness Boot", url: "https://frye.example/products/harness", paidLink: false, placementReason: "paid_merchant", productVariantId: HarnessVariantId, owningMerchantId: FryeId },
    { name: "Gift Card", url: "https://nobi.ai/gift-card", paidLink: false, placementReason: "invalid", productVariantId: GiftCardVariantId, owningMerchantId: ShopNobiId },
  ],
};

test("a page view lists every product in order, and start position + list index is a click's positionInGrid", () => {
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
      collectionSize: 4,
      experimentId: "shop-landing-products-v1",
      experimentVariant: "guide-first",
      landingVisitId: shown.event.details.landingVisitId,
      shownProductsStartPosition: 1,
      shownProducts: [
        { productVariantId: RoperVariantId, owningMerchantId: LuccheseId, isPaidLink: true, placementReason: "organic" },
        { productVariantId: null, isPaidLink: false },
        { productVariantId: HarnessVariantId, owningMerchantId: FryeId, isPaidLink: false, placementReason: "paid_merchant" },
        { productVariantId: GiftCardVariantId, isPaidLink: false },
      ],
      pageUrl: PageUrl,
      utm_source: "pinterest",
      referrer: "https://www.google.com/",
      shopperId: "shopper-1",
    },
  });
  const { productVariantId, owningMerchantId, positionInGrid } = click.event.details;
  const listIndex = shown.event.details.shownProducts.findIndex((shownProduct) => shownProduct.productVariantId === productVariantId);
  assert.equal(owningMerchantId, FryeId);
  assert.equal(shown.event.details.shownProductsStartPosition + listIndex, positionInGrid);
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
