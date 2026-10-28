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

const ReviewedNames = ["The Hand Lotion", "Kérylos Hand + Body Lotion - 350ml / 11.8fl.oz"];

/** Dated catalog evidence supports identity, not present inventory. */
function sourcePage() {
  return JSON.parse(readFileSync(new URL("./fixtures/hand-lotion.json", import.meta.url), "utf8")).page;
}

/** Run ordinary product validation and retain the upstream publication-filter signal. */
function normalize(page) {
  return buildSearchPages([page], 1).pages[0];
}

test("hand-lotion facts require both exact identities while preserving unrelated catalog details", () => {
  const original = normalize(sourcePage());
  const snapshot = structuredClone(original);
  const published = withAuthoredSearchPageCopy(original);
  assert.equal(published.comparison.rows.length, 2);
  assert.equal(published.guideSources.length, 2);
  assert.equal(published.guideSources[1].url, "https://www.l-objet.com/products/kerylos-hand-body-lotion-350ml-11-8fl-oz");
  assert.match(published.comparison.rows[0].setup, /500 mL/);
  assert.match(published.comparison.rows[0].adjustment, /sandalwood, black pepper, iris and jasmine/);
  assert.match(published.comparison.rows[1].setup, /350 mL.*hands and body/);
  assert.match(published.comparison.rows[1].adjustment, /yuzu, mandarin and grapefruit/);
  assert.doesNotMatch(JSON.stringify(published.guide), /cheaper options often|premium formulas include richer|skin-soothing benefits/);
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
      assert.doesNotMatch(JSON.stringify(result.faq), /comparison includes|reviewed options include/,
        'FAQs do not assert the continued presence of identity-filtered model options');
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

test("hand-lotion comparison renders scent, volume and intended use, references and matching hydrated content only for supported listings", async t => {
  const folder = mkdtempSync(new URL("../node_modules/.hand-lotion-comparison-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const { renderPrebuiltPageBody } = await loadPageRenderer();
  for (const [name, alter, count] of [
    ["matching", () => {}, 2],
    ["changed variant", page => { page.products.find(product => product.name === ReviewedNames[0]).url += "&variant_changed=true"; }, 1],
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
    const html = readFileSync(join(folder, 'shop/s/hand-lotion.html'), 'utf8');
    const content = readScriptJson(html, 'shop-nobi-prebuilt-content');
    const published = content.data;
    const body = readBody(html).replaceAll('&#x27;', '&#39;');
    assert.equal(published.comparison?.rows.length ?? 0, count, name);
    assert.equal(published.guideSources?.length ?? 0, count, name);
    assert.equal(body.includes('<table'), count > 0);
    assert.doesNotMatch(body, /The comparison includes two models/,
      `${name}: visible FAQs do not claim absent reviewed models remain in the comparison`);
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
      assert.match(published.title, /Scents, Bottle Sizes & Uses/);
      assert.ok(published.faq.some(entry => entry.question.includes('fragrance notes') && entry.answer.startsWith('No.')));
      assert.doesNotMatch(body, /cheaper options often|premium formulas include richer|skin-soothing benefits/);
    }
  }
});
