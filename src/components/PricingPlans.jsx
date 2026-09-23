import React from "react";
import { ArrowDown, Check, ChevronDown } from "lucide-react";
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
            <h3>Search</h3>
            <p className="pp-description">Find relevant results</p>
            <div className="pp-allowance">{PRICING.includedSearches.toLocaleString("en-US")} included / month</div>
            <div className="pp-unit"><span>{formatPrice(PRICING.searchCents)}</span> / extra search</div>
          </div>
          <div className="pp-rate pp-rate-assistant">
            <h3>Assistant</h3>
            <p className="pp-description">Answers &amp; follow-ups</p>
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
        <details className="pp-features">
          <summary>More plan details <ChevronDown size={23} strokeWidth={2.5} aria-hidden="true" /></summary>
          <div className="pp-details-body">
            <p>Each visitor question or conversational follow-up counts as a message, including questions that start a conversation.</p>
            <p>Both allowances renew monthly and are tracked separately. Extra usage is billed automatically at the rates above.</p>
            <p>Also included: 5,000 searchable items, 5,000 knowledge base documents, and insights & analytics.</p>
          </div>
        </details>
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
