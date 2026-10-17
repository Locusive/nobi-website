import assert from "node:assert/strict";
import { test } from "node:test";
import { BaseusScreenEntryPoint, BaseusScreenProducts, BaseusScreenQuery, BaseusScreenSlug } from "../src/content/baseusScreens.js";
import { handleProductLinkClick } from "../src/utils/shopNobiProductClick.js";
import { makeBrowser } from "./fixtures/shop-nobi-click-browser.js";

/** Proves exact authored variant/source/acquisition behavior using the existing standalone exit path. */
test("Baseus exits use the reviewed product identities and one standalone source-tagged visit", () => {
  const pageUrl = "https://nobi.ai/tools/baseus-two-screens?utm_source=pinterest&utm_medium=organic&utm_campaign=baseus_screens&utm_content=mac_mirror";
  const browser = makeBrowser({ pageUrl });
  const references = [];
  for (const [index, product] of BaseusScreenProducts.entries()) {
    const link = { href: product.url };
    handleProductLinkClick({ button: index, currentTarget: link }, { product, position: index + 1, query: BaseusScreenQuery, slug: BaseusScreenSlug, entryPoint: BaseusScreenEntryPoint }, browser);
    const event = browser.beacons.at(-1).event;
    assert.equal(event.details.productVariantId, product.productVariantId);
    assert.equal(event.details.entryPoint, "Shop Nobi Utility");
    assert.equal(event.details.query, "Baseus two independent screens");
    assert.equal(event.details.pageUrl, pageUrl);
    assert.equal(event.details.conversationId, undefined);
    assert.equal(event.details.utm_content, "mac_mirror");
    assert.equal(event.details.linkUrl, link.href);
    assert.equal(event.details.laptop, undefined);
    assert.equal(event.details.answers, undefined);
    const paid = new URL(link.href);
    assert.equal(paid.searchParams.get("awinmid"), "38962");
    assert.equal(paid.searchParams.get("ued"), product.url);
    references.push(paid.searchParams.get("clickref"));
  }
  assert.equal(browser.beacons.length, 2);
  assert.equal(references[0], references[1]);
  assert.match(references[0], /^baseus-two-screens\.[a-z0-9]{8}$/);
  assert.deepEqual(BaseusScreenProducts.map(product => product.productVariantId), ["781f8333-bcea-4def-b9ed-cf325950f47a", "4ba9ef25-133d-4360-86b5-2a2dc2b6c194"]);
});
