import React, { useState } from "react";
import PageLayout from "../components/PageLayout.jsx";
import { useSEO } from "../hooks/useSEO.js";
import { calculateGiftBudget, DefaultGiftBudget, formatGiftMoney, GiftBudgetSeo } from "../utils/giftBudget.js";

const Fields = [
  ["budget", "Total budget (USD)"],
  ["shipping", "Total estimated shipping (USD)"],
  ["tax", "Total estimated tax (USD)"],
  ["wrapping", "Total estimated wrapping (USD)"],
  ["count", "Number of gifts (optional)"],
];
const ControlClass = "mt-2 w-full rounded-lg border border-black/30 bg-white p-3 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600";

/** A local-only calculator that reserves user-estimated fees before allocating gift money. */
export default function GiftBudget() {
  useSEO(GiftBudgetSeo);
  const [input, setInput] = useState(DefaultGiftBudget);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(() => calculateGiftBudget(DefaultGiftBudget));
  const submit = event => {
    event.preventDefault();
    const calculation = calculateGiftBudget(input);
    setErrors(calculation.errors);
    setResult(Object.keys(calculation.errors).length ? null : calculation);
  };
  const update = (key, value) => {
    setInput(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: null }));
    setResult(null);
  };
  return <PageLayout active="shop"><div className="mx-auto max-w-5xl px-6 pb-16 text-black dark:text-white">
    <a href="/gift-guides" className="underline underline-offset-4">← Gift guides</a>
    <header className="max-w-3xl py-8"><p className="text-sm font-semibold uppercase tracking-widest text-purple-700 dark:text-purple-300">Plan the whole gift</p><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">What’s left for the gifts?</h1><p className="mt-5 text-lg text-black/70 dark:text-white/70">Set aside shipping, tax and wrapping before choosing. Enter your estimates for all gifts together, then see a per-gift amount that stays within that budget.</p></header>
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={submit} noValidate className="rounded-2xl border border-black/10 p-6 dark:border-white/20">
        <p id="gift-budget-help" className="mb-5 text-sm">All fees below are <strong>totals</strong>, not per-gift costs or tax percentages. Blank fee estimates count as $0. Leave gift count blank for one.</p>
        {Fields.map(([key, label]) => <div key={key} className="mb-5"><label htmlFor={`gb-${key}`} className="font-semibold">{label}</label><input id={`gb-${key}`} name={key} type="text" inputMode={key === "count" ? "numeric" : "decimal"} value={input[key]} maxLength="16" onChange={event => update(key, event.target.value)} className={ControlClass} aria-invalid={!!errors[key]} aria-describedby={`gift-budget-help${errors[key] ? ` gb-${key}-error` : ""}`} />{errors[key] && <p id={`gb-${key}-error`} className="mt-2 text-sm text-red-700 dark:text-red-300">{errors[key]}</p>}</div>)}
        {Object.values(errors).some(Boolean) && <p role="alert" className="mb-4 text-red-700 dark:text-red-300">Check the highlighted amounts and gift count.</p>}
        <button type="submit" className="rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600">Calculate gift budget</button>
      </form>
      <section aria-label="Budget result" aria-live="polite" aria-atomic="true" className="self-start rounded-2xl bg-slate-50 p-6 dark:bg-white/5">
        {result ? <BudgetResult result={result} /> : <p>Update your estimates, then calculate to see the new amounts.</p>}
        <p className="mt-6 text-sm text-black/60 dark:text-white/70">This uses only the dollar estimates you enter. Actual retailer totals, taxes and delivery costs can differ. No tax rate, quote or delivery promise is supplied.</p>
      </section>
    </div>
    <section className="mt-10"><h2 className="text-xl font-semibold">Ready to narrow the choices?</h2><p className="mt-3">For equal shares, uneven budgets and worked examples, read <a href="/blog/how-to-split-a-gift-budget" className="underline underline-offset-4">how to split a gift budget</a>.</p><p className="mt-3">Explore our <a href="/gift-guides" className="underline underline-offset-4">gift guides</a> or use the <a href="/tools/gift-chooser" className="underline underline-offset-4">gift chooser’s reviewed examples</a> with your item budget.</p></section>
  </div></PageLayout>;
}

/** Keep shortfalls separate from the nonnegative item allocation and unallocated cents. */
function BudgetResult({ result }) {
  if (result.shortfallCents > 0) return <><h2 className="text-xl font-semibold">Your fee estimates exceed the budget</h2><p className="mt-4 text-3xl font-semibold">{formatGiftMoney(result.shortfallCents)} shortfall</p><p className="mt-4">No money remains for gifts. Adjust the total budget or your fee estimates before choosing.</p></>;
  return <><h2 className="text-xl font-semibold">{formatGiftMoney(result.itemBudgetCents)} left for gifts</h2><p className="mt-4 text-4xl font-semibold">{formatGiftMoney(result.perGiftCents)} <span className="text-base font-normal">per gift</span></p><dl className="mt-6 space-y-2"><div><dt className="inline">Total estimated fees: </dt><dd className="inline font-semibold">{formatGiftMoney(result.totalFeesCents)}</dd></div><div><dt className="inline">Number of gifts: </dt><dd className="inline font-semibold">{result.count}</dd></div><div><dt className="inline">Left unallocated after equal split: </dt><dd className="inline font-semibold">{formatGiftMoney(result.leftoverCents)}</dd></div></dl><p className="mt-4 text-sm">The equal split rounds down to whole cents. Any leftover stays within your budget; it is not added to each gift.</p></>;
}
