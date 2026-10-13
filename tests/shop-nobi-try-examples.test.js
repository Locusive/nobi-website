import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { buildTryExamples, ExampleCount, liveSearchPath, PreferredExampleSlugs, ProductsPerExample, TryExamplesFile } from "../src/utils/shopNobiTryExamples.js";
import { makeDistCopy, prerenderWith } from "./shop-nobi-test-build.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";

/** Builds a product from one of the given stores, with every field the section shows and a few it leaves out. */
function buildProduct(index, storeNames) {
  return {
    name: `Product ${index}`,
    storeName: storeNames[index % storeNames.length],
    price: 40 + index,
    currency: "USD",
    imageUrl: `https://cdn.example.com/products/${index}.jpg`,
    url: `https://store.example.com/products/${index}`,
    storeLink: `https://store.example.com/products/${index}?utm_source=shop_nobi`,
    paidLink: false,
  };
}

/** Builds a search page with the given slug and products. */
function buildPage(slug, products) {
  return { slug, query: slug.replaceAll("-", " "), title: slug, products };
}

/** Builds a page that is healthy enough to show: a full row of products from two stores. */
function buildHealthyPage(slug) {
  const products = Array.from({ length: ProductsPerExample + 2 }, (_, index) => buildProduct(index, ["Store A", "Store B"]));
  return buildPage(slug, products);
}

test("examples follow the preferred order, skip pages too thin to show, and stop at the example count", () => {
  const thinPage = buildPage(PreferredExampleSlugs[0], [buildProduct(0, ["Store A", "Store B"])]);
  const oneStorePage = buildPage(PreferredExampleSlugs[1], Array.from({ length: ProductsPerExample }, (_, index) => buildProduct(index, ["Store A"])));
  const healthyPages = PreferredExampleSlugs.slice(2).reverse().map(buildHealthyPage);

  const { examples } = buildTryExamples([thinPage, oneStorePage, ...healthyPages]);

  assert.deepEqual(examples.map((example) => example.slug), PreferredExampleSlugs.slice(2, 2 + ExampleCount));
});

test("each example keeps its search, its page path and only what a card shows for its first products", () => {
  const { examples } = buildTryExamples([buildHealthyPage("purse")]);

  assert.equal(examples.length, 1);
  assert.equal(examples[0].query, "purse");
  assert.equal(examples[0].path, "/shop/s/purse");
  assert.equal(examples[0].products.length, ProductsPerExample);
  assert.deepEqual(examples[0].products[0], { name: "Product 0", storeName: "Store A", price: 40, currency: "USD", imageUrl: "https://cdn.example.com/products/0.jpg" });
});

test("a visitor's own search opens Shop Nobi's live search with the words in the address", () => {
  assert.equal(liveSearchPath("  red dress & heels under $200 "), "/shop?q=red%20dress%20%26%20heels%20under%20%24200");
});

test("the build writes the homepage's example results from the pages it built", async () => {
  const folder = makeDistCopy();
  const pageData = readFixturePageData();
  pageData.pages.push(buildHealthyPage("purse"));
  try {
    await prerenderWith({ body: pageData }, folder);

    const written = JSON.parse(readFileSync(join(folder, TryExamplesFile), "utf8"));
    assert.deepEqual(written.examples.map((example) => example.slug), ["purse"], "The fixture's thin pages are left out");
    assert.equal(written.examples[0].products.length, ProductsPerExample);
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
