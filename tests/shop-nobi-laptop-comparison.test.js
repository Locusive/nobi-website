import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";
import { withAuthoredSearchPageCopy } from "../scripts/shop-nobi-editorial-copy.js";
import { writePrebuiltPages } from "../scripts/shop-nobi-page-files.js";
import { buildPopularSearches } from "../scripts/shop-nobi-category-page-view.js";
import { loadPageRenderer } from "../scripts/page-renderer.js";
import { htmlEscape } from "../scripts/prerender-blog.js";
import { landingVariant } from "../src/utils/shopNobiLandingExperiment.js";
import { readBody, readScriptJson } from "./shop-nobi-test-build.js";

const ReviewedNames = ["Fold Laptop Stand", "Desk Laptop Stand", "Rise Laptop Stand", "Invisible Stand", "Sit-stand Laptop Desk"];

/** The dated fixture is evidence of identity, not a current price or availability assertion. */
function laptopPage() {
  return JSON.parse(readFileSync(new URL("./fixtures/laptop-stands.json", import.meta.url), "utf8")).page;
}

/** Normalize through the real publication boundary, including merchant and unsafe-link exclusions. */
function normalized(page) {
  return buildSearchPages([page], 1).pages[0];
}

test("each laptop specification and source require the exact reviewed identity and variant", () => {
  const original = normalized(laptopPage());
  const snapshot = structuredClone(original);
  const published = withAuthoredSearchPageCopy(original);
  assert.equal(published.comparison.rows.length, 5);
  assert.equal(new Set(published.guideSources.map(source => source.url)).size, 5);
  for (const [index, name] of ReviewedNames.entries()) {
    for (const change of [
      page => { page.products = page.products.filter(product => product.name !== name); },
      ...["name", "brand", "productVariantId", "owningMerchantId", "url"].map(field => page => { page.products.find(product => product.name === name)[field] += "-changed"; }),
      page => { const product = page.products.find(product => product.name === name); product.url = product.url.replace(/variant=\d+/, "variant=999"); },
    ]) {
      // Reprocess a published page as well, so stale derived rows cannot survive a refresh.
      const changed = structuredClone(published);
      change(changed);
      const result = withAuthoredSearchPageCopy(changed);
      assert.deepEqual(result.comparison.rows, published.comparison.rows.filter((_, rowIndex) => rowIndex !== index), name);
      assert.deepEqual(result.guideSources, published.guideSources.filter((_, rowIndex) => rowIndex !== index), name);
      assert.strictEqual(result.products, changed.products);
    }
  }
  const duplicated = { ...original, products: [...original.products, original.products.find(product => product.name === "Invisible Stand")] };
  const deduplicated = withAuthoredSearchPageCopy(duplicated);
  assert.deepEqual(deduplicated.comparison, published.comparison);
  assert.deepEqual(deduplicated.guideSources, published.guideSources);
  assert.strictEqual(deduplicated.products, duplicated.products, "Repeated records remain untouched while references appear once");
  const refreshed = structuredClone(original);
  refreshed.products.forEach(product => { product.price += 1; product.isInStock = false; });
  assert.deepEqual(withAuthoredSearchPageCopy(refreshed).comparison, published.comparison, "Price and stock updates do not change model specifications");
  assert.deepEqual(original, snapshot, "Source records stay untouched");
  assert.strictEqual(published.products, original.products);
  assert.equal(landingVariant(published.slug), landingVariant(original.slug));

  const invisible = published.comparison.rows.find(row => row.model.startsWith("MOFT Invisible"));
  assert.match(invisible.setup, /non-adhesive/);
  assert.match(invisible.model, /Large \/ Jet Black/);
  assert.match(invisible.fit, /15 inches and up.*14-inch MacBook Pro/);
  assert.match(published.comparison.rows.find(row => row.model === "Native Union Desk").adjustment, /height and angle/);
  assert.match(published.comparison.rows.find(row => row.model === "Native Union Rise").fit, /Excludes.*ventilation/);
});

for (const [scenario, alter, expectedRows] of [
  ["matching models", () => {}, 5],
  ["changed MOFT variant", page => { page.products.find(product => product.name === "Invisible Stand").url = "https://moft.com/products/invisible-stand?variant=999"; }, 4],
  ["no reviewed models", page => { page.products = page.products.filter(product => !ReviewedNames.includes(product.name)); }, 0],
  ["empty page", page => { page.products = []; }, 0],
  ["filtered listing", page => { page.products[0].url = "javascript:alert(1)"; }, 0],
  ["upstream-filtered listings", page => { page.publicationFilteredProducts = true; }, 0],
]) {
  test(`laptop comparison publication preserves source data and agrees across HTML and hydration with ${scenario}`, async t => {
    const folder = mkdtempSync(new URL("../node_modules/.laptop-comparison-", import.meta.url));
    t.after(() => rmSync(folder, { recursive: true, force: true }));
    writeFileSync(join(folder, "index.html"), '<!doctype html><html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
    const source = laptopPage();
    alter(source);
    const page = normalized(source);
    const plan = { searchPages: [page], categoryPages: [], popularSearches: buildPopularSearches([page], []) };
    const originalPlan = structuredClone(plan);
    await writePrebuiltPages(plan, folder);
    const html = readFileSync(join(folder, "shop/s/laptop-stands.html"), "utf8");
    const content = readScriptJson(html, "shop-nobi-prebuilt-content");
    const published = content.data;
    const body = readBody(html).replaceAll("&#x27;", "&#39;");
    assert.equal(published.comparison?.rows.length ?? 0, expectedRows);
    assert.equal(published.guideSources?.length ?? 0, expectedRows);
    assert.equal(body.includes("<table"), expectedRows > 0);
    assert.equal(body.includes('aria-label="Guidance sources"'), expectedRows > 0);
    if (expectedRows) {
      for (const row of published.comparison.rows) {
        for (const value of Object.values(row)) assert.ok(body.includes(htmlEscape(value)), value);
      }
      for (const reference of published.guideSources) {
        assert.ok(body.includes(`href="${htmlEscape(reference.url)}" target="_blank" rel="noopener noreferrer nofollow"`));
        assert.ok(body.includes(htmlEscape(reference.label)));
      }
    }
    if (scenario === "changed MOFT variant") assert.ok(!body.includes("MOFT Invisible, Large / Jet Black"));
    const { renderPrebuiltPageBody } = await loadPageRenderer();
    assert.ok(html.includes(renderPrebuiltPageBody(content)), "The browser content renders the exact same body as the generated HTML");
    for (const [key, value] of Object.entries(page)) {
      if (!["title", "description", "guide", "faq"].includes(key)) assert.deepEqual(published[key], value, key);
    }
    assert.deepEqual(plan, originalPlan, "Source plan used by feeds and Stories stays unchanged");
    assert.doesNotMatch(published.guide.join(" "), /reduce neck strain|non-slip surface protects|Laptop stands on this page range from/);
    assert.ok(!published.faq.some(entry => /lower temperatures|improve ergonomics/.test(entry.answer)));
  });
}

test("an emptied previously published laptop page discards its comparison and references", () => {
  const published = withAuthoredSearchPageCopy(normalized(laptopPage()));
  const empty = withAuthoredSearchPageCopy({ ...published, products: [] });
  assert.equal(empty.comparison, undefined);
  assert.deepEqual(empty.guideSources, []);
  assert.deepEqual(empty.faq, []);
});
