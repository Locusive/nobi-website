import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { emptyCaseChecklist, reviewCaseChecklist } from "../src/utils/phoneCaseChecklist.js";
const valid = () => ({ ...emptyCaseChecklist(), phone: "iPhone 17 Pro", variant: "Selected clear case", model: "unspecified" });

test("model review requires exact recorded identities and explicit evidence, with listing names when claimed", () => {
  assert.deepEqual(Object.keys(reviewCaseChecklist(emptyCaseChecklist()).errors).sort(), ["model", "phone", "variant"]);
  for (const model of ["listed", "different"]) assert.ok(reviewCaseChecklist({ ...valid(), model }).errors.listedModels);
  assert.deepEqual(reviewCaseChecklist(valid()).errors, {});
  assert.equal(reviewCaseChecklist(valid()).listedModels, "");
});
test("optional evidence stays independent and model names never become a computed fit verdict", () => {
  const input = { ...valid(), model: "listed", listedModels: "iPhone 17" };
  input.features.charging = { status: "missing", notes: "  Need my charger requirements  " };
  input.features.magnetic.status = "unnecessary";
  const result = reviewCaseChecklist(input);
  assert.deepEqual(result.errors, {});
  assert.match(result.model[1], /your listing check, not an independent physical fit test/);
  assert.equal(result.phone, "iPhone 17 Pro");
  assert.equal(result.listedModels, "iPhone 17");
  assert.deepEqual(result.features.map(row => row.status), ["Not documented", "Not needed", "Unanswered"]);
  assert.equal(result.features[0].notes, "Need my charger requirements");
  assert.equal(reviewCaseChecklist({ ...input, model: "different" }).features[0].notes, result.features[0].notes);
});
test("invalid evidence states and oversized notes fail without coercion or leaking shared reset state", () => {
  for (const [key, limit] of [["phone", 120], ["variant", 180], ["listedModels", 240]]) assert.ok(reviewCaseChecklist({ ...valid(), [key]: "x".repeat(limit + 1) }).errors[key]);
  assert.ok(reviewCaseChecklist({ ...valid(), model: "toString" }).errors.model);
  const input = valid(); input.features.charging = { status: "guaranteed", notes: "x".repeat(301) };
  const errors = reviewCaseChecklist(input).errors;
  assert.ok(errors["charging.status"]); assert.ok(errors["charging.notes"]);
  const first = emptyCaseChecklist(); first.features.charging.notes = "private";
  assert.equal(emptyCaseChecklist().features.charging.notes, "");
});
test("static worksheet delivers sources, unanswered defaults and privacy, and stays unlinked from the shop", () => {
  for (const file of ["dist/tools/phone-case-check.html", "dist/tools/phone-case-check/index.html"]) {
    const html = readFileSync(file, "utf8");
    for (const text of ['href="https://nobi.ai/tools/phone-case-check"', 'name="phone"', 'name="variant"', 'name="listedModels"', 'name="charging.notes"', 'aria-live="polite"', 'Reset all notes', 'does not save or send', 'disabled=""', 'Enable JavaScript', 'mgf24ll/a/iphone-17-clear-case-with-magsafe', 'mgft4ll/a/iphone-17-pro-clear-case-with-magsafe', 'hypothetical', 'not a “best cases” ranking', 'href="/shop"']) assert.ok(html.includes(text), text);
  }
  assert.ok(!readFileSync("dist/shop.html", "utf8").includes('href="/tools/phone-case-check"'));
  assert.ok(!readFileSync("dist/shop/s/black-leather-boots.html", "utf8").includes('href="/tools/phone-case-check"'));
  assert.ok(readFileSync("public/sitemap-pages.xml", "utf8").includes('<loc>https://nobi.ai/tools/phone-case-check</loc>'));
});
