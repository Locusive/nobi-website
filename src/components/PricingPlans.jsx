import React from "react";
import { ArrowDown, Check } from "lucide-react";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import { PRICING, formatPrice } from "../utils/pricingEstimate";
import "./PricingPlans.css";

export default function PricingPlans() {
  const { onOpen: openDemoForm } = useDemoForm();

  return <section className="pp-section" aria-label="Pricing plans">
    <div className="pp-grid">
      <article className="pp-standard">
        <div className="pp-heading">
          <h2>Standard</h2>
          <div className="pp-base"><span>Starts at</span><strong>{formatPrice(PRICING.baseCents)}</strong><span>/ month<br />+ extra usage</span></div>
        </div>
        <div className="pp-rates">
          <div className="pp-rate pp-rate-search">
            <div className="pp-capability-pill">
              <h3>Search request</h3>
              <p>Find relevant results</p>
            </div>
            <div className="pp-allowance">{PRICING.includedSearches.toLocaleString("en-US")} included / month</div>
            <div className="pp-unit"><span>{formatPrice(PRICING.searchCents)}</span> / extra search</div>
          </div>
          <div className="pp-rate pp-rate-assistant">
            <div className="pp-capability-pill">
              <h3>Chat message</h3>
              <p>Questions &amp; <span>follow-ups</span></p>
            </div>
            <div className="pp-allowance">{PRICING.includedMessages} included / month</div>
            <div className="pp-unit"><span>{formatPrice(PRICING.messageCents)}</span> / extra message</div>
          </div>
        </div>
        <ul className="pp-billing-notes">
          <li><Check size={14} aria-hidden="true" />Nobi’s replies are included</li>
          <li><Check size={14} aria-hidden="true" />No conversation-start fee</li>
        </ul>
        <a className="pp-start" href={getSignupUrl()}>Start for free</a>
        <p className="pp-trial">Free dashboard preview. No credit card.</p>
      </article>
      <article className="pp-enterprise">
        <h2>Enterprise</h2><strong>Custom pricing</strong>
        <p className="pp-enterprise-description">For higher usage and custom needs.</p>
        <ul><li><Check size={18} aria-hidden="true" /> Volume discounts</li><li><Check size={18} aria-hidden="true" /> Custom setup</li><li><Check size={18} aria-hidden="true" /> Dedicated support</li></ul>
        <button type="button" onClick={openDemoForm}>Get in touch</button>
      </article>
    </div>
    <div className="pp-next"><a href="#pricing-calculator">Estimate my bill <ArrowDown size={17} aria-hidden="true" /></a></div>
  </section>;
}
