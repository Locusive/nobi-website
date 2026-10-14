import React from "react";
import { EXTRA_MESSAGE_CENTS, LARGEST_BUNDLE } from "../constants/pricing";
import { formatCount, formatPrice } from "../utils/pricingEstimate";

const COUNTED_ACTIONS = [
  "A search",
  "A chat question",
  "A click on a suggestion",
  "A question on a product page",
  "A question in the filter panel",
];

/** Explains what counts as a message and what happens when a store goes over its bundle. */
export default function PricingMessageRules() {
  return <div className="pp-rules">
    <section className="pp-rule" aria-labelledby="pp-counts-title">
      <h3 id="pp-counts-title">What counts as a message</h3>
      <p>Everything a shopper types into Nobi counts as one message:</p>
      <ul>{COUNTED_ACTIONS.map(action => <li key={action}>{action}</li>)}</ul>
      <p>There is no separate search allowance. Showing more results for the same search is free.</p>
    </section>
    <section className="pp-rule" aria-labelledby="pp-over-title">
      <h3 id="pp-over-title">If you go over your bundle</h3>
      <p>Each store picks one of two settings:</p>
      <dl>
        <div><dt>Keep going</dt><dd>Nobi keeps running. That month is billed at the bundle that fits your usage.</dd></div>
        <div><dt>Stop and hide Nobi</dt><dd>Nobi stops at your limit and hides from your store until next month.</dd></div>
      </dl>
      <p>Above {formatCount(LARGEST_BUNDLE.messages)} messages on Keep going, you pay {formatPrice(LARGEST_BUNDLE.priceCents)} plus {EXTRA_MESSAGE_CENTS} cents for each extra message.</p>
    </section>
  </div>;
}
