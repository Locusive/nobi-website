import React, { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, MessageCircle, Search, Sparkles } from "lucide-react";
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
const countInput = value => /^\d+$/.test(value) ? count(value) : value;

function ActivitySlider({ id, label, value, onChange, onCommit, defaultMax, max = MAX_USAGE, caption, tone = "assistant" }) {
  const [sliderMax, setSliderMax] = useState(defaultMax);
  const amount = Number(value);
  const valid = value.trim() !== "" && Number.isInteger(amount) && amount >= 0 && amount <= max;
  // Keep the slider's scale stable while dragging; expand it for larger typed counts.
  useEffect(() => {
    if (valid && amount > sliderMax) setSliderMax(Math.min(max, Math.ceil(amount / defaultMax) * defaultMax));
  }, [amount, valid, sliderMax, defaultMax, max]);

  const editCount = event => {
    const input = event.target;
    const raw = input.value.replaceAll(",", "");
    const charactersBeforeCaret = input.value.slice(0, input.selectionStart).replaceAll(",", "").length;
    const formatted = countInput(raw);
    let caret = 0;
    let characters = 0;
    while (caret < formatted.length && characters < charactersBeforeCaret) {
      if (formatted[caret] !== ",") characters++;
      caret++;
    }
    onChange(raw);
    // Preserve the editing position when grouping separators appear or disappear.
    requestAnimationFrame(() => {
      if (document.activeElement === input) input.setSelectionRange(caret, caret);
    });
  };

  return <div className={`pw-slider pw-slider--${tone}`}>
    <div className="pw-slider-heading">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" inputMode="numeric" value={countInput(value)}
        aria-invalid={!valid} aria-describedby={`${id}-caption`} onChange={editCount} onBlur={onCommit} />
    </div>
    <input type="range" min="0" max={sliderMax} step="1" value={valid ? Math.min(amount, sliderMax) : 0}
      aria-label={`${label} slider`} aria-valuetext={valid ? count(amount) : "0"}
      onChange={event => onChange(event.target.value)} onPointerUp={onCommit} onKeyUp={event => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(event.key)) onCommit();
      }} />
    <div className="pw-slider-caption"><span id={`${id}-caption`}>{valid ? caption : `Enter a whole number from 0 to ${count(max)}.`}</span><span>{count(sliderMax)}</span></div>
  </div>;
}

export default function PricingWizard() {
  const id = useId();
  const [openPanels, setOpenPanels] = useState({ 1: true, 2: false });
  const [mode, setMode] = useState("");
  const [basis, setBasis] = useState("usage");
  const [visitors, setVisitors] = useState(String(DEFAULT_ACTIVITY.visitors));
  const [searches, setSearches] = useState(String(PRICING.includedSearches));
  const [messages, setMessages] = useState(String(PRICING.includedMessages));
  const [searchRate, setSearchRate] = useState(String(DEFAULT_ACTIVITY.searchesPerHundred));
  const [messageRate, setMessageRate] = useState(String(DEFAULT_ACTIVITY.messagesPerHundred));
  const tracked = useRef(false);
  const { onOpen: openDemoForm } = useDemoForm();
  const selected = USES.find(use => use.id === mode);
  const usage = estimateUsage({ mode, basis, visitors, searches, messages, searchesPerHundred: searchRate, messagesPerHundred: messageRate });
  const price = usage ? priceUsage(usage) : null;
  const usageSummary = usage ? [mode !== "assistant" && `${count(usage.searches)} searches`, mode !== "search" && `${count(usage.messages)} messages`].filter(Boolean).join(" + ") : "";
  const activityTitle = mode === "search" ? "How many searches do you expect?" : mode === "assistant" ? "How many messages do you expect?" : "How much activity do you expect?";
  const directLabel = mode === "search" ? "Enter search counts instead" : mode === "assistant" ? "Enter message counts instead" : "Enter usage counts instead";

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
  const commitEstimate = () => trackEstimate("Estimate Viewed");

  const panel = (number, title, summary, content) => <section className="pw-step" key={number} data-open={openPanels[number]}>
    <h3 className="pw-step-heading"><button type="button"
      id={`${id}-heading-${number}`} aria-expanded={openPanels[number]} aria-controls={`${id}-panel-${number}`}
      onClick={() => setOpenPanels(current => ({ ...current, [number]: !current[number] }))}>
      <span className="pw-step-number">{number}</span>
      <span className="pw-step-title">{title}{!openPanels[number] && summary && <span>{summary}</span>}</span>
      <span className="pw-toggle"><ChevronDown size={27} strokeWidth={3} className="pw-chevron" aria-hidden="true" /></span>
    </button></h3>
    <div id={`${id}-panel-${number}`} role="region" aria-labelledby={`${id}-heading-${number}`} hidden={!openPanels[number]} className="pw-panel">{content}</div>
  </section>;

  return <section className="pw-section" id="pricing-calculator" aria-labelledby={`${id}-title`}>
    <div className="pw-wrap">
      <div className="pw-intro"><h2 id={`${id}-title`}>Find your price</h2><p>Choose how you’ll use Nobi, then adjust your monthly activity.</p></div>
      <div className="pw-interview">
        {panel(1, "What would you like to use Nobi for?", selected?.summary,
          <div>
            <p className="pw-choice-hint">Both capabilities are included. Choose what you’d like to estimate.</p>
            <div className="pw-choices" role="group" aria-label="How would you like to use Nobi?">
              {USES.map(({ id: value, title, description, icon: Icon }) => <button className="pw-choice" type="button" key={value} aria-pressed={mode === value}
                onClick={() => { setMode(value); setOpenPanels(current => ({ ...current, 2: true })); }}>
                <span className="pw-choice-content"><Icon size={25} strokeWidth={1.7} aria-hidden="true" /><strong>{title}</strong><span>{description}</span></span>
                <span className="pw-radio" aria-hidden="true">{mode === value && <Check size={12} />}</span>
              </button>)}
            </div>
          </div>
        )}
        {panel(2, activityTitle, mode ? price ? `${usageSummary} · ${formatPrice(price.totalCents)} / month estimated` : "Adjust your monthly activity" : "",
          mode ? <div className="pw-estimator">
            <div className="pw-activity">
              <div className="pw-sliders">
                {basis === "usage" ? <>
                  {mode !== "assistant" && <ActivitySlider key="searches" id={`${id}-searches`} label="Search requests / month" value={searches} onChange={setSearches} onCommit={commitEstimate} defaultMax={100000} caption="2,500 included · then 1¢ each" tone="search" />}
                  {mode !== "search" && <ActivitySlider key="messages" id={`${id}-messages`} label="Visitor messages / month" value={messages} onChange={setMessages} onCommit={commitEstimate} defaultMax={10000} caption="250 included · then 10¢ each" />}
                </> : <ActivitySlider key="visitors" id={`${id}-visitors`} label="Monthly visitors" value={visitors} onChange={setVisitors} onCommit={commitEstimate} defaultMax={500000} max={10000000} caption="A rough visitor count is enough" />}
              </div>
              {basis === "usage" && mode !== "search" && <p className="pw-small">Count visitor questions and follow-ups.</p>}
              <button type="button" className="pw-basis-link" onClick={() => setBasis(current => current === "usage" ? "traffic" : "usage")}>{basis === "usage" ? "Not sure? Estimate from site traffic" : directLabel}</button>
              {basis === "traffic" && <>
                <details className="pw-assumptions"><summary>Adjust activity assumptions <ChevronDown size={15} aria-hidden="true" /></summary>
                  <div className="pw-fields">
                    {mode !== "assistant" && <label>Searches per 100 visitors<input type="number" min="0" max="1000" step="0.1" value={searchRate} onChange={event => setSearchRate(event.target.value)} onBlur={commitEstimate} /></label>}
                    {mode !== "search" && <label>Visitor messages per 100 visitors<input type="number" min="0" max="1000" step="0.1" value={messageRate} onChange={event => setMessageRate(event.target.value)} onBlur={commitEstimate} /></label>}
                  </div>
                </details>
                <details className="pw-lookup"><summary>Look up my site traffic <ChevronDown size={15} aria-hidden="true" /></summary><PricingEstimateForm
                  onEstimateInteraction={() => trackEstimate("Url Lookup Submitted")}
                  onTrafficLookup={value => setVisitors(String(Math.min(10_000_000, value)))}
                /></details>
              </>}
            </div>
            <aside className="pw-estimate" aria-label="Your monthly estimate">
              <h4>Your monthly estimate</h4>
              <div className="pw-price"><output aria-live="polite" aria-atomic="true">{price ? formatPrice(price.totalCents) : "—"}</output><span>/ month</span></div>
              {price ? <>
                <dl className="pw-costs">
                  <div><dt>Monthly base</dt><dd>{formatPrice(PRICING.baseCents)}</dd></div>
                  {mode !== "assistant" && <div><dt>Extra searches<small>{count(price.additionalSearches)} × 1¢</small></dt><dd>{formatPrice(price.searchCostCents)}</dd></div>}
                  {mode !== "search" && <div><dt>Extra messages<small>{count(price.additionalMessages)} × 10¢</small></dt><dd>{formatPrice(price.messageCostCents)}</dd></div>}
                </dl>
                {basis === "traffic" && <p className="pw-traffic-note">Assumes {usageSummary} / month. Adjust the assumptions to suit your site.</p>}
              </> : <p className="pw-error">Enter valid counts to see your estimate.</p>}
              <a className="pw-primary" href={getSignupUrl()} onClick={commitEstimate}>Start for free</a>
              <span className="pw-trial">Free preview. No credit card.</span>
            </aside>
          </div> : <p className="pw-choice-hint">Choose how you’ll use Nobi above to see your estimate.</p>
        )}
      </div>
      <div className="pw-after"><span>Your bill reflects actual usage.</span><button type="button" onClick={openDemoForm}>Prefer to talk it through?</button></div>
    </div>
  </section>;
}
