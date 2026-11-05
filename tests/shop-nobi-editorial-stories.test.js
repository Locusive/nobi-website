import assert from "node:assert/strict";
import { test } from "node:test";
import { planEditorialGuideStories } from "../scripts/shop-nobi-editorial-stories.js";
import { renderWebStory } from "../scripts/shop-nobi-web-story.js";
import { buildShopNobiSitemap } from "../scripts/shop-nobi-search-page-listings.js";
import { PortraitPosterSize } from "../src/utils/previewImage.js";

const products = Array.from({ length: 10 }, (_, i) => ({
  productVariantId: `variant-${i}`,
  owningMerchantId: `store-${i}`,
  name: `Bag ${i + 1}`,
  url: `https://store.example/bag-${i + 1}`,
  imageUrl: `https://cdn.shopify.com/s/files/1/bag-${i + 1}.jpg`,
  storeName: "Example Store",
  price: 100 + i,
  currency: "USD",
}));

function guide(changes = {}) {
  return {
    editorial: true,
    slug: "best-leather-bags",
    path: "/gift-guides/best-leather-bags",
    title: "The Best Leather Bags",
    seoDescription: "Ten researched leather bags.",
    intro: "Compare ten distinct leather bags. Check each seller's dimensions before buying.",
    buyingGuide: ["Start with the way you carry a bag. Check the size and closure."],
    lastModifiedAt: "2026-11-05T20:00:00Z",
    products,
    ...changes,
  };
}

test("a published researched guide has a short story that leads to its full article", async () => {
  const stories = await planEditorialGuideStories([guide()], async () => PortraitPosterSize);
  assert.equal(stories.length, 1);
  const { page, plan } = stories[0];
  assert.equal(page.slug, "guide-best-leather-bags");
  assert.equal(plan.pages.filter((part) => part.kind === "product").length, 3);
  const html = renderWebStory(page, plan, { endUrl: stories[0].guide.path });
  assert.match(html, /canonical" href="https:\/\/nobi.ai\/shop\/stories\/guide-best-leather-bags/);
  assert.match(html, /gift-guides\/best-leather-bags\?utm_source=shop_nobi_web_story/);
  assert.match(html, /utm_campaign=editorial_guide_story/);
  assert.match(html, /Read the full buying guide/);
  assert.equal((html.match(/v1\/shop\/story-go/g) ?? []).length, 3);
  const sitemap = buildShopNobiSitemap([], [], [], "2026-11-05", null, [guide()], stories);
  assert.match(sitemap, /shop\/stories\/guide-best-leather-bags/);
});

test("unpublished or incomplete editorial picks get no story", async () => {
  const stories = await planEditorialGuideStories([
    guide({ editorial: false }),
    guide({ products: products.slice(0, 9) }),
  ], async () => PortraitPosterSize);
  assert.equal(stories.length, 0);
});
