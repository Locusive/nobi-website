import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { selectJewelryComparisons } from "../src/utils/shopNobiJewelryComparison.js";
import { buildCategoryPages } from "../scripts/shop-nobi-category-page-view.js";
import { makeDistCopy, prerenderWith, readScriptJson } from "./shop-nobi-test-build.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";

/** Reads independently captured public identities as a local build fixture. */
function readJewelryFixture() {
  const fixture = JSON.parse(readFileSync(new URL("./fixtures/jewelry-comparison-pages.json", import.meta.url), "utf8"));
  return { ...fixture, generatedAt: new Date().toISOString() };
}

test("the comparison reads literal piece, stone and metal words across six confirmed collections", () => {
  const pages = readJewelryFixture().pages;
  const original = structuredClone(pages);
  const rows = selectJewelryComparisons(pages);
  assert.equal(rows.length, 6);
  assert.deepEqual(rows[0], { slug: "sterling-silver-rings", name: "Cirque Ring, Sterling Silver", piece: "Ring", stone: "Not named", metal: "Sterling silver" });
  assert.equal(rows.find((row) => row.slug === "amethyst-jewelry").metal, "14Kt gold; colour not named");
  assert.equal(rows.find((row) => row.slug === "yellow-gold-diamond-earrings").metal, "Not named", "The collection heading must not supply a material claim");
  assert.deepEqual(pages, original, "Comparison selection does not alter source products or links");
});

test("changed names, variants, native destinations and absent collections omit the affected example", () => {
  for (const field of ["name", "productVariantId", "url", "absentPage"]) {
    const pages = readJewelryFixture().pages;
    if (field === "absentPage") pages.shift();
    else pages[0].products[0][field] = "changed";
    const rows = selectJewelryComparisons(pages);
    assert.equal(rows.length, 5, field);
    assert.equal(rows.some((row) => row.slug === "sterling-silver-rings"), false, field);
  }
});

test("only the jewelry category receives comparisons while other category links stay intact", () => {
  const categories = buildCategoryPages([...readJewelryFixture().pages, ...readFixturePageData().pages], 100);
  assert.equal(categories.find((category) => category.slug === "jewelry").jewelryComparisons.length, 6);
  for (const category of categories.filter((category) => category.slug !== "jewelry")) {
    assert.equal(Object.hasOwn(category, "jewelryComparisons"), false);
    assert.ok(category.pages.length > 0);
  }
});

test("the built category shows the same six supported rows embedded for browser rendering", async () => {
  const folder = makeDistCopy();
  try {
    await prerenderWith({ body: readJewelryFixture() }, folder);
    const html = readFileSync(join(folder, "shop/c/jewelry.html"), "utf8");
    const content = readScriptJson(html, "shop-nobi-prebuilt-content");
    assert.equal(content.data.jewelryComparisons.length, 6);
    assert.ok(html.includes('id="jewelry-comparison-heading"'));
    assert.equal((html.match(/scope="row"/g) ?? []).length, 6);
    assert.ok(html.includes("Not named"));
    assert.ok(html.includes("not independent material certifications"));
    assert.ok(html.includes('<link rel="canonical" href="https://nobi.ai/shop/c/jewelry">'));
    for (const row of content.data.jewelryComparisons) {
      assert.ok(html.includes(`href="/shop/s/${row.slug}"`));
      assert.equal(Object.hasOwn(row, "nativeUrl"), false, "The comparison links internally");
    }
    assert.equal(content.data.name, "Jewelry");
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("a category with fewer than two supported examples has no empty comparison section", async () => {
  const fixture = readJewelryFixture();
  for (const page of fixture.pages.slice(1)) page.products[0].name = "Changed listing";
  const folder = makeDistCopy();
  try {
    await prerenderWith({ body: fixture }, folder);
    const html = readFileSync(join(folder, "shop/c/jewelry.html"), "utf8");
    assert.equal(html.includes('id="jewelry-comparison-heading"'), false);
    assert.ok(html.includes('href="/shop/s/amethyst-jewelry"'), "Ordinary collection links remain");
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
