import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

const Dist = new URL("../dist/", import.meta.url);

/** Read the published HTML without relying on client-side JavaScript. */
function readPage(path) {
  return readFileSync(new URL(path, Dist), "utf8");
}

test("Shop Nobi offers direct company and privacy links below its shopping content", () => {
  const search = readdirSync(new URL("shop/s/", Dist)).find(name => name.endsWith(".html"));
  const category = readdirSync(new URL("shop/c/", Dist)).find(name => name.endsWith(".html"));
  assert.ok(search && category, "Search and category pages must be built");
  for (const path of ["shop.html", `shop/s/${search}`, `shop/c/${category}`]) {
    const html = readPage(path);
    const footer = html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0];
    assert.ok(footer, `Missing footer on ${path}`);
    assert.match(footer, /<a href="\/about"[^>]*>About Us<\/a>/);
    assert.match(footer, /<a href="\/privacy"[^>]*>Privacy Policy<\/a>/);
  }
});

test("the About page explains the operator, purchases and affiliate support and links back to shopping", () => {
  const html = readPage("about.html");
  for (const text of ["About Shop Nobi", "Locusive, Inc.", "You buy directly from", "affiliate links", "may earn a commission"]) {
    assert.ok(html.includes(text), `Missing About information: ${text}`);
  }
  assert.match(html, /<a href="\/shop"[^>]*>Back to Shop Nobi<\/a>/);
  assert.match(html, /<a href="\/privacy"[^>]*>Privacy Policy<\/a>/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes('rel="canonical" href="https://nobi.ai/about"'));
  assert.ok(html.includes("<title>About Shop Nobi | Nobi</title>"));
  assert.equal(html, readPage("about/index.html"));
  assert.ok(readPage("sitemap-pages.xml").includes("<loc>https://nobi.ai/about</loc>"));
});
