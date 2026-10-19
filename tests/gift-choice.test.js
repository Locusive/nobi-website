import assert from "node:assert/strict";
import { test } from "node:test";
import { chooseGifts, readGiftChoice } from "../src/utils/giftChoice.js";

/** Submit the same native FormData shape the real React form reads. */
function submitChoice(answers) {
  const data = new FormData();
  Object.entries(answers).forEach(([name, value]) => data.set(name, String(value)));
  return chooseGifts(readGiftChoice(data));
}

test("an explicit coffee interest and item budget return three explained real options", () => {
  const result = submitChoice({ interest: "coffee", budget: 50 });
  assert.deepEqual(result.items.map(product => product.id), ["house-five", "sermon-six", "sermon-pouch"]);
  assert.ok(result.items.every(product => product.price <= 50 && product.why && product.tradeoff));
  assert.equal(result.shopUrl, "https://nobi.ai/shop");
  assert.equal(result.interest.collection, "https://nobi.ai/shop/s/instant-coffee");
  assert.match(result.request, /instant coffee, up to \$50 per item/);
});

test("item price boundaries never silently stretch the budget or pad empty results", () => {
  assert.deepEqual(submitChoice({ interest: "coffee", budget: 13 }).items.map(product => product.id), ["house-five"]);
  const none = submitChoice({ interest: "coffee", budget: 12.99 });
  assert.equal(none.items.length, 0);
  assert.match(none.request, /\$12.99 per item/);
  assert.equal(none.shopUrl, "https://nobi.ai/shop");
});

test("decaf keeps only the two explicitly labeled examples instead of inventing a third", () => {
  const result = submitChoice({ interest: "coffee", budget: 50, decafOnly: "on" });
  assert.deepEqual(result.items.map(product => product.id), ["ghost-decaf", "vancouver-decaf"]);
  assert.ok(result.items.every(product => /decaf/i.test(product.name)));
  assert.match(result.request, /decaf only/);
});

test("painting and short-handle preferences select the actual reviewed set and exclude long handles", () => {
  const result = submitChoice({ interest: "painting", budget: 50, shortHandlesOnly: "on" });
  assert.deepEqual(result.items.map(product => product.id), ["variety-set", "short-round", "short-flat"]);
  assert.match(result.items[0].name, /SK-8113S/);
  assert.equal(new URL(result.items[0].url).searchParams.get("variant"), "49661782589726");
  assert.ok(result.items.every(product => /Short Handle/.test(product.name)));
  assert.equal(result.interest.collection, "https://nobi.ai/shop/s/silver-paint-brushes");
});

test("avoiding device checks produces an honest charging no-match with a usable manual request", () => {
  const result = submitChoice({ interest: "charging", budget: 100, avoidDeviceChecks: "on" });
  assert.equal(result.items.length, 0);
  assert.match(result.request, /avoid gifts that need device-compatibility checks/);
  assert.equal(result.shopUrl, "https://nobi.ai/shop");
  assert.ok(!result.shopUrl.includes("?"));
  assert.equal(submitChoice({ interest: "charging", budget: 50 }).items.length, 3);
});

test("irrelevant hidden preferences do not corrupt a changed interest and invalid inputs return no products", () => {
  assert.equal(submitChoice({ interest: "painting", budget: 50, decafOnly: "on" }).items.length, 3);
  for (const budget of ["", -1, 0, "not-a-number", "Infinity", 5001]) {
    const result = submitChoice({ interest: "coffee", budget });
    assert.ok(result.error);
    assert.deepEqual(result.items, []);
  }
  assert.ok(submitChoice({ interest: "unknown", budget: 50 }).error);
});
