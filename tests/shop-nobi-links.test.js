import assert from "node:assert/strict";
import { test } from "node:test";
import { tagProductLinkOnClick } from "../src/utils/shopNobiSearchPage.js";
import { tagShopNobiPageLink } from "../src/utils/shopNobiPage.js";
import { encodePaidLink } from "../src/utils/shopNobiPaidLink.js";
import { buildClickId, createVisitId } from "../src/utils/shopNobiClickId.js";

const ShopNobiTags = "utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi";
const ClickId = "black-leather-boots.k3x9a0qz";
const Person = { isPerson: true, conversationId: null, clickId: ClickId };
const Crawler = { isPerson: false, conversationId: null, clickId: null };

/** Clicks a product link twice and returns where it points, which shows a second click changes nothing. */
function clickTwice(product, visit) {
  const link = { href: product.url };
  tagProductLinkOnClick({ currentTarget: link }, product, visit);
  tagProductLinkOnClick({ currentTarget: link }, product, visit);
  return link.href;
}

test("a click on a product link without a paid link swaps its utm_ tags for Shop Nobi's, keeping the rest", () => {
  const product = { url: "https://store.example/p/boot?variant=7&utm_source=other&utm_term=x#reviews" };

  assert.equal(clickTwice(product, Person), `https://store.example/p/boot?variant=7&${ShopNobiTags}#reviews`);
});

test("plain prebuilt links remove stale conversation IDs, including crawler and unreadable paid-link fallbacks", () => {
  const url = "https://store.example/p/boot?variant=7&nobi-conversation-id=old&utm_source=other#reviews";
  for (const visit of [Person, Crawler, { ...Person, conversationId: "conversation-1" }]) {
    for (const encodedStoreLink of [undefined, "not base64!"]) {
      assert.equal(clickTwice({ url, encodedStoreLink }, visit), `https://store.example/p/boot?variant=7&${ShopNobiTags}#reviews`);
    }
  }
});

test("a person's click opens the paid link as sent with the click id as its sub-ID, and a crawler's opens the plain link", () => {
  const innerLink = "https%3A%2F%2Fstore.example%2Fp%2Fboot%3Futm_source%3Dshop_nobi%26utm_campaign%3Dshop_nobi";
  const storeLink = `https://www.awin1.com/cread.php?awinmid=1&clickref=shop_nobi&ued=${innerLink}&name=café#top`;
  const product = { url: "https://store.example/p/boot", encodedStoreLink: encodePaidLink(storeLink) };

  const paidLink = `https://www.awin1.com/cread.php?awinmid=1&clickref=${ClickId}&ued=${innerLink}&name=café#top`;
  assert.equal(clickTwice(product, Person), paidLink, "Only the sub-ID changes");
  assert.equal(clickTwice(product, Crawler), `https://store.example/p/boot?${ShopNobiTags}`);
});

test("tracking tags and links without a sub-ID slot are never changed", () => {
  const unencodedLink = "https://store.example/ref?id=7&url=https://store.example/p/boot?utm_source=shop_nobi&utm_campaign=shop_nobi";
  for (const storeLink of [unencodedLink, "https://sovrn.co?key=web&u=https%3A%2F%2Fstore.example"]) {
    const product = { url: "https://store.example/p/boot", encodedStoreLink: encodePaidLink(storeLink) };
    assert.equal(clickTwice(product, Person), storeLink);
  }
});

test("a click id is the slug and a visit id, at most 50 letters, digits, dots and dashes", () => {
  const visitId = createVisitId(Uint8Array.from([0, 10, 35, 36, 71, 255, 1, 2]));
  assert.equal(visitId, "0az0z312");
  assert.match(createVisitId(), /^[a-z0-9]{8}$/);

  assert.equal(buildClickId("black-leather-boots", visitId), "black-leather-boots.0az0z312");
  const longClickId = buildClickId("a-".repeat(40), visitId);
  assert.equal(longClickId.length, 50);
  assert.match(longClickId, /^[A-Za-z0-9.-]+\.0az0z312$/);
});

test("a Shop Nobi page link placed on a channel names that channel and drops every utm tag it had", () => {
  const pageUrl = "https://nobi.ai/shop/s/linen-dress?stores=a&utm_source=old&utm_medium=old&utm_term=old";

  const taggedLink = tagShopNobiPageLink(pageUrl, "google_web_stories");

  assert.equal(
    taggedLink,
    "https://nobi.ai/shop/s/linen-dress?stores=a&utm_source=google_web_stories&utm_medium=referral&utm_campaign=shop_nobi",
  );
});
