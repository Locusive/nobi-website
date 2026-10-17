import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
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
function openBuiltShopPage() {
  const html = readFileSync(BuiltShopPage, "utf8");
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(([, code]) => code);
  const pageSetup = scripts.find((code) => code.includes("readNobiAssistantOptions"));
  const pageWindow = new EventTarget();
  pageWindow.location = { pathname: "/shop/s/linen-dresses" };
  pageWindow.crypto = { randomUUID: () => "7d2c5a8e-4b1f-4c3d-9e6a-2f8b1c0d3e4f" };
  vm.runInNewContext(pageSetup, { window: pageWindow });
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

test("a search page keeps its products above the live search until live products are drawn", () => {
  const page = followPage(PrebuiltContentKind.SearchPage);
  assert.equal(page.place(), PrebuiltContentPlace.AboveSearch);

  page.mountAssistant();
  OtherBundleEvents.forEach(page.fire);
  assert.equal(page.place(), PrebuiltContentPlace.AboveSearch, "A refused or failed search draws nothing, so the products stay");

  page.fire(LiveProductsDrawn);
  assert.equal(page.place(), PrebuiltContentPlace.Hidden);
});

test("category and sale pages stay under the search box until the shopper's search draws products", () => {
  for (const kind of [PrebuiltContentKind.CategoryPage, PrebuiltContentKind.SalePage, PrebuiltContentKind.SaleHub]) {
    const page = followPage(kind);
    assert.equal(page.place(), PrebuiltContentPlace.BelowSearch, kind);

    page.mountAssistant();
    assert.equal(page.place(), PrebuiltContentPlace.BelowSearch, kind);

    page.fire(LiveProductsDrawn);
    assert.equal(page.place(), PrebuiltContentPlace.Hidden, kind);
  }
});

test("/shop's popular searches, and the loading message of a page with no prebuilt content, leave when the assistant arrives", () => {
  for (const kind of [PrebuiltContentKind.PopularSearches, undefined]) {
    const page = followPage(kind);
    assert.equal(page.place(), PrebuiltContentPlace.AboveSearch, String(kind));

    page.mountAssistant();
    assert.equal(page.place(), PrebuiltContentPlace.Hidden, String(kind));
  }
});

test("live products the bundle draws before ShopPage, a lazy route, listens still replace the prebuilt products", () => {
  const pageWindow = openBuiltShopPage();
  pageWindow.dispatchEvent(new CustomEvent(LiveProductsDrawn));

  const page = followPage(PrebuiltContentKind.SearchPage, pageWindow);
  assert.equal(page.place(), PrebuiltContentPlace.Hidden);
});
