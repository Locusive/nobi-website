import assert from "node:assert/strict";
import { test } from "node:test";
import { addShopNobiTags, tagProductLinkOnClick } from "../src/utils/shopNobiSearchPage.js";
import { buildPopularSearches, linkCategoryPages } from "../scripts/shop-nobi-category-page-view.js";

const ShopNobiTags = "utm_source=shop_nobi&utm_medium=referral&utm_campaign=shop_nobi";

test("Shop Nobi's tags replace a store link's utm_ tags and keep its other parts", () => {
  assert.equal(
    addShopNobiTags("https://store.example/p/boot?variant=7&utm_source=other&utm_term=x#reviews"),
    `https://store.example/p/boot?variant=7&${ShopNobiTags}#reviews`
  );
});

test("a click on a product link tags the link before the browser follows it", () => {
  const link = { href: "https://store.example/p/boot?variant=7" };
  tagProductLinkOnClick({ currentTarget: link });
  assert.equal(link.href, `https://store.example/p/boot?variant=7&${ShopNobiTags}`);

  tagProductLinkOnClick({ currentTarget: link });
  assert.equal(link.href, `https://store.example/p/boot?variant=7&${ShopNobiTags}`, "A second click adds nothing more");
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
