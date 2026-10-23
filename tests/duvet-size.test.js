import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { addDuvetCover, compareDuvetDimensions, describeDuvetDifference, emptyDuvetInput } from "../src/utils/duvetSize.js";
import { createDuvetCompletionReporter, duvetShoppingPath } from "../src/utils/duvetMeasurement.js";
import { makeBrowser } from "./fixtures/shop-nobi-click-browser.js";
import { loadPageRenderer } from "../scripts/page-renderer.js";
import { PrebuiltContentKind } from "../src/utils/shopNobiPrebuiltContent.js";

const row = (width, length, unit = "in", basis = "listing") => ({ width, length, unit, basis });
const input = (cover = row("90", "94"), insert = row("90", "94")) => ({ insert, covers: [{ id: "A", ...cover }] });
const compare = (cover, insert) => compareDuvetDimensions(input(cover, insert));

test("compares axes independently without area, tolerance or automatic rotation", () => {
  const cases = [
    [row("90", "94"), "same", 0, 0],
    [row("92", "96"), "cover-larger", 50800, 50800],
    [row("88", "90"), "insert-larger", -50800, -101600],
    [row("92", "92"), "mixed", 50800, -50800],
    [row("94", "90"), "mixed", 101600, -101600],
  ];
  for (const [cover, state, width, length] of cases) {
    const result = compare(cover).comparisons[0];
    assert.deepEqual([result.state, result.width, result.length], [state, width, length]);
  }
  assert.equal(compare(row("94", "90")).comparisons[0].swapped, true);
  assert.equal(compare(row("100", "80"), row("80", "100")).comparisons[0].state, "mixed");
});
test("exact inch conversion preserves true equality and tiny nonzero directions", () => {
  assert.equal(compare(row("228.6", "238.76", "cm")).comparisons[0].state, "same");
  const tiny = compare(row("228.61", "238.76", "cm"), row("228.60", "238.76", "cm")).comparisons[0];
  assert.equal(tiny.width, 100); assert.equal(tiny.state, "cover-larger");
  assert.equal(describeDuvetDifference(tiny.width, "width", "cm"), "Cover is less than 0.1 cm wider");
  assert.equal(describeDuvetDifference(-100, "length", "in"), "Cover is less than 0.1 in shorter");
  assert.equal(describeDuvetDifference(0, "length", "cm"), "Same entered length");
});
test("unknown provenance retains arithmetic with a visible unconfirmed state", () => {
  assert.equal(compare(row("90", "92", "in", "unknown")).comparisons[0].unconfirmed, true);
  assert.equal(compare(row("90", "92")).comparisons[0].unconfirmed, false);
  const result = compare(row("90", "92"));
  assert.equal(result.comparisons[0].length, -50800);
});
test("every active optional cover is validated and fixed candidate order is preserved", () => {
  const base = input();
  base.covers = addDuvetCover(addDuvetCover(base.covers));
  assert.deepEqual(base.covers.map(cover => cover.id), ["A", "B", "C"]);
  const incomplete = compareDuvetDimensions(base);
  assert.ok(incomplete.errors["B.unit"]); assert.ok(incomplete.errors["C.unit"]);
  base.covers[1] = { id: "B", ...row("92", "96") };
  base.covers[2] = { id: "C", ...row("92", "92") };
  assert.deepEqual(compareDuvetDimensions(base).comparisons.map(cover => cover.state), ["same", "cover-larger", "mixed"]);
  assert.equal(addDuvetCover(base.covers), base.covers);
  const readded = addDuvetCover(base.covers.filter(cover => cover.id !== "B"));
  assert.deepEqual(readded.map(cover => cover.id), ["A", "B", "C"]);
  assert.equal(readded[2].width, "92");
});
test("positive bounded decimal dimensions, explicit units and basis are required", () => {
  assert.ok(Object.keys(compareDuvetDimensions(emptyDuvetInput()).errors).length > 0);
  for (const invalid of ["", "0", "-1", "Infinity", "NaN", "1e2", "90½", "1.234", "1000000", null]) {
    assert.ok(compare(row(invalid, "94")).errors["A.width"], String(invalid));
  }
  assert.ok(compare(row("90", "94", "mm")).errors["A.unit"]);
  assert.ok(compare(row("90", "94", "in", "guessed")).errors["A.basis"]);
  assert.equal(compare(row("999999.99", "999999.99", "cm")).errors["A.width"], undefined);
  const partial = input(); partial.covers.push({ id: "B", ...row("80", "") });
  assert.ok(compareDuvetDimensions(partial).errors["B.length"]);
});
test("one blank-form submission exposes every required field independently of unit selection", () => {
  const errors = compareDuvetDimensions(emptyDuvetInput()).errors;
  assert.deepEqual(Object.keys(errors), ["insert.width", "insert.length", "insert.unit", "insert.basis", "A.width", "A.length", "A.unit", "A.basis"]);
  const missingUnit = compare(row("90", "94", "")).errors;
  assert.ok(missingUnit["A.unit"]);
  assert.equal(missingUnit["A.width"], undefined);
  assert.equal(missingUnit["A.length"], undefined);
});
test("completion counts real production once and excludes invalid, preview, explicit QA and automated visits", () => {
  const browser = makeBrowser({ pageUrl: "https://nobi.ai/tools/duvet-cover-size?utm_source=google" });
  const record = createDuvetCompletionReporter(browser);
  record({ errors: { width: "missing" } }); assert.equal(browser.beacons.length, 0);
  const result = compare(row("90", "94")); record(result); record(result);
  assert.equal(browser.beacons.length, 1);
  const event = browser.beacons[0].event;
  assert.equal(event.name, "Shopper Utility Completed");
  assert.equal(event.details.toolId, "duvet_cover_size"); assert.equal(event.details.action, "compare_dimensions");
  assert.ok(!JSON.stringify(event).includes('"width"'));
  assert.ok(!JSON.stringify(event).includes('"comparisons"'));
  for (const options of [
    { pageUrl: "http://127.0.0.1/tools/duvet-cover-size" },
    { pageUrl: "https://6d59bd66.nobi-website.pages.dev/tools/duvet-cover-size" },
    { pageUrl: "https://feature-duvet-dimension-checker.nobi-website.pages.dev/tools/duvet-cover-size" },
    { pageUrl: "https://other.example/tools/duvet-cover-size" },
    { pageUrl: "http://nobi.ai/tools/duvet-cover-size" },
    { pageUrl: "https://nobi.ai/tools/duvet-cover-size?nobi_qa=1&utm_source=google" },
    { pageUrl: "https://www.nobi.ai/tools/duvet-cover-size?nobi_qa=1" },
    { pageUrl: "https://nobi.ai/tools/duvet-cover-size?nobi_qa=0&nobi_qa=1" },
    { userAgent: "Googlebot/2.1" }, { webdriver: true },
  ]) {
    const qa = makeBrowser(options); createDuvetCompletionReporter(qa)(result); assert.equal(qa.beacons.length, 0, JSON.stringify(options));
  }
  const www = makeBrowser({ pageUrl: "https://www.nobi.ai/tools/duvet-cover-size?nobi_qa=0" });
  createDuvetCompletionReporter(www)(result); assert.equal(www.beacons.length, 1);
});
test("internal handoff retains incoming acquisition tags and no measurement parameters", () => {
  const path = duvetShoppingPath('?utm_source=google&utm_medium=organic&width=90&result=same');
  const url = new URL(path, "https://nobi.ai");
  assert.equal(url.pathname, "/shop/s/duvet-covers");
  assert.deepEqual([...url.searchParams], [["nobi_tool", "duvet_cover_size"], ["utm_source", "google"], ["utm_medium", "organic"]]);
  assert.equal(duvetShoppingPath(), "/shop/s/duvet-covers?nobi_tool=duvet_cover_size");
});
test("static utility is useful without JavaScript and retains the authored canonical and sources", () => {
  for (const file of ["dist/tools/duvet-cover-size.html", "dist/tools/duvet-cover-size/index.html"]) {
    const html = readFileSync(file, "utf8");
    for (const text of ['href="https://nobi.ai/tools/duvet-cover-size"', 'Compare a duvet cover with your insert', 'name="insert.width"', 'name="A.unit"', 'Enable JavaScript for automatic comparison', 'without dimensions or result values', 'aria-live="polite"', '90 × 92 in', '90 × 94 in', 'not a universal US size table', 'https://parachutehome.com/pages/size-guide-cotton-duvet-cover-set']) assert.ok(html.includes(text), text);
  }
  assert.ok(readFileSync("public/sitemap-pages.xml", "utf8").includes('<loc>https://nobi.ai/tools/duvet-cover-size</loc>'));
});
test("only the exact duvet collection receives the new contextual discovery link", async () => {
  const { renderPrebuiltPageBody } = await loadPageRenderer();
  const fixture = JSON.parse(readFileSync("tests/fixtures/shop-nobi-pages.json", "utf8")).pages[0];
  for (const slug of ["duvet-covers", "black-leather-boots"]) {
    const body = renderPrebuiltPageBody({ kind: PrebuiltContentKind.SearchPage, path: `/shop/s/${slug}`, data: { ...fixture, slug, products: [], related: [] } });
    assert.equal(body.includes('href="/tools/duvet-cover-size"'), slug === "duvet-covers");
  }
});
