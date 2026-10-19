import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { htmlEscape, readMeta } from "../scripts/prerender-blog.js";

const Slug = "gifts-for-someone-who-wants-nothing";
const Canonical = `https://nobi.ai/blog/${Slug}`;
const Source = new URL(`../src/content/posts/2026-10-19_${Slug}.mdx`, import.meta.url);
const Output = new URL(`../dist/blog/${Slug}.html`, import.meta.url);

/** Read the actual normally built article, including its static crawler content. */
function readArticle() {
  return readFileSync(Output, "utf8");
}

test("gift guide serves its own article and matching visible FAQ schema on both URL forms", () => {
  const html = readArticle();
  const metadata = readMeta(Source.pathname);
  const schema = JSON.parse(html.match(/id="page-schema">([\s\S]*?)<\/script>/)[1]);
  const article = schema.find(entry => entry["@type"] === "Article");
  const faq = schema.find(entry => entry["@type"] === "FAQPage");

  assert.equal(html, readFileSync(new URL(`../dist/blog/${Slug}/index.html`, import.meta.url), "utf8"));
  assert.ok(html.includes(`<title>${htmlEscape(metadata.title)} | Nobi</title>`));
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`rel="canonical" href="${Canonical}"`));
  assert.equal(article.headline, metadata.title);
  assert.equal(article.mainEntityOfPage["@id"], Canonical);
  assert.equal(faq.mainEntity.length, 4);
  for (const question of faq.mainEntity) {
    assert.ok(html.includes(`<h3>${htmlEscape(question.name)}</h3>`));
    assert.ok(html.includes(htmlEscape(question.acceptedAnswer.text)));
  }
});

test("gift guide renders five distinct decisions with fit limits and honest source depth", () => {
  const html = readArticle();
  for (const decision of [
    "1. A small amount of something they already enjoy",
    "2. A replacement for one everyday nuisance",
    "3. Supplies for a hobby they already have",
    "4. A gift card with a specific purpose",
    "5. Time together, with the arranging already done",
  ]) assert.ok(html.includes(`<h2>${decision}</h2>`), `Missing actual decision: ${decision}`);
  assert.equal((html.match(/<strong>Choose this when:<\/strong>/g) || []).length, 5);
  assert.equal((html.match(/<strong>Skip it when:<\/strong>/g) || []).length, 5);
  assert.ok(html.includes("current coffee stock and delivery were not independently reconfirmed"));
  assert.ok(html.includes("We have not tested these products hands-on"));
  assert.ok(html.includes("Shop Nobi may earn a commission"));
  assert.ok(html.includes("A product page or a general shipping estimate does not guarantee arrival"));
  assert.ok(!html.includes("Giftcards.com"));
});

test("gift guide publishes working source and shopping links without an invented automatic search", () => {
  const html = readArticle();
  for (const href of [
    "/shop/s/instant-coffee",
    "/shop/s/black-chargers",
    "/shop/s/silver-paint-brushes",
    "/shop",
    "https://www.baseus.com/products/enerfill-fe11-3-port-usb-c-fast-charger-100w",
  ]) assert.ok(html.includes(`href="${href}"`), `Missing actual link: ${href}`);
  assert.ok(!html.includes("&lt;a href="), "Raw JSX anchors must not become literal crawler text");
  const sitemap = readFileSync(new URL("../dist/sitemap-pages.xml", import.meta.url), "utf8");
  assert.ok(sitemap.includes(`<loc>${Canonical}</loc>`));
  const markdown = readFileSync(new URL(`../dist/blog/${Slug}.md`, import.meta.url), "utf8");
  assert.ok(markdown.includes(`_Source: ${Canonical}_`));
  assert.equal(markdown.split("### What should I give someone who says they want nothing?").length - 1, 1);
});
