import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";
import { buildPopularSearches } from "../scripts/shop-nobi-category-page-view.js";
import { withAuthoredSearchPageCopy } from "../scripts/shop-nobi-editorial-copy.js";
import { writePrebuiltPages } from "../scripts/shop-nobi-page-files.js";
import { loadPageRenderer } from "../scripts/page-renderer.js";
import { htmlEscape } from "../scripts/prerender-blog.js";
import { landingVariant } from "../src/utils/shopNobiLandingExperiment.js";
import { readBody, readScriptJson } from "./shop-nobi-test-build.js";

const Fixture = JSON.parse(readFileSync(new URL("./fixtures/published-claim-pages.json", import.meta.url), "utf8"));
const DecisionTopics = {
  "duvet-covers": ["dimensions", "closure", "care"],
  "custom-print-mobile-phone-cases": ["phone model", "ready-printed", "printing"],
  "kids-shorts": ["set", "waist", "size"],
  "womens-diamond-bracelets": ["motif", "stone", "alloy"],
  "ceramic-bowls": ["decorative", "food-contact", "capacity", "quantity", "trim"],
  "womens-boat-shoes": ["outsole", "width", "laces"],
  "mens-black-loafers": ["penny", "finish", "width"],
  "bath-salts-soaks": ["quantity", "ingredient", "directions"],
  "mens-silver-pendant-necklaces": ["chain", "attachment", "motif"],
  "womens-chain-bracelets": ["width", "closure", "plating"],
};

/** Uses the actual dated catalog shapes, including legitimate legacy records with no identity IDs. */
function normalize(page) {
  return buildSearchPages([structuredClone(page)], 1).pages[0];
}

test("audited page corrections remove the identified claims and preserve every retained shopping record", () => {
  assert.equal(Fixture.pages.reduce((sum, page) => sum + page.products.length, 0), 163);
  for (const source of Fixture.pages) {
    const page = normalize(source);
    const snapshot = structuredClone(page);
    const published = withAuthoredSearchPageCopy(page);
    const text = JSON.stringify([published.guide, published.faq]);
    for (const claim of Fixture.audit.find(entry => entry.slug === page.slug).badQuotes) {
      assert.ok(!text.includes(JSON.stringify(claim.text).slice(1, -1)), `${page.slug}: ${claim.text}`);
    }
    for (const topic of DecisionTopics[page.slug]) assert.ok(text.toLowerCase().includes(topic), `${page.slug}: ${topic}`);
    assert.equal(published.faq.length, 4);
    assert.strictEqual(published.products, page.products);
    assert.deepEqual(published.related.map(({ slug, query }) => ({ slug, query })), page.related.map(({ slug, query }) => ({ slug, query })));
    for (const key of ["slug", "query", "refreshedAt", "categoryPath", "breadcrumbs"]) assert.deepEqual(published[key], page[key], key);
    assert.equal(landingVariant(published.slug), landingVariant(page.slug));
    assert.deepEqual(page, snapshot);
  }
});

test("all corrected pages agree across rendered metadata, guidance, FAQ schema and hydration", async t => {
  const folder = mkdtempSync(new URL("../node_modules/.published-claims-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const pages = buildSearchPages(Fixture.pages, 10).pages;
  const plan = { searchPages: pages, categoryPages: [], popularSearches: buildPopularSearches(pages, []) };
  const snapshot = structuredClone(plan);
  const { renderPrebuiltPageBody } = await loadPageRenderer();
  await writePrebuiltPages(plan, folder);
  for (const page of pages) {
    const html = readFileSync(join(folder, `shop/s/${page.slug}.html`), "utf8");
    const content = readScriptJson(html, "shop-nobi-prebuilt-content");
    const body = readBody(html).replaceAll('&#x27;', '&#39;');
    const published = content.data;
    assert.ok(html.includes(`<title>${htmlEscape(published.title)} | Shop Nobi</title>`));
    assert.ok(html.includes(`content="${htmlEscape(published.description)}"`));
    for (const paragraph of published.guide) assert.ok(body.includes(htmlEscape(paragraph)), `${page.slug}: guide`);
    for (const { question, answer } of published.faq) {
      assert.ok(body.includes(htmlEscape(question)) && body.includes(htmlEscape(answer)), page.slug);
    }
    const schema = readScriptJson(html, "page-schema");
    const faq = schema.find(entry => entry['@type'] === 'FAQPage');
    assert.deepEqual(faq.mainEntity.map(entry => ({ question: entry.name, answer: entry.acceptedAnswer.text })), published.faq);
    assert.ok(html.includes(renderPrebuiltPageBody(content)), `${page.slug}: browser and static render agree`);
    assert.deepEqual(published.products, page.products);
    assert.equal(body.includes('href="/tools/duvet-cover-size"'), page.slug === "duvet-covers");
  }
  assert.deepEqual(plan, snapshot, "Publication leaves the plan used by feeds and Stories unchanged");
});

test("filtered and empty versions cannot retain the authored claims or FAQ schema", async t => {
  const folder = mkdtempSync(new URL("../node_modules/.published-claim-filters-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  for (const mode of ["upstream filtered", "locally filtered", "empty"]) {
    const sources = structuredClone(Fixture.pages);
    for (const page of sources) {
      if (mode === "empty") page.products = [];
      else if (mode === "upstream filtered") page.publicationFilteredProducts = true;
      else page.products[0].url = "javascript:alert(1)";
    }
    const pages = buildSearchPages(sources, 10).pages;
    await writePrebuiltPages({ searchPages: pages, categoryPages: [], popularSearches: buildPopularSearches(pages, []) }, folder);
    for (const page of pages) {
      const html = readFileSync(join(folder, `shop/s/${page.slug}.html`), "utf8");
      const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
      assert.deepEqual(published.faq, [], `${mode}: ${page.slug}`);
      assert.ok(!readScriptJson(html, "page-schema").some(entry => entry["@type"] === "FAQPage"));
      assert.deepEqual(published.products, page.products);
      const original = withAuthoredSearchPageCopy(normalize(Fixture.pages.find(source => source.slug === page.slug)));
      for (const paragraph of original.guide) assert.ok(!published.guide.includes(paragraph), `${mode}: withheld ${page.slug} authored guidance`);
    }
  }
});
