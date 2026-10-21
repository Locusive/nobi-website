import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { calculateGiftBudget, DefaultGiftBudget, MaxMoneyCents } from "../src/utils/giftBudget.js";
const calculate = changes => calculateGiftBudget({ ...DefaultGiftBudget, ...changes });
test("reserves total fees once and splits whole cents without overspending", () => {
 const result = calculate({ shipping: "10", tax: "8", wrapping: "2", count: "3" });
 assert.equal(result.totalFeesCents, 2000); assert.equal(result.itemBudgetCents, 8000);
 assert.equal(result.perGiftCents, 2666); assert.equal(result.leftoverCents, 2);
 assert.equal(result.perGiftCents * 3 + result.leftoverCents + result.totalFeesCents, 10000);
});
test("decimal subtraction remains exact and a zero budget is valid", () => {
 assert.equal(calculate({ budget: "0.30", shipping: "0.10", tax: "0.20" }).itemBudgetCents, 0);
 assert.equal(calculate({ budget: "0" }).perGiftCents, 0);
 const result = calculate({ budget: "0.01", count: "1000" });
 assert.equal(result.perGiftCents, 0); assert.equal(result.leftoverCents, 1);
});
test("fee shortfall never becomes a negative gift allowance", () => {
 const result = calculate({ shipping: "120" });
 assert.equal(result.shortfallCents, 2000); assert.equal(result.itemBudgetCents, 0); assert.equal(result.perGiftCents, 0);
});
test("blank estimates count as zero and blank optional count means one gift", () => {
 const result = calculate({ shipping: " ", tax: "", wrapping: "", count: "" });
 assert.equal(result.totalFeesCents, 0); assert.equal(result.count, 1); assert.equal(result.perGiftCents, 10000);
});
test("rejects malformed money and nonwhole or out-of-bound gift counts", () => {
 for (const budget of ["", "-1", "NaN", "Infinity", "1e3", "1.001", "10000000", "USD5", null]) assert.ok(calculate({ budget }).errors.budget);
 assert.ok(calculate({ tax: "-0.01" }).errors.tax);
 for (const count of ["0", "-1", "1.5", "Infinity", "1001", "2x"]) assert.ok(calculate({ count }).errors.count);
 assert.equal(calculate({ budget: "9999999.99" }).budgetCents, MaxMoneyCents);
});
test("both static forms expose labels, estimate limits, links and canonical", () => {
 for (const file of ["dist/tools/gift-budget.html", "dist/tools/gift-budget/index.html"]) {
  const html = readFileSync(file, "utf8");
  for (const text of ['<title>Gift Budget Calculator | Shop Nobi</title>', 'href="https://nobi.ai/tools/gift-budget"', 'Total estimated shipping (USD)', 'Total estimated tax (USD)', 'Total estimated wrapping (USD)', 'Number of gifts (optional)', 'aria-live="polite"', 'href="/gift-guides"', 'href="/tools/gift-chooser"']) assert.ok(html.includes(text), text);
 }
 assert.ok(readFileSync("public/sitemap-pages.xml", "utf8").includes('<loc>https://nobi.ai/tools/gift-budget</loc>'));
 assert.ok(readFileSync("dist/gift-guides.html", "utf8").includes('href="/tools/gift-budget"'));
});
