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
import { makeBrowser } from "./fixtures/shop-nobi-click-browser.js";
import { makeDistCopy, prerenderWith, readBody, readScriptJson } from "./shop-nobi-test-build.js";

const Fixture = JSON.parse(readFileSync(new URL("./fixtures/cuckoo-prebuilt-page.json", import.meta.url), "utf8"));
const MerchantId = "962fb5d1-9238-4ecf-bc36-0ddc304be721";
const RequiredNotice = "Disclosure: Compensated Affiliate.";
const PageUrl = "https://nobi.ai/shop/s/food-mixers-blenders";
const OriginalSource = JSON.stringify(Fixture);
const normalizedPage = (page = Fixture.page) => buildSearchPages([page], 1).pages[0];
let distDir;
let html;
let page;

before(async () => {
  distDir = makeDistCopy();
  await prerenderWith({ body: { generatedAt: new Date().toISOString(), pages: [Fixture.page], retired: [] } }, distDir);
  html = readFileSync(join(distDir, "shop/s/food-mixers-blenders.html"), "utf8");
  page = readScriptJson(html, PrebuiltContentElementId).data;
});
after(() => rmSync(distDir, { recursive: true, force: true }));

/** Reads generated text artifacts without opening a browser or requesting merchant images. */
function outputText(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    return entry.isDirectory() ? outputText(path) : [readFileSync(path, "utf8")];
  }).join("\n");
}

test("retain both actual CUCKOO choices as text with their exact prices, stock, URLs and paid links", () => {
  assert.equal(page.products.length, 15);
  for (const original of Fixture.page.products.slice(0, 2)) {
    const product = page.products.find((candidate) => candidate.productVariantId === original.productVariantId);
    for (const key of ["name", "price", "currency", "isInStock", "url", "owningMerchantId", "productVariantId"]) {
      assert.equal(product[key], original[key], key);
    }
    assert.equal(product.imageUrl, null);
    assert.equal(product.commissionNotice, RequiredNotice);
    assert.equal(decodePaidLink(product.encodedStoreLink), original.storeLink);
  }
  assert.equal(JSON.stringify(Fixture), OriginalSource, "Presentation must not mutate the source tuples or photos.");
});

test("render the literal notice near both links without CUCKOO imagery in HTML, hydration, metadata or schema", () => {
  const body = readBody(html);
  assert.equal((body.match(/Disclosure: Compensated Affiliate\./g) || []).length, 2);
  for (const product of page.products.slice(0, 2)) {
    const start = body.indexOf(`href="${product.url.replace(/&/g, "&amp;")}"`);
    const card = body.slice(body.lastIndexOf("<li>", start), body.indexOf("</li>", start));
    assert.ok(start >= 0 && card.includes(RequiredNotice));
    assert.ok(card.includes(product.name) && !card.includes("<img"));
  }
  assert.ok(body.includes("$79.99") && body.includes("$45.99"));
  const itemList = readScriptJson(html, "page-schema").find((item) => item["@type"] === "ItemList");
  for (const entry of itemList.itemListElement.slice(0, 2)) assert.ok(!Object.hasOwn(entry.item, "image"));
  const generated = outputText(distDir);
  for (const product of Fixture.page.products.slice(0, 2)) {
    assert.ok(!generated.includes(new URL(product.imageUrl).pathname), "No original or resized CUCKOO photo may escape through a derivative.");
  }
});

test("leave the other thirteen merchants' cards and image-dependent outputs intact", () => {
  for (const original of Fixture.page.products.slice(2)) {
    const product = page.products.find((candidate) => candidate.productVariantId === original.productVariantId);
    for (const key of ["name", "brand", "storeName", "imageUrl", "price", "currency", "isInStock", "url", "owningMerchantId", "productVariantId"]) {
      assert.equal(product[key], original[key], key);
    }
    assert.ok(!Object.hasOwn(product, "commissionNotice"));
  }
  assert.equal(findLargePreviewImage(page.products), findLargePreviewImage(Fixture.page.products.slice(2)));
  const story = planWebStory(page);
  assert.ok(story);
  assert.ok(story.pages.filter((frame) => frame.kind === "product").every((frame) => frame.product.owningMerchantId !== MerchantId));
  const feeds = buildPinFeedFiles([page]);
  assert.deepEqual(feeds.map((feed) => feed.path), listPinFeedFiles());
  const index = (files) => JSON.parse(files.find((file) => file.path === "shop/pins/index.json").content);
  assert.deepEqual(index(feeds), index(buildPinFeedFiles([Fixture.page])), "Connections, board identities and item counts stay intact for this mixed page.");
  assert.ok(feeds[0].content.includes(`<guid isPermaLink="true">${PageUrl}</guid>`));
});

test("keep a CUCKOO-only page useful without making image previews, Stories or picture Pins", () => {
  const onlyCuckoo = normalizedPage({ ...Fixture.page, products: Fixture.page.products.slice(0, 2) });
  assert.equal(onlyCuckoo.products.length, 2);
  assert.equal(findLargePreviewImage(onlyCuckoo.products), null);
  assert.equal(planWebStory(onlyCuckoo), null);
  assert.equal(buildProductListSchema(onlyCuckoo, PageUrl).itemListElement.length, 2);
  assert.ok(!buildPinFeedFiles([onlyCuckoo])[0].content.includes("<item>"));
});

test("scope the exception to the actual merchant and retain name and URL safety checks", () => {
  const original = Fixture.page.products[0];
  const withoutImage = normalizedPage({ ...Fixture.page, products: [{ ...original, imageUrl: null }] });
  assert.equal(withoutImage.products.length, 1);
  assert.equal(withoutImage.products[0].commissionNotice, RequiredNotice);
  const unsafe = [{ ...original, url: "javascript:alert(1)" }, { ...original, name: "" }];
  assert.equal(normalizedPage({ ...Fixture.page, products: unsafe }).products.length, 0);
  const otherMerchant = { ...original, owningMerchantId: Fixture.page.products[2].owningMerchantId };
  const regular = normalizedPage({ ...Fixture.page, products: [otherMerchant] }).products[0];
  assert.equal(regular.imageUrl, original.imageUrl, "A name or domain alone does not activate the merchant policy.");
  assert.ok(!Object.hasOwn(regular, "commissionNotice"));
  assert.equal(normalizedPage({ ...Fixture.page, products: [{ ...otherMerchant, imageUrl: null }] }).products.length, 0);
});

test("retain the exact assigned Awin destination and visit attribution when a text-only card is clicked", () => {
  const product = page.products[0];
  const browser = makeBrowser({ pageUrl: PageUrl + "?utm_source=pinterest" });
  const link = { href: product.url };
  handleProductLinkClick({ button: 0, currentTarget: link }, { product, position: 1, query: page.query, slug: page.slug }, browser);
  const paid = new URL(link.href);
  assert.equal(paid.hostname, "www.awin1.com");
  assert.equal(paid.searchParams.get("awinmid"), "61971");
  assert.equal(paid.searchParams.get("awinaffid"), "3122300");
  assert.match(paid.searchParams.get("clickref"), /^food-mixers-blenders\.[a-z0-9]{8}$/);
  assert.equal(new URL(paid.searchParams.get("ued")).searchParams.get("variant"), "42359763730685");
  assert.equal(browser.beacons.length, 1);
  assert.equal(browser.beacons[0].event.details.productVariantId, product.productVariantId);
  assert.equal(browser.beacons[0].event.details.owningMerchantId, MerchantId);
});
