import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "vite";
import { htmlEscape } from "../scripts/prerender-blog.js";

const Slug = "trivia-card-game-gift";
const Canonical = `https://nobi.ai/blog/${Slug}`;
const Fixture = JSON.parse(readFileSync(new URL("./fixtures/funfact-trivia-gift.json", import.meta.url), "utf8"));
const readArticle = () => readFileSync(new URL(`../dist/blog/${Slug}/index.html`, import.meta.url), "utf8");

/** Checks the rendered shopper CTA against the retained actual Java output, not a reconstructed template. */
function checkAssignedCard(html) {
  const anchors = [...html.matchAll(/<a href="([^"]+)" rel="sponsored nofollow">View The Party Mix I at Fun Fact Co\.<\/a>/g)];
  assert.equal(anchors.length, 1);
  const actual = anchors[0][1].replace(/&amp;/g, "&");
  assert.equal(actual, Fixture.product.paid);
  const paid = new URL(actual);
  assert.equal(paid.origin + paid.pathname, "https://www.awin1.com/cread.php");
  assert.equal(paid.searchParams.get("awinmid"), "114020");
  assert.equal(paid.searchParams.get("awinaffid"), "3122300");
  const destination = new URL(paid.searchParams.get("ued"));
  assert.equal(destination.origin + destination.pathname, "https://funfactco.com/products/fun-fact-trivia-deck-game");
  assert.deepEqual(destination.searchParams.getAll("variant"), ["44995184558326"]);
  assert.equal(destination.searchParams.get("utm_term"), "trivia card game gift");
  assert.equal(destination.searchParams.get("utm_source"), "shop_nobi");
  const anchorPosition = html.indexOf(anchors[0][0]);
  assert.ok(html.slice(Math.max(0, anchorPosition - 220), anchorPosition).includes(Fixture.product.disclosure));
  assert.ok(!html.includes('href="https://funfactco.com/products/'), "Keep one qualified product CTA, not an untracked alternative.");
  assert.ok(!html.includes("Election"));
}

test("publish useful trivia gift decisions with exact qualified facts and matching visible FAQ schema", () => {
  const html = readArticle();
  assert.ok(html.includes(`<link rel="canonical" href="${Canonical}">`));
  assert.ok(html.includes("How to Choose a Trivia Card Game as a Gift | Nobi"));
  for (const heading of ["Start with the people who will play", "Match the time and question style", "Check the topics before the packaging", "One option to consider", "If the fit is uncertain, give them a choice"]) {
    assert.ok(html.includes(`<h2>${heading}</h2>`), heading);
  }
  for (const fact of ["ages 10+", "2+ players", "10–45 minutes", "multiple-choice and true/false", "death, animals, space and numbers", "US$25 on October 19, 2026, before shipping and any applicable tax", "we have not played or tested"]) {
    assert.ok(html.includes(fact), fact);
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json" id="page-schema">([^<]*)<\/script>/)[1]);
  const faq = schema.find((item) => item["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, 4);
  for (const item of faq.mainEntity) {
    assert.ok(html.includes(`<h3>${htmlEscape(item.name)}</h3>`));
    assert.ok(html.includes(htmlEscape(item.acceptedAnswer.text)));
  }
  assert.ok(!schema.some((item) => ["Review", "AggregateRating"].includes(item["@type"])));
  assert.ok(html.includes("A firm US$25 delivered budget will not cover"));
  assert.ok(html.includes("Choose another theme if death would be unwelcome"));
});

test("publish one disclosed assigned card, existing gift discovery links and the canonical sitemap entry", () => {
  const html = readArticle();
  checkAssignedCard(html);
  assert.ok(!html.includes("&lt;a href="));
  for (const href of ["/tools/gift-chooser", "/blog/gifts-for-someone-who-wants-nothing"]) assert.ok(html.includes(`href="${href}"`));
  assert.ok(!html.includes("fftd1-hero.jpg"));
  const sitemap = readFileSync(new URL("../dist/sitemap-pages.xml", import.meta.url), "utf8");
  assert.ok(sitemap.includes(`<loc>${Canonical}</loc>`));
});

test("retain the same factual text-only card in the actual runtime MDX rendering", async () => {
  const cache = fileURLToPath(new URL("../node_modules/.cache/", import.meta.url));
  mkdirSync(cache, { recursive: true });
  const folder = mkdtempSync(join(cache, "trivia-runtime-mdx-"));
  try {
    await build({ logLevel: "warn", build: {
      ssr: fileURLToPath(new URL(`../src/content/posts/2026-10-19_${Slug}.mdx`, import.meta.url)),
      outDir: folder, emptyOutDir: true, rollupOptions: { output: { entryFileNames: "article.mjs" } },
    } });
    const article = await import(pathToFileURL(join(folder, "article.mjs")).href);
    const html = renderToStaticMarkup(React.createElement(article.default));
    checkAssignedCard(html);
    assert.ok(html.includes("US$25 on October 19, 2026"));
    assert.ok(html.includes("death, animals, space and numbers"));
    assert.ok(!html.includes("<img"), "No merchant photograph or new brand graphic is published.");
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
