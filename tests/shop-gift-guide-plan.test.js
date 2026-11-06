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
  assert.equal(GiftGuideTopics.length, 139);
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

test("women's crossbody guide publishes only with all ten researched current variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-crossbody-bags-for-women");
  const pages = topic.sources.map((slug) => ({ slug, query: slug, refreshedAt: "2026-11-05T00:00:00Z", products: [] }));
  topic.picks.forEach((pick, index) => pages[index % pages.length].products.push(product(pick.id, "Store")));
  const build = (input) => buildGiftGuides(input, "2026-11-05T21:00:00Z").find((item) => item.slug === topic.slug);
  assert.equal(build(pages).products.length, 10);
  assert.equal(build(pages.map((page, index) => index ? page : { ...page, products: page.products.slice(1) })), undefined);
});

test("women's stocking-stuffer guide requires all ten exact current variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-stocking-stuffers-for-women");
  assert.ok(topic);
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const pages = topic.sources.map((slug) => ({ slug, query: slug, refreshedAt: "2026-11-05T00:00:00Z", products: [] }));
  topic.picks.forEach((pick, index) => pages[index].products.push(product(pick.id, `Store ${index}`)));
  const build = (input) => buildGiftGuides(input, "2026-11-05T21:00:00Z").find((item) => item.slug === topic.slug);
  const guide = build(pages);
  assert.equal(guide.products.length, 10);
  assert.equal(guide.paidCount, 0);
  assert.ok(guide.products.every((item) => item.editorialWhy && item.editorialCheck && item.editorialSource));
  assert.equal(build(pages.map((page, index) => index === 0 ? { ...page, products: [] } : page)), undefined);
});

test("cat-lover guide uses ten exact gifts for the recipient and withholds missing variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-gifts-for-cat-lovers");
  assert.equal(topic.picks.length, 10);
  assert.ok(topic.picks.every((pick) => pick.why && pick.check && pick.source));
  const pages = topic.sources.map((slug) => ({ slug, query: slug, refreshedAt: "2026-11-05T00:00:00Z", products: [] }));
  topic.picks.forEach((pick, index) => pages[index].products.push(product(pick.id, `Store ${index}`)));
  const build = (input) => buildGiftGuides(input, "2026-11-05T21:00:00Z").find((item) => item.slug === topic.slug);
  assert.equal(build(pages).products.length, 10);
  assert.equal(build(pages.map((page, index) => index ? page : { ...page, products: [] })), undefined);
});

test("travel-backpack guide matches all ten exact variants, including catalog rows without an internal ID", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-travel-backpack");
  assert.equal(topic.picks.length, 10);
  const pages = topic.sources.map((slug) => ({ slug, query: slug, refreshedAt: "2026-11-05T23:00:00Z", products: [] }));
  topic.picks.forEach((pick) => pages[0].products.push(product(pick.id, "Travel store", {
    productVariantId: pick.id,
    url: pick.url || `https://merchant.example/${pick.id}`,
  })));
  const build = (input) => buildGiftGuides(input, "2026-11-05T23:30:00Z").find((item) => item.slug === topic.slug);
  const guide = build(pages);
  assert.equal(guide.products.length, 10);
  assert.equal(new Set(guide.products.map((item) => item.productVariantId || item.url)).size, 10);
  const changedUrl = pages.map((page, index) => index === 0
    ? { ...page, products: page.products.map((item, productIndex) => productIndex === 0 ? { ...item, url: `${item.url}&wrong-variant=1` } : item) }
    : page);
  assert.equal(build(changedUrl), undefined);
});

test("carry-on luggage guide publishes ten selected cases and never substitutes checked-only luggage", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-carry-on-luggage");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const pages = topic.sources.map((slug) => ({ slug, query: slug, refreshedAt: "2026-11-05T23:00:00Z", products: [] }));
  topic.picks.forEach((pick) => pages[0].products.push(product(pick.id, "Luggage store")));
  const build = (input) => buildGiftGuides(input, "2026-11-05T23:50:00Z").find((item) => item.slug === topic.slug);
  assert.equal(build(pages).products.length, 10);
  assert.equal(build(pages.map((page, index) => index ? page : { ...page, products: page.products.slice(1) })), undefined);
});

test("dad gift guide requires all ten exact current variants across distinct interests", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-gifts-for-dad");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  assert.equal(topic.sources.length, 10);
  const pages = topic.sources.map((slug, index) => ({
    slug, query: slug, refreshedAt: "2026-11-06T00:00:00Z", products: [product(topic.picks[index].id, `Store ${index}`)],
  }));
  const build = (input) => buildGiftGuides(input, "2026-11-06T00:15:00Z").find((item) => item.slug === topic.slug);
  const guide = build(pages);
  assert.equal(guide.products.length, 10);
  assert.ok(guide.products.every((item) => item.editorialWhy && item.editorialCheck && item.editorialSource));
  assert.equal(build(pages.map((page, index) => index === 0 ? { ...page, products: [] } : page)), undefined);
});

test("mom gift guide requires ten exact picks and resolves its seller-URL-only garden set", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-gifts-for-mom");
  assert.equal(topic.picks.length, 10);
  assert.equal(topic.sources.length, 10);
  const pages = topic.sources.map((slug, index) => ({
    slug, query: slug, refreshedAt: "2026-11-06T00:00:00Z", products: [product(topic.picks[index].id, `Store ${index}`, {
      productVariantId: topic.picks[index].id,
      url: topic.picks[index].url || `https://merchant.example/${topic.picks[index].id}`,
    })],
  }));
  const build = (input) => buildGiftGuides(input, "2026-11-06T00:30:00Z").find((item) => item.slug === topic.slug);
  assert.equal(build(pages).products.length, 10);
  assert.equal(build(pages.map((page, index) => index === 4 ? { ...page, products: [] } : page)), undefined);
});

test("men's wallet guide requires its ten distinct researched variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-wallets-for-men");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const page = { slug: topic.sources[0], query: "men's wallets", refreshedAt: "2026-11-06T00:30:00Z",
    products: topic.picks.map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source })) };
  const build = (products) => buildGiftGuides([
    { ...page, products }, ...topic.sources.slice(1).map((slug) => ({ ...page, slug, products: [] })),
  ], "2026-11-06T00:45:00Z")
    .find((item) => item.slug === topic.slug);
  assert.equal(build(page.products).products.length, 10);
  assert.equal(build(page.products.slice(1)), undefined);
});

test("coffee grinder guide requires ten exact variants and withholds a missing grinder", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-coffee-grinders");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const base = { query: "coffee grinders", refreshedAt: "2026-11-06T00:30:00Z" };
  const products = topic.picks.map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source }));
  const build = (items) => buildGiftGuides(topic.sources.map((slug, index) => ({ ...base, slug,
    products: index === 0 ? items : [] })), "2026-11-06T01:00:00Z")
    .find((item) => item.slug === topic.slug);
  assert.equal(build(products).products.length, 10);
  assert.equal(build(products.slice(1)), undefined);
});

test("espresso guide requires ten exact current variants and does not substitute open-box machines", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-espresso-machines");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const base = { query: "espresso machines", refreshedAt: "2026-11-06T01:00:00Z" };
  const products = topic.picks.map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source }));
  const build = (items) => buildGiftGuides(topic.sources.map((slug, index) => ({ ...base, slug,
    products: index === 0 ? items : [] })), "2026-11-06T01:06:00Z")
    .find((item) => item.slug === topic.slug);
  assert.equal(build(products).products.length, 10);
  assert.equal(build(products.slice(1)), undefined);
  assert.equal(build([...products.slice(1), product("open-box", "Discount", { name: "Open-box espresso machine" })]), undefined);
});

test("men's watch guide requires ten exact models and withholds one missing variant", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-watches-for-men");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug,
    refreshedAt: "2026-11-06T01:00:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(pick.id, `Store ${i}`, { url: pick.source })) : [],
  }));
  const build = (input) => buildGiftGuides(input, "2026-11-06T01:20:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages).products.length, 10);
  assert.equal(build([{ ...pages[0], products: pages[0].products.slice(1) }, ...pages.slice(1)]), undefined);
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
