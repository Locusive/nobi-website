import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { calculateGiftBudget, DefaultGiftBudget, formatGiftMoney } from "../src/utils/giftBudget.js";

const Slug = "how-to-split-a-gift-budget";
const Canonical = `https://nobi.ai/blog/${Slug}`;
const article = () => readFileSync(`dist/blog/${Slug}/index.html`, "utf8");

test("published equal-share examples match the usable calculator without overspending", () => {
  const html = article();
  for (const [count, allowance, remainder] of [[3, 2400, 0], [5, 1440, 0], [7, 1028, 4]]) {
    const result = calculateGiftBudget({ ...DefaultGiftBudget, shipping: "15", tax: "8", wrapping: "5", count: String(count) });
    assert.equal(result.itemBudgetCents, 7200);
    assert.equal(result.perGiftCents, allowance);
    assert.equal(result.leftoverCents, remainder);
    assert.ok(html.includes(`<td>${count}</td><td>${formatGiftMoney(allowance)}</td><td>${formatGiftMoney(remainder)}</td>`));
  }
  assert.ok(html.includes("$72.03"));
  assert.ok(html.includes("$20 shortfall"));
});

test("article and calculator expose an indexable two-way journey to published gift guidance", () => {
  const html = article();
  assert.ok(html.includes(`rel="canonical" href="${Canonical}"`));
  for (const path of ["/tools/gift-budget", "/gift-guides", "/blog/gifts-for-someone-who-wants-nothing", "/blog/headphones-as-a-gift", "/blog/trivia-card-game-gift"]) {
    assert.ok(html.includes(`href="${path}"`), path);
    const destination = path.startsWith("/blog/") ? `dist${path}/index.html` : `dist${path}.html`;
    assert.ok(readFileSync(destination, "utf8").length > 0);
  }
  for (const file of ["dist/tools/gift-budget.html", "dist/tools/gift-budget/index.html"]) {
    assert.ok(readFileSync(file, "utf8").includes(`href="/blog/${Slug}"`));
  }
  assert.ok(readFileSync("public/sitemap-pages.xml", "utf8").includes(`<loc>${Canonical}</loc>`));
  assert.ok(html.includes("These amounts illustrate the arithmetic"));
  assert.ok(html.includes("not a holiday") || html.includes("not a promise"));
  assert.ok(html.includes("may earn a commission"));
});
