import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "vite";

const Article = new URL("../src/content/posts/2026-10-22_qcy.mdx", import.meta.url);
const Canonical = "https://nobi.ai/blog/qcy";
const readBuilt = (path) => readFileSync(new URL(`../dist/${path}`, import.meta.url), "utf8");

/** Checks the shopper-facing experiment without implying a tested or monetized recommendation. */
function checkPlainBrandFeature(html) {
  assert.ok(html.includes("QCY says it began in 2009"));
  assert.ok(html.includes("Manufacturer features are not our listening-test results"));
  assert.ok(html.includes("reviewed October 20, 2026"));
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g)];
  for (const [label, destination] of [
    ["Explore QCY H6 Neo", "https://www.qcy.com/products/qcy-h6-neo"],
    ["Explore QCY", "https://www.qcy.com/"],
  ]) {
    const matching = links.filter(([, , text]) => text === label);
    assert.equal(matching.length, 1, label);
    assert.equal(matching[0][1], destination);
  }
  assert.ok(html.includes('href="https://nobi.ai/blog/headphones-as-a-gift"'));
  assert.doesNotMatch(html, /awin1|awinaffid|\$52\.99|earn a commission|Review draft|Meta:|Search Shop Nobi/);
}

test("publish the same plain brand feature for crawlers and the runtime MDX reader", async () => {
  const built = readBuilt("blog/qcy/index.html");
  assert.ok(built.includes(`<link rel="canonical" href="${Canonical}">`));
  checkPlainBrandFeature(built.slice(built.indexOf('<div id="root">')));
  const cache = fileURLToPath(new URL("../node_modules/.cache/", import.meta.url));
  mkdirSync(cache, { recursive: true });
  const directory = mkdtempSync(join(cache, "qcy-traffic-mdx-"));
  try {
    await build({ logLevel: "warn", build: {
      ssr: fileURLToPath(Article), outDir: directory, emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "article.mjs" } },
    } });
    const article = await import(pathToFileURL(join(directory, "article.mjs")).href);
    assert.equal(article.meta.slug, "qcy");
    assert.equal(article.meta.draft, false);
    checkPlainBrandFeature(renderToStaticMarkup(React.createElement(article.default)));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("make the pilot discoverable without replacing the gift guide's earning destination", () => {
  const guide = readBuilt("blog/headphones-as-a-gift/index.html");
  assert.equal([...guide.matchAll(/href="\/blog\/qcy"/g)].length, 1);
  assert.ok(guide.includes("See H6 Neo Black at QCY"));
  assert.ok(guide.includes("https://www.awin1.com/cread.php?"));
  assert.ok(readBuilt("sitemap-pages.xml").includes(`<loc>${Canonical}</loc>`));
  assert.ok(readBuilt("blog/qcy.md").includes("QCY: audio options worth exploring"));
});
