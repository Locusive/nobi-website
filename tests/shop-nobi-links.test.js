import assert from "node:assert/strict";
import { test } from "node:test";
import { tagProductLinkOnClick } from "../src/utils/shopNobiSearchPage.js";
import { buildPopularSearches, linkCategoryPages } from "../scripts/shop-nobi-category-page-view.js";

const ShopNobiTags = "utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi";

test("a click on a product link swaps its utm_ tags for Shop Nobi's, keeping the rest of the link", () => {
  const link = { href: "https://store.example/p/boot?variant=7&utm_source=other&utm_term=x#reviews" };
  const taggedHref = `https://store.example/p/boot?variant=7&${ShopNobiTags}#reviews`;

  tagProductLinkOnClick({ currentTarget: link });
  assert.equal(link.href, taggedHref);

  tagProductLinkOnClick({ currentTarget: link });
  assert.equal(link.href, taggedHref, "A second click adds nothing more");
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
