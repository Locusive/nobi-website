import assert from "node:assert/strict";
import { test } from "node:test";
import { tagProductLinkOnClick } from "../src/utils/shopNobiSearchPage.js";
import { tagShopNobiPageLink } from "../src/utils/shopNobiPage.js";

const ShopNobiTags = "utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi";

test("a click on a product link swaps its utm_ tags for Shop Nobi's, keeping the rest of the link", () => {
  const link = { href: "https://store.example/p/boot?variant=7&utm_source=other&utm_term=x#reviews" };
  const taggedHref = `https://store.example/p/boot?variant=7&${ShopNobiTags}#reviews`;

  tagProductLinkOnClick({ currentTarget: link });
  assert.equal(link.href, taggedHref);

  tagProductLinkOnClick({ currentTarget: link });
  assert.equal(link.href, taggedHref, "A second click adds nothing more");
});

test("a click on a product link with the page's conversation carries it once, so the store can tie an order back", () => {
  const link = { href: "https://store.example/p/boot?variant=7&nobi-conversation-id=old" };

  tagProductLinkOnClick({ currentTarget: link }, "conversation-1");
  tagProductLinkOnClick({ currentTarget: link }, "conversation-1");

  assert.equal(link.href, `https://store.example/p/boot?variant=7&nobi-conversation-id=conversation-1&${ShopNobiTags}`);
});

test("a Shop Nobi page link placed on a channel names that channel and drops every utm tag it had", () => {
  const pageUrl = "https://nobi.ai/shop/s/linen-dress?stores=a&utm_source=old&utm_medium=old&utm_term=old";

  const taggedLink = tagShopNobiPageLink(pageUrl, "google_web_stories");

  assert.equal(
    taggedLink,
    "https://nobi.ai/shop/s/linen-dress?stores=a&utm_source=google_web_stories&utm_medium=referral&utm_campaign=shop_nobi",
  );
});
