import assert from "node:assert/strict";
import { test } from "node:test";
import { replaceProductLinkOnClick } from "../src/utils/shopNobiSearchPage.js";
import { tagShopNobiPageLink } from "../src/utils/shopNobiPage.js";
import { encodePaidLink } from "../src/utils/shopNobiPaidLink.js";
import { buildPopularSearches, linkCategoryPages } from "../scripts/shop-nobi-category-page-view.js";

const ShopNobiTags = "utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi";

const Person = { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/141.0 Safari/537.36" };
const Crawler = { userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" };
const AutomatedBrowser = { ...Person, webdriver: true };

test("a click on a product link without a paid store link swaps its utm_ tags for Shop Nobi's, keeping the rest", () => {
  const product = { url: "https://store.example/p/boot?variant=7&utm_source=other&utm_term=x#reviews" };
  const link = { href: product.url };
  const taggedHref = `https://store.example/p/boot?variant=7&${ShopNobiTags}#reviews`;

  replaceProductLinkOnClick({ currentTarget: link }, product, Person);
  assert.equal(link.href, taggedHref);

  replaceProductLinkOnClick({ currentTarget: link }, product, Person);
  assert.equal(link.href, taggedHref, "A second click adds nothing more");
});

test("a person's click opens the paid store link as the API sent it, and a crawler's opens the plain tagged link", () => {
  const storeLink = "https://sovrn.co?key=web&u=https%3A%2F%2Fstore.example%2Fp%2Fboot%3Futm_source%3Dshop_nobi&name=café";
  const product = { url: "https://store.example/p/boot", encodedStoreLink: encodePaidLink(storeLink) };
  const plainTaggedLink = `https://store.example/p/boot?${ShopNobiTags}`;

  const link = { href: product.url };
  replaceProductLinkOnClick({ currentTarget: link }, product, Person);
  replaceProductLinkOnClick({ currentTarget: link }, product, Person);
  assert.equal(link.href, storeLink, "A second click changes nothing");

  for (const visitor of [Crawler, AutomatedBrowser]) {
    const crawledLink = { href: product.url };
    replaceProductLinkOnClick({ currentTarget: crawledLink }, product, visitor);
    assert.equal(crawledLink.href, plainTaggedLink);
  }
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
