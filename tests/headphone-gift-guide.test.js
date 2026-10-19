import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "vite";
import { htmlEscape, renderBodyHtml } from "../scripts/prerender-blog.js";

const Slug = "headphones-as-a-gift";
const Canonical = `https://nobi.ai/blog/${Slug}`;
const MdxPath = `/src/content/posts/2026-10-19_${Slug}.mdx`;
const readArticle = () => readFileSync(new URL(`../dist/blog/${Slug}/index.html`, import.meta.url), "utf8");

/** Reads the actual published shopping link and checks its assigned network and exact product destination. */
function checkAssignedCardLink(html) {
  const anchors = [...html.matchAll(/<a href="([^"]+)" rel="sponsored nofollow">See H6 Neo Black at QCY<\/a>/g)];
  assert.equal(anchors.length, 1, "The actual card must expose one qualified shopping link.");
  const link = new URL(anchors[0][1].replace(/&amp;/g, "&"));
  assert.equal(link.origin + link.pathname, "https://www.awin1.com/cread.php");
  assert.equal(link.searchParams.get("awinmid"), "108554");
  assert.equal(link.searchParams.get("awinaffid"), "3122300");
  assert.equal(link.searchParams.get("clickref"), "shop_nobi");
  const destination = new URL(link.searchParams.get("ued"));
  assert.equal(destination.origin + destination.pathname, "https://www.qcy.com/products/qcy-h6-neo");
  assert.equal(destination.searchParams.get("variant"), "46471663747129");
  assert.equal(destination.searchParams.get("utm_term"), "headphones as a gift");
  const disclosurePosition = html.indexOf("We may earn a commission");
  assert.ok(disclosurePosition >= 0 && disclosurePosition < html.indexOf(anchors[0][0]));
  assert.ok(!html.includes("Election"), "Do not copy the historical campaign attribution.");
}

test("publish useful headphone decisions and matching visible FAQ schema", () => {
  const html = readArticle();
  assert.ok(html.includes(`<link rel="canonical" href="${Canonical}">`));
  assert.ok(html.includes("Headphones as a Gift: Four Checks Before You Buy | Nobi"));
  for (const heading of [
    "1. Start with one real use, not a list of features",
    "2. Check the exact devices and any extra equipment",
    "3. Treat comfort as a reason to ask first",
    "4. Leave room for delivery, not just the product price",
    "When giving choice is the better gift",
  ]) assert.ok(html.includes(`<h2>${heading}</h2>`), heading);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json" id="page-schema">([^<]*)<\/script>/)[1]);
  const faq = schema.find((item) => item["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, 4);
  for (const item of faq.mainEntity) {
    assert.ok(html.includes(`<h3>${htmlEscape(item.name)}</h3>`));
    assert.ok(html.includes(htmlEscape(item.acceptedAnswer.text)));
  }
  assert.ok(!schema.some((item) => ["Review", "AggregateRating"].includes(item["@type"])));
  assert.ok(html.includes("$52.99 USD on October 19, 2026"));
  assert.ok(html.includes("We have not tested these headphones hands-on"));
  assert.ok(html.includes("with ANC off"));
  assert.ok(html.includes("not a promise of arrival for Christmas"));
});

test("publish the disclosed exact assigned QCY card and real internal discovery paths", () => {
  const html = readArticle();
  checkAssignedCardLink(html);
  assert.ok(!html.includes("&lt;a href="), "The shopping link must not be escaped crawler text.");
  for (const href of ["/tools/gift-chooser", "/blog/gifts-for-someone-who-wants-nothing", "/shop/s/audio-components", "https://www.qcy.com/pages/shipping-policy"]) {
    assert.ok(html.includes(`href="${href}"`), href);
  }
  const sitemap = readFileSync(new URL("../dist/sitemap-pages.xml", import.meta.url), "utf8");
  assert.ok(sitemap.includes(`<loc>${Canonical}</loc>`));
});

test("render the same qualified card in the actual runtime MDX component", async () => {
  const cache = fileURLToPath(new URL("../node_modules/.cache/", import.meta.url));
  mkdirSync(cache, { recursive: true });
  const directory = mkdtempSync(join(cache, "qcy-runtime-mdx-"));
  try {
    await build({
      logLevel: "warn",
      build: {
        ssr: fileURLToPath(new URL(`..${MdxPath}`, import.meta.url)),
        outDir: directory,
        emptyOutDir: true,
        rollupOptions: { output: { entryFileNames: "article.mjs" } },
      },
    });
    const article = await import(pathToFileURL(join(directory, "article.mjs")).href);
    const html = renderToStaticMarkup(React.createElement(article.default));
    checkAssignedCardLink(html);
    assert.ok(html.includes("$52.99 USD on October 19, 2026"));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("keep unsafe or extra HTML escaped while preserving the narrow sponsored anchor", () => {
  const directory = mkdtempSync(join(tmpdir(), "nobi-sponsored-anchor-"));
  const filename = join(directory, "article.mdx");
  try {
    writeFileSync(filename, 'export const meta = {\n title: "Fixture"\n};\n\n<a href="https://shop.example/item?a=1&b=2" rel="sponsored nofollow">View item</a>\n\n<a href="javascript:alert(1)" rel="sponsored nofollow">Unsafe</a>\n\n<a href="https://user@shop.example/item" rel="sponsored nofollow">User info</a>\n\n<a href="https://shop.example/item" onclick="alert(1)" rel="sponsored nofollow">Extra attribute</a>\n\n<a href="https://shop.example/item" rel="sponsored nofollow"><img src="x" /></a>\n');
    const html = renderBodyHtml(filename);
    assert.equal((html.match(/<a href=/g) || []).length, 1);
    assert.ok(html.includes('<a href="https://shop.example/item?a=1&amp;b=2" rel="sponsored nofollow">View item</a>'));
    assert.ok(!html.includes('<img'));
    assert.ok(!html.includes('href="javascript:'));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
