import assert from "node:assert/strict";
import { readFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";
import { before, after, test } from "node:test";
import vm from "node:vm";
import {
  choosePrebuiltContentPlace,
  PrebuiltContentKind,
  PrebuiltContentPlace,
  watchForLiveResults,
} from "../src/utils/shopNobiPrebuiltContent.js";

// The window event the production assistant bundle fires when it draws live products ("Displayed Product Collection").
const LiveProductsDrawn = "nobi-displayed-product-collection";
// Other window events the bundle fires, which say nothing about drawn products.
const OtherBundleEvents = ["nobi-analytics", "nobi-send-message"];
const BuiltShopPage = new URL("../dist/shop/index.html", import.meta.url);

/** Runs the built /shop page's setup script, which runs before the bundle loads, in a stand-in window. */
function openBuiltShopPage({ path = "/shop/s/linen-dresses", content = null } = {}) {
  const html = readFileSync(BuiltShopPage, "utf8");
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(([, code]) => code);
  const pageSetup = scripts.find((code) => code.includes("readNobiAssistantOptions"));
  const pageWindow = new EventTarget();
  pageWindow.location = { pathname: path };
  pageWindow.crypto = { randomUUID: () => "7d2c5a8e-4b1f-4c3d-9e6a-2f8b1c0d3e4f" };
  vm.runInNewContext(pageSetup + "\nwindow.assistantOptions = readNobiAssistantOptions();", {
    window: pageWindow, document: { getElementById: () => content ? { textContent: JSON.stringify(content) } : null },
  });
  return pageWindow;
}

/** Follows one page the way ShopPage does: the assistant arrives, then the bundle fires its events on the window. */
function followPage(kind, bundleWindow = new EventTarget()) {
  const progress = { assistantHasMounted: false, liveResultsHaveDrawn: false };
  watchForLiveResults(bundleWindow, () => {
    progress.liveResultsHaveDrawn = true;
  });

  return {
    mountAssistant: () => {
      progress.assistantHasMounted = true;
    },
    fire: (eventName) => bundleWindow.dispatchEvent(new CustomEvent(eventName)),
    place: () => choosePrebuiltContentPlace(kind, progress),
  };
}

test("prebuilt content follows the assistant lifecycle without hiding idle browse links", () => {
  for (const [kind, beforeMount, afterMount] of [
    [PrebuiltContentKind.SearchPage, PrebuiltContentPlace.AboveSearch, PrebuiltContentPlace.AboveSearch],
    [PrebuiltContentKind.ProductPage, PrebuiltContentPlace.AboveSearch, PrebuiltContentPlace.AboveSearch],
    [PrebuiltContentKind.CategoryPage, PrebuiltContentPlace.BelowSearch, PrebuiltContentPlace.BelowSearch],
    [PrebuiltContentKind.PopularSearches, PrebuiltContentPlace.AboveSearch, PrebuiltContentPlace.BelowSearch],
    [undefined, PrebuiltContentPlace.AboveSearch, PrebuiltContentPlace.Hidden],
  ]) {
    const page = followPage(kind);
    assert.equal(page.place(), beforeMount, String(kind));
    page.mountAssistant();
    OtherBundleEvents.forEach(page.fire);
    assert.equal(page.place(), afterMount, `${kind}: refused or failed searches leave idle content`);
    page.fire(LiveProductsDrawn);
    assert.equal(page.place(), PrebuiltContentPlace.Hidden, String(kind));
  }
});

test("live products the bundle draws before ShopPage, a lazy route, listens still replace the prebuilt products", () => {
  const pageWindow = openBuiltShopPage();
  pageWindow.dispatchEvent(new CustomEvent(LiveProductsDrawn));

  const page = followPage(PrebuiltContentKind.SearchPage, pageWindow);
  assert.equal(page.place(), PrebuiltContentPlace.Hidden);
});


test("search and product pages hand off their existing query without opening the empty autofocus state", () => {
  for (const [kind, slug] of [[PrebuiltContentKind.SearchPage, "s/linen-dresses"], [PrebuiltContentKind.ProductPage, "p/bodum-tribute-12076-57us-34oz"]]) {
    const path = `/shop/${slug}`;
    const content = { kind, path, data: { query: "already displayed product" } };
    const opened = openBuiltShopPage({ path, content });
    assert.equal(opened.assistantOptions.openingQuery, content.data.query);
    assert.equal(opened.assistantOptions.openingConversationId, opened.shopNobiPageConversationId);
    for (const invalid of [{ ...content, path: "/different" }, { ...content, kind: PrebuiltContentKind.CategoryPage }, null]) {
      assert.equal(openBuiltShopPage({ path, content: invalid }).assistantOptions.openingQuery, undefined);
    }
  }
});

let renderShopPage;
let rendererFolder;
before(async () => {
  const cache = fileURLToPath(new URL("../node_modules/.cache/", import.meta.url));
  mkdirSync(cache, { recursive: true });
  rendererFolder = mkdtempSync(join(cache, "shop-page-content-"));
  const progressFixture = fileURLToPath(new URL("./fixtures/shop-page-progress.js", import.meta.url));
  // Only the arrival/draw inputs are scripted. Render the actual ShopPage tree and its real browse component.
  await build({
    configFile: false, logLevel: "warn",
    resolve: { alias: [
      { find: /.*\/hooks\/useAdoptedAssistantContainer$/, replacement: progressFixture },
      { find: /.*\/hooks\/useLiveResultsHaveDrawn$/, replacement: progressFixture },
    ] },
    build: {
      ssr: fileURLToPath(new URL("./fixtures/render-shop-page.jsx", import.meta.url)),
      outDir: rendererFolder, emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "renderer.mjs" } },
    },
  });
  ({ renderShopPage } = await import(pathToFileURL(join(rendererFolder, "renderer.mjs"))));
});
after(() => { if (rendererFolder) rmSync(rendererFolder, { recursive: true, force: true }); });

/** Read destination anchors, including the anchors inside closed native details. */
function browseHrefs(html) {
  return [...html.matchAll(/href="(\/shop\/[sc]\/[^" ]+)"/g)].map((match) => match[1]);
}

test("actual root rendering retains every browse destination in compact native disclosures through mount", () => {
  for (const count of [0, 3, 15]) {
    const categories = Array.from({ length: count }, (_, index) => ({ slug: `category-${index}`, name: `Category ${index}` }));
    const pages = count ? [{ slug: "linen-shirts", title: "Linen & cotton shirts" }] : [];
    const moreSearches = count ? [{ slug: "desk-lamps", title: "Desk lamps" }] : [];
    const content = { kind: PrebuiltContentKind.PopularSearches, path: "/shop", data: { categories, pages, moreSearches } };
    const expected = [...categories.map(({ slug }) => `/shop/c/${slug}`), ...pages.concat(moreSearches).map(({ slug }) => `/shop/s/${slug}`)];
    for (const assistantHasMounted of [false, true]) {
      const html = renderShopPage(content, { assistantHasMounted, liveResultsHaveDrawn: false });
      assert.deepEqual(browseHrefs(html), expected);
      assert.equal((html.match(/<h1\b/g) || []).length, assistantHasMounted ? 0 : 1, "Mounted browse does not duplicate the assistant H1");
      assert.match(html, /<h2[^>]*>Browse products<\/h2>/);
      assert.ok(!html.includes("shop-nobi-category-search"), "Root hero and suggestions retain their normal styles");
      const disclosures = [...html.matchAll(/<details([^>]*)>([\s\S]*?)<\/details>/g)];
      assert.equal(disclosures.length, count ? (count > 12 ? 3 : 2) : 0);
      disclosures.forEach(([, attributes, body]) => {
        assert.ok(!/\bopen(?:=|\s|$)/.test(attributes));
        assert.match(body, /^<summary[^>]*>[^<]+<\/summary>/);
        assert.ok(browseHrefs(body).length > 0);
      });
      assert.equal(browseHrefs(html.replace(/<details[\s\S]*?<\/details>/g, "")).length, Math.min(12, count));
      const browseAt = html.indexOf('aria-labelledby="shop-nobi-browse-heading"');
      const searchAt = html.indexOf('id="shop-nobi-live-search"');
      assert.ok(assistantHasMounted ? browseAt > searchAt : browseAt < searchAt);
      if (count) assert.ok(html.includes("Linen &amp; cotton shirts"));
    }
    const results = renderShopPage(content, { assistantHasMounted: true, liveResultsHaveDrawn: true });
    assert.deepEqual(browseHrefs(results), []);
    assert.ok(!results.includes("Browse products"));
  }
});

test("actual category layout alone keeps its compact assistant styling until live results arrive", () => {
  const content = { kind: PrebuiltContentKind.CategoryPage, path: "/shop/c/furniture", data: {
    slug: "furniture", name: "Furniture", subcategories: [], pages: [{ slug: "desk-lamps", title: "Desk lamps" }],
  } };
  for (const assistantHasMounted of [false, true]) {
    const html = renderShopPage(content, { assistantHasMounted, liveResultsHaveDrawn: false });
    assert.match(html, /id="shop-nobi-live-search" class="shop-nobi-category-search"/);
    assert.match(html, /<h1[^>]*>Furniture<\/h1>/);
    assert.deepEqual(browseHrefs(html), ["/shop/s/desk-lamps"]);
  }
  const drawn = renderShopPage(content, { assistantHasMounted: true, liveResultsHaveDrawn: true });
  assert.ok(!drawn.includes("shop-nobi-category-search"));
  assert.deepEqual(browseHrefs(drawn), []);
  assert.match(renderShopPage(null, { assistantHasMounted: false, liveResultsHaveDrawn: false }), /Loading Shop Nobi/);
  assert.ok(!renderShopPage(null, { assistantHasMounted: true, liveResultsHaveDrawn: false }).includes("Loading Shop Nobi"));
});
