import assert from "node:assert/strict";
import { readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";
import { buildPinFeedFiles, listPinFeedFiles } from "../scripts/shop-nobi-pin-feed.js";
import { planWebStory } from "../scripts/shop-nobi-web-story-plan.js";
import { findLargePreviewImage } from "../src/utils/previewImage.js";
import { buildProductListSchema } from "../src/utils/shopNobiStructuredData.js";
import { PrebuiltContentElementId } from "../src/utils/shopNobiPrebuiltContent.js";
import { decodePaidLink } from "../src/utils/shopNobiPaidLink.js";
import { handleProductLinkClick } from "../src/utils/shopNobiProductClick.js";
import { sendSearchPageShownProducts } from "../src/utils/shopNobiShownProducts.js";
import { makeBrowser } from "./fixtures/shop-nobi-click-browser.js";
import { makeDistCopy, prerenderWith, readBody, readScriptJson } from "./shop-nobi-test-build.js";

const Fixture = JSON.parse(readFileSync(new URL("./fixtures/esr-prebuilt-page.json", import.meta.url), "utf8"));
const MerchantId = "e43e55da-830c-4dc3-82f5-c8995273b2b2";
const HeldProduct = Fixture.page.products.find((product) => product.owningMerchantId === MerchantId);
const OtherProducts = Fixture.page.products.filter((product) => product.owningMerchantId !== MerchantId);
const OriginalSource = JSON.stringify(Fixture);
const PageUrl = "https://nobi.ai/shop/s/black-chargers";
const normalize = (source) => buildSearchPages([source], 1).pages[0];
let distDir;
let html;
let page;

before(async () => {
  distDir = makeDistCopy();
  await prerenderWith({ body: { generatedAt: new Date().toISOString(), pages: [Fixture.page], retired: [] } }, distDir);
  html = readFileSync(join(distDir, "shop/s/black-chargers.html"), "utf8");
  page = readScriptJson(html, PrebuiltContentElementId).data;
});
after(() => rmSync(distDir, { recursive: true, force: true }));

/** Reads locally generated text artifacts without downloading merchant content. */
function outputText(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    return entry.isDirectory() ? outputText(path) : [readFileSync(path, "utf8")];
  }).join("\n");
}

/** Rejects the exact held record's copy, identifiers, destination and photo in public output. */
function assertNoHeldProduct(text) {
  for (const value of [HeldProduct.name, HeldProduct.productVariantId, MerchantId, new URL(HeldProduct.imageUrl).pathname, new URL(HeldProduct.url).pathname]) {
    assert.ok(!text.includes(value), `Held product leaked: ${value}`);
  }
}

test("omit the held ESR record while retaining every other actual card and original source tuple", () => {
  assert.equal(Fixture.page.products.length, 17);
  assert.equal(page.products.length, 16);
  assert.ok(!page.products.some((product) => product.owningMerchantId === MerchantId));
  for (const [index, original] of OtherProducts.entries()) {
    const product = page.products[index];
    for (const key of ["name", "brand", "storeName", "imageUrl", "price", "currency", "isInStock", "url", "owningMerchantId", "productVariantId", "paidLink"]) {
      assert.equal(product[key], original[key], key);
    }
    if (original.paidLink) assert.equal(decodePaidLink(product.encodedStoreLink), original.storeLink);
  }
  assert.equal(JSON.stringify(Fixture), OriginalSource, "The source catalog tuple, image, price and affiliate template remain intact.");
  assert.equal(HeldProduct.price, 39.99);
  assert.ok(HeldProduct.storeLink.includes("awinmid=24915"));
});

test("exclude ESR copy and price records from actual HTML, hydration, ItemList, metadata and image derivatives", () => {
  const body = readBody(html);
  assertNoHeldProduct(outputText(distDir));
  assert.ok(OtherProducts.some((product) => product.price === 39.99));
  assert.ok(body.includes("$39.99"), "Another merchant’s same-price card must remain visible.");
  const itemList = readScriptJson(html, "page-schema").find((entry) => entry["@type"] === "ItemList");
  assert.equal(itemList.itemListElement.length, 16);
  assert.deepEqual(itemList.itemListElement.map((entry) => entry.position), Array.from({ length: 16 }, (_, index) => index + 1));
  assert.deepEqual(itemList.itemListElement.map((entry) => entry.item.name), OtherProducts.map((product) => product.name));
  assert.deepEqual(itemList.itemListElement.map((entry) => entry.item.offers.price), OtherProducts.map((product) => product.price));
  assert.equal(findLargePreviewImage(page.products), findLargePreviewImage(OtherProducts));
});

test("retain generic guide, FAQ and canonical board identity while selecting only remaining Story and Pin products", () => {
  assert.deepEqual(page.guide, Fixture.page.guide);
  assert.deepEqual(page.faq, Fixture.page.faq);
  const story = planWebStory(page);
  assert.ok(story);
  assert.ok(story.pages.filter((frame) => frame.kind === "product").every((frame) => frame.product.owningMerchantId !== MerchantId));
  const feeds = buildPinFeedFiles([page]);
  assert.deepEqual(feeds.map((feed) => feed.path), listPinFeedFiles());
  assert.ok(feeds[0].content.includes(`<guid isPermaLink="true">${PageUrl}</guid>`));
  assertNoHeldProduct(JSON.stringify(story) + feeds.map((feed) => feed.content).join("\n"));
});

test("publish no ESR product or image-dependent derivative when the source page contains only ESR", async () => {
  const folder = makeDistCopy();
  try {
    const source = { ...Fixture.page, products: [HeldProduct] };
    await prerenderWith({ body: { generatedAt: new Date().toISOString(), pages: [source], retired: [] } }, folder);
    const onlyHtml = readFileSync(join(folder, "shop/s/black-chargers.html"), "utf8");
    const emptyPage = readScriptJson(onlyHtml, PrebuiltContentElementId).data;
    assert.equal(emptyPage.products.length, 0);
    assert.equal(buildProductListSchema(emptyPage, PageUrl).itemListElement.length, 0);
    assert.equal(findLargePreviewImage(emptyPage.products), null);
    assert.equal(planWebStory(emptyPage), null);
    assert.ok(!buildPinFeedFiles([emptyPage])[0].content.includes("<item>"));
    assertNoHeldProduct(outputText(folder));
    assert.deepEqual(emptyPage.guide, Fixture.page.guide, "A rights hold does not blindly rewrite generic editorial copy.");
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("key the hold to the exact ESR merchant rather than its product name, price or domain", () => {
  assert.equal(normalize({ ...Fixture.page, products: [{ ...HeldProduct, owningMerchantId: MerchantId.toUpperCase() }] }).products.length, 0);
  const differentMerchant = { ...HeldProduct, owningMerchantId: OtherProducts[0].owningMerchantId };
  const product = normalize({ ...Fixture.page, products: [differentMerchant] }).products[0];
  assert.equal(product.name, HeldProduct.name);
  assert.equal(product.price, 39.99);
  assert.equal(product.imageUrl, HeldProduct.imageUrl);
  assert.equal(product.url, HeldProduct.url);
});

test("report only displayed products and preserve another merchant's paid destination and click position", () => {
  const browser = makeBrowser({ pageUrl: PageUrl });
  sendSearchPageShownProducts(page, browser);
  const product = page.products[0];
  const link = { href: product.url };
  handleProductLinkClick({ button: 0, currentTarget: link }, { product, position: 1, query: page.query, slug: page.slug }, browser);
  const shown = browser.beacons[0].event.details;
  assert.equal(shown.collectionSize, 16);
  assert.ok(!shown.shownProducts.some((entry) => entry.owningMerchantId === MerchantId));
  const paid = new URL(link.href);
  assert.equal(paid.searchParams.get("awinmid"), "38962");
  assert.equal(paid.searchParams.get("awinaffid"), "3122300");
  assert.equal(new URL(paid.searchParams.get("ued")).searchParams.get("variant"), "43510427025485");
  assert.match(paid.searchParams.get("clickref"), /^black-chargers\.[a-z0-9]{8}$/);
  assert.equal(browser.beacons[1].event.details.positionInGrid, 1);
  assert.equal(browser.beacons[1].event.details.productVariantId, product.productVariantId);
});

test("complete two simultaneous real prerenders without sharing or deleting one another's renderer output", async () => {
  const folders = [makeDistCopy(), makeDistCopy()];
  try {
    const sources = [Fixture.page, { ...Fixture.page, products: [HeldProduct] }];
    await Promise.all(sources.map((source, index) => prerenderWith({
      body: { generatedAt: new Date().toISOString(), pages: [source], retired: [] },
    }, folders[index])));
    const counts = folders.map((folder) => {
      const output = readFileSync(join(folder, "shop/s/black-chargers.html"), "utf8");
      assertNoHeldProduct(output);
      return readScriptJson(output, PrebuiltContentElementId).data.products.length;
    });
    assert.deepEqual(counts, [16, 0]);
  } finally {
    folders.forEach((folder) => rmSync(folder, { recursive: true, force: true }));
  }
});
