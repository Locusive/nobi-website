import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { MindTheColorOffer, MindTheColorSeo, MindTheColorSources } from "../src/content/mindTheColor.js";

const Dist = new URL("../dist/", import.meta.url);
const readPage = () => readFileSync(new URL("tools/mindthecolor-fit.html", Dist), "utf8");

test("static software page retains source currency, install/license limits and disclosure without JavaScript", () => {
  const html = readPage();
  for (const fact of ["€179 + VAT", "October 17, 2026", "Adobe Photoshop is a separate purchase or subscription", "Photoshop 26+", ".ccx", "Internet at every launch", "offline use for that Photoshop session", "same Adobe account", "shared team access", "AI/ML", "Sales are final except", "We have not installed or tested", "Your answers stay here", "We may earn a commission from qualifying purchases", "JavaScript", "Start with your setup"]) assert.ok(html.includes(fact), `Missing ${fact}`);
  for (const source of Object.values(MindTheColorSources)) assert.ok(html.includes(source.url));
  assert.ok(html.includes(MindTheColorOffer.url.replaceAll("&", "&amp;")));
  assert.equal((html.match(/rel="sponsored nofollow noopener"/g) || []).length, 1);
  assert.ok(!html.includes("a=480165219"), "Affiliate parameter stays out of crawler HTML");
  assert.ok(!html.includes("$201.12") && !html.includes('"priceCurrency":"USD"'));
  assert.ok(!html.includes('"@type":"Product"') && !html.includes('"@type":"Review"'));
  assert.equal((html.match(/<select\b/g) || []).length, 6);
});

test("both URL forms have original assets, one canonical and sitemap discovery", () => {
  const html = readPage();
  assert.equal(html, readFileSync(new URL("tools/mindthecolor-fit/index.html", Dist), "utf8"));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`<title>${MindTheColorSeo.title.replaceAll("&", "&amp;")}</title>`));
  assert.ok(html.includes('href="https://nobi.ai/tools/mindthecolor-fit"'));
  assert.ok(readFileSync(new URL("sitemap-pages.xml", Dist), "utf8").includes("<loc>https://nobi.ai/tools/mindthecolor-fit</loc>"));
  const revisions = JSON.parse(readFileSync(new URL("utility-revisions.json", Dist), "utf8"));
  assert.match(revisions.revisions["https://nobi.ai/tools/mindthecolor-fit"], /^[a-f0-9]{64}$/);
  for (const path of ["/shop", "/privacy", "/terms"]) assert.ok(html.includes(`href="${path}"`));
  const image = readFileSync(new URL("media/mindthecolor-requirements.png", Dist));
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 800);
});
