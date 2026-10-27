import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { withAuthoredSearchPageCopy } from "../scripts/shop-nobi-editorial-copy.js";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";
import { buildPopularSearches } from "../scripts/shop-nobi-category-page-view.js";
import { writePrebuiltPages } from "../scripts/shop-nobi-page-files.js";
import { htmlEscape } from "../scripts/prerender-blog.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";
import { readBody, readScriptJson } from "./shop-nobi-test-build.js";

/** Uses the observed wording and six public identities with synthetic shopping fields for local tests. */
function observedMailboxPage() {
  const observed = JSON.parse(readFileSync(new URL("./fixtures/mailbox-review-page.json", import.meta.url), "utf8"));
  const base = readFixturePageData().pages[0];
  return {
    ...base, slug: "mailbox-posts", title: "Best Mailbox Posts from Top Stores", query: "mailbox posts",
    guide: observed.guide, faq: observed.faq,
    products: observed.products.map((product) => ({ ...base.products[0], ...product, paidLink: true })),
  };
}

test("mailbox advice removes unsupported generalizations and bounds the manufacturer fact to the reviewed item", () => {
  const page = observedMailboxPage();
  const original = structuredClone(page);
  const corrected = withAuthoredSearchPageCopy(page);
  const text = [...corrected.guide, ...corrected.faq.map(({ answer }) => answer)].join("\n");
  for (const unsupported of ["48-54", "wooden styles in cedar", "painted metal finishes", "Most posts come with a concrete base"]) {
    assert.equal(text.includes(unsupported), false, unsupported);
  }
  assert.match(text, /weather-resistant resin/);
  assert.match(text, /4x4 wooden mounting post sold separately/);
  assert.match(text, /does not establish the materials or mounting requirements of the other listings/);
  assert.deepEqual(corrected.guideSources, [{
    label: "Step2 Highland product details (checked October 23, 2026)",
    url: "https://www.step2.com/products/highland-mail-post-xl-black-mailbox?variant=47636615397663",
  }]);
  assert.deepEqual(corrected.products, original.products);
  assert.deepEqual(page, original);
});

test("a changed or missing reviewed product retains cautious advice without the item fact or citation", () => {
  for (const field of ["name", "url", "productVariantId", "missing"]) {
    const page = observedMailboxPage();
    if (field === "missing") page.products.splice(1, 1);
    else page.products[1][field] = "changed";
    const corrected = withAuthoredSearchPageCopy(page);
    assert.equal(corrected.guide.join(" ").includes("weather-resistant resin"), false, field);
    assert.equal(corrected.guideSources, undefined, field);
    assert.match(corrected.guide[1], /finish name does not establish/);
    assert.equal(corrected.guide.join(" ").includes("48-54"), false);
  }
});

test("mailbox correction preserves refreshed wording, unrelated pages and repeated rendering", () => {
  const page = observedMailboxPage();
  page.guide[0] = "Freshly verified buying guidance.";
  page.faq[0].answer = "Freshly verified installation guidance.";
  const corrected = withAuthoredSearchPageCopy(page);
  assert.equal(corrected.guide[0], page.guide[0]);
  assert.deepEqual(corrected.faq[0], page.faq[0]);
  assert.deepEqual(withAuthoredSearchPageCopy(corrected), corrected);
  page.slug = "another-mailbox-page";
  const other = withAuthoredSearchPageCopy(page);
  // Generic metadata can improve, but mailbox-specific guidance must not leak onto another page.
  for (const [key, value] of Object.entries(page)) {
    if (!["title", "description"].includes(key)) assert.deepEqual(other[key], value, key);
  }
});

test("refreshed material guidance does not acquire a manufacturer citation for text we did not author", () => {
  const page = observedMailboxPage();
  page.guide[1] = "New material guidance from the upstream source.";
  const corrected = withAuthoredSearchPageCopy(page);
  assert.equal(corrected.guide[1], page.guide[1]);
  assert.equal(corrected.guideSources, undefined);
  assert.equal(corrected.guide.join(" ").includes("weather-resistant resin"), false);
});

test("published mailbox HTML, hydration and FAQ agree while the source plan and other page remain intact", async (t) => {
  const folder = mkdtempSync(new URL("../node_modules/.mailbox-test-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<!doctype html><html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const { pages } = buildSearchPages([observedMailboxPage(), readFixturePageData().pages[0]], 2);
  const plan = { searchPages: pages, categoryPages: [], popularSearches: buildPopularSearches(pages, []) };
  const original = structuredClone(plan);
  await writePrebuiltPages(plan, folder);
  const html = readFileSync(join(folder, "shop/s/mailbox-posts.html"), "utf8");
  const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
  const body = readBody(html).replaceAll("&#x27;", "&#39;");
  assert.equal(body.includes("48-54"), false);
  for (const text of [...published.guide, ...published.faq.flatMap(({ question, answer }) => [question, answer])]) {
    assert.ok(body.includes(htmlEscape(text)), text);
  }
  assert.ok(published.guideSources?.length === 1);
  assert.ok(body.includes(`href="${htmlEscape(published.guideSources[0].url)}"`));
  const faq = readScriptJson(html, "page-schema").find((entry) => entry["@type"] === "FAQPage");
  assert.deepEqual(faq.mainEntity, published.faq.map(({ question, answer }) =>
    ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })));
  for (const [key, value] of Object.entries(original.searchPages[0])) {
    if (!["guide", "faq"].includes(key)) assert.deepEqual(published[key], value, key);
  }
  assert.deepEqual(plan, original);
  const other = readFileSync(join(folder, "shop/s/black-leather-boots.html"), "utf8");
  assert.deepEqual(readScriptJson(other, "shop-nobi-prebuilt-content").data, original.searchPages[1]);
});
