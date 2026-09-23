import React, { useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { EVENTS } from '../constants/events';
import { trackEvent } from '../utils/eventTracker';
import { sendPricingEstimate } from '../utils/pricingLead.js';

/** Keep the existing website lookup and lead destination, with explicit, acknowledged submission. */
export default function PricingEstimateForm({ estimate, onTrafficLookup }) {
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupNote, setLookupNote] = useState('');
  const [submitState, setSubmitState] = useState('idle');
  const [error, setError] = useState('');

  async function lookupTraffic() {
    if (!website.trim()) { setLookupNote('Enter your website address first.'); return; }
    setLookupBusy(true);
    setLookupNote('');
    try {
      const response = await fetch(`/api/traffic-lookup?domain=${encodeURIComponent(website.trim())}`, { signal: AbortSignal.timeout(15000) });
      const data = response.ok ? await response.json() : null;
      const visits = Number(data?.monthlyVisits);
      if (!Number.isFinite(visits) || visits <= 0) throw new Error('No estimate');
      onTrafficLookup(Math.round(visits));
      setLookupNote(`Updated the calculator with approximately ${Math.round(visits).toLocaleString('en-US')} monthly visits. Traffic is estimated; adjust the usage rates above.`);
      trackEvent(EVENTS.PRICING_CALCULATOR_ESTIMATE_INTERACTION, { interaction_type: 'url_lookup_estimated', monthly_visitors: Math.round(visits) });
    } catch {
      setLookupNote('Traffic data is unavailable. Enter usage above, or send us your site for an estimate.');
    } finally {
      setLookupBusy(false);
    }
  }

  async function submitLead(event) {
    event.preventDefault();
    if (submitState === 'submitting') return;
    setSubmitState('submitting');
    setError('');
    try {
      await sendPricingEstimate({ website, name: '', email, estimate });
    } catch {
      setSubmitState('idle');
      setError('Your request could not be sent. Please try again, or email hello@nobi.ai.');
      return;
    }
    setSubmitState('done');
    trackEvent(EVENTS.PRICING_CALCULATOR_LEAD_SUBMITTED, { ...estimate, website: website.trim(), hasContact: true });
  }

  return (
    <details className="pricing-lead" id="pricing-estimate-request">
      <summary>Want an estimate for your site?<ChevronDown size={16} aria-hidden="true" /></summary>
      {submitState === 'done' ? <p className="pricing-form-success" role="status">Request received. We’ll email you about your estimate.</p> : (
        <form className="pricing-lead-form" onSubmit={submitLead}>
          <div className="pricing-contact-fields">
            <label className="pricing-form-field"><span>Website</span><input name="website" autoComplete="url" placeholder="yoursite.com" value={website} disabled={lookupBusy || submitState === 'submitting'} required onChange={event => { setWebsite(event.target.value); setLookupNote(''); }} /></label>
            <label className="pricing-form-field"><span>Work email</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} disabled={submitState === 'submitting'} required onChange={event => setEmail(event.target.value)} /></label>
            <button className="pricing-button pricing-button-primary" type="submit" disabled={submitState === 'submitting' || lookupBusy}>{submitState === 'submitting' ? 'Sending…' : 'Get an estimate'}</button>
          </div>
          <button className="pricing-text-button pricing-lookup-button" type="button" onClick={lookupTraffic} disabled={lookupBusy || submitState === 'submitting'}>{lookupBusy && <Loader2 size={14} className="pricing-spinner" aria-hidden="true" />}{lookupBusy ? 'Looking up traffic…' : 'Just look up my traffic'}</button>
          {lookupNote && <p className="pricing-lookup-note" role="status">{lookupNote}</p>}
          {error && <p className="pricing-form-error" role="alert">{error}</p>}
        </form>
      )}
    </details>
  );
}
