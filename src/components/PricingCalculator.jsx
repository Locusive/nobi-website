import React, { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
  const [searches, setSearches] = useState(STANDARD_PLAN.includedSearches);
  const [messages, setMessages] = useState(STANDARD_PLAN.includedMessages);
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
    <section id="pricing-calculator" className="pricing-calculator" aria-labelledby="pricing-calculator-title">
      <div className="pricing-container">
        <h2 id="pricing-calculator-title">Estimate your monthly cost</h2>
        <div className="pricing-calculator-panel">
          <fieldset className="pricing-mode-picker">
            <legend className="pricing-sr-only">Use Nobi for</legend>
            {PRICING_MODES.map(item => (
              <label key={item.id} className={modeId === item.id ? 'is-selected' : ''}>
                <input type="radio" name="pricing-mode" value={item.id} checked={modeId === item.id} onChange={() => selectMode(item)} />
                {item.title}
              </label>
            ))}
          </fieldset>

          <div className="pricing-estimator">
            <div className="pricing-estimator-inputs" onBlur={() => trackInteraction('estimator_interacted')}>
              <div className="pricing-input-heading">
                <span>{inputMethod === 'usage' ? 'Monthly usage' : 'Website traffic'}</span>
                <button type="button" className="pricing-text-button" onClick={() => setInputMethod(inputMethod === 'usage' ? 'traffic' : 'usage')}>
                  {inputMethod === 'usage' ? 'Use traffic instead' : 'Enter usage instead'}
                </button>
              </div>
              {inputMethod === 'traffic' ? (
                <>
                  <NumberField label="Monthly visits" value={visits} onChange={setVisits} />
                  <details className="pricing-assumptions">
                    <summary>Adjust usage assumptions<ChevronDown size={14} aria-hidden="true" /></summary>
                    {mode.hasSearch && <NumberField label="Searches per 100 visits" value={searchRate} onChange={setSearchRate} decimal max={1000} />}
                    {mode.hasMessages && <NumberField label="Messages per 100 visits" value={messageRate} onChange={setMessageRate} decimal max={1000} />}
                  </details>
                  <p className="pricing-fine-print">Illustrative rates: {mode.hasSearch && `${searchRate || 0} searches`}{mode.hasSearch && mode.hasMessages && ', '}{mode.hasMessages && `${messageRate || 0} messages`} per 100 visits.</p>
                </>
              ) : (
                <>
                  {mode.hasSearch && <NumberField label="Searches" value={searches} onChange={setSearches} />}
                  {mode.hasMessages && <NumberField label="Assistant messages" value={messages} onChange={setMessages} />}
                  <p className="pricing-fine-print">Adjust these example volumes to match your site.</p>
                </>
              )}
            </div>
            <div className="pricing-estimate-receipt">
              <div aria-live="polite" aria-atomic="true">
                <div className="pricing-estimate-amount"><strong>{money(estimate.totalCents)}</strong><span>/ month</span></div>
                <p className="pricing-estimate-caption">$25 base + {money(estimate.totalCents - STANDARD_PLAN.monthlyCents)} additional usage</p>
              </div>
              <details className="pricing-breakdown">
                <summary>View breakdown<ChevronDown size={14} aria-hidden="true" /></summary>
                <dl className="pricing-bill-lines">
                  <div><dt>Base plan</dt><dd>$25</dd></div>
                  <div><dt>Extra searches<small>{integer(estimate.searchOverage)} × $0.01</small></dt><dd>{money(estimate.searchCostCents)}</dd></div>
                  <div><dt>Extra messages<small>{integer(estimate.messageOverage)} × $0.10</small></dt><dd>{money(estimate.messageCostCents)}</dd></div>
                </dl>
                <p className="pricing-fine-print">Includes 2,500 searches and 250 messages. Each allowance is separate. Prices in USD.</p>
              </details>
              <a className="pricing-button pricing-button-primary" href={getSignupUrl()}>Start for free</a>
            </div>
          </div>

          <details className="pricing-example">
            <summary>See what counts as a search or message<ChevronDown size={16} aria-hidden="true" /></summary>
            <div aria-live="polite">
              <p>{mode.explanation}</p>
              <ul>
                {mode.steps.map((step, index) => <li key={`${modeId}-${index}`}><span>“{step.request}”</span><span>{step.type === 'search' ? 'Search' : 'Message'} <strong>{money(step.type === 'search' ? STANDARD_PLAN.searchCents : STANDARD_PLAN.messageCents)}</strong></span></li>)}
              </ul>
              <p className="pricing-fine-print">Rates shown apply after the included allowances. Nobi’s replies are included.</p>
            </div>
          </details>
          <PricingEstimateForm estimate={snapshot} onTrafficLookup={count => {
            setVisits(normalizeCount(count));
            setInputMethod('traffic');
          }} />
        </div>
      </div>
    </section>
  );
}

function NumberField({ label, value, onChange, decimal = false, max = MAX_ESTIMATE_COUNT }) {
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
    </label>
  );
}
