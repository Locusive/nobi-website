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
  "pencil-cases": ["interior", "closure", "100 pens"],
  "mens-red-coats-and-jackets": ["lining", "hood", "layers"],
  "red-shoulder-bags": ["strap drop", "convertible", "hardware"],
  "black-office-furniture": ["headrest", "warranty", "worktop"],
  "womens-blue-athletic-shorts": ["measurement", "liner", "two-pack"],
  "navy-handbags": ["wristlet", "compartment", "strap"],
  "shell-jewelry": ["motif", "composition", "pair"],
  "black-leather-handbags": ["lining", "handle drop", "finish"],
  "black-shopping-totes": ["packable", "leather-look", "sisal"],
  "black-bed-sheets": ["pocket depth", "pillowcase", "stitch"],
  "gray-crossbody-bags": ["3l", "waxed", "closure"],
  "kids-pink-baby-dresses": ["babydoll", "age", "bodysuit"],
  "office-floor-mats": ["desktop", "footrest", "chair wheels"],
  "leather-lifestyle-sneakers": ["retailer", "size", "upper"],
  "espresso-kitchen-appliance-accessories": ["dose", "adapter", "model"],
  "mens-black-sunglasses": ["bridge", "polarization", "specification"],
  "baby-stroller-accessories": ["folded dimensions", "attachment", "load"],
  "water-tables": ["furniture", "basin", "package"],
  "rice-cookers": ["refurbished", "uncooked", "model"],
  "red-wallets": ["card pockets", "bill", "variant"],
  "beige-shoulder-bags": ["strap drop", "lining", "finish"],
  "mens-black-sweatpants": ["inseam", "waistband", "detergent"],
  "womens-white-sweatpants": ["brand", "inseam", "waistband"],
  "sterling-silver-bracelets": ["length", "finish", "charm"],
  "pearl-rings": ["mother-of-pearl", "size", "stack"],
  "mens-parkas": ["insulation", "shell", "layers"],
  "mens-blue-t-shirts": ["neckline", "composition", "shade"],
  "suitcases": ["dimensions", "expanded", "front-pocket"],
  "hunting-shooting-jackets": ["intended", "lining", "reversible"],
  "14k-yellow-gold-huggie-earrings": ["inner diameter", "quantity", "hinge"],
  "ruby-rings": ["origin", "resizing", "treatment"],
  "ruby-earrings": ["color", "pair", "closure"],
  "earplugs": ["attenuation", "replacement", "bundle"],
  "electric-massagers": ["eye", "attachment", "power"],
  "beige-electric-guitars": ["finish", "condition", "pickup"],
  "brown-electric-guitars": ["mahogany", "construction", "finish"],
  "bicycle-chains": ["lock", "connector", "length"],
  "bicycle-hubs": ["front", "spoke-hole", "dynamo"],
  "bicycle-shifters": ["friction", "brake", "side"],
  "snowboard-binding-parts": ["re:flex", "step on", "quantity"],
  "tent-footprints": ["bundle", "version", "coverage"],
  "camping-lanterns": ["candle", "runtime", "conditions"],

  "mens-leather-sneakers-athletic-shoes": ["activity", "upper", "width"],
  "tan-clothing": ["game bag", "lining", "finish"],
  "pearl-shirts-and-tops": ["color", "snap", "trim"],
  "kids-diamond-necklaces": ["age", "chain", "stone"],
  "yellow-bracelets": ["ceramic", "closure", "color"],
  "black-undershirts": ["pack", "neckline", "wool"],
  "blue-navy-sandals": ["heel", "strap", "finish"],
  "outdoor-storage-boxes": ["replacement lid", "internal dimensions", "seating"],
  "vanilla-perfume-cologne": ["format", "volume", "application"],
  "linen-sheet-sets": ["pocket depth", "pillowcase", "blend"],
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

/** Exercise exact model gates on an already-published page so stale derived facts cannot survive. */
function checkWalletIdentityGates(page, published) {
  const names = ["Bosca Monfrini ITALIA Slim 8-Slot Men's Pocket Wallet", "Ermenegildo Zegna Printed Calfskin Leather Zip Around Wallet", "The Sak Iris Wallet"];
  assert.equal(published.comparison.rows.length, 3);
  assert.equal(published.guideSources.length, 4);
  assert.match(published.comparison.rows[0].setup, /8 card pockets/);
  assert.match(published.comparison.rows[1].setup, /does not disclose a count/);
  assert.match(published.comparison.rows[2].setup, /4 card pockets/);
  assert.match(published.comparison.note, /not a verified red variant/);
  for (const [index, name] of names.entries()) {
    for (const field of ["removed", "name", "brand", "productVariantId", "owningMerchantId", "url", "variant query"]) {
      const changed = structuredClone(published);
      const product = changed.products.find(item => item.name === name);
      if (field === "removed") changed.products = changed.products.filter(item => item !== product);
      else if (field === "variant query") product.url = product.url.replace(/variant=\d+/, "variant=999");
      else product[field] += "-changed";
      const result = withAuthoredSearchPageCopy(changed);
      assert.deepEqual(result.comparison.rows, published.comparison.rows.filter((_, row) => row !== index), `${name}: ${field}`);
      const excluded = index === 0 ? [0, 1] : [index + 1];
      assert.deepEqual(result.guideSources, published.guideSources.filter((_, source) => !excluded.includes(source)));
      assert.strictEqual(result.products, changed.products);
    }
  }
  checkWalletRefreshStates(page, published, names);
}

/** Model facts ignore price/stock updates, deduplicate references, and disappear with their listings. */
function checkWalletRefreshStates(page, published, names) {
  const duplicate = { ...page, products: [...page.products, page.products.find(product => product.name === names[0])] };
  const result = withAuthoredSearchPageCopy(duplicate);
  assert.deepEqual(result.comparison, published.comparison);
  assert.deepEqual(result.guideSources, published.guideSources);
  assert.strictEqual(result.products, duplicate.products);
  const refreshed = structuredClone(page);
  refreshed.products.forEach(product => { product.price += 1; product.isInStock = false; });
  assert.deepEqual(withAuthoredSearchPageCopy(refreshed).comparison, published.comparison);
  for (const products of [[], published.products.filter(product => !names.includes(product.name))]) {
    const withoutModels = withAuthoredSearchPageCopy({ ...published, products });
    assert.equal(withoutModels.comparison, undefined);
    assert.equal(withoutModels.guideSources?.length ?? 0, 0);
    assert.strictEqual(withoutModels.products, products);
  }
}

/** Shopping answers follow displayed records across removals and renamed models or retailers. */
function checkRetailerExamples(page, published) {
  const first = "Double L Lace Up Sneakers at Lucchese";
  const second = "Leather Lace-Up Sneakers at UNTUCKit";
  const third = "VEJA Women's V-90 Leather Sneaker at Saint Bernard";
  assert.ok(published.guide[0].includes(`${first}; ${second}; ${third}.`));
  assert.ok(!published.guide[0].includes("Scotch and Soda"), "At most three distinct retailers are introduced");
  const renamed = structuredClone(page.products[0]);
  renamed.name = 'New <Model> & Style';
  renamed.storeName = 'Updated & Store';
  const cases = [
    { products: page.products.slice(1), present: ["Double L lace Up Sneaker at Lucchese", second, third], absent: [first] },
    { products: page.products.filter(product => product.storeName !== "Lucchese"), present: [second, third, "Plakka Leather Sneakers at Scotch and Soda"], absent: [first, "Lucchese"] },
    { products: [renamed], present: ['New <Model> & Style at Updated & Store'], absent: [first, second, third] },
    { products: [page.products[2], page.products[3]], present: [second], absent: [first, third, "Contrast Leather Lace-Up Sneakers"] },
  ];
  for (const { products, present, absent } of cases) {
    const source = { ...published, products };
    const snapshot = structuredClone(source);
    const result = withAuthoredSearchPageCopy(source);
    for (const text of present) assert.ok(result.guide[0].includes(text), text);
    for (const text of absent) assert.ok(!JSON.stringify([result.guide, result.faq]).includes(text), text);
    assert.equal(result.faq[0].answer, result.guide[0]);
    assert.strictEqual(result.products, products);
    assert.deepEqual(source, snapshot);
  }
}

test("audited page corrections remove the identified claims and preserve every retained shopping record", () => {
  assert.equal(Fixture.pages.length, 62);
  assert.equal(Fixture.pages.reduce((sum, page) => sum + page.products.length, 0), 1024);
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
    if (page.slug === "red-wallets") checkWalletIdentityGates(page, published);
    if (page.slug === "leather-lifestyle-sneakers") checkRetailerExamples(page, published);
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
  const pages = buildSearchPages(Fixture.pages, Fixture.pages.length).pages;
  assert.equal(pages.length, Fixture.pages.length);
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
    if (page.slug === "red-wallets") {
      assert.equal(published.comparison.rows.length, 3);
      assert.ok(body.includes('<table') && body.includes('role="region"'));
      for (const row of published.comparison.rows) for (const value of Object.values(row)) assert.ok(body.includes(htmlEscape(value)), value);
      for (const source of published.guideSources) assert.ok(body.includes(`href="${htmlEscape(source.url)}" target="_blank" rel="noopener noreferrer nofollow"`));
    }
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
    const pages = buildSearchPages(sources, sources.length).pages;
    assert.equal(pages.length, Fixture.pages.length);
    await writePrebuiltPages({ searchPages: pages, categoryPages: [], popularSearches: buildPopularSearches(pages, []) }, folder);
    for (const page of pages) {
      const html = readFileSync(join(folder, `shop/s/${page.slug}.html`), "utf8");
      const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
      assert.equal(published.comparison, undefined, `${mode}: no stale comparison`);
      assert.equal(published.guideSources?.length ?? 0, 0, `${mode}: no stale references`);
      assert.deepEqual(published.faq, [], `${mode}: ${page.slug}`);
      assert.ok(!readScriptJson(html, "page-schema").some(entry => entry["@type"] === "FAQPage"));
      assert.deepEqual(published.products, page.products);
      const original = withAuthoredSearchPageCopy(normalize(Fixture.pages.find(source => source.slug === page.slug)));
      for (const paragraph of original.guide) assert.ok(!published.guide.includes(paragraph), `${mode}: withheld ${page.slug} authored guidance`);
    }
  }
});
