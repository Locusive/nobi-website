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

const ReviewedNames = ["Ondulato Dinner Napkins", "Napa Napkins, Set of 4 - Blue",
  "Matouk Wave Cocktail Napkins - Provence"];

/** Dated catalog evidence supports identity, not present inventory. */
function sourcePage() {
  return JSON.parse(readFileSync(new URL("./fixtures/cloth-napkins.json", import.meta.url), "utf8")).page;
}

/** Run ordinary product validation and retain the upstream publication-filter signal. */
function normalize(page) {
  return buildSearchPages([page], 1).pages[0];
}

test("cloth facts require all three exact identities while preserving unrelated catalog details", () => {
  const original = normalize(sourcePage());
  const snapshot = structuredClone(original);
  const published = withAuthoredSearchPageCopy(original);
  assert.equal(published.comparison.rows.length, 3);
  assert.equal(published.guideSources.length, 3);
  assert.equal(published.guideSources[2].url, "https://www.matouk.com/products/wave-cocktail-napkin-set-of-6?color=Provence");
  assert.match(published.comparison.rows[0].adjustment, /20 × 20 inches/);
  assert.match(published.comparison.rows[1].fit, /no tumble drying/);
  assert.match(published.comparison.rows[2].setup, /Cocktail napkins, set of six/);
  assert.ok(!JSON.stringify(published.comparison.rows[2]).includes('round'));
  for (const [index, name] of ReviewedNames.entries()) {
    for (const change of [
      page => { page.products = page.products.filter(product => product.name !== name); },
      ...["name", "brand", "productVariantId", "owningMerchantId", "url"].map(field => page => {
        page.products.find(product => product.name === name)[field] += "-changed";
      }),
      page => { const product = page.products.find(product => product.name === name); product.url = product.url.replace(/variant=\d+/, 'variant=999'); },
    ]) {
      const changed = structuredClone(published);
      change(changed);
      const result = withAuthoredSearchPageCopy(changed);
      assert.deepEqual(result.comparison.rows, published.comparison.rows.filter((_, row) => row !== index), name);
      assert.deepEqual(result.guideSources, published.guideSources.filter((_, row) => row !== index), name);
      assert.strictEqual(result.products, changed.products);
    }
  }
  const duplicate = { ...original, products: [...original.products, original.products.find(product => product.name === ReviewedNames[0])] };
  const deduplicated = withAuthoredSearchPageCopy(duplicate);
  assert.deepEqual(deduplicated.comparison, published.comparison);
  assert.strictEqual(deduplicated.products, duplicate.products, 'Table deduplication does not alter product cards');
  const refreshed = structuredClone(original);
  refreshed.products.forEach(product => { product.price += 1; product.isInStock = false; });
  assert.deepEqual(withAuthoredSearchPageCopy(refreshed).comparison, published.comparison);
  assert.deepEqual(original, snapshot);
  assert.strictEqual(published.products, original.products);
  assert.equal(landingVariant(published.slug), landingVariant(original.slug));
  const empty = withAuthoredSearchPageCopy({ ...published, products: [] });
  assert.equal(empty.comparison, undefined);
  assert.deepEqual(empty.guideSources, []);
  assert.deepEqual(empty.faq, []);
});

test("cloth comparison renders format and care labels, references and matching hydrated content only for supported listings", async t => {
  const folder = mkdtempSync(new URL("../node_modules/.cloth-comparison-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const { renderPrebuiltPageBody } = await loadPageRenderer();
  for (const [name, alter, count] of [
    ["matching", () => {}, 3],
    ["changed variant", page => { page.products.find(product => product.name === ReviewedNames[0]).url += "&variant_changed=true"; }, 2],
    ["no reviewed models", page => { page.products = page.products.filter(product => !ReviewedNames.includes(product.name)); }, 0],
    ["empty", page => { page.products = []; }, 0],
    ["locally filtered", page => { page.products[0].url = "javascript:alert(1)"; }, 0],
    ["upstream filtered", page => { page.publicationFilteredProducts = true; }, 0],
  ]) {
    const source = sourcePage();
    alter(source);
    const page = normalize(source);
    const plan = { searchPages: [page], categoryPages: [], popularSearches: buildPopularSearches([page], []) };
    const snapshot = structuredClone(plan);
    await writePrebuiltPages(plan, folder);
    const html = readFileSync(join(folder, 'shop/s/cloth-napkins.html'), 'utf8');
    const content = readScriptJson(html, 'shop-nobi-prebuilt-content');
    const published = content.data;
    const body = readBody(html).replaceAll('&#x27;', '&#39;');
    assert.equal(published.comparison?.rows.length ?? 0, count, name);
    assert.equal(published.guideSources?.length ?? 0, count, name);
    assert.equal(body.includes('<table'), count > 0);
    assert.equal(body.includes('aria-label="Guidance sources"'), count > 0);
    if (count) {
      for (const label of published.comparison.columns) assert.ok(body.includes(`scope="col" class="p-3 font-semibold">${htmlEscape(label)}</th>`), label);
      for (const row of published.comparison.rows) {
        for (const value of Object.values(row)) assert.ok(body.includes(htmlEscape(value)), value);
      }
      for (const source of published.guideSources) assert.ok(body.includes(`href="${htmlEscape(source.url)}" target="_blank" rel="noopener noreferrer nofollow"`));
      assert.ok(body.indexOf(htmlEscape(published.comparison.note)) < body.indexOf('role="region"'));
      assert.ok(body.includes('overflow-x-auto') && body.includes('min-w-[40rem]'));
      assert.ok(!body.includes('Device-fit check'));
    }
    assert.ok(html.includes(renderPrebuiltPageBody(content)), 'HTML and browser rendering agree');
    for (const [key, value] of Object.entries(page)) {
      if (!["title", "description", "guide", "faq"].includes(key)) assert.deepEqual(published[key], value, key);
    }
    assert.deepEqual(plan, snapshot, 'Feed and Story source plan remains unchanged');
    if (count) {
      assert.match(published.title, /Dinner Sizes, Set Counts & Care/);
      assert.ok(published.faq.some(entry => entry.question.includes('washing machine and dryer') && entry.answer.startsWith('No.')));
      assert.ok(!JSON.stringify(published.guide).includes('Heavier linen feels luxurious'));
    }
  }
});
