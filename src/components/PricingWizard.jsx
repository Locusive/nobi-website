import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, MessageCircle, Search, Sparkles } from "lucide-react";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import { trackEvent } from "../utils/eventTracker";
import { EVENTS } from "../constants/events";
import { DEFAULT_ACTIVITY, MAX_USAGE, PRICING, estimateUsage, formatPrice, priceUsage } from "../utils/pricingEstimate";
import PricingEstimateForm from "./PricingEstimateForm";
import "./PricingWizard.css";

const USES = [
  { id: "search", title: "Search your site", summary: "Search", icon: Search, description: "Show matching items, pages, and resources." },
  { id: "assistant", title: "Answer questions", summary: "Assistant", icon: MessageCircle, description: "Give answers and help visitors narrow things down." },
  { id: "both", title: "Do both", summary: "Search + assistant", icon: Sparkles, description: "Let visitors search, then keep talking." },
];
const count = value => Number(value).toLocaleString("en-US");

export default function PricingWizard() {
  const id = useId();
  const [openStep, setOpenStep] = useState(1);
  const [mode, setMode] = useState("");
  const [useConfirmed, setUseConfirmed] = useState(false);
  const [activityConfirmed, setActivityConfirmed] = useState(false);
  const [basis, setBasis] = useState("traffic");
  const [visitors, setVisitors] = useState(String(DEFAULT_ACTIVITY.visitors));
  const [searches, setSearches] = useState("2500");
  const [messages, setMessages] = useState("250");
  const [searchRate, setSearchRate] = useState(String(DEFAULT_ACTIVITY.searchesPerHundred));
  const [messageRate, setMessageRate] = useState(String(DEFAULT_ACTIVITY.messagesPerHundred));
  const [error, setError] = useState("");
  const headers = useRef({});
  const interview = useRef(null);
  const focusNext = useRef(false);
  const tracked = useRef(false);
  const { onOpen: openDemoForm } = useDemoForm();
  const selected = USES.find(use => use.id === mode);
  const usage = estimateUsage({ mode, basis, visitors, searches, messages, searchesPerHundred: searchRate, messagesPerHundred: messageRate });
  const price = usage ? priceUsage(usage) : null;
  const usageSummary = usage ? [mode !== "assistant" && `${count(usage.searches)} searches`, mode !== "search" && `${count(usage.messages)} messages`].filter(Boolean).join(" + ") : "";

  useEffect(() => {
    if (!focusNext.current || !openStep) return;
    focusNext.current = false;
    const header = headers.current[openStep];
    header?.focus({ preventScroll: true });
    const frame = interview.current;
    const target = frame?.offsetHeight < window.innerHeight - 120 ? frame : header;
    const rect = target?.getBoundingClientRect();
    if (rect && (rect.top < 100 || rect.bottom > window.innerHeight - 20)) {
      target.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [openStep]);

  const goTo = step => { focusNext.current = true; setOpenStep(step); };
  const edit = (setter, value) => { setter(value); setActivityConfirmed(false); setError(""); };
  const trackEstimate = (interactionType, actualUsage = usage) => {
    if (tracked.current || !actualUsage) return;
    tracked.current = true;
    const cost = priceUsage(actualUsage).totalCents / 100;
    trackEvent(EVENTS.PRICING_CALCULATOR_ESTIMATE_INTERACTION, {
      "Source": "Marketing Pricing Calculator", "Interaction Type": interactionType,
      "Monthly Visitors": basis === "traffic" ? Number(visitors) : null,
      "Searches": actualUsage.searches, "Messages": actualUsage.messages,
      "Has Search": mode !== "assistant", "Has Messages": mode !== "search", "Estimated Monthly Cost": cost,
    }, { gaProperties: {
      source: "marketing_pricing_calculator", interaction_type: interactionType,
      monthly_visitors: basis === "traffic" ? Number(visitors) : null,
      searches: actualUsage.searches, messages: actualUsage.messages,
      has_search: mode !== "assistant", has_messages: mode !== "search", estimated_monthly_cost: cost,
    } });
  };
  const showEstimate = event => {
    event.preventDefault();
    if (!usage) { setError("Enter whole counts of zero or more, and check your estimate assumptions."); return; }
    setError("");
    setActivityConfirmed(true);
    trackEstimate("Estimate Viewed");
    goTo(3);
  };

  const step = (number, title, summary, enabled, complete, content) => <section className="pw-step" key={number} data-open={openStep === number}>
    <h3 className="pw-step-heading"><button
      type="button" ref={element => { headers.current[number] = element; }}
      id={`${id}-heading-${number}`} aria-expanded={openStep === number} aria-controls={`${id}-panel-${number}`}
      disabled={!enabled} onClick={() => setOpenStep(current => current === number ? null : number)}
    >
      <span className={`pw-step-number ${complete ? "pw-step-number--done" : ""}`}>{complete ? <Check size={17} aria-label="Complete" /> : number}</span>
      <span className="pw-step-title">{title}{summary && openStep !== number && <span>{summary}</span>}</span>
      {enabled && <><span className="pw-edit">{openStep === number ? "" : complete ? number === 3 ? "View" : "Edit" : "Open"}</span><span className="pw-toggle"><ChevronDown size={27} strokeWidth={3} className="pw-chevron" aria-hidden="true" /></span></>}
    </button></h3>
    <div id={`${id}-panel-${number}`} role="region" aria-labelledby={`${id}-heading-${number}`} hidden={openStep !== number} className="pw-panel">{content}</div>
  </section>;

  return <section className="pw-section" id="pricing-calculator" aria-labelledby={`${id}-title`}>
    <div className="pw-wrap">
      <div className="pw-intro"><h2 id={`${id}-title`}>Find your price</h2><p>Two quick questions. An estimate for your site.</p></div>
      <div className="pw-interview" ref={interview}>
        {step(1, "What would you like to use Nobi for?", useConfirmed ? selected?.summary : "", true, useConfirmed,
          <div>
            <p className="pw-choice-hint">Choose what to estimate. Both capabilities are included in the same plan.</p>
            <div className="pw-choices" role="group" aria-label="How would you like to use Nobi?">
              {USES.map(({ id: value, title, description, icon: Icon }) => <button className="pw-choice" type="button" key={value} aria-pressed={mode === value}
                onClick={() => { setMode(value); setUseConfirmed(true); setActivityConfirmed(false); setError(""); goTo(2); }}>
                <span className="pw-choice-content"><Icon size={25} strokeWidth={1.7} aria-hidden="true" /><strong>{title}</strong><span>{description}</span></span>
                <span className="pw-radio" aria-hidden="true">{mode === value && <Check size={12} />}</span>
              </button>)}
            </div>
          </div>
        )}
        {step(2, "How much activity do you expect?", activityConfirmed ? basis === "traffic" ? `${count(visitors)} visitors / month` : `${usageSummary} / month` : "", useConfirmed, activityConfirmed,
          <>
            <form onSubmit={showEstimate} onInvalid={event => {
              const details = event.target.closest("details");
              if (details) details.open = true;
            }}>
              <fieldset className="pw-basis"><legend className="pw-sr-only">How would you like to estimate activity?</legend>
                {[{ value: "traffic", label: "Use my site traffic" }, { value: "usage", label: "Enter searches & messages" }].map(option => <label key={option.value}><input type="radio" name={`${id}-basis`} checked={basis === option.value} onChange={() => edit(setBasis, option.value)} /><span>{option.label}</span></label>)}
              </fieldset>
              {basis === "traffic" ? <div className="pw-activity">
                <p>A rough monthly visitor count is enough.</p>
                <div className="pw-visitor-input"><label htmlFor={`${id}-visitors`}>Monthly visitors</label><input id={`${id}-visitors`} type="number" inputMode="numeric" min="0" max="10000000" step="1" value={visitors} onChange={event => edit(setVisitors, event.target.value)} required /></div>
                <div className="pw-presets" role="group" aria-label="Common monthly visitor counts">{[10000, 50000, 100000].map(amount => <button type="button" key={amount} aria-pressed={Number(visitors) === amount} onClick={() => edit(setVisitors, String(amount))}>{count(amount)}</button>)}</div>
                <details className="pw-assumptions"><summary>How we estimate activity <ChevronDown size={15} aria-hidden="true" /></summary>
                  <p>Starting assumptions you can adjust for your audience.</p>
                  <div className="pw-fields">
                    {mode !== "assistant" && <label>Searches per 100 visitors<input type="number" min="0" max="1000" step="0.1" value={searchRate} onChange={event => edit(setSearchRate, event.target.value)} required /></label>}
                    {mode !== "search" && <label>Visitor messages per 100 visitors<input type="number" min="0" max="1000" step="0.1" value={messageRate} onChange={event => edit(setMessageRate, event.target.value)} required /></label>}
                  </div>
                  {usage && <p>That estimates {usageSummary.toLowerCase()} per month.</p>}
                </details>
              </div> : <div className="pw-activity">
                <p>Count each search and each visitor message, including follow-ups.</p>
                <div className="pw-fields">
                  {mode !== "assistant" && <label>Searches per month<input type="number" inputMode="numeric" min="0" max={MAX_USAGE} step="1" value={searches} onChange={event => edit(setSearches, event.target.value)} required /></label>}
                  {mode !== "search" && <label>Visitor messages per month<input type="number" inputMode="numeric" min="0" max={MAX_USAGE} step="1" value={messages} onChange={event => edit(setMessages, event.target.value)} required /></label>}
                </div>
                {mode !== "search" && <p className="pw-small">Nobi's replies are included. Count only messages sent by your visitors.</p>}
              </div>}
              {error && <p role="alert" className="pw-error">{error}</p>}
              <div className="pw-actions"><button className="pw-back" type="button" onClick={() => goTo(1)}>Back</button><button className="pw-primary">See my price <ArrowRight size={16} aria-hidden="true" /></button></div>
            </form>
            {basis === "traffic" && <details className="pw-lookup"><summary>Don't know your traffic? Look up your site <ChevronDown size={15} aria-hidden="true" /></summary><PricingEstimateForm
              onEstimateInteraction={() => trackEstimate("Url Lookup Submitted")}
              onTrafficLookup={value => { edit(setVisitors, String(Math.min(10_000_000, value))); goTo(2); }}
            /></details>}
          </>
        )}
        {step(3, "Your monthly price", activityConfirmed && price ? `${formatPrice(price.totalCents)} estimated / month` : "", activityConfirmed, activityConfirmed,
          activityConfirmed && price && <div className="pw-result-grid">
            <div className="pw-standard">
              <div className="pw-result-label">Standard <span>For {selected.summary.toLowerCase()}</span></div>
              <div className="pw-price"><strong>{formatPrice(price.totalCents)}</strong><span>/ month estimated</span></div>
              <p className="pw-price-caption">{price.totalCents === PRICING.baseCents ? "Your expected usage fits within the included amount." : `${formatPrice(PRICING.baseCents)} base + ${formatPrice(price.totalCents - PRICING.baseCents)} additional usage.`}</p>
              <p className="pw-included">Includes 2,500 searches and 250 assistant messages each month.</p>
              <details className="pw-breakdown"><summary>See how this is calculated <ChevronDown size={15} aria-hidden="true" /></summary>
                {basis === "traffic" && <p>Based on {count(visitors)} visitors/month{mode !== "assistant" ? `, ${searchRate} searches per 100 visitors` : ""}{mode !== "search" ? `, and ${messageRate} visitor messages per 100 visitors` : ""}. Your actual usage may differ.</p>}
                <dl><div><dt>Monthly base</dt><dd>{formatPrice(PRICING.baseCents)}</dd></div>
                  {mode !== "assistant" && <div><dt>{count(usage.searches)} searches<small>2,500 included; {count(price.additionalSearches)} extra × 1¢</small></dt><dd>{formatPrice(price.searchCostCents)}</dd></div>}
                  {mode !== "search" && <div><dt>{count(usage.messages)} visitor messages<small>250 included; {count(price.additionalMessages)} extra × 10¢</small></dt><dd>{formatPrice(price.messageCostCents)}</dd></div>}
                </dl>
              </details>
              <a className="pw-primary" href={getSignupUrl()}>Start for free</a>
              <span className="pw-trial">Free dashboard preview. No credit card.</span>
            </div>
            <div className="pw-enterprise"><h4>Enterprise</h4><strong>Let's talk</strong><p>For higher usage and custom needs.</p><ul><li><Check size={16} /> Volume discounts</li><li><Check size={16} /> Custom integrations & onboarding</li><li><Check size={16} /> Dedicated support</li></ul><button type="button" onClick={openDemoForm}>Get in touch</button></div>
          </div>
        )}
      </div>
      <div className="pw-after"><span>Your bill reflects actual usage.</span><button type="button" onClick={openDemoForm}>Prefer to talk it through?</button></div>
    </div>
  </section>;
}
