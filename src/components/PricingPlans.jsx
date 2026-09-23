import React from "react";
import { ArrowDown, Camera, Check, ChevronDown, MessageCircle, Paintbrush, Search, Sparkles } from "lucide-react";
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
          <div className="pp-rate">
            <h3><Search size={21} aria-hidden="true" /> Search engine</h3>
            <div className="pp-preview pp-search-preview" role="img" aria-label="Search example: Beginner courses returns Photography and Pottery.">
              <div className="pp-preview-query" aria-hidden="true"><Search size={14} /><span>Beginner courses</span></div>
              <div className="pp-preview-results" aria-hidden="true">
                <div><Camera size={16} /><span>Photography</span></div>
                <div><Paintbrush size={16} /><span>Pottery</span></div>
              </div>
            </div>
            <div className="pp-allowance">{PRICING.includedSearches.toLocaleString("en-US")} searches included / mo</div>
            <div className="pp-unit"><span>{formatPrice(PRICING.searchCents)}</span> / extra search</div>
          </div>
          <div className="pp-rate">
            <h3><MessageCircle size={21} aria-hidden="true" /> AI assistant</h3>
            <div className="pp-preview pp-chat-preview" role="img" aria-label="Assistant example: a visitor asks Any evening classes? Nobi replies Photography, 6 pm. Only the visitor's message counts.">
              <div className="pp-preview-question" aria-hidden="true">Any evening classes?</div>
              <div className="pp-preview-answer" aria-hidden="true"><Sparkles size={14} /><span>Photography, 6 pm.</span></div>
            </div>
            <div className="pp-allowance">{PRICING.includedMessages} messages included / mo</div>
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
