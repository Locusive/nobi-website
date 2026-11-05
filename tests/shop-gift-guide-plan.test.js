import test from "node:test";
import assert from "node:assert/strict";
import { buildGiftGuides } from "../scripts/shop-gift-guide-plan.js";
import { giftGuidePriceContext, giftGuideSeo } from "../src/utils/shopGiftGuide.js";
import { GiftGuideTopics, GiftGuideSourceCopy } from "../src/content/shopGiftGuideTopics.js";
import { ShopGiftGuideAdvice } from "../src/content/shopGiftGuideAdvice.js";

const product = (id, storeName, extra = {}) => ({ productVariantId: id, name: `Product ${id}`,
  url: `https://merchant.example/${id}`, imageUrl: `https://merchant.example/${id}.jpg`,
  storeName, isInStock: true, paidLink: false, ...extra });

test("gift guide uses current eligible catalog products, preserves earning links, and omits sparse topics", () => {
  const pages = [
    { slug: "cookbooks", query: "cookbooks", refreshedAt: "2026-11-04T00:00:00Z", products: [
      product("paid", "A", { paidLink: true, encodedStoreLink: "abc" }),
      product("no-image", "A", { imageUrl: null }),
      product("old", "A", { isInStock: false }),
      product("refurb", "A", { name: "Refurbished saucepan" }),
      product("plain", "B"),
    ] },
    { slug: "olive-kitchen-tools-and-utensils", query: "kitchen tools", refreshedAt: "2026-11-05T00:00:00Z", products: [
      product("rice-one", "C"), product("rice-two", "D"), product("rice-three", "E"), product("paid", "A"),
    ] },
  ];
  const guides = buildGiftGuides(pages, "2026-11-05T01:00:00Z");
  const cook = guides.find((guide) => guide.slug === "gifts-for-home-cooks");
  assert.ok(cook);
  assert.equal(cook.products.length, 5);
  assert.equal(cook.paidCount, 1);
  assert.equal(cook.refreshedAt, "2026-11-05T00:00:00Z");
  assert.equal(cook.lastModifiedAt, "2026-11-05T03:20:00Z");
  assert.equal(cook.products.filter((item) => item.productVariantId === "paid").length, 1);
  assert.ok(!cook.products.some((item) => ["no-image", "old", "refurb"].includes(item.productVariantId)));
  assert.equal(guides.length, 1);
  assert.ok(!guides.some((guide) => guide.slug === "gifts-for-painters"));
  const seo = giftGuideSeo(cook);
  assert.equal(seo.path, "/gift-guides/gifts-for-home-cooks");
  assert.equal(seo.schema[0].mainEntity.itemListElement.length, 5);
});

test("product rows compare only known prices in the same currency", () => {
  const picks = [{ price: 25, currency: "USD" }, { price: 40, currency: "USD" }, { price: 50, currency: "EUR" }];
  assert.match(giftGuidePriceContext(picks[0], picks), /No other USD pick/);
  assert.match(giftGuidePriceContext(picks[1], picks), /1 of the 1 other USD picks/);
  assert.equal(giftGuidePriceContext(picks[2], picks), null);
  assert.equal(giftGuidePriceContext({ price: null, currency: "USD" }, picks), null);
});

test("gift guides drop stale or undated sources instead of displaying old picks", () => {
  const fresh = { slug: "rice-cookers", query: "rice cookers", refreshedAt: "2026-11-04T00:00:00Z",
    products: [1, 2, 3, 4, 5].map((id) => product(`fresh-${id}`, `Store ${id}`)) };
  const stale = { slug: "cookbooks", query: "cookbooks", refreshedAt: "2026-09-01T00:00:00Z",
    products: [1, 2, 3, 4, 5].map((id) => product(`old-${id}`, `Store ${id}`)) };
  const guide = buildGiftGuides([stale, fresh], "2026-11-05T01:00:00Z")
    .find((item) => item.slug === "gifts-for-home-cooks");
  assert.ok(guide);
  assert.equal(guide.products.length, 5);
  assert.ok(guide.products.every((item) => item.productVariantId.startsWith("fresh-")));
  assert.equal(buildGiftGuides([stale], "2026-11-05T01:00:00Z").length, 0);
});

test("the editorial topics have distinct slugs and purchase guidance for every source", () => {
  assert.equal(GiftGuideTopics.length, 120);
  assert.equal(new Set(GiftGuideTopics.map((topic) => topic.slug)).size, GiftGuideTopics.length);
  for (const topic of GiftGuideTopics) {
    assert.ok(topic.intro.length >= 140, `short intro: ${topic.slug}`);
    if (topic.editorial) {
      assert.equal(topic.buyingGuide.length, 3);
      assert.equal(topic.picks.length, 10);
      continue;
    }
    assert.equal(ShopGiftGuideAdvice[topic.slug]?.length, 3, `missing buying brief: ${topic.slug}`);
    for (const source of topic.sources) assert.ok(GiftGuideSourceCopy[source]?.length === 2 || (topic.why && topic.check), `missing source note: ${source}`);
  }
});

test("leather tote guide keeps ten exact picks, including Lucchese, and withholds missing variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-leather-tote-bags-for-women");
  const pages = topic.sources.map((slug) => ({ slug, query: slug, refreshedAt: "2026-11-05T00:00:00Z", products: [] }));
  topic.picks.forEach((pick, index) => pages[index % pages.length].products.push(product(pick.id, index === 1 ? "Lucchese" : "Store")));
  const build = (input) => buildGiftGuides(input, "2026-11-05T19:00:00Z").find((item) => item.slug === topic.slug);
  const guide = build(pages);
  assert.equal(guide.products.length, 10);
  assert.match(guide.products[1].editorialHeading, /Lucchese Lucia/);
  assert.ok(guide.products.every((item) => item.editorialWhy && item.editorialCheck && item.editorialSource));
  assert.equal(build(pages.map((page, i) => i ? page : { ...page, products: page.products.slice(1) })), undefined);
});

test("cowboy-dad picks exclude a women's boot misclassified by the source page", () => {
  const pages = [
    { slug: "mens-cowboy-boots", query: "men's cowboy boots", refreshedAt: "2026-11-04T00:00:00Z", products: [
      product("wrong", "A", { name: "Acne Studios Black Leather Cowboy Boots (CD0024-900410-BLACK)" }),
      ...[1, 2, 3, 4, 5].map((id) => product(`mens-boot-${id}`, `Boot store ${id}`)),
    ] },
  ];
  const guide = buildGiftGuides(pages, "2026-11-05T01:00:00Z").find((item) => item.slug === "gifts-for-a-cowboy-dad");
  assert.ok(guide);
  assert.ok(guide.products.every((item) => item.productVariantId !== "wrong"));
});
