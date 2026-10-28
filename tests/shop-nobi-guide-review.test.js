import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";
import { writePrebuiltPages } from "../scripts/shop-nobi-page-files.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";
import { readBody, readScriptJson } from "./shop-nobi-test-build.js";
import { htmlEscape } from "../scripts/prerender-blog.js";

const ReviewedTopics = [
  ["green-polo", /care label/i],
  ["booties", /intended wearer/i],
  ["100-silk-clothing-accessories", /composition/i],
  ["washed-cotton-velvet-bing-cherry-decor", /furniture model/i],
  ["100-cashmere-clothing", /composition/i],
  ["100-cashmere-sweaters", /composition/i],
  ["100-cotton-underwear-socks", /composition/i],
  ["amplifier-cases", /cover/i],
  ["18k-white-gold-bangles", /diameter/i],
  ["kids-pink-baby-one-pieces", /convertible/i],
  ["mens-black-joggers", /antimicrobial/i],
];

test("reviewed guides replace unsafe source advice consistently in visible HTML, schema and hydration", async t => {
  const folder = mkdtempSync(new URL("../node_modules/.guide-review-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const fixture = readFixturePageData().pages[0];
  const sourcePages = ReviewedTopics.map(([slug]) => ({
    ...fixture, slug, title: "Unreviewed buying guide", query: slug.replaceAll("-", " "),
    guide: ["Unsafe legacy blanket guidance."],
    faq: [{ question: "How should I choose?", answer: "Unsafe legacy blanket guidance." }],
    products: fixture.products.slice(0, 2),
  }));
  const pages = buildSearchPages(sourcePages, sourcePages.length).pages;
  const original = structuredClone(pages);
  await writePrebuiltPages({ searchPages: pages, categoryPages: [], popularSearches: { pages: [], moreSearches: [], categories: [] } }, folder);
  for (const [index, [slug, topic]] of ReviewedTopics.entries()) {
    const html = readFileSync(join(folder, `shop/s/${slug}.html`), "utf8");
    const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
    const body = readBody(html).replaceAll("&#x27;", "&#39;");
    assert.doesNotMatch(html, /Unsafe legacy blanket guidance/, slug);
    assert.match(published.guide.join(" "), topic, slug);
    assert.ok(body.includes(htmlEscape(published.title)), slug);
    for (const paragraph of published.guide) assert.ok(body.includes(htmlEscape(paragraph)), slug);
    const faq = readScriptJson(html, "page-schema").find(entry => entry["@type"] === "FAQPage");
    assert.deepEqual(faq.mainEntity.map(entry => ({ question: entry.name, answer: entry.acceptedAnswer.text })), published.faq, slug);
    for (const { question, answer } of published.faq) {
      assert.ok(body.includes(htmlEscape(question)), slug);
      assert.ok(body.includes(htmlEscape(answer)), slug);
    }
    assert.ok(html.includes(`<title>${htmlEscape(published.title)} | Shop Nobi</title>`), slug);
    assert.ok(html.includes(`content="${htmlEscape(published.description)}"`), slug);
    assert.deepEqual(published.products, original[index].products, slug);
    assert.equal(published.query, original[index].query, slug);
    assert.equal(published.updatedAt, original[index].updatedAt, slug);
  }
  assert.deepEqual(pages, original, "Source records are preserved for other publication surfaces");
});
