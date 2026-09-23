import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useDemoForm } from '../context/DemoFormContext';
import { getSignupUrl } from '../utils/signupUrl';
import { trackDemoFormOpened } from '../utils/eventTracker';
import { PRICING_DESCRIPTION, PRICING_FAQS, STANDARD_PLAN } from '../constants/pricing.js';
import Nav from '../components/home/Nav';
import CustomerLogos from '../components/home/CustomerLogos';
import SiteFooter from '../components/home/SiteFooter';
import PricingCalculator from '../components/PricingCalculator.jsx';
import '../components/home/homepage.css';
import './Pricing.css';

export default function Pricing() {
  const { onOpen } = useDemoForm();
  const openDemo = () => { trackDemoFormOpened(); onOpen(); };
  useSEO({
    title: 'Pricing | Nobi', description: PRICING_DESCRIPTION, path: '/pricing',
    schema: {
      '@context': 'https://schema.org', '@type': 'Product', name: 'Nobi',
      description: PRICING_DESCRIPTION, brand: { '@type': 'Brand', name: 'Nobi' },
      offers: { '@type': 'Offer', price: String(STANDARD_PLAN.monthlyCents / 100), priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://nobi.ai/pricing' },
    },
  });

  return (
    <div className="pricing-page">
      <Nav active="pricing" />
      <main>
        <section className="pricing-hero">
          <span className="pricing-eyebrow">Pricing</span>
          <h1>Simple, usage-based pricing</h1>
          <p>Search, answers, or both. Start free, grow as you go.</p>
        </section>

        <section className="pricing-plans" aria-label="Plans">
          <div className="pricing-container pricing-plan-grid">
            <div className="pricing-standard">
              <div className="pricing-plan-top"><h2>Standard</h2><div className="pricing-plan-price"><strong>${STANDARD_PLAN.monthlyCents / 100}</strong><span>/ month + usage</span></div></div>
              <div className="pricing-rates">
                <div><h3>Searches</h3><p>Results without a conversation.</p><strong>2,500 included</strong><span>Then $0.01 per search</span></div>
                <div><h3>Assistant messages</h3><p>Questions and follow-ups. Replies included.</p><strong>250 included</strong><span>Then $0.10 per message</span></div>
              </div>
              <a href={getSignupUrl()} className="pricing-button pricing-button-primary">Start for free</a>
              <p className="pricing-card-note">No credit card needed. <a href="#pricing-calculator">Estimate your cost</a></p>
              <details className="pricing-plan-includes"><summary>What else is included?<ChevronDown size={15} aria-hidden="true" /></summary><ul><li>Up to 5,000 searchable items</li><li>Up to 5,000 knowledge base documents</li><li>Insights, analytics, and lead capture</li></ul></details>
            </div>
            <div className="pricing-enterprise">
              <h2>Enterprise</h2>
              <div className="pricing-custom-price">Let’s talk</div>
              <p>For higher usage and custom needs.</p>
              <ul>{['Volume discounts', 'Custom integrations & onboarding', 'Dedicated support'].map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
              <button className="pricing-button pricing-button-light" type="button" onClick={openDemo}>Get in touch</button>
            </div>
          </div>
        </section>

        <div className="pricing-logos"><CustomerLogos /></div>
        <PricingCalculator />

        <section className="pricing-faq-section" aria-labelledby="pricing-faq-title">
          <div className="pricing-container">
            <h2 id="pricing-faq-title">Pricing questions</h2>
            <div className="pricing-faqs">
              {PRICING_FAQS.map(faq => (
                <details key={faq.q} className="nb-faq">
                  <summary>{faq.q}<ChevronDown className="nb-faq-chev" size={17} aria-hidden="true" /></summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
