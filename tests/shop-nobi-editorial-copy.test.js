import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { writePrebuiltPages } from "../scripts/shop-nobi-page-files.js";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";
import { buildPopularSearches } from "../scripts/shop-nobi-category-page-view.js";
import { htmlEscape } from "../scripts/prerender-blog.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";
import { readBody, readScriptJson } from "./shop-nobi-test-build.js";
import { withAuthoredSearchPageCopy } from "../scripts/shop-nobi-editorial-copy.js";

/** A synthetic mixed listing exercises all retained shopping fields without copying a live catalogue. */
function mixedSuitcasePage() {
  const fixture = readFixturePageData().pages[0];
  return {
    ...fixture, slug: "blue-suitcases", title: "Blue Suitcases", query: "blue suitcases",
    guide: ["Blue suitcases on this page range from about $70 to $495. The collection includes hard-shell carry-ons, expandable checked bags, and a few novelty suitcases with built-in record players.", "Keep the remaining guidance."],
    faq: [{ question: "What size suitcase should I choose?", answer: "Check the retailer's measurements." },
      { question: "Do built-in tech suitcases affect durability?", answer: "Tech features add weight and moving parts, so check reviews for long-term reliability." }],
    products: Array.from({ length: 16 }, (_, index) => ({ ...fixture.products[0],
      name: index === 4 || index === 14 ? `Suitcase Record Player ${index}` : `Travel Suitcase ${index}`,
      productVariantId: `fixture-product-${index}`, url: `https://example.com/products/suitcase-${index}` })),
  };
}

test("suitcase clarification agrees across HTML, FAQ schema and hydration while retaining every shopping field", async (t) => {
  const folder = mkdtempSync(new URL("../node_modules/.editorial-test-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<!doctype html><html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const fixture = readFixturePageData().pages[0];
  const { pages } = buildSearchPages([mixedSuitcasePage(), fixture], 2);
  const plan = { searchPages: pages, categoryPages: [], popularSearches: buildPopularSearches(pages, []) };
  const original = structuredClone(plan);
  await writePrebuiltPages(plan, folder);
  const html = readFileSync(join(folder, "shop/s/blue-suitcases.html"), "utf8");
  const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
  const body = readBody(html).replaceAll("&#x27;", "&#39;");
  assert.ok(!html.includes("novelty suitcases"));
  assert.ok(!html.includes("Do built-in tech suitcases affect durability?"));
  assert.match(published.guide[0], /record players are audio products, not bags for packing/);
  assert.equal(published.faq[1].question, "Are suitcase-style record players travel luggage?");
  for (const text of [published.guide[0], published.faq[1].question, published.faq[1].answer]) {
    assert.ok(body.includes(htmlEscape(text)), text);
  }
  const faq = readScriptJson(html, "page-schema").find((entry) => entry["@type"] === "FAQPage");
  assert.deepEqual(faq.mainEntity, published.faq.map(({ question, answer }) =>
    ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })));
  for (const [key, value] of Object.entries(original.searchPages[0])) {
    if (!["guide", "faq"].includes(key)) assert.deepEqual(published[key], value, key);
  }
  assert.equal(published.products.length, 16);
  assert.deepEqual(published.guide.slice(1), original.searchPages[0].guide.slice(1));
  assert.deepEqual(published.faq[0], original.searchPages[0].faq[0]);
  assert.deepEqual(plan, original);
  const other = readFileSync(join(folder, "shop/s/black-leather-boots.html"), "utf8");
  assert.deepEqual(readScriptJson(other, "shop-nobi-prebuilt-content").data, original.searchPages[1]);
});

test("suitcase correction leaves refreshed guidance and other pages intact", () => {
  for (const change of [
    (page) => { page.guide[0] = "Freshly reviewed luggage guidance."; },
    (page) => { page.faq[1].answer = "Freshly reviewed answer."; },
    (page) => { page.slug = "black-suitcases"; },
  ]) {
    const page = mixedSuitcasePage();
    change(page);
    assert.deepEqual(withAuthoredSearchPageCopy(page), page);
  }
});

test("published ring guidance agrees across the page, metadata and browser data without changing shopping data or other pages", async (t) => {
  const folder = mkdtempSync(new URL("../node_modules/.editorial-test-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<!doctype html><html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const fixture = readFixturePageData().pages[0];
  const ring = {
    ...fixture,
    slug: "sterling-silver-rings",
    title: "Best Sterling Silver Rings from Top Stores",
    description: "Compare the best sterling silver rings from top stores in one place.",
    guide: ["A secure clasp or shank ensures the ring stays in place."],
    faq: [{ question: "Old ring question", answer: "Old ring answer" }],
  };
  const { pages } = buildSearchPages([ring, fixture], 2);
  const plan = { searchPages: pages, categoryPages: [], popularSearches: buildPopularSearches(pages, []) };
  const originalPlan = structuredClone(plan);

  await writePrebuiltPages(plan, folder);

  const html = readFileSync(join(folder, "shop/s/sterling-silver-rings.html"), "utf8");
  const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
  // React and the head renderer use equivalent numeric apostrophe entities.
  const body = readBody(html).replaceAll("&#x27;", "&#39;");
  assert.equal(published.title, "Sterling Silver Rings: Compare Styles, Fit & Finish");
  assert.ok(html.includes(`<title>${htmlEscape(published.title)} | Shop Nobi</title>`));
  assert.ok(html.includes(`<meta name="description" content="${htmlEscape(published.description)}">`));
  assert.ok(body.includes(`>${htmlEscape(published.title)}</h1>`));
  for (const paragraph of published.guide) assert.ok(body.includes(htmlEscape(paragraph)));
  assert.equal(published.guide.length, 4);
  assert.equal(published.faq.length, 4);
  for (const { question, answer } of published.faq) {
    assert.ok(body.includes(htmlEscape(question)));
    assert.ok(body.includes(htmlEscape(answer)));
  }
  const schema = readScriptJson(html, "page-schema");
  assert.deepEqual(schema.find((entry) => entry["@type"] === "FAQPage").mainEntity,
    published.faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })));
  assert.ok(!html.includes("secure clasp"));
  assert.ok(!html.includes("Old ring answer"));
  for (const [key, value] of Object.entries(originalPlan.searchPages[0])) {
    if (!["title", "description", "guide", "faq"].includes(key)) assert.deepEqual(published[key], value, key);
  }
  assert.deepEqual(plan, originalPlan, "Feed and Web Story consumers retain the original plan");

  const otherHtml = readFileSync(join(folder, "shop/s/black-leather-boots.html"), "utf8");
  assert.deepEqual(readScriptJson(otherHtml, "shop-nobi-prebuilt-content").data, originalPlan.searchPages[1]);
  assert.ok(otherHtml.includes("<title>Black Leather Boots | Shop Nobi</title>"));
  assert.ok(!otherHtml.includes("Compare Styles, Fit &amp; Finish"));
});
