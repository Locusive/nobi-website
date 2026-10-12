import assert from "node:assert/strict";
import { test } from "node:test";
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

/** Follows one page the way ShopPage does: the assistant arrives, then the bundle fires its events on the window. */
function followPage(kind) {
  const bundleWindow = new EventTarget();
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

test("a category page keeps its heading and searches under the search box until the shopper's search draws products", () => {
  const page = followPage(PrebuiltContentKind.CategoryPage);
  assert.equal(page.place(), PrebuiltContentPlace.BelowSearch);

  page.mountAssistant();
  assert.equal(page.place(), PrebuiltContentPlace.BelowSearch);

  page.fire(LiveProductsDrawn);
  assert.equal(page.place(), PrebuiltContentPlace.Hidden);
});

test("/shop's popular searches, and the loading message of a page with no prebuilt content, leave when the assistant arrives", () => {
  for (const kind of [PrebuiltContentKind.PopularSearches, undefined]) {
    const page = followPage(kind);
    assert.equal(page.place(), PrebuiltContentPlace.AboveSearch, String(kind));

    page.mountAssistant();
    assert.equal(page.place(), PrebuiltContentPlace.Hidden, String(kind));
  }
});
