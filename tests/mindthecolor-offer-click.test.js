import assert from "node:assert/strict";
import { test } from "node:test";
import { MindTheColorEntryPoint, MindTheColorOffer, MindTheColorSlug } from "../src/content/mindTheColor.js";
import { handleOfferLinkClick } from "../src/utils/shopNobiOfferClick.js";
import { makeBrowser } from "./fixtures/shop-nobi-click-browser.js";

const PageUrl = "https://nobi.ai/tools/mindthecolor-fit?utm_source=pinterest&utm_medium=organic&utm_campaign=plugin_fit&utm_content=offline_launch";

/** Exercise a real built link through the existing offer exit, without following it or posting a live event. */
function click(browser, button = 0) {
  const link = { href: MindTheColorOffer.url };
  handleOfferLinkClick({ button, currentTarget: link }, { offer: MindTheColorOffer, slug: MindTheColorSlug, entryPoint: MindTheColorEntryPoint }, browser);
  return link.href;
}

test("digital exits preserve the actual Gumroad publisher and send separate offer attribution without a fake sub-ID", () => {
  const browser = makeBrowser({ pageUrl: PageUrl });
  const url = click(browser);
  assert.equal(click(browser, 1), url);
  const paid = new URL(url);
  assert.equal(paid.origin + paid.pathname, MindTheColorOffer.sourceUrl);
  assert.deepEqual(paid.searchParams.getAll("a"), ["480165219"]);
  assert.equal(paid.searchParams.has("clickref"), false);
  assert.equal(paid.searchParams.get("utm_term"), MindTheColorOffer.query);
  assert.equal(browser.beacons.length, 2);
  const { event } = browser.beacons[0];
  assert.equal(event.name, "Click On Offer");
  assert.equal(event.details.offerKind, "DIGITAL_SOFTWARE");
  assert.equal(event.details.priceBasis, "PER_LICENSE");
  assert.equal(event.details.owningMerchantId, MindTheColorOffer.owningMerchantId);
  assert.equal(event.details.linkUrl, url);
  assert.equal(event.details.pageUrl, PageUrl);
  assert.equal(event.details.utm_campaign, "plugin_fit");
  assert.equal(event.details.utm_content, "offline_launch");
  for (const field of ["productId", "productVariantId", "productPrice", "conversationId", "photoshop", "platform", "installer", "internet", "users", "workflow", "answers"]) assert.equal(event.details[field], undefined);
});

test("automation keeps the nonaffiliate source and local copies cannot count as acquisition", () => {
  for (const options of [{ userAgent: "Googlebot/2.1" }, { webdriver: true }, { pageUrl: "http://127.0.0.1:4787/tools/mindthecolor-fit" }]) {
    const browser = makeBrowser({ pageUrl: PageUrl, ...options });
    const url = new URL(click(browser));
    assert.equal(browser.beacons.length + browser.fetches.length, 0);
    if (options.webdriver || options.userAgent) assert.equal(url.searchParams.has("a"), false);
    assert.equal(url.origin + url.pathname, MindTheColorOffer.sourceUrl);
  }
});
