import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { EVENTS } from '../constants/events';
import { trackEvent } from '../utils/eventTracker';
import { sendPricingEstimate } from '../utils/pricingLead.js';

/** Keep the existing website lookup and lead destination, with explicit, acknowledged submission. */
export default function PricingEstimateForm({ estimate, onTrafficLookup }) {
  const [website, setWebsite] = useState('');
  const [name, setName] = useState('');
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
      setLookupNote(`Updated the calculator with approximately ${Math.round(visits).toLocaleString('en-US')} monthly visits. This third-party traffic estimate may differ from your analytics; the usage rates are still illustrative.`);
      trackEvent(EVENTS.PRICING_CALCULATOR_ESTIMATE_INTERACTION, { interaction_type: 'url_lookup_estimated', monthly_visitors: Math.round(visits) });
    } catch {
      setLookupNote('Traffic data is unavailable for this site. Enter your own usage above, or request a tailored estimate below.');
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
      await sendPricingEstimate({ website, name, email, estimate });
    } catch {
      setSubmitState('idle');
      setError('Your request could not be sent. Please try again, or email hello@nobi.ai.');
      return;
    }
    setSubmitState('done');
    trackEvent(EVENTS.PRICING_CALCULATOR_LEAD_SUBMITTED, { ...estimate, website: website.trim(), hasContact: true });
  }

  return (
    <div className="pricing-lead" id="pricing-estimate-request">
      <div><h3>Want an estimate for your site?</h3><p>Look up your traffic, or send us your setup and we’ll help you work out the right fit.</p><p className="pricing-fine-print">Your selected setup and estimate are included with your request.</p></div>
      {submitState === 'done' ? <div className="pricing-form-success" role="status"><strong>Your request is in.</strong><p>We’ll review your site and email you about your estimate.</p></div> : (
        <form className="pricing-lead-form" onSubmit={submitLead}>
          <label className="pricing-form-field"><span>Website</span><input name="website" autoComplete="url" placeholder="yoursite.com" value={website} disabled={lookupBusy || submitState === 'submitting'} required onChange={event => { setWebsite(event.target.value); setLookupNote(''); }} /></label>
          <button className="pricing-text-button pricing-lookup-button" type="button" onClick={lookupTraffic} disabled={lookupBusy || submitState === 'submitting'}>{lookupBusy && <Loader2 size={16} className="pricing-spinner" aria-hidden="true" />}{lookupBusy ? 'Looking up traffic…' : 'Estimate traffic for this site'}</button>
          {lookupNote && <p className="pricing-lookup-note" role="status">{lookupNote}</p>}
          <div className="pricing-contact-fields">
            <label className="pricing-form-field"><span>Name <small>(optional)</small></span><input name="name" autoComplete="name" value={name} disabled={submitState === 'submitting'} onChange={event => setName(event.target.value)} /></label>
            <label className="pricing-form-field"><span>Work email</span><input name="email" type="email" autoComplete="email" value={email} disabled={submitState === 'submitting'} required onChange={event => setEmail(event.target.value)} /></label>
          </div>
          <button className="pricing-button pricing-button-primary" type="submit" disabled={submitState === 'submitting' || lookupBusy}>{submitState === 'submitting' ? 'Sending your request…' : 'Get a tailored estimate'}</button>
          <p className="pricing-fine-print">We’ll email you about your estimate. No account needed.</p>
          {error && <p className="pricing-form-error" role="alert">{error}</p>}
        </form>
      )}
    </div>
  );
}
