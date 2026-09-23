import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowDown, Check, Info, MessageCircle, Search, X } from "lucide-react";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import { PRICING, formatPrice } from "../utils/pricingEstimate";
import "./PricingPlans.css";

function BillingIntro() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);

  function closeAndFocus() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function dismissOutside(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }
    function dismissOnEscape(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAndFocus();
      }
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [open]);

  return <div className="pp-intro" ref={containerRef}>
    <p><span>Use Nobi for search, with messages for answers and follow-ups.</span><button
      ref={triggerRef}
      type="button"
      className="pp-info-trigger"
      aria-label="How billing works"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? id : undefined}
      onClick={() => setOpen(!open)}
      title="How billing works"
    ><Info size={14} aria-hidden="true" /></button></p>
    {open && <div id={id} className="pp-billing-popover" role="dialog" aria-labelledby={`${id}-title`}>
      <div className="pp-popover-heading">
        <h3 id={`${id}-title`}>How billing works</h3>
        <button ref={closeRef} type="button" onClick={closeAndFocus} aria-label="Close billing details"><X size={16} aria-hidden="true" /></button>
      </div>
      <dl>
        <div><dt><Search size={16} aria-hidden="true" />As a search engine</dt><dd>Most requests are searches. If a visitor asks a question or follows up conversationally, that counts as a message.</dd></div>
        <div><dt><MessageCircle size={16} aria-hidden="true" />As an AI assistant</dt><dd>You’ll have messages too: visitor questions and conversational follow-ups, including a question that starts a conversation.</dd></div>
      </dl>
      <p>Nobi’s replies are included. Extra usage is billed after each monthly allowance.</p>
    </div>}
  </div>;
}

export default function PricingPlans() {
  const { onOpen: openDemoForm } = useDemoForm();

  return <section className="pp-section" aria-label="Pricing plans">
    <div className="pp-grid">
      <article className="pp-standard">
        <div className="pp-heading">
          <h2>Standard</h2>
          <BillingIntro />
          <div className="pp-base"><strong>{formatPrice(PRICING.baseCents)}</strong><span>/ month base</span></div>
        </div>
        <div className="pp-rates">
          <div className="pp-rate pp-rate-search">
            <div className="pp-capability-pill">
              <Search size={16} aria-hidden="true" />
              <div className="pp-pill-copy"><h3>Search engine</h3><p>Mostly searches</p></div>
            </div>
            <div className="pp-allowance">{PRICING.includedSearches.toLocaleString("en-US")} searches included / mo</div>
            <div className="pp-unit"><span>{formatPrice(PRICING.searchCents)}</span> / extra search</div>
          </div>
          <div className="pp-rate pp-rate-assistant">
            <div className="pp-capability-pill">
              <MessageCircle size={16} aria-hidden="true" />
              <div className="pp-pill-copy"><h3>AI assistant</h3><p>Messages too</p></div>
            </div>
            <div className="pp-allowance">{PRICING.includedMessages} messages included / mo</div>
            <div className="pp-unit"><span>{formatPrice(PRICING.messageCents)}</span> / extra message</div>
          </div>
        </div>
        <p className="pp-billing-notes">Nobi’s replies are included. No conversation-start fee.</p>
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
