import assert from "node:assert/strict";
import { test } from "node:test";
import { replaceProductLinkOnClick } from "../src/utils/shopNobiSearchPage.js";
import { tagShopNobiPageLink } from "../src/utils/shopNobiPage.js";
import { encodePaidLink } from "../src/utils/shopNobiPaidLink.js";
import { buildClickId, createVisitId } from "../src/utils/shopNobiClickId.js";
import { buildPopularSearches, linkCategoryPages } from "../scripts/shop-nobi-category-page-view.js";

const ShopNobiTags = "utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi";

const Person = { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/141.0 Safari/537.36" };
const Crawler = { userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" };
const AutomatedBrowser = { ...Person, webdriver: true };
const ClickId = "black-leather-boots.k3x9a0qz";

test("a click on a product link without a paid store link swaps its utm_ tags for Shop Nobi's, keeping the rest", () => {
  const product = { url: "https://store.example/p/boot?variant=7&utm_source=other&utm_term=x#reviews" };
  const link = { href: product.url };
  const taggedHref = `https://store.example/p/boot?variant=7&${ShopNobiTags}#reviews`;

  replaceProductLinkOnClick({ currentTarget: link }, product, ClickId, Person);
  assert.equal(link.href, taggedHref);

  replaceProductLinkOnClick({ currentTarget: link }, product, ClickId, Person);
  assert.equal(link.href, taggedHref, "A second click adds nothing more");
});

test("a person's click opens the paid store link as sent, with the click id in its sub-ID slot, and a crawler's opens the plain link", () => {
  const innerLink = "https%3A%2F%2Fstore.example%2Fp%2Fboot%3Futm_source%3Dshop_nobi%26utm_campaign%3Dshop_nobi";
  const storeLink = `https://www.awin1.com/cread.php?awinmid=1&clickref=shop_nobi&ued=${innerLink}&name=café#top`;
  const product = { url: "https://store.example/p/boot", encodedStoreLink: encodePaidLink(storeLink) };

  const link = { href: product.url };
  replaceProductLinkOnClick({ currentTarget: link }, product, ClickId, Person);
  replaceProductLinkOnClick({ currentTarget: link }, product, ClickId, Person);
  assert.equal(link.href, `https://www.awin1.com/cread.php?awinmid=1&clickref=${ClickId}&ued=${innerLink}&name=café#top`, "Only the sub-ID changes");

  for (const visitor of [Crawler, AutomatedBrowser]) {
    const crawledLink = { href: product.url };
    replaceProductLinkOnClick({ currentTarget: crawledLink }, product, ClickId, visitor);
    assert.equal(crawledLink.href, `https://store.example/p/boot?${ShopNobiTags}`);
  }
});

test("tracking tags and links without a sub-ID slot are never changed", () => {
  const unencodedLink = "https://store.example/ref?id=7&url=https://store.example/p/boot?utm_source=shop_nobi&utm_campaign=shop_nobi";
  for (const storeLink of [unencodedLink, "https://sovrn.co?key=web&u=https%3A%2F%2Fstore.example"]) {
    const link = { href: "https://store.example/p/boot" };
    replaceProductLinkOnClick({ currentTarget: link }, { url: link.href, encodedStoreLink: encodePaidLink(storeLink) }, ClickId, Person);
    assert.equal(link.href, storeLink);
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

test("/shop shows every category, the first 50 pages, and the remaining pages without a category", () => {
  const categorized = Array.from({ length: 51 }, (_, index) => ({
    slug: `boots-${index}`,
    title: `Boots ${index}`,
    breadcrumbs: [{ name: "Shoes", slug: null }],
  }));
  const uncategorized = { slug: "gift-ideas", title: "Gift Ideas", breadcrumbs: [] };
  const categoryPages = [{ slug: "shoes", name: "Shoes", refreshedAt: null, pages: [] }];

  const popularSearches = buildPopularSearches([...categorized, uncategorized], categoryPages);

  assert.deepEqual(popularSearches.categories, [{ slug: "shoes", name: "Shoes" }]);
  assert.equal(popularSearches.pages.length, 50);
  assert.deepEqual(popularSearches.pages[0], { slug: "boots-0", title: "Boots 0" });
  assert.deepEqual(popularSearches.moreSearches, [{ slug: "gift-ideas", title: "Gift Ideas" }]);
});

test("a search page links to its category page only when that page was built", () => {
  const searchPages = [
    { slug: "boots", title: "Boots", breadcrumbs: [{ name: "Shoes", slug: null }] },
    { slug: "rings", title: "Rings", breadcrumbs: [{ name: "Jewelry", slug: null }] },
    { slug: "gift-ideas", title: "Gift Ideas", breadcrumbs: [] },
  ];
  const builtCategoryPages = [{ slug: "shoes", name: "Shoes", refreshedAt: null, pages: [] }];

  const linkedPages = linkCategoryPages(searchPages, builtCategoryPages);

  assert.deepEqual(linkedPages.map((page) => page.categoryPageSlug), ["shoes", null, null]);
});
