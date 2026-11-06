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
  assert.equal(GiftGuideTopics.length, 168);
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

test("gifts for cooks guide requires all ten selected catalog variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-gifts-for-cooks");
  assert.ok(topic);
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const pages = topic.sources.map((slug) => ({ slug, query: slug, refreshedAt: "2026-11-05T00:00:00Z", products: [] }));
  topic.picks.forEach((pick, index) => pages[index].products.push(product(pick.id, `Store ${index}`)));
  const build = (input) => buildGiftGuides(input, "2026-11-06T02:00:00Z").find((item) => item.slug === topic.slug);
  const guide = build(pages);
  assert.equal(guide.products.length, 10);
  assert.ok(guide.products.every((item) => item.editorialWhy && item.editorialCheck && item.editorialSource));
  assert.equal(build(pages.map((page, index) => index === 0 ? { ...page, products: [] } : page)), undefined);
});

test("gifts for bakers guide requires ten distinct current catalog variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-gifts-for-bakers");
  assert.ok(topic);
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  assert.equal(new Set(topic.sources).size, 10);
  const pages = topic.sources.map((slug) => ({ slug, query: slug, refreshedAt: "2026-11-06T01:34:53Z", products: [] }));
  topic.picks.forEach((pick, index) => pages[index].products.push(product(pick.id, `Store ${index}`)));
  const build = (input) => buildGiftGuides(input, "2026-11-06T02:00:00Z").find((item) => item.slug === topic.slug);
  const guide = build(pages);
  assert.equal(guide.products.length, 10);
  assert.ok(guide.products.every((item) => item.editorialWhy && item.editorialCheck && item.editorialSource));
  assert.equal(build(pages.map((page, index) => index === 0 ? { ...page, products: [] } : page)), undefined);
});

test("tea-lover guide requires ten selected current seller listings", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-gifts-for-tea-lovers");
  assert.ok(topic);
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  assert.equal(new Set(topic.sources).size, 10);
  const pages = topic.sources.map((slug) => ({ slug, query: slug, refreshedAt: "2026-11-06T01:34:53Z", products: [] }));
  topic.picks.forEach((pick, index) => pages[index].products.push(product(pick.id, `Store ${index}`)));
  const build = (input) => buildGiftGuides(input, "2026-11-06T03:00:00Z").find((item) => item.slug === topic.slug);
  const guide = build(pages);
  assert.equal(guide.products.length, 10);
  assert.ok(guide.products.every((item) => item.editorialWhy && item.editorialCheck && item.editorialSource));
  assert.equal(build(pages.map((page, index) => index === 0 ? { ...page, products: [] } : page)), undefined);
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

test("women's slippers guide requires ten exact seller variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-slippers-for-women");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug,
    refreshedAt: "2026-11-06T01:00:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(`slipper-${i}`, `Store ${i}`, { url: pick.url })) : [],
  }));
  const build = (input) => buildGiftGuides(input, "2026-11-06T02:00:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages).products.length, 10);
  assert.equal(build([{ ...pages[0], products: pages[0].products.slice(1) }, ...pages.slice(1)]), undefined);
});

test("men's slippers guide withholds the article when a selected pair vanishes", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-slippers-for-men");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug, refreshedAt: "2026-11-06T01:00:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(`men-slipper-${i}`, `Store ${i}`, { url: pick.url })) : [] }));
  const build = (products) => buildGiftGuides([{ ...pages[0], products }, ...pages.slice(1)], "2026-11-06T02:00:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages[0].products).products.length, 10);
  assert.equal(build(pages[0].products.slice(1)), undefined);
});

test("cookware set guide requires ten distinct current catalog sets", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-cookware-sets");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const page = { slug: "cookware-sets", query: "cookware sets", refreshedAt: "2026-11-06T02:00:00Z",
    products: topic.picks.map((pick, index) => product(pick.id, `Store ${index}`)) };
  const build = (products) => buildGiftGuides([{ ...page, products }], "2026-11-06T03:00:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(page.products).products.length, 10);
  assert.equal(build(page.products.slice(1)), undefined);
});

test("men's leather belt guide requires ten exact available seller variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-leather-belts-for-men");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug, refreshedAt: "2026-11-06T02:30:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(`belt-${i}`, `Store ${i}`, { url: pick.url })) : [] }));
  const build = (products) => buildGiftGuides([{ ...pages[0], products }, ...pages.slice(1)], "2026-11-06T03:00:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages[0].products).products.length, 10);
  assert.equal(build(pages[0].products.slice(1)), undefined);
});

test("men's winter coat guide requires ten exact available seller variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-winter-coats-for-men");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug, refreshedAt: "2026-11-06T02:20:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(`winter-coat-${i}`, `Store ${i}`, { url: pick.url })) : [] }));
  const build = (products) => buildGiftGuides([{ ...pages[0], products }, ...pages.slice(1)], "2026-11-06T02:30:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages[0].products).products.length, 10);
  assert.equal(build(pages[0].products.slice(1)), undefined);
});

test("bath towel guide selects ten actual bath-towel variants and withholds one missing listing", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-bath-towels");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug, refreshedAt: "2026-11-06T02:30:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(`bath-towel-${i}`, `Store ${i}`, { url: pick.url })) : [] }));
  const build = (products) => buildGiftGuides([{ ...pages[0], products }, ...pages.slice(1)], "2026-11-06T02:45:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages[0].products).products.length, 10);
  assert.equal(build(pages[0].products.slice(1)), undefined);
});

test("coffee mug guide requires ten distinct current catalog variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-coffee-mugs");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const page = { slug: "coffee-mugs", query: "coffee mugs", refreshedAt: "2026-11-06T02:00:00Z",
    products: topic.picks.map((pick, index) => product(pick.id, `Store ${index}`)) };
  const build = (products) => buildGiftGuides([{ ...page, products }], "2026-11-06T03:00:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(page.products).products.length, 10);
  assert.equal(build(page.products.slice(1)), undefined);
});

test("women's bathrobe guide requires ten exact available seller variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-bathrobes-for-women");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug, refreshedAt: "2026-11-06T02:40:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(`bathrobe-${i}`, `Store ${i}`, { url: pick.url })) : [] }));
  const build = (products) => buildGiftGuides([{ ...pages[0], products }, ...pages.slice(1)], "2026-11-06T02:50:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages[0].products).products.length, 10);
  assert.equal(build(pages[0].products.slice(1)), undefined);
});

test("pearl-earring guide keeps ten exact seller variants and withholds a vanished variant", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-pearl-earrings");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id || pick.url)).size, 10);
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug, refreshedAt: "2026-11-06T02:50:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(pick.id || `pearl-${i}`, `Store ${i}`, { url: pick.url || pick.source })) : [] }));
  const build = (products) => buildGiftGuides([{ ...pages[0], products }, ...pages.slice(1)], "2026-11-06T03:00:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages[0].products).products.length, 10);
  assert.equal(build(pages[0].products.slice(1)), undefined);
});

test("duvet-cover guide requires ten exact available covers", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-duvet-covers");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug, refreshedAt: "2026-11-06T02:55:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(`duvet-cover-${i}`, `Store ${i}`, { url: pick.url })) : [] }));
  const build = (products) => buildGiftGuides([{ ...pages[0], products }, ...pages.slice(1)], "2026-11-06T03:00:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages[0].products).products.length, 10);
  assert.equal(build(pages[0].products.slice(1)), undefined);
});

test("women's winter hat guide requires ten exact available hats", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-winter-hats-for-women");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug, refreshedAt: "2026-11-06T03:22:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(`winter-hat-${i}`, `Store ${i}`, { url: pick.url })) : [] }));
  const build = (products) => buildGiftGuides([{ ...pages[0], products }, ...pages.slice(1)], "2026-11-06T03:35:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages[0].products).products.length, 10);
  assert.equal(build(pages[0].products.slice(1)), undefined);
});

test("women's winter scarf guide requires ten exact available variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-winter-scarves-for-women");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  assert.ok(topic.picks.every((pick) => pick.why && pick.check && pick.source));
  const pages = topic.sources.map((slug, index) => ({ slug, query: slug, refreshedAt: "2026-11-06T03:34:00Z",
    products: index === 0 ? topic.picks.map((pick, i) => product(`winter-scarf-${i}`, `Store ${i}`, { url: pick.url })) : [] }));
  const build = (products) => buildGiftGuides([{ ...pages[0], products }, ...pages.slice(1)], "2026-11-06T03:40:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages[0].products).products.length, 10);
  assert.equal(build(pages[0].products.slice(1)), undefined);
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

test("throw blanket guide keeps ten exact fibers and withholds a missing listing", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-throw-blankets");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const page = { slug: "throw-blankets", query: "throw blankets", refreshedAt: "2026-11-06T01:30:00Z",
    products: topic.picks.map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source })) };
  const build = (products) => buildGiftGuides([{ ...page, products }], "2026-11-06T01:45:00Z")
    .find((guide) => guide.slug === topic.slug);
  const guide = build(page.products);
  assert.equal(guide.products.length, 10);
  assert.ok(guide.products.every((item) => item.editorialWhy && item.editorialCheck && item.editorialSource));
  assert.equal(build(page.products.slice(1)), undefined);
});

test("scented candle guide requires ten current listings and omits its dated holiday candle", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-scented-candles");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  assert.ok(topic.picks.every((pick) => pick.why && pick.check && pick.source));
  const page = { slug: "candles", query: "candles", refreshedAt: "2026-11-06T02:00:00Z",
    products: topic.picks.map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source })) };
  const build = (products) => buildGiftGuides([{ ...page, products }], "2026-11-06T02:20:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(page.products).products.length, 10);
  assert.equal(build(page.products.slice(1)), undefined);
  assert.equal(build([...page.products.slice(1), product("old-holiday-2025", "Store", { name: "Holiday Candle 2025" })]), undefined);
});

test("cashmere guide requires all ten exact seller variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-cashmere-sweaters-for-women");
  assert.equal(topic.picks.length, 10);
  const page = { slug: "100-cashmere-sweaters", query: "100% cashmere sweaters", refreshedAt: "2026-11-06T03:30:00Z",
    products: topic.picks.map((pick, index) => product(pick.id ?? `url-only-${index}`, `Store ${index}`, { url: pick.source })) };
  const build = (products) => buildGiftGuides(topic.sources.map((slug) => ({ ...page, slug, products })), "2026-11-06T03:45:00Z")
    .find((guide) => guide.slug === topic.slug);
  const guide = build(page.products);
  assert.equal(guide.products.length, 10);
  assert.ok(guide.products.every((item, index) => item.url === topic.picks[index].source));
  assert.equal(build(page.products.slice(1)), undefined);
  assert.equal(build(page.products.map((item, index) => index === 0 ? { ...item, url: `${item.url}&wrong-variant=1` } : item)), undefined);
});

test("travel toiletry guide uses ten distinct current variants and withholds a missing pick", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-toiletry-bags-for-travel");
  assert.ok(topic);
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  assert.ok(topic.picks.every((pick) => pick.why && pick.check && pick.source));
  const page = { slug: "toiletry-bags", query: "toiletry bags", refreshedAt: "2026-11-06T03:00:00Z",
    products: topic.picks.map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source })) };
  const build = (products) => buildGiftGuides([{ ...page, products }], "2026-11-06T03:20:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(page.products).products.length, 10);
  assert.equal(build(page.products.slice(1)), undefined);
});

test("runner gift guide requires ten distinct current seller variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-gifts-for-runners");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const page = { slug: "running-shoes", query: "running gear", refreshedAt: "2026-11-06T02:30:00Z",
    products: topic.picks.map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source })) };
  const build = (products) => buildGiftGuides(topic.sources.map((slug) => ({ ...page, slug, products })), "2026-11-06T03:00:00Z")
    .find((guide) => guide.slug === topic.slug);
  const guide = build(page.products);
  assert.equal(guide.products.length, 10);
  assert.ok(guide.products.every((item, index) => item.url === topic.picks[index].source && item.editorialWhy && item.editorialCheck));
  assert.equal(build(page.products.slice(1)), undefined);
  assert.equal(build(page.products.map((item, index) => index === 0 ? { ...item, url: `${item.url}&wrong-variant=1` } : item)), undefined);
});

test("women's raincoat guide selects ten exact variants and withholds a missing coat", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-raincoats-for-women");
  assert.ok(topic);
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  assert.ok(topic.picks.every((pick) => pick.why && pick.check && pick.source));
  const page = { slug: "womens-raincoats", query: "women's raincoats", refreshedAt: "2026-11-06T02:50:00Z",
    products: topic.picks.slice(0, 9).map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source })) };
  const otherPage = { ...page, slug: "raincoats", products: [product(topic.picks[9].id, "Amaree's", { url: topic.picks[9].source })] };
  const build = (products) => buildGiftGuides([{ ...page, products }, otherPage], "2026-11-06T03:05:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(page.products).products.length, 10);
  assert.equal(build(page.products.slice(1)), undefined);
});

test("women's wallet guide chooses ten distinct exact wallet listings", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-wallets-for-women");
  assert.ok(topic);
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  assert.ok(topic.picks.every((pick) => pick.why && pick.check && pick.source === pick.url));
  assert.ok(topic.picks.every((pick) => /variant=\d+/.test(pick.url)));
  assert.ok(topic.picks.some((pick) => pick.heading.includes("Lucchese")));
  const page = { slug: topic.sources[0], query: "women's wallets", refreshedAt: "2026-11-06T04:00:00Z",
    products: topic.picks.map((pick, index) => product(pick.id || `url-only-${index}`, `Store ${index}`, { url: pick.source })) };
  const build = (products) => buildGiftGuides(topic.sources.map((slug) => ({ ...page, slug, products })), "2026-11-06T04:30:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(page.products).products.length, 10);
  assert.equal(build(page.products.slice(1)), undefined);
  assert.equal(build(page.products.map((item, index) => index === 0 ? { ...item, url: `${item.url}&wrong-variant=1` } : item)), undefined);
});

test("teacher gift guide requires ten different exact available listings", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-gifts-for-teachers");
  assert.ok(topic);
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.url)).size, 10);
  assert.ok(topic.picks.every((pick) => pick.why && pick.check && pick.source === pick.url));
  const page = { slug: topic.sources[0], query: "teacher gifts", refreshedAt: "2026-11-06T03:15:00Z",
    products: topic.picks.map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source })) };
  const build = (products) => buildGiftGuides(topic.sources.map((slug) => ({ ...page, slug, products })), "2026-11-06T03:30:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(page.products).products.length, 10);
  assert.equal(build(page.products.slice(1)), undefined);
  assert.equal(build(page.products.map((item, index) => index === 0 ? { ...item, url: `${item.url}&wrong=1` } : item)), undefined);
});

test("women's wool coat guide selects ten exact variants and withholds a missing coat", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-wool-coats-for-women");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  assert.ok(topic.picks.every((pick) => pick.why && pick.check && pick.source));
  const page = { slug: "womens-coats", query: "women's coats", refreshedAt: "2026-11-06T03:20:00Z",
    products: topic.picks.map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source })) };
  const build = (products) => buildGiftGuides(topic.sources.map((slug) => ({ ...page, slug, products })), "2026-11-06T03:30:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(page.products).products.length, 10);
  assert.equal(build(page.products.slice(1)), undefined);
});

test("women's perfume gift-set guide requires ten exact available listings", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-perfume-gift-sets-for-women");
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  const page = { slug: topic.sources[0], query: "women's fragrance gift sets", refreshedAt: "2026-11-06T03:20:00Z",
    products: topic.picks.map((pick, index) => product(pick.id, `Store ${index}`, { url: pick.source })) };
  const build = (products) => buildGiftGuides(topic.sources.map((slug) => ({ ...page, slug, products })), "2026-11-06T03:25:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(page.products).products.length, 10);
  assert.equal(build(page.products.slice(1)), undefined);
});

test("women's winter glove guide requires ten distinct current glove variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-winter-gloves-for-women");
  assert.ok(topic);
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  assert.ok(topic.picks.every((pick) => pick.why && pick.check && pick.source));
  const pages = topic.sources.map((slug) => ({ slug, query: "winter gloves for women",
    refreshedAt: "2026-11-06T03:00:00Z", products: [] }));
  topic.picks.forEach((pick, index) => pages[index % pages.length].products.push(
    product(pick.id, `Store ${index}`, { url: pick.source })));
  const build = (input) => buildGiftGuides(input, "2026-11-06T03:10:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages).products.length, 10);
  assert.equal(build(pages.map((page) => ({ ...page, products: page.products.filter((item) => item.productVariantId !== topic.picks[0].id) }))), undefined);
});

test("men's sweater guide requires ten exact seller variants", () => {
  const topic = GiftGuideTopics.find((item) => item.slug === "best-sweaters-for-men");
  assert.ok(topic);
  assert.equal(topic.picks.length, 10);
  assert.equal(new Set(topic.picks.map((pick) => pick.id)).size, 10);
  assert.ok(topic.picks.every((pick) => pick.why && pick.check && /variant=\d+/.test(pick.source)));
  const pages = topic.sources.map((slug) => ({ slug, query: "men's sweaters",
    refreshedAt: "2026-11-06T03:30:00Z", products: [] }));
  topic.picks.forEach((pick, index) => pages[index % pages.length].products.push(
    product(pick.id, `Store ${index}`, { url: pick.source })));
  const build = (input) => buildGiftGuides(input, "2026-11-06T03:40:00Z")
    .find((guide) => guide.slug === topic.slug);
  assert.equal(build(pages).products.length, 10);
  assert.equal(build(pages.map((page) => ({ ...page,
    products: page.products.filter((item) => item.productVariantId !== topic.picks[0].id) }))), undefined);
});
