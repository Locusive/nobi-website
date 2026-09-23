import React from 'react';
import { Check, ChevronDown, Search, MessagesSquare } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useDemoForm } from '../context/DemoFormContext';
import { getSignupUrl } from '../utils/signupUrl';
import { trackDemoFormOpened } from '../utils/eventTracker';
import { PRICING_DESCRIPTION, PRICING_FAQS, STANDARD_PLAN } from '../constants/pricing.js';
import Nav from '../components/home/Nav';
import SiteFooter from '../components/home/SiteFooter';
import PricingCalculator from '../components/PricingCalculator.jsx';
import '../components/home/homepage.css';
import './Pricing.css';

const LOGOS = [
  { alt: 'UNTUCKit', src: '/media/logos/untuckit.svg', height: 20 },
  { alt: 'Lucchese', src: '/media/logos/lucchese.svg', height: 26 },
  { alt: 'Kilte', src: '/media/logos/kilte.webp', height: 22 },
  { alt: 'TOOLUP', src: '/media/logos/toolup.svg', height: 22 },
  { alt: 'Alps and Meters', src: '/media/logos/alps_meters.png', height: 22 },
];

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
          <div className="pricing-container pricing-hero-grid">
            <div className="pricing-hero-copy">
              <p className="pricing-small-label">Nobi pricing</p>
              <h1>Great search.<br />Helpful answers.<br />Clear pricing.</h1>
              <p className="pricing-hero-description">Use Nobi for search, an AI assistant, or both. Pay for the requests your visitors make, with a monthly allowance of each included.</p>
              <a href="#pricing-calculator" className="pricing-button pricing-button-light">Find your setup &amp; cost <ArrowIcon /></a>
              <p className="pricing-hero-note">Try Nobi free. No credit card needed.</p>
            </div>
            <div className="pricing-plan-summary">
              <div className="pricing-plan-heading"><h2>Standard</h2><span>One plan. Your choice of setup.</span></div>
              <div className="pricing-plan-price"><strong>${STANDARD_PLAN.monthlyCents / 100}</strong><span>/ month<br />+ usage beyond your allowances</span></div>
              <div className="pricing-allowance">
                <Search size={22} aria-hidden="true" />
                <div><h3>{STANDARD_PLAN.includedSearches.toLocaleString('en-US')} searches included</h3><p>Find relevant results, without a conversation.</p><strong>Then $0.01 per additional search</strong></div>
              </div>
              <div className="pricing-allowance">
                <MessagesSquare size={22} aria-hidden="true" />
                <div><h3>{STANDARD_PLAN.includedMessages} assistant messages included</h3><p>Answer questions or refine results through chat.</p><strong>Then $0.10 per additional assistant message</strong></div>
              </div>
              <p className="pricing-plan-note">Both allowances are included every month. An assistant message means one visitor request, with Nobi’s reply included.</p>
              <a href={getSignupUrl()} className="pricing-button pricing-button-primary">Start for free</a>
            </div>
          </div>
        </section>

        <div className="pricing-trust pricing-container">
          <p>Trusted by teams who care about discovery</p>
          <div>{LOGOS.map(logo => <img key={logo.alt} src={logo.src} alt={logo.alt} style={{ height: logo.height }} />)}</div>
        </div>

        <PricingCalculator />

        <section className="pricing-section pricing-plan-details" aria-labelledby="included-title">
          <div className="pricing-container pricing-details-grid">
            <div>
              <h2 id="included-title">A complete toolkit.<br />One monthly base.</h2>
              <p>All three setups use the same Standard plan. Choose the experience that fits your site.</p>
              <ul className="pricing-feature-list">
                {['Up to 5,000 searchable items', 'Up to 5,000 knowledge base documents', 'Insights & analytics', 'Search, answers & lead capture'].map(item => <li key={item}><Check size={18} aria-hidden="true" />{item}</li>)}
              </ul>
              <p className="pricing-trial-note"><strong>Start in your dashboard for free.</strong> Get 100 free messages every month, no credit card needed. Ready for your website? Start a {STANDARD_PLAN.trialDays}-day free trial.</p>
            </div>
            <aside className="pricing-enterprise">
              <span className="pricing-small-label">Enterprise</span>
              <h3>More volume?<br />Let’s find your fit.</h3>
              <p>Custom pricing for larger sites, higher usage, and annual commitments.</p>
              <ul><li>Volume discounts on usage</li><li>Custom integrations &amp; onboarding</li><li>Dedicated support</li><li>More than 5,000 searchable items or documents</li></ul>
              <button className="pricing-button pricing-button-outline" type="button" onClick={openDemo}>Talk through your setup</button>
            </aside>
          </div>
        </section>

        <section className="pricing-section pricing-faq-section" aria-labelledby="pricing-faq-title">
          <div className="pricing-container pricing-faq-layout">
            <div><h2 id="pricing-faq-title">A few good<br />pricing questions.</h2><p>Still working out your setup?</p><button type="button" className="pricing-text-button" onClick={openDemo}>Let’s talk it through</button></div>
            <div className="pricing-faqs">
              {PRICING_FAQS.map((faq, index) => (
                <details key={faq.q} open={index === 0} className="nb-faq">
                  <summary>{faq.q}<ChevronDown className="nb-faq-chev" size={18} aria-hidden="true" /></summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="pricing-final-cta">
          <div className="pricing-container"><h2>See what Nobi can do on your site.</h2><p>Try search and the assistant in your dashboard, free.</p><a className="pricing-button pricing-button-light" href={getSignupUrl()}>Start for free</a></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ArrowIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" /></svg>;
}
