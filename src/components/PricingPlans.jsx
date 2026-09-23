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
          <div className="pp-base"><strong>{formatPrice(PRICING.baseCents)}</strong><span>/ month<br />+ extra usage</span></div>
        </div>
        <div className="pp-rates">
          <div className="pp-rate">
            <h3><Search size={21} aria-hidden="true" /> Searches</h3>
            <div className="pp-allowance">{PRICING.includedSearches.toLocaleString("en-US")} included</div>
            <div className="pp-unit">Then <strong>{formatPrice(PRICING.searchCents)}</strong> each</div>
          </div>
          <div className="pp-rate">
            <h3><MessageCircle size={21} aria-hidden="true" /> Questions &amp; follow-ups</h3>
            <div className="pp-allowance">{PRICING.includedMessages} included</div>
            <div className="pp-unit">Then <strong>{formatPrice(PRICING.messageCents)}</strong> each</div>
          </div>
        </div>
        <div className="pp-actions"><a className="pp-start" href={getSignupUrl()}>Start for free</a><a className="pp-estimate" href="#pricing-calculator">Estimate my bill <ArrowDown size={17} aria-hidden="true" /></a></div>
        <p className="pp-trial">30 days free · No credit card</p>
        <details className="pp-features">
          <summary>How billing works <ChevronDown size={23} strokeWidth={2.5} aria-hidden="true" /></summary>
          <div className="pp-details-body">
            <p><strong>Searches</strong> return matching items, pages, or resources. <strong>Messages</strong> are visitor questions and conversational follow-ups. Nobi’s replies are included.</p>
            <div className="pp-example" aria-label="Example of a search followed by a message">
              <div><Search size={17} aria-hidden="true" /><span>“Beginner courses” <small>Search</small></span></div>
              <div><MessageCircle size={17} aria-hidden="true" /><span>“Which run in the evening?” <small>Message</small></span></div>
            </div>
            <p>A question that starts a conversation counts as a message, too. Both allowances renew monthly and are tracked separately.</p>
            <p>Also included: 5,000 searchable items, 5,000 knowledge base documents, and insights & analytics.</p>
          </div>
        </details>
      </article>
      <article className="pp-enterprise">
        <h2>Enterprise</h2><strong>Custom pricing</strong>
        <ul><li><Check size={18} aria-hidden="true" /> Volume discounts</li><li><Check size={18} aria-hidden="true" /> Custom setup</li><li><Check size={18} aria-hidden="true" /> Dedicated support</li></ul>
        <button type="button" onClick={openDemoForm}>Get in touch</button>
      </article>
    </div>
  </section>;
}
