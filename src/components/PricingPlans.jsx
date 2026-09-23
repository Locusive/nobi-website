import React from "react";
import { ArrowDown, ArrowRight, BookOpen, ChevronDown, MessageCircle, Search } from "lucide-react";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import { PRICING, formatPrice } from "../utils/pricingEstimate";
import "./PricingPlans.css";

/** Explain the two capabilities included in the existing Standard subscription. */
export default function PricingPlans() {
  const { onOpen: openDemoForm } = useDemoForm();

  return <section className="pp-section" aria-label="Pricing plans">
    <div className="pp-wrap">
      <div className="pp-heading">
        <div>
          <h2>Standard</h2>
          <div className="pp-base"><span>Starts at</span><strong>{formatPrice(PRICING.baseCents)}</strong><span>/ month</span></div>
          <p className="pp-subtitle">Search and assistant included. Your total grows with usage.</p>
        </div>
        <div className="pp-signup">
          <a className="pp-start" href={getSignupUrl()}>Start for free</a>
          <p>Free dashboard preview. No credit card.</p>
        </div>
      </div>

      <div className="pp-capabilities">
        <article className="pp-capability">
          <div className="pp-capability-title"><Search size={23} strokeWidth={1.8} aria-hidden="true" /><h3>Search engine</h3></div>
          <p className="pp-description">Help visitors find items, pages, and resources on your site.</p>
          <div className="pp-demo pp-search-demo" role="img" aria-label="Search example: Beginner courses returns Photography basics and Intro to pottery.">
            <div className="pp-demo-query" aria-hidden="true"><Search size={16} />Beginner courses</div>
            <div className="pp-demo-results" aria-hidden="true">
              <div><BookOpen size={18} /><span>Photography basics</span></div>
              <div><BookOpen size={18} /><span>Intro to pottery</span></div>
            </div>
          </div>
          <div className="pp-rate">
            <p>{PRICING.includedSearches.toLocaleString("en-US")} searches included / month</p>
            <div>Then <span>{formatPrice(PRICING.searchCents)}</span> / search</div>
          </div>
        </article>

        <article className="pp-capability">
          <div className="pp-capability-title"><MessageCircle size={23} strokeWidth={1.8} aria-hidden="true" /><h3>AI assistant</h3></div>
          <p className="pp-description">Answer questions from your content and help visitors narrow their options.</p>
          <div className="pp-demo pp-assistant-demo" role="img" aria-label="Assistant example: a visitor asks Which run in the evening? Nobi replies Photography basics has an evening class.">
            <div className="pp-demo-question" aria-hidden="true">Which run in the evening?</div>
            <div className="pp-demo-answer" aria-hidden="true"><MessageCircle size={16} /><span>Photography basics has an evening class.</span></div>
          </div>
          <div className="pp-rate">
            <p>{PRICING.includedMessages} visitor messages included / month</p>
            <div>Then <span>{formatPrice(PRICING.messageCents)}</span> / message</div>
          </div>
        </article>
      </div>

      <div className="pp-explanation">
        <p>Searches find results. Questions and conversational follow-ups use assistant messages.</p>
        <p>No conversation-start fee. Nobi’s replies are included.</p>
      </div>
      <details className="pp-billing">
        <summary>More plan details <ChevronDown size={20} aria-hidden="true" /></summary>
        <div className="pp-billing-body">
          <p>Simple queries from the search bar use the search allowance. Questions and longer requests can use the assistant from the start. Conversational follow-ups use the message allowance.</p>
          <p>The allowances reset monthly and are tracked separately. Extra usage is billed automatically. Also included: 5,000 searchable items, 5,000 knowledge base documents, and analytics.</p>
        </div>
      </details>

      <aside className="pp-enterprise" aria-label="Enterprise pricing">
        <div><h2>Enterprise</h2><p>Custom pricing, volume discounts, and hands-on support.</p></div>
        <button type="button" onClick={openDemoForm}>Let’s talk <ArrowRight size={17} aria-hidden="true" /></button>
      </aside>
      <div className="pp-next"><a href="#pricing-calculator">Estimate my bill <ArrowDown size={19} aria-hidden="true" /></a><p>See how your expected activity affects your monthly cost.</p></div>
    </div>
  </section>;
}
