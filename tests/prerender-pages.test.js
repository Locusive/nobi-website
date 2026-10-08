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

/** Replace each block marked as a picture with its label, the way the Nobi assistant reads a page. */
function readPicturesAsLabels(html) {
  const pictureStart = /<div role="img" aria-label="/;
  let result = html;
  let start = result.search(pictureStart);
  while (start !== -1) {
    const label = result.slice(start).match(/aria-label="([^"]*)"/)[1];
    const divTag = /<\/?div\b[^>]*>/g;
    divTag.lastIndex = start;
    let depth = 0;
    let end = start;
    for (let match = divTag.exec(result); match; match = divTag.exec(result)) {
      depth += match[0].startsWith("</") ? -1 : 1;
      if (depth === 0) {
        end = divTag.lastIndex;
        break;
      }
    }
    result = result.slice(0, start) + label + result.slice(end);
    start = result.search(pictureStart);
  }
  return result;
}

for (const [path, label, sampleTexts] of [
  ["homepage.html", "Example of Nobi search results on a sample clothing store", [
    "red dress under $200", "Understood red", "Search anything on your site", "Results ordering", "What is your return window?",
    "crochet dress for a beach vacation",
  ]],
  ["product.html", "Example of Nobi capturing a lead", ["does this run true to size?", "New lead captured", "Results ordering"]],
]) {
  test(`${path} marks its product demos as labeled pictures, so their sample text is not read as page content`, () => {
    const html = readPage(path);
    const text = bodyText(readPicturesAsLabels(html));
    assert.ok(text.includes(label), `Missing picture label: ${label}`);
    for (const sampleText of sampleTexts) {
      assert.ok(bodyText(html).includes(sampleText), `Demo text should still be on the page: ${sampleText}`);
      assert.ok(!text.includes(sampleText), `Demo text outside a picture: ${sampleText}`);
    }
  });
}

test("the Shop Nobi page shares its own link preview picture, and the other pages keep Nobi's", () => {
  const shopHtml = readPage("shop.html");
  assert.ok(shopHtml.includes('<meta property="og:image" content="https://nobi.ai/shop-nobi-og-image.png">'));
  assert.ok(shopHtml.includes('<meta name="twitter:image" content="https://nobi.ai/shop-nobi-og-image.png">'));
  assert.ok(existsSync(new URL("shop-nobi-og-image.png", Dist)), "The picture must be published with the site");
  assert.ok(readPage("homepage.html").includes('<meta property="og:image" content="https://nobi.ai/og-image.png">'));
});

test("pricing includes plan allowances, overages, trial terms, and FAQ answers", () => {
  const text = bodyText(readPage("pricing.html"));
  for (const fact of [
    "2,500", "250", "$0.10/message", "$0.01/search", "30-day free trial",
    "100 free messages", "Additional usage is billed", "5,000",
    "Both are tracked separately with their own limits.",
  ]) assert.ok(text.includes(fact), `Missing pricing fact: ${fact}`);
  assert.ok(!text.includes("pause until the next billing cycle"));
  assert.ok(text.includes("A payment method is required to start the 30-day free trial"));
  assert.ok(text.includes("What would you like to use Nobi for?"));
  const beforeEstimate = text.split("Find your price")[0];
  for (const fact of ["Standard", "/ month base", "+ extra usage", "$25", "2,500", "$0.01", "250", "$0.10", "Enterprise", "Simple site searches", "Conversational messages", "No conversation-start fee"])
    assert.ok(beforeEstimate.includes(fact), `Pricing must be explained before the interview: ${fact}`);
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

test("the Shop Nobi page serves its own metadata, the site nav, and the production bundle", () => {
  const html = readPage("shop.html");
  const text = bodyText(html);
  assert.ok(html.includes("<title>Shop Nobi | Nobi</title>"));
  assert.ok(html.includes('rel="canonical" href="https://nobi.ai/shop"'));
  assert.equal((html.match(/id="page-schema"/g) || []).length, 1);
  assert.ok(html.includes("<header") && text.includes("Sign Up Free"), "The page carries its own header");
  assert.ok(text.includes("Loading Shop Nobi"));
  assert.ok(html.includes("Shop Nobi is a search engine: you buy directly from the store."), "The page description says Shop Nobi is a search engine");
  assert.ok(html.includes('<meta name="robots" content="index, nofollow">'), "Crawlers may index the page but not follow its product links");
  assert.ok(!text.includes("Modern site search"));
  assert.ok(html.includes('src="https://assistant-script.nobi.ai/nobi.bundle.js"'));
  assert.ok(!html.includes("localhost"));
  assert.equal(html, readPage("shop/index.html"));
});
