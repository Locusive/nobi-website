import React from "react";
import { ArrowDown, Check, ChevronDown, MessageCircle, Search } from "lucide-react";
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
          <div className="pp-base"><span>Starts at</span><strong>{formatPrice(PRICING.baseCents)}</strong><span>/ month</span></div>
          <p className="pp-price-note">Plus extra usage at the rates below.</p>
        </div>
        <div className="pp-rates">
          <div className="pp-rate">
            <h3><Search size={21} aria-hidden="true" /> Search engine</h3>
            <p className="pp-description">Find matching items, pages, and resources.</p>
            <div className="pp-allowance">{PRICING.includedSearches.toLocaleString("en-US")} searches / month included</div>
            <div className="pp-unit">Then <span>{formatPrice(PRICING.searchCents)}</span> / search</div>
          </div>
          <div className="pp-rate">
            <h3><MessageCircle size={21} aria-hidden="true" /> AI assistant</h3>
            <p className="pp-description">Answer questions and refine search results.</p>
            <div className="pp-allowance">{PRICING.includedMessages} messages / month included</div>
            <div className="pp-unit">Then <span>{formatPrice(PRICING.messageCents)}</span> / message</div>
          </div>
        </div>
        <p className="pp-explanation">Each visitor question or conversational follow-up counts as a message. Nobi’s replies are included. No conversation-start fee.</p>
        <a className="pp-start" href={getSignupUrl()}>Start for free</a>
        <p className="pp-trial">Free dashboard preview. No credit card.</p>
        <details className="pp-features">
          <summary>More plan details <ChevronDown size={23} strokeWidth={2.5} aria-hidden="true" /></summary>
          <div className="pp-details-body">
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
