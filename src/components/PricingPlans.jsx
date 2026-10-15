import React from "react";
import { Check } from "lucide-react";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import { LARGEST_BUNDLE, MESSAGE_BUNDLES } from "../constants/pricing";
import { formatCount, formatPrice, formatPricePerMessage } from "../utils/priceFormat";
import BundleSlider from "./BundleSlider.jsx";
import PricingMessageRules from "./PricingMessageRules.jsx";
import "./PricingPlans.css";

/** The full list of monthly bundles, with the custom tier at the end. */
function BundleTable() {
  return <table className="pp-bundles">
    <caption>Monthly message bundles</caption>
    <thead><tr><th scope="col">Messages a month</th><th scope="col">Price a month</th><th scope="col">Price per message</th></tr></thead>
    <tbody>
      {MESSAGE_BUNDLES.map(bundle => <tr key={bundle.messages}>
        <th scope="row">{formatCount(bundle.messages)}</th>
        <td>{formatPrice(bundle.priceCents)}</td>
        <td>{formatPricePerMessage(bundle)}</td>
      </tr>)}
      <tr className="pp-bundles-custom"><th scope="row">Over {formatCount(LARGEST_BUNDLE.messages)}</th><td colSpan={2}>Custom pricing</td></tr>
    </tbody>
  </table>;
}

/** The pricing overview: the bundle slider, the enterprise card, and what counts as a message. */
export default function PricingPlans() {
  const { onOpen: openDemoForm } = useDemoForm();

  return <section className="pp-section" aria-label="Pricing plans">
    <div className="pp-grid">
      <article className="pp-standard">
        <div className="pp-heading">
          <h2>Message bundles</h2>
          <p className="pp-intro">Pick a monthly bundle. Every search and every chat question counts as one message.</p>
        </div>
        <BundleSlider />
        <details className="pp-all-bundles">
          <summary>See all bundles</summary>
          <BundleTable />
        </details>
        <a className="pp-start" href={getSignupUrl()}>Start for free</a>
        <p className="pp-trial">Free dashboard preview. No credit card.</p>
      </article>
      <article className="pp-enterprise">
        <h2>Enterprise</h2><strong>Custom pricing</strong>
        <p className="pp-enterprise-description">For more than {formatCount(LARGEST_BUNDLE.messages)} messages a month, or custom needs.</p>
        <ul><li><Check size={18} aria-hidden="true" /> Volume discounts</li><li><Check size={18} aria-hidden="true" /> Custom setup</li><li><Check size={18} aria-hidden="true" /> Dedicated support</li></ul>
        <button type="button" onClick={openDemoForm}>Talk to sales</button>
      </article>
    </div>
    <PricingMessageRules />
  </section>;
}
