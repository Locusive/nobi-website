/** Bounds keep every cent operation exact and the gift count practical. */
export const MaxMoneyCents = 999999999;
export const MaxGiftCount = 1000;
export const DefaultGiftBudget = { budget: "100", shipping: "0", tax: "0", wrapping: "0", count: "1" };

/** Read decimal dollars directly into integer cents without floating-point rounding. */
function readCents(value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return null;
  const [whole, fraction = ""] = text.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents <= MaxMoneyCents ? cents : null;
}

/** Validate user estimates and divide only the money remaining after all total fees. */
export function calculateGiftBudget(input) {
  const errors = {};
  const amounts = {};
  for (const key of ["budget", "shipping", "tax", "wrapping"]) {
    const raw = input[key];
    amounts[key] = readCents(key !== "budget" && typeof raw === "string" && raw.trim() === "" ? "0" : raw);
    if (amounts[key] === null) errors[key] = "Enter a nonnegative USD amount with up to two decimal places, no more than $9,999,999.99.";
  }
  const countText = typeof input.count === "string" ? input.count.trim() || "1" : "";
  const count = /^\d+$/.test(countText) ? Number(countText) : NaN;
  if (!Number.isInteger(count) || count < 1 || count > MaxGiftCount) errors.count = "Enter a whole number of gifts from 1 to 1,000, or leave blank for one.";
  if (Object.keys(errors).length) return { errors };
  const totalFeesCents = amounts.shipping + amounts.tax + amounts.wrapping;
  const itemBudgetCents = Math.max(0, amounts.budget - totalFeesCents);
  const perGiftCents = Math.floor(itemBudgetCents / count);
  return { errors, budgetCents: amounts.budget, totalFeesCents, itemBudgetCents, count, perGiftCents,
    leftoverCents: itemBudgetCents - perGiftCents * count,
    shortfallCents: Math.max(0, totalFeesCents - amounts.budget) };
}

/** Display already-calculated integer cents as USD, including a visible zero. */
export function formatGiftMoney(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

/** Shared static and client metadata; this calculator supplies no retailer or tax estimates. */
export const GiftBudgetSeo = { path: "/tools/gift-budget", title: "Gift Budget Calculator | Shop Nobi",
  description: "Subtract your total shipping, tax and wrapping estimates, then split the remaining gift budget in cents. See leftover money or a shortfall.",
  schema: [{ "@context": "https://schema.org", "@type": "WebPage", name: "Gift Budget Calculator", url: "https://nobi.ai/tools/gift-budget" }] };
