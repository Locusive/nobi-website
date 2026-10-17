import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { CoveCubbyProducts, CoveCubbySeo } from "../src/content/coveCubbyComparison.js";

const Dist = new URL("../dist/", import.meta.url);

/** Read the actual rendered page without running JavaScript, like a crawler or a disabled-script browser. */
function comparisonHtml() {
  return readFileSync(new URL("tools/cove-vs-cubby.html", Dist), "utf8");
}

test("the comparison serves facts, controls and source links in its initial HTML", () => {
  const html = comparisonHtml();
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes("Which fits your space?"));
  assert.ok(html.includes("October 16, 2026"));
  for (const product of CoveCubbyProducts) {
    assert.ok(html.includes(product.url.replaceAll("&", "&amp;")), `Missing exact ${product.name} purchase variant`);
    assert.ok(html.includes(`Check ${product.name} at Tuft &amp; Paw`));
    assert.ok(html.includes(`$${product.price}`));
    assert.ok(html.includes(`${product.width}″ wide × ${product.depth}″ deep`));
    assert.ok(html.includes(`${product.name} manufacturer specifications`));
    assert.ok(html.includes(product.sourceUrl), `Missing untagged ${product.name} source`);
  }
  for (const label of ["Available width", "Available depth", "Extra clearance on each side", "Compare footprints", "Try the 20 × 24 inch example"]) {
    assert.ok(html.includes(label), `Missing usable control: ${label}`);
  }
  assert.ok(html.includes("We may earn a commission from qualifying purchases through these links."));
  assert.equal((html.match(/rel="sponsored nofollow noopener"/g) || []).length, 2);
  assert.ok(!html.includes("https://www.awin1.com/"), "The initial HTML keeps plain store links");
  assert.ok(html.includes("zero extra clearance"));
  assert.ok(html.includes("Enable JavaScript to calculate a fit."));
  assert.ok(html.includes("we have not tested these litter boxes"));
  assert.ok(html.includes("Tuft &amp; Paw says the usable litter area is the same"));
  assert.ok(!html.includes("research draft") && !html.includes("UNPUBLISHED_"));
  assert.equal(html, readFileSync(new URL("tools/cove-vs-cubby/index.html", Dist), "utf8"));
});

test("the comparison has its canonical, source-derived preview, site navigation and sitemap entry", () => {
  const html = comparisonHtml();
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes('href="https://nobi.ai/tools/cove-vs-cubby"'));
  assert.ok(html.includes(`<title>${CoveCubbySeo.title.replaceAll("&", "&amp;")}</title>`));
  assert.ok(html.includes('property="og:image" content="https://nobi.ai/media/cove-cubby-01-common-scale.png"'));
  assert.ok(html.includes('name="twitter:image" content="https://nobi.ai/media/cove-cubby-01-common-scale.png"'));
  for (const path of ["/shop", "/privacy", "/terms"]) assert.ok(html.includes(`href="${path}"`));
  for (const asset of ["media/cove-cubby-footprints.svg", "media/cove-cubby-footprints.png"]) assert.ok(existsSync(new URL(asset, Dist)));
  for (const name of ["01-common-scale", "02-20-by-24-example", "03-exterior-vs-litter-area"]) {
    const png = readFileSync(new URL(`media/cove-cubby-${name}.png`, Dist));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), 1000);
    assert.equal(png.readUInt32BE(20), 1500);
  }
  assert.ok(readFileSync(new URL("sitemap-pages.xml", Dist), "utf8").includes("<loc>https://nobi.ai/tools/cove-vs-cubby</loc>"));
});
