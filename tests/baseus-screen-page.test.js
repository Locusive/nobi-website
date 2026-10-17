import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { BaseusScreenProducts, BaseusScreenSeo, BaseusScreenSources, validateBaseusScreenLink } from "../src/content/baseusScreens.js";
import { BaseusScreenLinkArtifact } from "../src/content/baseusScreenLinks.js";

const Dist = new URL("../dist/", import.meta.url);
const readPage = () => readFileSync(new URL("tools/baseus-two-screens.html", Dist), "utf8");

test("the built utility gives its source limits, unknown path and disclosures without running JavaScript", () => {
  const html = readPage();
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const fact of ["Two monitors.", "Two different screens?", "Compare these docks", "October 17, 2026", "DisplayLink", "DP1.4", "DSC", "1440p60", "90W", "75W", "160W", "Needs checking", "not hands-on testing", "not physically tested", "built-in", "Enable JavaScript"]) {
    assert.ok(html.includes(fact), `Missing ${fact}`);
  }
  assert.ok(html.includes("Neither is a fit?"));
  assert.ok(html.includes('value="video-only"'));
  assert.ok(html.includes("Data and DP Alt Mode, but no laptop charging"));
  assert.ok(html.includes("No data or no DP Alt Mode"));
  assert.ok(html.includes("This link does not mean the dock fits your answers."));
  assert.ok(html.includes("We may earn a commission from qualifying purchases through these links."));
  assert.ok(html.includes("its PDF CDN could not be read"));
  assert.ok(html.includes("Broad “dual 4K” marketing conflicts"));
  assert.ok(!html.includes('"@type":"Product"'), "No invented test or Product review schema");
  for (const source of Object.values(BaseusScreenSources)) assert.ok(html.includes(source.url.replaceAll("&", "&amp;")));
});

test("initial product links retain exact reviewed variants and plain merchant destinations", () => {
  const html = readPage();
  for (const product of BaseusScreenProducts) {
    assert.ok(html.includes(product.url.replaceAll("&", "&amp;")));
    assert.ok(html.includes(`$${product.price.toFixed(2)}`));
    assert.ok(html.includes(product.model));
  }
  assert.equal((html.match(/rel="sponsored nofollow noopener"/g) || []).length, 2);
  assert.ok(!html.includes("https://www.awin1.com/"));
  assert.ok(!html.includes("RD1$189.99") && !html.includes("coupon"));
});

test("page registration provides both static URL forms, one canonical, navigation and sitemap", () => {
  const html = readPage();
  assert.equal(html, readFileSync(new URL("tools/baseus-two-screens/index.html", Dist), "utf8"));
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes('href="https://nobi.ai/tools/baseus-two-screens"'));
  assert.ok(html.includes(`<title>${BaseusScreenSeo.title}</title>`));
  for (const path of ["/shop", "/privacy", "/terms"]) assert.ok(html.includes(`href="${path}"`));
  assert.ok(existsSync(new URL("media/baseus-independent-screens.svg", Dist)));
  const png = readFileSync(new URL("media/baseus-independent-screens.png", Dist));
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 800);
  assert.ok(html.includes('property="og:image" content="https://nobi.ai/media/baseus-independent-screens.png"'));
  assert.ok(readFileSync(new URL("sitemap-pages.xml", Dist), "utf8").includes("<loc>https://nobi.ai/tools/baseus-two-screens</loc>"));
});

test("publication rejects incomplete or substituted authored link records", () => {
  for (const record of BaseusScreenLinkArtifact.products) {
    assert.equal(validateBaseusScreenLink(record), record);
    for (const paid of [record.paid.replace("clickref=shop_nobi&", ""),
      record.paid.replace("clickref=shop_nobi", "clickref=stale"),
      record.paid.replace("clickref=shop_nobi", "clickref=%73hop_nobi"), `${record.paid}&clickref=stale`]) {
      assert.throws(() => validateBaseusScreenLink({ ...record, paid }), "The raw replaceable visit-reference slot must be exact and unambiguous");
    }
    const reviewedPeer = BaseusScreenLinkArtifact.products.find(product => product.id !== record.id);
    for (const changes of [{ productId: reviewedPeer.productId }, { productVariantId: reviewedPeer.productVariantId },
      { owningMerchantId: reviewedPeer.productId }, { id: reviewedPeer.id },
      { productVariantInternalId: reviewedPeer.productVariantInternalId },
      { sourceUrl: reviewedPeer.sourceUrl, plain: reviewedPeer.plain, paid: reviewedPeer.paid }]) {
      assert.throws(() => validateBaseusScreenLink({ ...record, ...changes }), "A valid-shaped different identity must not be accepted");
    }

    for (const changes of [{ productVariantId: "" }, { owningMerchantId: null }, { paidLink: false }, { id: "invented-model" }, { id: "__proto__" }, { id: "toString" },
      { plain: record.plain.replace("https:", "http:") }, { paid: record.paid.replace("awinmid=38962", "awinmid=1") },
      { paid: record.paid.replace("ued=", "missing=") }, { sourceUrl: record.sourceUrl.replace("variant=", "not-variant=") }]) {
      assert.throws(() => validateBaseusScreenLink({ ...record, ...changes }));
    }
  }
});
