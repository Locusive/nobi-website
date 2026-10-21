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
