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
          <div><h2>Standard</h2><p>Search, answers, or both.</p></div>
          <div className="pp-base"><strong>{formatPrice(PRICING.baseCents)}</strong><span>/ month<br />+ extra usage</span></div>
        </div>
        <div className="pp-rates">
          <div className="pp-rate">
            <h3><Search size={21} aria-hidden="true" /> Searches</h3>
            <p>Matching items, pages, or resources.</p>
            <div className="pp-allowance">{PRICING.includedSearches.toLocaleString("en-US")} included</div>
            <div className="pp-unit">Then <strong>{formatPrice(PRICING.searchCents)}</strong> / search</div>
          </div>
          <div className="pp-rate">
            <h3><MessageCircle size={21} aria-hidden="true" /> Messages</h3>
            <p>Questions and conversational follow-ups.</p>
            <div className="pp-allowance">{PRICING.includedMessages} included</div>
            <div className="pp-unit">Then <strong>{formatPrice(PRICING.messageCents)}</strong> / message</div>
          </div>
        </div>
        <div className="pp-example" aria-label="Example of a search followed by a message">
          <div><Search size={17} aria-hidden="true" /><span>“Beginner courses” <small>Search</small></span></div>
          <div><MessageCircle size={17} aria-hidden="true" /><span>“Which run in the evening?” <small>Message</small></span></div>
          <p>A conversation can start with a question, too. Each visitor message counts; Nobi’s replies are included.</p>
        </div>
        <div className="pp-actions"><a className="pp-start" href={getSignupUrl()}>Start for free</a><a className="pp-estimate" href="#pricing-calculator">Estimate my bill <ArrowDown size={17} aria-hidden="true" /></a></div>
        <p className="pp-trial">30-day free trial. No credit card needed.</p>
        <details className="pp-features"><summary>What else is included? <ChevronDown size={20} strokeWidth={2.5} aria-hidden="true" /></summary><p>Up to 5,000 searchable items, 5,000 knowledge base documents, and insights & analytics. Both monthly usage allowances are included; each is tracked separately.</p></details>
      </article>
      <article className="pp-enterprise">
        <h2>Enterprise</h2><strong>Let’s talk</strong><p>For higher usage and custom needs.</p>
        <ul><li><Check size={18} aria-hidden="true" /> Volume discounts</li><li><Check size={18} aria-hidden="true" /> Custom integrations & onboarding</li><li><Check size={18} aria-hidden="true" /> Dedicated support</li></ul>
        <button type="button" onClick={openDemoForm}>Get in touch</button>
      </article>
    </div>
  </section>;
}
