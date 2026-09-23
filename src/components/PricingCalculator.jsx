import React, { useRef, useState } from 'react';
import { Search, MessagesSquare, Check, ArrowDown } from 'lucide-react';
import { PRICING_MODES, STANDARD_PLAN } from '../constants/pricing.js';
import { estimateMonthlyCost, estimateUsageFromVisits, normalizeCount, money, MAX_ESTIMATE_COUNT } from '../utils/pricing.js';
import { EVENTS } from '../constants/events';
import { trackEvent } from '../utils/eventTracker';
import { getSignupUrl } from '../utils/signupUrl';
import PricingEstimateForm from './PricingEstimateForm.jsx';

const integer = value => value.toLocaleString('en-US');

export default function PricingCalculator() {
  const [modeId, setModeId] = useState('both');
  const [inputMethod, setInputMethod] = useState('usage');
  const [searches, setSearches] = useState(5000);
  const [messages, setMessages] = useState(500);
  const [visits, setVisits] = useState(50000);
  const [searchRate, setSearchRate] = useState(3.5);
  const [messageRate, setMessageRate] = useState(0.5);
  const trackedEstimate = useRef(false);
  const mode = PRICING_MODES.find(item => item.id === modeId);
  const usage = inputMethod === 'traffic'
    ? estimateUsageFromVisits(visits, searchRate, messageRate)
    : { searches: normalizeCount(searches), messages: normalizeCount(messages) };
  const activeSearches = mode.hasSearch ? usage.searches : 0;
  const activeMessages = mode.hasMessages ? usage.messages : 0;
  const estimate = estimateMonthlyCost(activeSearches, activeMessages);
  const snapshot = {
    setup: mode.title, input_method: inputMethod,
    searches: activeSearches, messages: activeMessages,
    estimated_monthly_cost: estimate.totalCents / 100,
  };

  function trackInteraction(interactionType) {
    if (trackedEstimate.current) return;
    trackedEstimate.current = true;
    trackEvent(EVENTS.PRICING_CALCULATOR_ESTIMATE_INTERACTION, {
      'Source': 'Marketing Pricing Calculator',
      'Interaction Type': interactionType,
      'Monthly Visitors': inputMethod === 'traffic' ? normalizeCount(visits) : null,
      'Searches': activeSearches, 'Messages': activeMessages,
      'Has Search': mode.hasSearch, 'Has Messages': mode.hasMessages,
      'Estimated Monthly Cost': estimate.totalCents / 100,
      'Setup': mode.title,
    }, { gaProperties: { ...snapshot, source: 'marketing_pricing_calculator', interaction_type: interactionType }, visitorContext: 'Visitor is estimating Nobi pricing for their website.' });
  }

  function selectMode(nextMode) {
    setModeId(nextMode.id);
    trackEvent(EVENTS.PRICING_CALCULATOR_MODE_CHANGED, {
      mode: nextMode.id, has_search: nextMode.hasSearch, has_messages: nextMode.hasMessages,
    }, { visitorContext: `Visitor is evaluating Nobi for ${nextMode.title.toLowerCase()}.` });
  }

  return (
    <section id="pricing-calculator" className="pricing-guide pricing-section" aria-labelledby="pricing-guide-title">
      <div className="pricing-container">
        <div className="pricing-section-heading">
          <h2 id="pricing-guide-title">How will you use Nobi?</h2>
          <p>Choose a setup to see what counts and estimate your cost. No signup needed.</p>
        </div>
        <fieldset className="pricing-mode-picker">
          <legend className="pricing-sr-only">Choose your Nobi setup</legend>
          {PRICING_MODES.map(item => (
            <label key={item.id} className={`pricing-mode ${modeId === item.id ? 'is-selected' : ''}`}>
              <input type="radio" name="pricing-mode" value={item.id} checked={modeId === item.id} onChange={() => selectMode(item)} />
              <span className="pricing-mode-text"><strong>{item.title}</strong><span>{item.description}</span></span>
              <span className="pricing-mode-check" aria-hidden="true">{modeId === item.id && <Check size={14} />}</span>
            </label>
          ))}
        </fieldset>
        <p className="pricing-setup-note">Three ways to use the same $25/month plan. This chooser changes your estimate, not your account.</p>

        <div className="pricing-example" aria-live="polite" aria-atomic="true">
          <div className="pricing-example-intro">
            <span className="pricing-small-label">An example on your site</span>
            <h3>{mode.exampleTitle}</h3>
            <p>{mode.explanation}</p>
            {mode.hasMessages && <p className="pricing-example-reply">Each assistant message includes Nobi’s reply.</p>}
          </div>
          <div className="pricing-example-receipt">
            <ol className="pricing-request-list">
              {mode.steps.map((step, index) => (
                <li key={`${modeId}-${index}`}>
                  <span className={`pricing-request-icon ${step.type}`} aria-hidden="true">{step.type === 'search' ? <Search size={18} /> : <MessagesSquare size={18} />}</span>
                  <div><strong>{step.request}</strong><p>{step.response}</p><span className="pricing-request-type">1 {step.type === 'search' ? 'search' : 'assistant message'}</span></div>
                  <span className="pricing-request-cost">{money(step.type === 'search' ? STANDARD_PLAN.searchCents : STANDARD_PLAN.messageCents)}</span>
                </li>
              ))}
            </ol>
            <div className="pricing-example-total"><span>{mode.summary}</span><strong>{money(mode.totalCents)}</strong></div>
            <p className="pricing-fine-print">Example cost after the relevant monthly allowances are used. Within your allowances, these requests are included.</p>
          </div>
        </div>

        <div className="pricing-estimator-heading"><ArrowDown size={21} aria-hidden="true" /><h3>Now estimate your monthly cost</h3></div>
        <div className="pricing-estimator">
          <div className="pricing-estimator-inputs" onBlur={() => trackInteraction('estimator_interacted')}>
            <fieldset className="pricing-input-method">
              <legend className="pricing-sr-only">How would you like to estimate usage?</legend>
              <label><input type="radio" name="input-method" checked={inputMethod === 'usage'} onChange={() => setInputMethod('usage')} />I know my usage</label>
              <label><input type="radio" name="input-method" checked={inputMethod === 'traffic'} onChange={() => setInputMethod('traffic')} />Estimate from traffic</label>
            </fieldset>
            {inputMethod === 'traffic' ? (
              <>
                <NumberField label="Monthly visits" value={visits} onChange={setVisits} hint="Use sessions from your website analytics." />
                <div className="pricing-rate-fields">
                  {mode.hasSearch && <NumberField label="Searches per 100 visits" value={searchRate} onChange={setSearchRate} decimal max={1000} />}
                  {mode.hasMessages && <NumberField label="Assistant messages per 100 visits" value={messageRate} onChange={setMessageRate} decimal max={1000} />}
                </div>
                <p className="pricing-fine-print">Illustrative assumptions, not measured usage. Include every conversational follow-up in your message count. Adjust these rates to match your site.</p>
                <p className="pricing-derived-usage">Estimated usage: {mode.hasSearch && `${integer(activeSearches)} searches`}{mode.hasSearch && mode.hasMessages && ' + '}{mode.hasMessages && `${integer(activeMessages)} assistant messages`} / month</p>
              </>
            ) : (
              <>
                {mode.hasSearch && <NumberField label="Searches per month" value={searches} onChange={setSearches} hint="Count each simple search that returns matching items." />}
                {mode.hasMessages && <NumberField label="Assistant messages per month" value={messages} onChange={setMessages} hint="Count visitor requests, including each conversational follow-up. Replies are included." />}
                <p className="pricing-fine-print">Example volumes to get you started. Replace them with your expected usage.</p>
              </>
            )}
          </div>
          <div className="pricing-estimate-receipt" aria-live="polite" aria-atomic="true">
            <span className="pricing-small-label">Your estimated monthly bill</span>
            <div className="pricing-estimate-amount"><strong>{money(estimate.totalCents)}</strong><span>/ month</span></div>
            <dl className="pricing-bill-lines">
              <div><dt>Standard plan</dt><dd>{money(STANDARD_PLAN.monthlyCents)}</dd></div>
              <div><dt>Additional searches<small>{integer(estimate.searchOverage)} × $0.01</small></dt><dd>{money(estimate.searchCostCents)}</dd></div>
              <div><dt>Additional assistant messages<small>{integer(estimate.messageOverage)} × $0.10</small></dt><dd>{money(estimate.messageCostCents)}</dd></div>
            </dl>
            <p className="pricing-included-note"><Check size={17} aria-hidden="true" /><span>Includes {integer(STANDARD_PLAN.includedSearches)} searches and {integer(STANDARD_PLAN.includedMessages)} assistant messages each month.</span></p>
            <p className="pricing-fine-print">USD. Additional usage is billed automatically. Unused allowances do not transfer between searches and messages.</p>
            <a className="pricing-button pricing-button-primary" href={getSignupUrl()}>Start for free</a>
            <p className="pricing-cta-note">Try it in your dashboard. No credit card needed.</p>
          </div>
        </div>
        <PricingEstimateForm estimate={snapshot} onTrafficLookup={count => {
          setVisits(normalizeCount(count));
          setInputMethod('traffic');
        }} />
      </div>
    </section>
  );
}

function NumberField({ label, value, onChange, hint, decimal = false, max = MAX_ESTIMATE_COUNT }) {
  return (
    <label className="pricing-number-field">
      <span>{label}</span>
      <input type="number" inputMode={decimal ? 'decimal' : 'numeric'} min="0" max={max} step={decimal ? '0.1' : '1'} value={value}
        onChange={event => {
          const raw = event.target.value;
          if (raw === '') return onChange('');
          const number = Number(raw);
          onChange(Number.isFinite(number) ? Math.min(max, Math.max(0, decimal ? number : Math.round(number))) : 0);
        }} />
      {hint && <small>{hint}</small>}
    </label>
  );
}
