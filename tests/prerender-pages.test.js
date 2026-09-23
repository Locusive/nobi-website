import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { getSignupUrl } from "../src/utils/signupUrl.js";

const Dist = new URL("../dist/", import.meta.url);

/** Read built HTML as a crawler would, without executing JavaScript. */
function readPage(path) {
  return readFileSync(new URL(path, Dist), "utf8");
}

/** Extract text while excluding metadata, JavaScript, and styles. */
function bodyText(html) {
  return html.split("<body>")[1]
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

for (const [path, heading] of [
  ["homepage.html", "Modern site search"],
  ["pricing.html", "Simple, usage-based pricing"],
  ["product.html", "One assistant. Every job your website needs done."],
]) {
  test(`${path} serves real content, metadata, and valid bundled assets without JavaScript`, () => {
    const html = readPage(path);
    assert.ok(bodyText(html).includes(heading));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.equal((html.match(/id="page-schema"/g) || []).length, 1);
    assert.ok(html.includes('href="https://dashboard.nobi.ai/signup"'));
    for (const [, asset] of html.matchAll(/(?:src|href)="\/assets\/([^\"]+)"/g)) {
      assert.ok(existsSync(new URL(`assets/${asset}`, Dist)), `Missing asset: ${asset}`);
    }
    if (path !== "homepage.html") {
      assert.equal(html, readPage(path.replace(".html", "/index.html")));
    }
  });
}

test("pricing includes plan allowances, overages, trial terms, and FAQ answers", () => {
  const text = bodyText(readPage("pricing.html"));
  for (const fact of [
    "2,500", "250", "$0.10/message", "$0.01/search", "30-day free trial",
    "100 free messages", "pause until the next billing cycle", "5,000",
    "Both are tracked separately with their own limits.",
  ]) assert.ok(text.includes(fact), `Missing pricing fact: ${fact}`);
});

test("blog and glossary output retain their own content without the homepage", () => {
  for (const directory of ["blog", "glossary"]) {
    const file = readdirSync(new URL(`${directory}/`, Dist)).find(name => name.endsWith(".html"));
    assert.ok(file, `No ${directory} output`);
    const html = readPage(join(directory, file));
    assert.ok(html.includes('class="prerendered-article"'));
    assert.ok(!bodyText(html).includes("Modern site search"));
  }
});

test("signup links render without a browser and still preserve browser attribution", () => {
  assert.equal(getSignupUrl(), "https://dashboard.nobi.ai/signup");
  assert.equal(getSignupUrl({ path: "" }), "https://dashboard.nobi.ai");
  globalThis.window = { location: { search: "?utm_source=test&utm_campaign=summer&gclid=123&unrelated=secret" } };
  try {
    assert.equal(getSignupUrl(), "https://dashboard.nobi.ai/signup?utm_source=test&utm_campaign=summer&gclid=123");
  } finally {
    delete globalThis.window;
  }
});

test("the homepage rewrite preserves an empty fallback for other client routes", () => {
  assert.ok(readPage("index.html").includes('<div id="root"></div>'));
  assert.match(readPage("_redirects"), /^\/ \/homepage 200$/m);
});
