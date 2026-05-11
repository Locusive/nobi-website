import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import MixpanelClient from "../service-clients/mixpanel-client";
import { EVENTS } from "../constants/events";

const PLAN_BASE_PRICE = 25;
const INCLUDED_SEARCHES = 2500;
const INCLUDED_MESSAGES = 250;
const SEARCH_OVERAGE = 0.01;
const MESSAGE_OVERAGE = 0.10;

const DEFAULT_SEARCH_RATE_PCT = 3.5;
const DEFAULT_MESSAGE_RATE_PCT = 2.0;

const DEFAULT_SESSIONS = 50000;
const SLIDER_MIN = 1000;
const SLIDER_MAX = 500000;
const SLIDER_STEP = 1000;

const WEB3FORMS_ACCESS_KEY = "c7a3fd79-0e4f-47ce-aa30-c141616d21e3";
const URL_FORM_TIMEOUT_MS = 120000;
const TRAFFIC_MULTIPLIER = 5;

const SLIDER_CSS = `
.calc-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 24px;
  background: transparent;
  cursor: pointer;
  outline: none;
}
.calc-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 9999px;
  background: linear-gradient(
    to right,
    #6d28d9 0%,
    #6d28d9 var(--calc-percent, 50%),
    #e2e8f0 var(--calc-percent, 50%),
    #e2e8f0 100%
  );
}
.calc-slider::-moz-range-track {
  height: 4px;
  border-radius: 9999px;
  background: #e2e8f0;
}
.calc-slider::-moz-range-progress {
  height: 4px;
  border-radius: 9999px;
  background: #6d28d9;
}
.calc-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 9999px;
  background: #ffffff;
  border: 2px solid #6d28d9;
  margin-top: -7px;
  box-shadow: 0 2px 8px rgba(109, 40, 217, 0.25);
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.calc-slider:hover::-webkit-slider-thumb,
.calc-slider:focus-visible::-webkit-slider-thumb {
  transform: scale(1.1);
  box-shadow: 0 2px 10px rgba(109, 40, 217, 0.3), 0 0 0 6px rgba(109, 40, 217, 0.12);
}
.calc-slider::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 9999px;
  background: #ffffff;
  border: 2px solid #6d28d9;
  box-shadow: 0 2px 8px rgba(109, 40, 217, 0.25);
}
.calc-text-input {
  background: transparent;
  border: none;
  outline: none;
  text-align: right;
}
.calc-rate-input {
  background: transparent;
  border: none;
  outline: none;
  text-align: right;
  border-bottom: 1px dashed #cbd5e1;
  padding: 0 2px;
  transition: border-color 120ms ease;
}
.calc-rate-input:hover,
.calc-rate-input:focus {
  border-bottom-color: #6d28d9;
}
`;

function formatInt(n) {
  return Math.round(n).toLocaleString();
}

function formatCurrency(n) {
  return Math.round(n).toLocaleString("en-US");
}

function formatRate(n) {
  return Number.isInteger(n) ? String(n) : String(n);
}

function deriveFromSessions(sessions, searchRatePct, messageRatePct) {
  const searches = Math.round(sessions * (searchRatePct / 100));
  const messages = Math.round(sessions * (messageRatePct / 100));
  return { searches, messages };
}

function computeMonthlyCost(searches, messages) {
  const searchOver = Math.max(0, searches - INCLUDED_SEARCHES) * SEARCH_OVERAGE;
  const messageOver = Math.max(0, messages - INCLUDED_MESSAGES) * MESSAGE_OVERAGE;
  return PLAN_BASE_PRICE + searchOver + messageOver;
}

export default function PricingCalculator() {
  const [sessions, setSessions] = useState(DEFAULT_SESSIONS);
  const [searchRatePct, setSearchRatePct] = useState(DEFAULT_SEARCH_RATE_PCT);
  const [messageRatePct, setMessageRatePct] = useState(DEFAULT_MESSAGE_RATE_PCT);
  const [hasSearch, setHasSearch] = useState(true);

  const initial = useMemo(
    () => deriveFromSessions(DEFAULT_SESSIONS, DEFAULT_SEARCH_RATE_PCT, DEFAULT_MESSAGE_RATE_PCT),
    []
  );
  const [searches, setSearches] = useState(initial.searches);
  const [messages, setMessages] = useState(initial.messages);

  const recomputeFromSessions = (s, sr, mr, search = hasSearch) => {
    const derived = deriveFromSessions(s, sr, mr);
    setSearches(search ? derived.searches : 0);
    setMessages(derived.messages);
  };

  const handleSessionsChange = (next) => {
    const clamped = Math.max(SLIDER_MIN, Math.min(10_000_000, next));
    setSessions(clamped);
    recomputeFromSessions(clamped, searchRatePct, messageRatePct);
  };

  const handleSearchRateChange = (next) => {
    const clamped = Math.max(0, Math.min(100, next));
    setSearchRatePct(clamped);
    recomputeFromSessions(sessions, clamped, messageRatePct);
  };

  const handleToggleSearch = () => {
    if (hasSearch) {
      setHasSearch(false);
      setSearches(0);
    } else {
      setHasSearch(true);
      const derived = deriveFromSessions(sessions, searchRatePct, messageRatePct);
      setSearches(derived.searches);
    }
  };

  const handleMessageRateChange = (next) => {
    const clamped = Math.max(0, Math.min(100, next));
    setMessageRatePct(clamped);
    recomputeFromSessions(sessions, searchRatePct, clamped);
  };

  const monthlyCost = computeMonthlyCost(searches, messages);
  const searchOver = Math.max(0, searches - INCLUDED_SEARCHES);
  const messageOver = Math.max(0, messages - INCLUDED_MESSAGES);
  const overage = searchOver * SEARCH_OVERAGE + messageOver * MESSAGE_OVERAGE;
  const sliderPercent =
    ((Math.min(sessions, SLIDER_MAX) - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

  return (
    <section
      id="pricing-calculator"
      className="bg-gradient-to-b from-white via-white to-slate-50 pt-10 pb-16 sm:pt-12 sm:pb-20"
    >
      <style>{SLIDER_CSS}</style>
      <div className="mx-auto max-w-xl px-6">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            Estimate your monthly cost
          </h2>
          <p className="text-sm text-slate-500">
            Drag the slider to your monthly traffic and we'll do the math.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 mb-4">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm font-semibold text-slate-900">Monthly visitors</span>
            <FormattedIntInput
              value={sessions}
              onChange={handleSessionsChange}
              className="calc-text-input text-base font-semibold text-slate-900 tabular-nums w-32"
              aria-label="Monthly visitors"
            />
          </div>
          <input
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={SLIDER_STEP}
            value={Math.min(sessions, SLIDER_MAX)}
            onChange={(e) => handleSessionsChange(Number(e.target.value))}
            className="calc-slider"
            style={{ "--calc-percent": `${sliderPercent}%` }}
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1 tabular-nums">
            <span>1,000</span>
            <span>500,000+</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.18)] px-6 py-5">
          <div className="space-y-1">
            {hasSearch ? (
              <CalcRow
                label="Searches"
                value={searches}
                onChange={(v) => setSearches(Math.max(0, v))}
                sub={
                  <>
                    ≈ <RateInput value={searchRatePct} onChange={handleSearchRateChange} max={20} />% of visitors
                  </>
                }
              />
            ) : null}
            <CalcRow
              label="Messages"
              value={messages}
              onChange={(v) => setMessages(Math.max(0, v))}
              sub={
                <>
                  ≈ <RateInput value={messageRatePct} onChange={handleMessageRateChange} max={20} />% of visitors
                </>
              }
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500">Use Nobi for search</span>
            <PurpleToggle
              checked={hasSearch}
              onChange={handleToggleSearch}
              label="Use Nobi for search"
            />
          </div>

          <div className="mt-4 pt-5 border-t border-slate-100">
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-5xl font-semibold text-slate-900 tabular-nums tracking-tight">
                ${formatCurrency(monthlyCost)}
              </span>
              <span className="text-base text-slate-500 font-medium">/ month</span>
            </div>
            <div className="text-sm text-slate-600 mt-2 tabular-nums text-right">
              $25 base
              {overage > 0 ? (
                <>
                  <span className="text-slate-400 mx-2">+</span>
                  <span className="text-slate-900 font-medium">${formatCurrency(overage)}</span>
                  <span className="text-slate-500"> over the included tier</span>
                </>
              ) : (
                <span className="text-emerald-600 font-medium ml-2">· fits in plan</span>
              )}
            </div>
          </div>
        </div>

        <UrlEstimateForm onTrafficLookup={handleSessionsChange} />
      </div>
    </section>
  );
}

function CalcRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-baseline gap-2 text-sm py-1">
      <span className="text-slate-700 font-medium">{label}</span>
      <span className="text-xs text-slate-400">{sub}</span>
      <FormattedIntInput
        value={value}
        onChange={onChange}
        className="calc-text-input text-sm font-medium text-slate-700 tabular-nums w-20 ml-auto hover:bg-slate-50 focus:bg-slate-50 rounded-md px-1 -mx-1 transition"
      />
    </div>
  );
}

function PurpleToggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-1 ${
        checked ? "bg-violet-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-3.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function FormattedIntInput({ value, onChange, ...props }) {
  const display = value === 0 ? "" : Number(value).toLocaleString();
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    onChange(raw === "" ? 0 : Number(raw));
  };
  return <input type="text" inputMode="numeric" value={display} onChange={handleChange} {...props} />;
}

function RateInput({ value, onChange, max }) {
  const [text, setText] = useState(formatRate(value));

  useEffect(() => {
    setText(formatRate(value));
  }, [value]);

  const commit = (raw) => {
    const cleaned = raw.replace(/[^\d.]/g, "");
    const parsed = cleaned === "" || cleaned === "." ? 0 : Number(cleaned);
    if (!Number.isNaN(parsed)) {
      onChange(Math.min(max, Math.max(0, parsed)));
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw);
        commit(raw);
      }}
      onBlur={() => setText(formatRate(value))}
      className="calc-rate-input text-xs font-semibold text-slate-700 tabular-nums w-8"
      aria-label="Adjust rate"
    />
  );
}

function buildLeadFormData({ url, name, email }) {
  const formData = new FormData();
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);
  formData.append(
    "subject",
    `Nobi Pricing Estimate Request: ${url || "(no URL)"}`
  );
  formData.append("from_name", "Nobi Pricing Calculator");
  formData.append("website", url || "");
  if (name) formData.append("name", name);
  if (email) formData.append("email", email);
  formData.append(
    "message",
    `Lead from pricing calculator. URL: ${url}${name ? ` · Name: ${name}` : " · (no name given)"}${email ? ` · Email: ${email}` : " · (no email given)"}`
  );
  return formData;
}

function UrlEstimateForm({ onTrafficLookup }) {
  const [step, setStep] = useState("idle");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [estimatedVisits, setEstimatedVisits] = useState(null);
  const [siteName, setSiteName] = useState("");

  const sentRef = useRef(false);
  const submittedRef = useRef(false);
  const timeoutRef = useRef(null);
  const latestRef = useRef({ url: "", name: "", email: "", estimatedVisits: null });

  useEffect(() => {
    latestRef.current = { url, name, email, estimatedVisits };
  }, [url, name, email, estimatedVisits]);

  const sendOnce = () => {
    if (sentRef.current) return false;
    if (!submittedRef.current) return false;
    if (!latestRef.current.url) return false;
    sentRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const formData = buildLeadFormData(latestRef.current);
    try {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        keepalive: true,
      }).catch(() => {});
      MixpanelClient.track(EVENTS.PRICING_CALCULATOR_LEAD_SUBMITTED, {
        website: latestRef.current.url,
        hasContact: Boolean(latestRef.current.email),
        estimatedVisits: latestRef.current.estimatedVisits,
      });
    } catch (_) {
      // ignore
    }
    return true;
  };

  useEffect(() => {
    const handler = () => {
      if (latestRef.current.url) sendOnce();
    };
    window.addEventListener("beforeunload", handler);
    window.addEventListener("pagehide", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      window.removeEventListener("pagehide", handler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!url.trim()) {
      setError("Drop your site URL.");
      return;
    }
    submittedRef.current = true;
    setStep("loading");
    let visits = null;
    let resolvedName = "";
    try {
      const r = await fetch(
        `/api/traffic-lookup?domain=${encodeURIComponent(url.trim())}`
      );
      if (r.ok) {
        const data = await r.json();
        if (data?.monthlyVisits && data.monthlyVisits > 0) {
          visits = Math.round(data.monthlyVisits * TRAFFIC_MULTIPLIER);
        }
        resolvedName = data?.siteName || "";
      }
    } catch (_) {
      // ignore — fall through to details step regardless
    }

    if (visits) {
      setEstimatedVisits(visits);
      setSiteName(resolvedName);
      onTrafficLookup?.(visits);
    }

    if (window.Nobi?.addVisitorContext) {
      const site = resolvedName || url.trim();
      window.Nobi.addVisitorContext(
        `Visitor entered their site URL on the Nobi pricing page${site ? ` (${site})` : ""} to get a pricing estimate.`
      );
    }

    timeoutRef.current = setTimeout(() => {
      sendOnce();
      setStep((s) => (s === "details" ? "done-quiet" : s));
    }, URL_FORM_TIMEOUT_MS);

    setStep("details");
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    sendOnce();
    setStep("done");
    setSubmitting(false);
  };

  if (step === "done" || step === "done-quiet") {
    return (
      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-5 py-4 text-sm">
        <div className="font-semibold text-emerald-900">Thanks, we'll be in touch.</div>
        <div className="text-emerald-800 mt-0.5 text-xs">
          We'll review your site and reply within one business day.
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 flex items-center gap-3 text-sm text-slate-600">
        <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
        Looking up traffic for {url}…
      </div>
    );
  }

  if (step === "details") {
    return (
      <form
        onSubmit={handleDetailsSubmit}
        className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-4"
      >
        {estimatedVisits ? (
          <>
            <div className="text-sm font-semibold text-slate-900 mb-1">
              Updated your estimate using <span className="text-slate-700">{siteName || url}</span>.
            </div>
            <div className="text-xs text-slate-500 mb-3">
              Want us to walk through the details? Drop your name and email.
            </div>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold text-slate-900 mb-1">
              We couldn't pull traffic data for <span className="text-slate-700">{url}</span>.
            </div>
            <div className="text-xs text-slate-500 mb-3">
              Drop your name and email and we'll review it manually and send you a custom estimate.
            </div>
          </>
        )}
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 disabled:opacity-60 transition whitespace-nowrap"
          >
            Get in touch
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleUrlSubmit}
      className="mt-4 rounded-2xl border border-slate-100 bg-white px-5 py-4"
    >
      <div className="text-xs text-slate-500 mb-2">
        Don't know your numbers? Drop your URL and we'll estimate them for you.
      </div>
      <div className="grid sm:grid-cols-[1fr_auto] gap-2">
        <input
          name="websiteUrl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yoursite.com"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition whitespace-nowrap"
        >
          Look it up
        </button>
      </div>
      {error ? <div className="text-xs text-red-600 mt-2">{error}</div> : null}
    </form>
  );
}
