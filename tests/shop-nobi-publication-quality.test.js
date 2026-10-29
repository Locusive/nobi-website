import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";
import { writePrebuiltPages } from "../scripts/shop-nobi-page-files.js";
import { withAuthoredSearchPageCopy } from "../scripts/shop-nobi-editorial-copy.js";
import { withPublicationQuality, catalogPriceSummary } from "../scripts/shop-nobi-publication-quality.js";
import { buildSearchPageSeo } from "../src/utils/shopNobiSearchPage.js";
import { appendLlmsTxtSection, buildShopNobiSitemap } from "../scripts/shop-nobi-search-page-listings.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";
import { readScriptJson, readBody } from "./shop-nobi-test-build.js";

const SuedeCarePairs = JSON.parse(readFileSync(new URL("./fixtures/shop-nobi-suede-care-pairs.json", import.meta.url), "utf8"));
const ReviewedSuedeAnswer = "Before applying a protective treatment, check the maker’s care instructions for the exact suede item, including its finish, lining and trim. Use only cleaning tools and treatments the maker permits for that model; a suede label alone does not establish water or stain protection.";

/** Raw records exercise the actual rights filter and publication renderer together. */
function sourcePage() {
  const source = readFixturePageData().pages[0];
  return { ...source, slug: "phone-cases", title: "Best Phone Cases from Top Stores", query: "phone cases",
    guide: ["Cases on this page cost $23 to $69. ESR offers a magnetic mount."],
    faq: [{ question: "Which mount is listed?", answer: "The ESR HaloLock mount." }],
    products: [{ ...source.products[0], name: "ESR Case", owningMerchantId: "e43e55da-830c-4dc3-82f5-c8995273b2b2" }] };
}

test("local or upstream filtering clears unsupported copy and empty discovery, then restores populated publication", async t => {
  const folder = mkdtempSync(new URL("../node_modules/.publication-quality-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const source = sourcePage();
  const allowed = { ...readFixturePageData().pages[0].products[0], name: "Pink Case", price: 48, currency: "USD" };
  for (const [state, products] of [["empty", source.products], ["partial", [...source.products, allowed]], ["upstream", [allowed]], ["upstream-empty", []], ["restored", [allowed]]]) {
    const raw = { ...source, products, publicationFilteredProducts: state.startsWith("upstream") };
    const empty = state === "empty" || state === "upstream-empty";
    if (state === "restored") { raw.guide = ["Check the exact phone model before choosing."]; raw.faq = []; }
    const original = structuredClone(raw);
    const page = buildSearchPages([raw], 1).pages[0];
    await writePrebuiltPages({ searchPages: [page], categoryPages: [], popularSearches: { pages: [], moreSearches: [], categories: [] } }, folder);
    const html = readFileSync(join(folder, "shop/s/phone-cases.html"), "utf8");
    const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
    assert.doesNotMatch(html, /ESR|HaloLock|\$23|\$69/);
    assert.equal(buildSearchPageSeo(published).noindex, empty);
    assert.ok(html.includes(`name="robots" content="${empty ? "noindex, nofollow" : "index, follow, max-image-preview:large"}"`));
    const sitemap = buildShopNobiSitemap([], [page], [], "2026-10-27");
    const llms = appendLlmsTxtSection("Original text", [page]);
    assert.equal(sitemap.includes("/phone-cases"), !empty);
    assert.equal(llms.includes("/phone-cases"), !empty);
    if (empty) {
      assert.match(published.description, /No product listings/);
      assert.equal(published.faq.length, 0);
      assert.ok(!readScriptJson(html, "page-schema").some(entry => entry["@type"] === "FAQPage"));
    } else if (state === "partial" || state === "upstream") {
      assert.match(published.guide[0], /\$48\.00 \(USD\)/);
      assert.equal(published.faq.length, 0);
    } else assert.deepEqual(published.guide, raw.guide);
    assert.deepEqual(raw, original);
    assert.deepEqual(published.products, page.products);
  }
});

test("all guide positions and FAQs lose fixed assertions while preserving measurements and search instructions", () => {
  const page = buildSearchPages([{ ...sourcePage(), products: [readFixturePageData().pages[0].products[0]] }], 1).pages[0];
  page.guide = ["These 20 displayed boots range from $8.90 to $1,460. Check the 30-inch shaft.",
    "H. Lorenzo lists the lace-up at $840. Check the closure.",
    "Models under $200 include the sandal. Enter a search such as boots under $100."];
  page.faq = [{ question: "What do they cost?", answer: "Prices start at $8.90." },
    { question: "What currency?", answer: "These prices are in USD because no symbol appears." },
    { question: "What length?", answer: "Check the 30-inch measurement." }];
  const original = structuredClone(page);
  const result = withAuthoredSearchPageCopy(page);
  assert.doesNotMatch(result.guide.join(" "), /20 displayed|\$8\.90|\$1,460|\$840|H\. $|Models under/);
  assert.ok(result.guide.includes("Check the 30-inch shaft."));
  assert.ok(result.guide.includes("Check the closure."));
  assert.ok(result.guide.includes("Enter a search such as boots under $100."));
  assert.deepEqual(result.faq, [page.faq[2]]);
  assert.deepEqual(page, original);
  assert.deepEqual(withPublicationQuality(result), result, "Repeated publication does not add repeated summaries");
});

test("catalog summaries never mix currencies, missing prices or invalid amounts into a range", () => {
  for (const products of [[], [{ price: -1, currency: "USD" }], [{ price: 5 }],
    [{ price: 10, currency: "USD" }, { price: 20, currency: "EUR" }]]) {
    assert.match(catalogPriceSummary(products), /^Check each product card/);
  }
  assert.match(catalogPriceSummary([{ price: 5, currency: "EUR" }, { price: 10, currency: "EUR" }, { price: null }]), /2 displayed.*€5.00 to €10.00 \(EUR\)/);
});

test("empty reviewed pages cannot resurrect inventory claims, while their populated guidance returns", () => {
  const source = sourcePage();
  source.slug = "pencil-skirts";
  source.title = "Best Pencil Skirts from Top Stores";
  assert.equal(withAuthoredSearchPageCopy(buildSearchPages([source], 1).pages[0]).faq.length, 0);
  source.products = [readFixturePageData().pages[0].products[0]];
  assert.equal(withAuthoredSearchPageCopy(buildSearchPages([source], 1).pages[0]).faq.length, 4);
});

test("the observed boot comparison no longer advertises an absent named item", () => {
  const page = buildSearchPages([{ ...sourcePage(), products: [readFixturePageData().pages[0].products[0]] }], 1).pages[0];
  page.guide = [];
  page.faq = [{ question: "Which shape?", answer: "The listings include Elle Leather Ankle Boots, Ducati high boots, lace-ups, back-zip boots and an ankle wedge. Check the shaft height." }];
  assert.doesNotMatch(withPublicationQuality(page).faq[0].answer, /Elle/);
});


test("weight units remain guidance while explicit sterling amounts are replaced", () => {
  const page = buildSearchPages([{ ...sourcePage(), products: [readFixturePageData().pages[0].products[0]] }], 1).pages[0];
  page.guide = ["This suitcase weighs 8 pounds. Check the wheel diameter.", "This case is listed at £80. Check the dimensions."];
  page.faq = [{ question: "What is its capacity?", answer: "The stated limit is 10 to 20 pounds." }];
  const result = withPublicationQuality(page);
  assert.ok(result.guide.includes(page.guide[0]));
  assert.deepEqual(result.faq, page.faq);
  assert.doesNotMatch(result.guide.join(" "), /£80/);
});

/** A generic publication fixture with the retained complete care pair and an unrelated FAQ. */
function suedePage(pair = SuedeCarePairs[0]) {
  const raw = { ...readFixturePageData().pages[0], slug: pair.slug,
    title: "Best Suede Accessories from Top Stores",
    products: [readFixturePageData().pages[0].products[0]], guide: ["Compare the closure and listed measurements."],
    faq: [{ question: pair.question, answer: pair.answer },
      { question: "Which size should I choose?", answer: "Compare your measurements with the maker’s size guide for the exact model." }] };
  return buildSearchPages([raw], 1).pages[0];
}

test("all reviewed suede-care pairs publish consistently without changing other content or repeated publication", async t => {
  const folder = mkdtempSync(new URL("../node_modules/.suede-publication-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const pages = SuedeCarePairs.map(suedePage);
  const originals = structuredClone(pages);
  await writePrebuiltPages({ searchPages: pages, categoryPages: [], popularSearches: { pages: [], moreSearches: [], categories: [] } }, folder);
  for (const [index, page] of pages.entries()) {
    const published = withAuthoredSearchPageCopy(page);
    const untouched = withAuthoredSearchPageCopy({ ...page, faq: [page.faq[1]] });
    assert.equal(published.faq[0].answer, ReviewedSuedeAnswer, page.slug);
    assert.deepEqual({ ...published, faq: [published.faq[1]] }, untouched, `${page.slug}: only matching answer changes`);
    assert.deepEqual(withAuthoredSearchPageCopy(published), published, `${page.slug}: idempotent`);
    const html = readFileSync(join(folder, `shop/s/${page.slug}.html`), "utf8");
    assert.ok(readBody(html).includes(ReviewedSuedeAnswer), `${page.slug}: visible answer`);
    assert.ok(!html.includes(SuedeCarePairs[index].answer), `${page.slug}: obsolete answer absent`);
    assert.deepEqual(readScriptJson(html, "shop-nobi-prebuilt-content").data, published);
    const schema = readScriptJson(html, "page-schema").find(entry => entry["@type"] === "FAQPage");
    assert.deepEqual(schema.mainEntity.map(entry => ({ question: entry.name, answer: entry.acceptedAnswer.text })), published.faq);
  }
  assert.deepEqual(pages, originals, "Input source records are unchanged");
});

test("care correction preserves unfamiliar or authored copy and retains empty or filtered suppression", () => {
  const base = suedePage();
  const faq = base.faq[0];
  const negatives = [
    { label: "another question", faq: [{ ...faq, question: "What did the manufacturer recommend?" }] },
    { label: "extended answer", faq: [{ ...faq, answer: `${faq.answer} Only where the maker permits it.` }] },
    { label: "qualified answer", faq: [{ ...faq, answer: "Check the manufacturer’s directions before using any protective spray." }] },
    { label: "quoted maker advice", faq: [{ ...faq, answer: `The maker says: “${faq.answer}”` }] },
    { label: "custom title", title: "Suede accessories and care", faq: [faq] },
    { label: "cited source", guideSources: [{ label: "Maker care guide", url: "https://example.com/care" }], faq: [faq] },
  ];
  for (const { label, ...change } of negatives) {
    const page = { ...base, ...change };
    assert.deepEqual(withAuthoredSearchPageCopy(page).faq, page.faq, label);
  }
  const authored = { ...base, slug: "beige-shoulder-bags" };
  assert.deepEqual(withAuthoredSearchPageCopy(authored), withAuthoredSearchPageCopy({ ...authored, faq: [] }), "Reviewed page copy takes precedence over source pairs");
  for (const change of [{ products: [] }, { publicationFilteredProducts: true }]) {
    const published = withAuthoredSearchPageCopy({ ...base, ...change });
    assert.deepEqual(published.faq, []);
    assert.ok(!published.guide.join(" ").includes(ReviewedSuedeAnswer));
  }
});
