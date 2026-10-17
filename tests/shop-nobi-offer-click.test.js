import assert from "node:assert/strict";
import { test } from "node:test";
import { handleOfferLinkClick } from "../src/utils/shopNobiOfferClick.js";
import { MarleySpoonEntryPoint, MarleySpoonOffer, MarleySpoonSlug } from "../src/content/marleySpoonCost.js";
import { makeBrowser } from "./fixtures/shop-nobi-click-browser.js";

const PageUrl = "https://nobi.ai/tools/marley-spoon-cost?utm_source=pinterest&utm_medium=organic&utm_campaign=delivery_cost&utm_content=first_five";
const EventsUrl = "https://api.nobi.ai/v1/merchants/9282b7cb-66ce-4d53-8c37-c291352ef03d/events";

/** Follow the actual authored link through the shared person/visit path without contacting any endpoint. */
function clickOffer(browser, button = 0) {
  const link = { href: MarleySpoonOffer.url };
  handleOfferLinkClick({ button, currentTarget: link }, { offer: MarleySpoonOffer, slug: MarleySpoonSlug, entryPoint: MarleySpoonEntryPoint }, browser);
  return link.href;
}

test("offer exits share a stable reference and send a distinct non-product event with the exact finished destination", () => {
  const browser = makeBrowser({ pageUrl: PageUrl });
  const firstLink = clickOffer(browser);
  assert.equal(clickOffer(browser, 1), firstLink, "Main and middle clicks use the same page-view reference");
  const paid = new URL(firstLink);
  const reference = paid.searchParams.get("clickref");
  assert.match(reference, /^marley-spoon-cost\.[a-z0-9]{8}$/);
  assert.equal(paid.searchParams.get("awinmid"), "6988");
  assert.equal(paid.searchParams.get("awinaffid"), "3122300");
  assert.equal(paid.searchParams.get("ued"), MarleySpoonOffer.url);
  assert.equal(new URL(paid.searchParams.get("ued")).searchParams.get("v"), MarleySpoonOffer.code);
  assert.equal(new URL(paid.searchParams.get("ued")).searchParams.has("nobi-conversation-id"), false);
  assert.equal(browser.beacons.length, 2);
  const { url, event } = browser.beacons[0];
  assert.equal(url, EventsUrl);
  assert.deepEqual(event, {
    name: "Click On Offer", source: "assistant", shopperId: "shopper-1",
    details: {
      entryPoint: "Shop Nobi Utility", offerId: MarleySpoonOffer.id, offerName: MarleySpoonOffer.name,
      offerKind: "SUBSCRIPTION", priceBasis: "PER_DELIVERY", owningMerchantId: MarleySpoonOffer.owningMerchantId,
      storeName: "Marley Spoon", query: "Marley Spoon delivery cost", linkUrl: firstLink, pageUrl: PageUrl,
      utm_source: "pinterest", utm_medium: "organic", utm_campaign: "delivery_cost", utm_content: "first_five",
      referrer: "https://www.google.com/", shopperId: "shopper-1",
    },
  });
  const nextBrowser = makeBrowser({ pageUrl: PageUrl });
  assert.notEqual(new URL(clickOffer(nextBrowser)).searchParams.get("clickref"), reference);
  assert.equal(clickOffer(browser, 2), firstLink);
  assert.equal(browser.beacons.length, 2, "Right clicks tag the exit but never count as a followed link");
});

test("bots, automation and local copies send no offer event, and crawlers keep the plain merchant destination", () => {
  for (const options of [
    { userAgent: "Googlebot/2.1" }, { webdriver: true },
    { pageUrl: "http://localhost:5173/tools/marley-spoon-cost" },
    { pageUrl: "http://127.0.0.1:5174/tools/marley-spoon-cost" },
  ]) {
    const browser = makeBrowser({ pageUrl: PageUrl, ...options });
    const link = clickOffer(browser);
    assert.equal(browser.beacons.length + browser.fetches.length, 0);
    if (options.userAgent || options.webdriver) {
      assert.equal(new URL(link).hostname, "marleyspoon.com");
      assert.equal(new URL(link).searchParams.get("v"), MarleySpoonOffer.code);
    }
  }
});

test("smoke marker, beacon fallback and blocked shopper storage preserve delivery without physical or calculator fields", () => {
  for (const acceptsBeacons of [true, false]) {
    const browser = makeBrowser({ pageUrl: PageUrl, acceptsBeacons, smokeTestToken: "smoke-token", readStorage: () => { throw new Error("blocked"); } });
    const link = clickOffer(browser);
    const sent = acceptsBeacons ? browser.beacons[0] : browser.fetches[0];
    assert.equal(sent.url, `${EventsUrl}?nobi_smoke_test=smoke-token`);
    assert.equal(sent.event.name, "Click On Offer");
    assert.equal(sent.event.shopperId, undefined);
    assert.equal(sent.event.details.linkUrl, link);
    for (const field of ["productId", "productVariantId", "productName", "productPrice", "conversationId", "deliveryCount", "budget"]) assert.equal(sent.event.details[field], undefined);
    if (!acceptsBeacons) {
      assert.equal(sent.request.method, "POST");
      assert.equal(sent.request.keepalive, true);
    }
  }
});
