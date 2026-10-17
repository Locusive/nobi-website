import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateMindTheColorFit, MindTheColorQuestions } from "../src/utils/mindTheColorFit.js";
import { MindTheColorOffer, validateMindTheColorLink } from "../src/content/mindTheColor.js";
import { MindTheColorLinkArtifact } from "../src/content/mindTheColorLink.js";

const Ready = { photoshop: "ready", platform: "mac", installer: "ready", internet: "yes", users: "single", workflow: "creative" };

test("a complete declared setup gets a conditional result without changing source answers", () => {
  const original = JSON.stringify(Ready);
  for (const platform of ["mac", "windows"]) {
    assert.deepEqual(evaluateMindTheColorFit({ ...Ready, platform }), {
      status: "conditional", title: "Your answers match the listed prerequisites", failures: [], unknowns: [],
    });
  }
  assert.equal(JSON.stringify(Ready), original);
});

test("each documented failed requirement blocks a match even with other answers missing", () => {
  const failures = { photoshop: ["older", "other"], platform: ["other"], installer: ["update", "unavailable"], internet: ["no"], users: ["team"], workflow: ["automated"] };
  for (const [key, values] of Object.entries(failures)) {
    for (const value of values) {
      const result = evaluateMindTheColorFit({ ...Ready, [key]: value });
      assert.equal(result.status, "blocked");
      assert.equal(result.failures.length, 1);
      assert.equal(result.unknowns.length, 0);
      const incomplete = evaluateMindTheColorFit({ [key]: value });
      assert.equal(incomplete.status, "blocked");
      assert.equal(incomplete.unknowns.length, MindTheColorQuestions.length - 1);
    }
  }
  const result = evaluateMindTheColorFit({ ...Ready, internet: "no", users: "team", workflow: "automated" });
  assert.equal(result.failures.length, 3, "All material mismatches stay visible");
  assert.match(result.failures.join(" "), /offline launches/);
  assert.match(result.failures.join(" "), /shared team/);
  assert.match(result.failures.join(" "), /AI\/ML/);
});

test("unknown, malformed and absent values cannot produce a match", () => {
  assert.equal(evaluateMindTheColorFit().unknowns.length, 6);
  assert.equal(evaluateMindTheColorFit(null).status, "unknown");
  for (const question of MindTheColorQuestions) {
    for (const value of [undefined, "unknown", "", true, 26, "constructor", "__proto__", "unexpected"]) {
      const result = evaluateMindTheColorFit({ ...Ready, [question.id]: value });
      assert.equal(result.status, "unknown");
      assert.deepEqual(result.unknowns, [question.label]);
      assert.deepEqual(result.failures, []);
    }
  }
});

test("publication requires exact real owner, product, publisher parameter and complete offline provenance", () => {
  assert.equal(validateMindTheColorLink(MindTheColorLinkArtifact), MindTheColorLinkArtifact.offer);
  assert.equal(MindTheColorOffer.currency, "EUR");
  assert.equal(MindTheColorOffer.sourcePrice, 179);
  assert.equal(MindTheColorOffer.kind, "DIGITAL_SOFTWARE");
  assert.equal(MindTheColorOffer.priceBasis, "PER_LICENSE");
  assert.throws(() => validateMindTheColorLink(null), /before publication/);
  const changes = [
    a => { delete a.provenance; }, a => { a.provenance.configurationSha256 = ""; },
    a => { a.channel = "OTHER_ASSISTANT"; }, a => { a.conversationId = "invented"; },
    a => { a.searchText = "changed"; }, a => { a.defaultOuterReference = "shop_nobi"; },
    a => { a.networkGuardSelfTestBlocked = false; }, a => { a.networkAttemptsByExercisedCode = 1; },
    a => { a.offer.owningMerchantId = "7decef8b-9aef-4d97-a7f4-6eea83ede096"; },
    a => { a.offer.id = "another-license"; }, a => { a.offer.name = "another-license"; },
    a => { a.offer.productVariantId = "fake-sku"; }, a => { a.offer.kind = "PRODUCT"; },
    a => { a.offer.priceBasis = "PER_MONTH"; }, a => { a.offer.paidLink = false; },
    a => { a.offer.sourceUrl = "https://another.gumroad.com/l/Mindthecolor3"; },
    a => { a.offer.paid = a.offer.paid.replace("480165219", "1"); },
    a => { a.offer.paid += "&a=480165219"; }, a => { a.offer.paid += "&clickref=shop_nobi"; },
    a => { a.offer.paid += "#unexpected"; }, a => { a.offer.plain += "&a=480165219"; },
    a => { a.offer.plain = a.offer.plain.replace("https:", "http:"); },
    a => { a.offer.paid = a.offer.paid.replace("Mindthecolor3", "another-product"); },
    a => { a.offer.paid = a.offer.paid.replace("utm_campaign=shop_nobi", "utm_campaign=changed"); },
    a => { a.offer.plain = a.offer.plain.replace("utm_medium=referral", "utm_medium=changed"); },
  ];
  for (const change of changes) {
    const artifact = structuredClone(MindTheColorLinkArtifact);
    change(artifact);
    assert.throws(() => validateMindTheColorLink(artifact), /before publication/);
  }
});
