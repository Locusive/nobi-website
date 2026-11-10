import assert from "node:assert/strict";
import { test } from "node:test";
import { giftGuideSearchAttribution } from "../src/utils/shopGiftGuide.js";

test("a shopper's tagged social campaign survives the guide search form", () => {
  assert.deepEqual(giftGuideSearchAttribution(
    "?utm_source=threads&utm_medium=organic_social&utm_campaign=luggage_brand_reply_20261110",
    "best-carry-on-luggage",
  ), {
    source: "threads", medium: "organic_social",
    campaign: "luggage_brand_reply_20261110", content: "best-carry-on-luggage",
  });
});

test("the existing Flipboard pilot keeps its established attribution", () => {
  assert.deepEqual(giftGuideSearchAttribution("?utm_source=flipboard", "best-carry-on-luggage"), {
    source: "flipboard", medium: "referral", campaign: "editorial_pilot",
    content: "best-carry-on-luggage",
  });
  assert.equal(giftGuideSearchAttribution("", "best-carry-on-luggage"), null);
});
